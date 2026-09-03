import { apiClient } from "@/lib/axios";
import type { Media, MediaType } from "../types/media.types";

interface MediaResponse {
  success: boolean;
  message: string;
  data: Media;
}

interface MediaListResponse {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: Media[];
}

export async function getAdminMedia(
  type?: MediaType,
  page = 1,
  limit = 20,
): Promise<MediaListResponse> {
  const response = await apiClient.get<MediaListResponse>("/media/all", {
    params: {
      ...(type ? { type } : {}),
      page,
      limit,
    },
  });

  return response.data;
}

export async function uploadMedia(
  file: File,
  title?: string,
  category?: string,
  tags?: string,
): Promise<Media> {
  const formData = new FormData();

  formData.append("file", file);

  if (title) {
    formData.append("title", title);
  }

  if (category) {
    formData.append("category", category);
  }

  if (tags) {
    formData.append("tags", tags);
  }

  const response = await apiClient.post<MediaResponse>(
    "/media/upload",
    formData,
  );

  return response.data.data;
}

export async function deleteMedia(id: string): Promise<void> {
  await apiClient.delete(`/media/${id}`);
}
