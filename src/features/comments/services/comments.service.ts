import { apiGet } from '@/lib/api-fetch'
import { apiClient } from '@/lib/axios'
import type { ApiListEnvelope, ApiEnvelope } from '@/types/api.types'
import type { Comment } from '../types/comment.types'
import { buildMockComments } from './comments.mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'

/**
 * Maps to GET /api/comment/article/:articleId. NOTE: keyed by the
 * article's MongoDB _id, not its slug — the article page must fetch
 * the article first, then pass `article._id` here. Only approved,
 * top-level comments come back with their replies nested one level
 * (matches the backend's own nesting in getCommentsByArticle).
 */
export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
  if (USE_MOCK) {
    return buildMockComments(articleId)
  }
  const res = await apiGet<ApiListEnvelope<Comment>>(`/comment/article/${articleId}`, {
    cache: 'no-store',
  })
  return res.data
}

/**
 * Maps to POST /api/comment/create — requires auth (verifyToken on the
 * backend), so this is a client-side mutation using the axios instance
 * (attaches the Redux-held JWT). There is no guest-comment path on this
 * backend, unlike the earlier (superseded) design.
 */
export async function postComment(payload: {
  article: string
  text: string
  parent?: string | null
}): Promise<Comment> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      _id: `mock-${Date.now()}`,
      article: payload.article,
      user: { _id: 'me', fullName: 'আপনি' },
      text: payload.text,
      parent: payload.parent ?? null,
      likes: [],
      isApproved: false, // matches real backend default — pending until moderated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  const res = await apiClient.post<ApiEnvelope<Comment>>('/comment/create', payload)
  return res.data.data
}

/** Maps to PATCH /api/comment/:id/like — also auth-required. */
export async function toggleLikeComment(commentId: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return
  }
  await apiClient.patch(`/comment/${commentId}/like`)
}
