import { apiClient } from "@/lib/axios";
import type { Bookmark } from "../types/bookmark.types";

interface ToggleBookmarkResponse {
  success: boolean;
  bookmarked: boolean;
  message: string;
}

interface CheckBookmarkResponse {
  success: boolean;
  bookmarked: boolean;
}

interface MyBookmarksResponse {
  success: boolean;
  message: string;
  data: Bookmark[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// POST /api/bookmarks/:articleId — টগল (থাকলে রিমুভ, না থাকলে অ্যাড)
export async function toggleBookmark(
  articleId: string,
): Promise<ToggleBookmarkResponse> {
  const response = await apiClient.post<ToggleBookmarkResponse>(
    `/bookmarks/${articleId}`,
  );
  return response.data;
}

// GET /api/bookmarks/check/:articleId
export async function checkBookmark(articleId: string): Promise<boolean> {
  const response = await apiClient.get<CheckBookmarkResponse>(
    `/bookmarks/check/${articleId}`,
  );
  return response.data.bookmarked;
}

// GET /api/bookmarks?page&limit
export async function getMyBookmarks(
  page = 1,
  limit = 20,
): Promise<MyBookmarksResponse> {
  const response = await apiClient.get<MyBookmarksResponse>(
    `/bookmarks?page=${page}&limit=${limit}`,
  );
  return response.data;
}

// DELETE /api/bookmarks/:articleId
export async function deleteBookmark(articleId: string): Promise<void> {
  await apiClient.delete(`/bookmarks/${articleId}`);
}
