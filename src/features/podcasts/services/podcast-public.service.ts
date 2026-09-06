import { apiClient } from "@/lib/axios";
import type { Podcast } from "../types/podcast.types";

interface PodcastListResponse {
  success: boolean;
  message?: string;
  total: number;
  podcasts: Podcast[];
}

export async function getPublicPodcasts(): Promise<PodcastListResponse> {
  const response = await apiClient.get<PodcastListResponse>("/podcast");

  return response.data;
}

export async function togglePodcastLike(podcastId: string) {
  const response = await apiClient.post(`/podcast/${podcastId}/like`);

  return response.data;
}

export async function getPodcastStats(podcastId: string) {
  const response = await apiClient.get(`/podcast/${podcastId}/stats`);

  return response.data;
}

export async function getPodcastComments(podcastId: string) {
  const response = await apiClient.get(`/podcast/${podcastId}/comments`);

  return response.data;
}

export async function addPodcastComment(podcastId: string, comment: string) {
  const response = await apiClient.post(`/podcast/${podcastId}/comment`, {
    text: comment,
  });

  return response.data;
}

export async function getPublicPodcast(podcastId: string) {
  const response = await apiClient.get(`/podcast/${podcastId}`);

  return response.data;
}

export async function playPodcast(podcastId: string) {
  const response = await apiClient.patch(`/podcast/${podcastId}/play`);
  return response.data;
}
