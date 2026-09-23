"use client";

import { useEffect, useState } from "react";
import { getTrendingArticles } from "../services/articles.service";
import type { Article } from "../types/article.types";

interface UsePopularArticlesResult {
  articles: Article[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * "সর্বাধিক পঠিত" widget: last 30 days' most-viewed articles first;
 * if that window has nothing published, widens to last 12 months so the
 * section never shows empty on a slow month.
 */
export function usePopularArticlesClient(limit = 5): UsePopularArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refetchTick, setRefetchTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    async function load() {
      try {
        let result = await getTrendingArticles({ days: 30, limit });

        if (result.length === 0) {
          result = await getTrendingArticles({ days: 365, limit });
        }

        if (!cancelled) setArticles(result);
      } catch {
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [limit, refetchTick]);

  return {
    articles,
    isLoading,
    isError,
    refetch: () => setRefetchTick((t) => t + 1),
  };
}
