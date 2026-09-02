'use client'

import { useEffect, useState } from 'react'
import { getArticles, type GetArticlesParams } from '../services/articles.service'
import type { Article } from '../types/article.types'

interface UseArticlesClientResult {
  articles: Article[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

/**
 * Manual fetch-on-effect hook — this project has no TanStack Query in
 * its stack, so client-side reads (needed for interactive tab-switching,
 * where a Server Component can't respond to a click) use this instead.
 * Server Components remain the default for everything that doesn't need
 * post-load interactivity (Hero, category preview blocks).
 */
export function useArticlesClient(
  params: GetArticlesParams & { limit?: number }
): UseArticlesClientResult {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [refetchTick, setRefetchTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setIsError(false)

    getArticles(params)
      .then((data) => {
        if (!cancelled) setArticles(data)
      })
      .catch(() => {
        if (!cancelled) setIsError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.search, params.tag, params.limit, refetchTick])

  return { articles, isLoading, isError, refetch: () => setRefetchTick((t) => t + 1) }
}
