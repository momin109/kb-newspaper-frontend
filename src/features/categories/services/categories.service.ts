import { apiGet } from "@/lib/api-fetch";
import type { ApiListEnvelope } from "@/types/api.types";
import type { Category } from "../types/category.types";
import { MOCK_CATEGORIES } from "./categories.mock";
import type { Article } from "@/features/articles/types/article.types";
import { MOCK_ARTICLES } from "@/features/articles/services/articles.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

/**
 * Maps to GET /api/category-with-sub/all (routes/category.route.js).
 * Returns categories already nested as a tree — each top-level category
 * comes with a `children[]` array of its subcategories — so the nav bar
 * can render hover dropdowns without building the tree itself.
 * Safe to call from Server Components.
 */
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    return MOCK_CATEGORIES;
  }
  const res = await apiGet<ApiListEnvelope<Category>>(
    "/category-with-sub/all",
    {
      revalidate: 300,
    },
  );
  return res.data;
}

/**
 * Maps to GET /api/category/all/:slug (routes/category.route.js →
 * getCategoryWithArticles — "🔥 main feature" per the backend's own
 * comment). NOTE: this endpoint's response envelope is
 * { success, category, articles } — different from the standard
 * { success, data } shape used everywhere else, so it gets its own type
 * rather than reusing ApiEnvelope.
 */
export interface CategoryArticlesResult {
  category: Category;
  subCategories: Category[];
  siblingCategories: Category[];
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getCategoryWithArticles(
  slug: string,
  page = 1,
  limit = 12,
): Promise<CategoryArticlesResult | null> {
  if (USE_MOCK) {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

    if (!category) return null;

    const allArticles = MOCK_ARTICLES.filter(
      (article) => article.category?._id === category._id,
    ).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

    const start = (page - 1) * limit;
    const articles = allArticles.slice(start, start + limit);

    return {
      category,
      subCategories: [],
      siblingCategories: [],
      articles,
      pagination: {
        page,
        limit,
        total: allArticles.length,
        totalPages: Math.ceil(allArticles.length / limit),
      },
    };
  }

  try {
    const query = new URLSearchParams();

    query.set("page", String(page));
    query.set("limit", String(limit));

    const res = await apiGet<{
      success: boolean;
      category: Category;
      subCategories?: Category[];
      siblingCategories?: Category[];
      data: {
        articles: Article[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    }>(`/category/${slug}?${query.toString()}`, { revalidate: 60 });

    return {
      category: res.category,
      subCategories: res.subCategories ?? [],
      siblingCategories: res.siblingCategories ?? [],
      articles: res.data.articles,
      pagination: res.data.pagination,
    };
  } catch {
    return null;
  }
}
