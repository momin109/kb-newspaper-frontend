"use client";

import { useEffect, useState } from "react";

import type { Comment } from "@/features/comments/types/comment.types";
import {
  approveComment,
  deleteComment,
  getAdminComments,
} from "@/features/comments/services/comment-admin.service";

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  async function loadComments() {
    try {
      setLoading(true);

      const data = await getAdminComments();

      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  async function handleApprove(id: string) {
    try {
      setActionId(id);

      const updatedComment = await approveComment(id);

      setComments((prev) =>
        prev.map((comment) => (comment._id === id ? updatedComment : comment)),
      );
    } catch (error) {
      console.error("Failed to approve comment:", error);
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("আপনি কি এই comment টি delete করতে চান?");

    if (!confirmed) return;

    try {
      setActionId(id);

      await deleteComment(id);

      setComments((prev) => prev.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Comments</h1>

        <p className="text-sm text-muted-foreground">Manage user comments</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>

                <th className="px-4 py-3 text-left">Article</th>

                <th className="px-4 py-3 text-left">Comment</th>

                <th className="px-4 py-3 text-left">Status</th>

                <th className="px-4 py-3 text-left">Date</th>

                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    Loading comments...
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No comments found
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment._id} className="border-t">
                    {/* User */}
                    <td className="px-4 py-3 font-medium">
                      {comment.user?.fullName ?? "Unknown User"}
                    </td>

                    {/* Article */}
                    <td className="max-w-[220px] px-4 py-3">
                      <span className="line-clamp-2">
                        {comment.article?.title ?? "Unknown Article"}
                      </span>
                    </td>

                    {/* Comment */}
                    <td className="max-w-[300px] px-4 py-3">
                      <span className="line-clamp-2 text-sm">
                        {comment.text}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {comment.isApproved ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          Approved
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("bn-BD")}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {!comment.isApproved && (
                          <button
                            onClick={() => handleApprove(comment._id)}
                            disabled={actionId === comment._id}
                            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(comment._id)}
                          disabled={actionId === comment._id}
                          className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
