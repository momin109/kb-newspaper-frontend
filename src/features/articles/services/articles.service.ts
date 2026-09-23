import { apiGet } from "@/lib/api-fetch";
import type { ApiEnvelope } from "@/types/api.types";
import type { Article } from "../types/article.types";
import { apiClient } from "@/lib/axios";

export interface GetArticlesParams {
  category?: string;
  search?: string;
  tag?: string;
  sort?: "latest" | "popular" | "oldest";
}

interface GetArticlesResponse {
  success: boolean;
  message: string;
  data: {
    articles: Article[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface GetArticlesPageParams extends GetArticlesParams {
  page?: number;
  limit?: number;
}

export interface ArticlesPageResult {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TrendingArticlesResponse {
  success: boolean;
  message: string;
  data: Article[];
}

/**
 * GET /api/article
 */
export async function getArticles(
  params: GetArticlesParams & { limit?: number } = {},
): Promise<Article[]> {
  const query = new URLSearchParams();

  if (params.category) {
    query.set("category", params.category);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.tag) {
    query.set("tag", params.tag);
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  const res = await apiGet<GetArticlesResponse>(
    `/article${query.toString() ? `?${query.toString()}` : ""}`,
    { revalidate: 60 },
  );

  const articles = res.data.articles;

  return params.limit ? articles.slice(0, params.limit) : articles;
}

/**
 * GET /api/article/:slug
 */
export async function getArticleBySlug(
  slug: string,
): Promise<
  | { status: "ok"; article: Article }
  | { status: "not_found" }
  | { status: "premium_locked" }
> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

  const res = await fetch(`${API_BASE_URL}/article/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return { status: "not_found" };
  }

  if (res.status === 403) {
    return { status: "premium_locked" };
  }

  if (!res.ok) {
    throw new Error(`API GET /article/${slug} failed: ${res.status}`);
  }

  const json = (await res.json()) as ApiEnvelope<Article>;

  return {
    status: "ok",
    article: json.data,
  };
}

/**
 * GET /api/article/trending — real backend endpoint (article.controller.js
 * → getTrendingArticles). `days` filters by publishedAt window, sorted by
 * views desc. No cache/no-store concerns here since it's used client-side
 * (see usePopularArticles hook) for the "সর্বাধিক পঠিত" widget.
 */
export async function getTrendingArticles(
  params: { days?: number; limit?: number } = {},
): Promise<Article[]> {
  const query = new URLSearchParams();

  if (params.days) query.set("days", String(params.days));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await apiGet<TrendingArticlesResponse>(
    `/article/trending${query.toString() ? `?${query.toString()}` : ""}`,
    { revalidate: 60 },
  );

  return res.data;
}

export async function shareArticle(articleId: string): Promise<void> {
  await apiClient.patch(`/article/${articleId}/share`);
}

/**
 * GET /api/article — real pagination version (page/limit/totalPages),
 * for listing pages that need "পরের পাতা" navigation. `getArticles`
 * above stays as-is for the tabbed homepage widgets that just need a
 * flat array.
 */
export async function getArticlesPage(
  params: GetArticlesPageParams = {},
): Promise<ArticlesPageResult> {
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.tag) query.set("tag", params.tag);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await apiGet<GetArticlesResponse>(
    `/article${query.toString() ? `?${query.toString()}` : ""}`,
    { revalidate: 60 },
  );

  return res.data;
}
