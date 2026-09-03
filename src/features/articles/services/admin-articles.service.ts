import { apiClient } from "@/lib/axios";
import type { Article, ArticleStatus } from "../types/article.types";

interface AdminArticlesResponse {
  success: boolean;
  message: string;
  total: number;
  data: Article[];
}

interface AdminArticleResponse {
  success: boolean;
  message: string;
  data: Article;
}

/**
 * Get all articles for admin panel
 *
 * Backend:
 * GET /api/article/admin/all
 *
 * Access:
 * admin / editor
 */
async function getAdminArticles(
  status?: ArticleStatus,
): Promise<AdminArticlesResponse> {
  const response = await apiClient.get<AdminArticlesResponse>(
    "/article/admin/all",
    {
      params: status ? { status } : undefined,
    },
  );

  return response.data;
}

/**
 * Delete article
 *
 * Backend:
 * DELETE /api/article/:id
 *
 * Access:
 * admin only
 */
async function deleteArticle(
  articleId: string,
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/article/${articleId}`);

  return response.data;
}

/**
 * Change article status
 *
 * Backend:
 * PATCH /api/article/:id/status
 *
 * Access:
 * admin / editor
 */
async function changeArticleStatus(
  articleId: string,
  status: ArticleStatus,
): Promise<AdminArticleResponse> {
  const response = await apiClient.patch<AdminArticleResponse>(
    `/article/${articleId}/status`,
    { status },
  );

  return response.data;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  thumbnail?: File | null;
  media?: File[];
}

export async function createArticle(
  input: CreateArticleInput,
): Promise<AdminArticleResponse> {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("content", input.content);
  formData.append("category", input.category);
  formData.append("tags", JSON.stringify(input.tags));
  formData.append("status", input.status);

  if (input.thumbnail) {
    formData.append("thumbnail", input.thumbnail);
  }

  input.media?.forEach((file) => {
    formData.append("media", file);
  });

  const response = await apiClient.post<AdminArticleResponse>(
    "/article/create",
    formData,
  );

  return response.data;
}

export interface UpdateArticleInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  thumbnail?: File | null;
  media?: File[];
  removedMedia?: string[];
}

export async function updateArticle(
  articleId: string,
  input: UpdateArticleInput,
): Promise<AdminArticleResponse> {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("content", input.content);
  formData.append("category", input.category);
  formData.append("tags", JSON.stringify(input.tags));
  formData.append("status", input.status);

  if (input.thumbnail) {
    formData.append("thumbnail", input.thumbnail);
  }

  if (input.media?.length) {
    input.media.forEach((file) => {
      formData.append("media", file);
    });
  }

  if (input.removedMedia?.length) {
    formData.append("removedMedia", JSON.stringify(input.removedMedia));
  }

  const response = await apiClient.put<AdminArticleResponse>(
    `/article/${articleId}`,
    formData,
  );

  return response.data;
}

export async function getAdminArticleById(
  articleId: string,
): Promise<AdminArticleResponse> {
  const response = await apiClient.get<AdminArticleResponse>(
    `/article/admin/${articleId}`,
  );

  return response.data;
}

export const adminArticlesService = {
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  changeArticleStatus,
};
