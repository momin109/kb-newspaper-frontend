import { apiClient } from "@/lib/axios";
import type { Category } from "../types/category.types";

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

interface CategoriesResponse {
  success: boolean;
  total: number;
  message: string;
  data: Category[];
}

export async function getAdminCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesResponse>("/category/all");

  return response.data.data;
}

export async function createCategory(name: string): Promise<Category> {
  const response = await apiClient.post<CategoryResponse>("/category/create", {
    name,
  });

  return response.data.data;
}

export async function updateCategory(
  id: string,
  name: string,
): Promise<Category> {
  const response = await apiClient.put<CategoryResponse>(`/category/${id}`, {
    name,
  });

  return response.data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/category/${id}`);
}
