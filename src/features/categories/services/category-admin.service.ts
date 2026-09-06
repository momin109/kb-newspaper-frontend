import { apiClient } from "@/lib/axios";
import type { Category, CategoryTree } from "../types/category.types";

interface CategoryResponse {
  success: boolean;
  message?: string;
  data: Category;
}

interface CategoriesResponse {
  success: boolean;
  total?: number;
  message?: string;
  data: Category[];
}

interface CategoryTreeResponse {
  success: boolean;
  data: CategoryTree[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parent?: string | null;
}

export interface UpdateCategoryInput {
  name: string;
  slug: string;
  parent?: string | null;
}

/**
 * Get flat categories
 */
export async function getAdminCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesResponse>("/category/all");

  return response.data.data;
}

/**
 * Get nested category tree
 */
export async function getAdminCategoryTree(): Promise<CategoryTree[]> {
  const response = await apiClient.get<CategoryTreeResponse>(
    "/category-with-sub/all",
  );

  return response.data.data;
}

/**
 * Create category / sub-category
 */
export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const response = await apiClient.post<CategoryResponse>(
    "/category-with-sub/create",
    {
      name: input.name,
      slug: input.slug,
      parent: input.parent ?? null,
    },
  );

  return response.data.data;
}

/**
 * Update category / sub-category
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  const response = await apiClient.put<CategoryResponse>(
    `/category-with-sub/${id}`,
    {
      name: input.name,
      slug: input.slug,
      parent: input.parent ?? null,
    },
  );

  return response.data.data;
}

/**
 * Delete category / sub-category
 */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/category-with-sub/${id}`);
}
