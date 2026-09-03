import { apiClient } from "@/lib/axios";
import type { Comment } from "../types/comment.types";

interface CommentsResponse {
  success: boolean;
  message: string;
  totalComments: number;
  data: Comment[];
}

interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export async function getAdminComments(): Promise<Comment[]> {
  const response = await apiClient.get<CommentsResponse>("/comment/all");

  return response.data.data;
}

export async function approveComment(id: string): Promise<Comment> {
  const response = await apiClient.patch<CommentResponse>(
    `/comment/${id}/approve`,
  );

  return response.data.data;
}

export async function deleteComment(id: string): Promise<void> {
  await apiClient.delete(`/comment/${id}`);
}
