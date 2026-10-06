import { apiClient } from "@/lib/axios";
import type {
  Category,
  CategoryTree,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category.types";

export type { CreateCategoryInput, UpdateCategoryInput };

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

/**
 * Normalizes raw category response into a flat array of categories.
 * If the backend returns a nested tree (with children[]), this extracts
 * both parents and all children into a unified flat list.
 * If the backend returns a flat list, it passes them through safely.
 */
export function normalizeCategories(data: any[]): Category[] {
  if (!Array.isArray(data)) return [];

  const flatList: Category[] = [];
  const seenIds = new Set<string>();

  function traverse(item: any, inheritedParentId: string | null = null) {
    if (!item || !item._id || seenIds.has(item._id)) return;
    seenIds.add(item._id);

    let parentVal: any = item.parent;
    if (!parentVal && inheritedParentId) {
      parentVal = inheritedParentId;
    }

    flatList.push({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      parent: parentVal ?? null,
      isFeatured: Boolean(item.isFeatured),
      sortOrder: Number(item.sortOrder) || 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      children: Array.isArray(item.children) ? item.children : undefined,
    });

    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children.forEach((child: any) => traverse(child, item._id));
    }
  }

  data.forEach((root) => traverse(root));
  return flatList;
}

/**
 * Get flat categories
 */
export async function getAdminCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesResponse>("/category/all");

  return normalizeCategories(response.data.data);
}

/**
 * Get nested category tree
 */
export async function getAdminCategoryTree(): Promise<CategoryTree[]> {
  const response = await apiClient.get<CategoryTreeResponse>(
    "/category/all?tree=true",
  );

  return response.data.data;
}

/**
 * Create category / sub-category
 */
export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const response = await apiClient.post<CategoryResponse>("/category/create", {
    name: input.name,
    slug: input.slug,
    parent: input.parent ?? null,
    isFeatured: input.isFeatured ?? false,
    sortOrder: input.sortOrder ?? 0,
  });

  return response.data.data;
}

/**
 * Update category / sub-category
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  const response = await apiClient.put<CategoryResponse>(`/category/${id}`, {
    name: input.name,
    slug: input.slug,
    parent: input.parent ?? null,
    isFeatured: input.isFeatured,
    sortOrder: input.sortOrder,
  });

  return response.data.data;
}

/**
 * Delete category / sub-category
 */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/category/${id}`);
}

