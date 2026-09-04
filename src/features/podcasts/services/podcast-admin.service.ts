import { apiClient } from "@/lib/axios";
import type { Podcast } from "../types/podcast.types";

interface PodcastListResponse {
  success: boolean;
  message?: string;
  total: number;
  podcasts: Podcast[];
}

interface PodcastResponse {
  success: boolean;
  message?: string;
  podcast: Podcast;
}

interface PodcastStatsResponse {
  success: boolean;
  message?: string;
  podcast: Podcast;
  stats: {
    likes: number;
    comments: number;
  };
}

export interface CreatePodcastInput {
  title: string;
  description: string;
  category: string;
  audio?: File | null;
  video?: File | null;
  thumbnail?: File | null;
}

export interface UpdatePodcastInput {
  title: string;
  description: string;
  category: string;
  audio?: File | null;
  video?: File | null;
  thumbnail?: File | null;
}

function buildPodcastFormData(
  input: CreatePodcastInput | UpdatePodcastInput,
): FormData {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("category", input.category);

  if (input.audio) {
    formData.append("audio", input.audio);
  }

  if (input.video) {
    formData.append("video", input.video);
  }

  if (input.thumbnail) {
    formData.append("thumbnail", input.thumbnail);
  }

  return formData;
}

export async function getAdminPodcasts(
  search?: string,
  category?: string,
): Promise<PodcastListResponse> {
  const response = await apiClient.get<PodcastListResponse>("/podcast", {
    params: {
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(category?.trim() ? { category: category.trim() } : {}),
    },
  });

  return response.data;
}

export async function getAdminPodcastById(
  id: string,
): Promise<PodcastResponse> {
  const response = await apiClient.get<PodcastResponse>(`/podcast/${id}`);

  return response.data;
}

export async function createPodcast(
  input: CreatePodcastInput,
): Promise<PodcastResponse> {
  const formData = buildPodcastFormData(input);

  const response = await apiClient.post<PodcastResponse>(
    "/podcast/create",
    formData,
  );

  return response.data;
}

export async function updatePodcast(
  id: string,
  input: UpdatePodcastInput,
): Promise<PodcastResponse> {
  const formData = buildPodcastFormData(input);

  const response = await apiClient.put<PodcastResponse>(
    `/podcast/${id}`,
    formData,
  );

  return response.data;
}

export async function deletePodcast(id: string): Promise<void> {
  await apiClient.delete(`/podcast/${id}`);
}

export async function getPodcastStats(
  id: string,
): Promise<PodcastStatsResponse> {
  const response = await apiClient.get<PodcastStatsResponse>(
    `/podcast/${id}/stats`,
  );

  return response.data;
}

export const podcastAdminService = {
  getAdminPodcasts,
  getAdminPodcastById,
  createPodcast,
  updatePodcast,
  deletePodcast,
  getPodcastStats,
};
