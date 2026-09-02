/**
 * Isomorphic GET fetcher — works in Server Components (with Next.js
 * caching/revalidation) and Client Components alike. This project has
 * no TanStack Query in its stack, so reads go through Next.js's native
 * data-fetching (Server Components) wherever possible for best
 * SEO/performance; this helper is the shared plumbing for that.
 *
 * Mutations (POST/PATCH/DELETE with auth) go through the separate
 * axios client instance instead, since those only ever run in Client
 * Components (forms) and need the Redux-held JWT attached.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5001/api'

interface FetchOptions {
  revalidate?: number | false
  cache?: RequestCache
}

export async function apiGet<T>(
  path: string,
  options: FetchOptions = { revalidate: 60 }
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...(options.cache ? { cache: options.cache } : {}),
    ...(options.revalidate !== undefined && !options.cache
      ? { next: { revalidate: options.revalidate } }
      : {}),
  })

  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}
