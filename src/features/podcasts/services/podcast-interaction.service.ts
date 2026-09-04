import { apiClient } from "@/lib/axios";

export interface PodcastCommentUser {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
}

export interface PodcastComment {
  _id: string;
  user: PodcastCommentUser | null;
  podcast: string;
  text: string;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PodcastCommentsResponse {
  success: boolean;
  message?: string;
  total: number;
  comments: PodcastComment[];
}

interface PodcastCommentResponse {
  success: boolean;
  message?: string;
  comment?: PodcastComment;
}

interface ApproveCommentResponse {
  success: boolean;
  message?: string;
  comment?: PodcastComment;
}

interface DeleteCommentResponse {
  success: boolean;
  message?: string;
}

export async function getPodcastComments(
  podcastId: string,
): Promise<PodcastCommentsResponse> {
  const response = await apiClient.get<PodcastCommentsResponse>(
    `/podcast/${podcastId}/comments`,
  );

  return response.data;
}

export async function approvePodcastComment(
  commentId: string,
): Promise<ApproveCommentResponse> {
  const response = await apiClient.patch<ApproveCommentResponse>(
    `/podcast/comment/${commentId}/approve`,
  );

  return response.data;
}

export async function deletePodcastComment(
  commentId: string,
): Promise<DeleteCommentResponse> {
  const response = await apiClient.delete<DeleteCommentResponse>(
    `/podcast/comment/${commentId}`,
  );

  return response.data;
}

export const podcastInteractionService = {
  getPodcastComments,
  approvePodcastComment,
  deletePodcastComment,
};
