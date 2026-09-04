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

export interface CreateStoryInput {
  title?: string;
  image?: File | null;
  video?: File | null;
}

export interface UpdateStoryInput {
  title?: string;
  image?: File | null;
  video?: File | null;
}

export async function getAdminStories(): Promise<StoryListResponse> {
  const response = await apiClient.get<StoryListResponse>("/stories");

  return response.data;
}

export async function createStory(
  input: CreateStoryInput,
): Promise<StoryResponse> {
  const formData = new FormData();

  if (input.title?.trim()) {
    formData.append("title", input.title.trim());
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  if (input.video) {
    formData.append("video", input.video);
  }

  const response = await apiClient.post<StoryResponse>(
    "/stories/create",
    formData,
  );

  return response.data;
}

export async function updateStory(
  id: string,
  input: UpdateStoryInput,
): Promise<StoryResponse> {
  const formData = new FormData();

  if (input.title !== undefined) {
    formData.append("title", input.title.trim());
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  if (input.video) {
    formData.append("video", input.video);
  }

  const response = await apiClient.put<StoryResponse>(
    `/stories/${id}`,
    formData,
  );

  return response.data;
}

export async function deleteStory(id: string): Promise<void> {
  await apiClient.delete(`/stories/${id}`);
}

export const storyAdminService = {
  getAdminStories,
  createStory,
  updateStory,
  deleteStory,
};
