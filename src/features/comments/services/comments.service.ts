import { apiGet } from "@/lib/api-fetch";
import { apiClient } from "@/lib/axios";

import type { ApiListEnvelope, ApiEnvelope } from "@/types/api.types";

import type { Comment } from "../types/comment.types";

import { buildMockComments } from "./comments.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

/**
 * Maps to GET /api/comment/article/:articleId.
 *
 * The backend expects the article MongoDB _id,
 * not the article slug.
 */
export async function getCommentsByArticle(
  articleId: string,
): Promise<Comment[]> {
  if (USE_MOCK) {
    return buildMockComments(articleId);
  }

  const res = await apiGet<ApiListEnvelope<Comment>>(
    `/comment/article/${articleId}`,
    {
      cache: "no-store",
    },
  );

  return res.data;
}

/**
 * Maps to POST /api/comment/create.
 *
 * Requires authentication.
 */
export async function postComment(payload: {
  article: string;
  text: string;
  parent?: string | null;
}): Promise<Comment> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      _id: `mock-${Date.now()}`,

      article: {
        _id: payload.article,
        title: "Mock Article",
      },

      user: {
        _id: "me",
        fullName: "আপনি",
      },

      text: payload.text,

      parent: payload.parent ?? null,

      likes: [],

      isApproved: false,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };
  }

  const res = await apiClient.post<ApiEnvelope<Comment>>(
    "/comment/create",
    payload,
  );

  return res.data.data;
}

/**
 * Maps to PATCH /api/comment/:id/like.
 *
 * Requires authentication.
 */
export async function toggleLikeComment(commentId: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return;
  }

  await apiClient.patch(`/comment/${commentId}/like`);
}
