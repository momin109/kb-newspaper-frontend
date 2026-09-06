import { apiClient } from "@/lib/axios";

import type { Media, MediaType } from "../types/media.types";

interface MediaListResponse {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: Media[];
}

export async function getPublicMedia(
  type: MediaType,
  page = 1,
  limit = 10,
): Promise<MediaListResponse> {
  const response = await apiClient.get<MediaListResponse>("/media/all", {
    params: {
      type,
      page,
      limit,
    },
  });

  return response.data;
}
