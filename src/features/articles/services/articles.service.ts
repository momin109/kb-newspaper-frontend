import { apiGet } from '@/lib/api-fetch'
import type { ApiEnvelope, ApiListEnvelope } from '@/types/api.types'
import type { Article } from '../types/article.types'
import { MOCK_ARTICLES, MOCK_ARTICLE_DETAIL } from './articles.mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'

export interface GetArticlesParams {
  category?: string // category ObjectId, per article.controller.js's getArticles
  search?: string
  tag?: string
}

/**
 * Maps to GET /api/article (routes/article.route.js → getArticles).
 * NOTE: the real endpoint has no `page`/`limit`/pagination — it returns
 * the full published list with `total`. Client-side slicing is used
 * here for "limit" until the backend adds real pagination — flagged as
 * a TODO for the backend team.
 */
export async function getArticles(
  params: GetArticlesParams & { limit?: number } = {}
): Promise<Article[]> {
  if (USE_MOCK) {
    let items = [...MOCK_ARTICLES]
    if (params.category) items = items.filter((a) => a.category?._id === params.category)
    if (params.tag) items = items.filter((a) => a.tags.includes(params.tag!))
    if (params.search) {
      const q = params.search.toLowerCase()
      items = items.filter((a) => a.title.toLowerCase().includes(q))
    }
    items.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    return params.limit ? items.slice(0, params.limit) : items
  }

  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.tag) query.set('tag', params.tag)

  const res = await apiGet<ApiListEnvelope<Article>>(
    `/article${query.toString() ? `?${query}` : ''}`,
    { revalidate: 60 }
  )
  return params.limit ? res.data.slice(0, params.limit) : res.data
}

/** Maps to GET /api/article/:slug (increments the view count server-side). */
export async function getArticleBySlug(
  slug: string
): Promise<{ status: 'ok'; article: Article } | { status: 'not_found' } | { status: 'premium_locked' }> {
  if (USE_MOCK) {
    return { status: 'ok', article: { ...MOCK_ARTICLE_DETAIL, slug } }
  }

  // Raw fetch here (not apiGet) because this endpoint has meaningful
  // status-code branches (200/403/404) that a generic "throw on !ok"
  // helper would collapse into one error.
  //
  // NOTE: the real backend gates premium articles by checking `req.user`
  // (Bearer token) — but this is a Server Component, which has no
  // access to the Redux-held JWT (it's not stored in a cookie). Until
  // the auth token is also mirrored into a cookie, every server-side
  // fetch here is effectively anonymous, so premium articles will show
  // the locked state for all readers, even logged-in ones. TODO once
  // the auth module is built: set an httpOnly cookie on login so this
  // Server Component can forward it.
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5001/api'
  const res = await fetch(`${API_BASE_URL}/article/${slug}`, { cache: 'no-store' })

  if (res.status === 404) return { status: 'not_found' }
  if (res.status === 403) return { status: 'premium_locked' }
  if (!res.ok) throw new Error(`API GET /article/${slug} failed: ${res.status}`)

  const json = (await res.json()) as ApiEnvelope<Article>
  return { status: 'ok', article: json.data }
}

/**
 * "Trending"/most-read isn't a dedicated backend endpoint — derived
 * client-side by sorting the published list by `views` descending.
 * TODO: replace with GET /api/report/top-articles once that's wired
 * up for public (non-admin) use, or add a public trending endpoint.
 */
export async function getTrendingArticles(limit = 6): Promise<Article[]> {
  const all = await getArticles({})
  return [...all].sort((a, b) => b.views - a.views).slice(0, limit)
}
