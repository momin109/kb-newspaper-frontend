"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import {
  approvePodcastComment,
  deletePodcastComment,
  getPodcastComments,
} from "@/features/podcasts/services/podcast-interaction.service";

export default function PodcastCommentsPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const podcastId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["podcast-comments", podcastId],
    queryFn: () => getPodcastComments(podcastId),
    enabled: Boolean(podcastId),
  });

  const approveMutation = useMutation({
    mutationFn: approvePodcastComment,

    onSuccess: () => {
      toast.success("Comment approved");

      queryClient.invalidateQueries({
        queryKey: ["podcast-comments", podcastId],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to approve comment",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePodcastComment,

    onSuccess: () => {
      toast.success("Comment deleted");

      queryClient.invalidateQueries({
        queryKey: ["podcast-comments", podcastId],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    },
  });

  function handleDelete(commentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    deleteMutation.mutate(commentId);
  }

  const comments = data?.comments ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/podcast")}
          className="rounded-md border p-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">Podcast Comments</h1>

          <p className="text-sm text-muted-foreground">
            Manage comments for this podcast
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-60 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load comments.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && comments.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h3 className="font-medium">No comments found</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            This podcast has no comments yet.
          </p>
        </div>
      )}

      {/* Comments */}
      {!isLoading && !isError && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => {
            const userName =
              comment.user?.fullName || comment.user?.name || "Unknown user";

            const isApproving =
              approveMutation.isPending &&
              approveMutation.variables === comment._id;

            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables === comment._id;

            return (
              <div key={comment._id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{userName}</p>

                      {comment.isApproved ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Approved
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          Pending
                        </span>
                      )}
                    </div>

                    {comment.user?.email && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {comment.user.email}
                      </p>
                    )}

                    <p className="mt-3 text-sm">{comment.text}</p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {!comment.isApproved && (
                      <button
                        type="button"
                        disabled={isApproving || isDeleting}
                        onClick={() => approveMutation.mutate(comment._id)}
                        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                      >
                        {isApproving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isDeleting || isApproving}
                      onClick={() => handleDelete(comment._id)}
                      className="inline-flex items-center justify-center rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
