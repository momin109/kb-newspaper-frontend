import { apiClient } from "@/lib/axios";

import type { Story } from "../types/story.types";

interface StoryListResponse {
  success: boolean;
  message: string;
  total: number;
  stories: Story[];
}

interface StoryResponse {
  success: boolean;
  message: string;
  story: Story;
}

export async function getPublicStories(): Promise<StoryListResponse> {
  const response = await apiClient.get<StoryListResponse>("/stories");

  return response.data;
}

export async function getPublicStory(storyId: string): Promise<StoryResponse> {
  const response = await apiClient.get<StoryResponse>(`/stories/${storyId}`);

  return response.data;
}

export async function viewStory(storyId: string) {
  const response = await apiClient.patch(`/stories/${storyId}/view`);

  return response.data;
}
