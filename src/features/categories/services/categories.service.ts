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
export async function getCategoryWithArticles(
  slug: string,
): Promise<{ category: Category; articles: Article[] } | null> {
  if (USE_MOCK) {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
    if (!category) return null;
    const articles = MOCK_ARTICLES.filter(
      (a) => a.category?._id === category._id,
    ).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    return { category, articles };
  }

  try {
    const res = await apiGet<{
      success: boolean;
      category: Category;
      articles: Article[];
    }>(`/category/all/${slug}`, { revalidate: 60 });
    return { category: res.category, articles: res.articles };
  } catch {
    return null;
  }
}
