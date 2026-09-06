"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, MessageCircle, Mic, Send } from "lucide-react";

import {
  addPodcastComment,
  getPodcastComments,
  getPodcastStats,
  playPodcast,
  togglePodcastLike,
} from "@/features/podcasts/services/podcast-public.service";

import type { Podcast } from "@/features/podcasts/types/podcast.types";

interface PodcastComment {
  _id: string;
  text: string;
  isApproved?: boolean;
  createdAt?: string;
  user?: {
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
  };
}

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PodcastDetailsClient({
  podcast,
}: {
  podcast: Podcast;
}) {
  const router = useRouter();

  // =========================================
  // Play/View Tracking
  // =========================================

  const hasTrackedPlay = useRef(false);

  // =========================================
  // Like State
  // =========================================

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // =========================================
  // Comment State
  // =========================================

  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState<PodcastComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentMessage, setCommentMessage] = useState("");

  // =========================================
  // Load Podcast Stats
  // =========================================

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getPodcastStats(podcast._id);

        const stats = response?.stats;

        if (!stats) {
          return;
        }

        setLikeCount(typeof stats.likes === "number" ? stats.likes : 0);

        setCommentCount(
          typeof stats.comments === "number" ? stats.comments : 0,
        );
      } catch (error) {
        console.error("Failed to load podcast stats:", error);
      }
    };

    loadStats();
  }, [podcast._id]);

  // =========================================
  // Load Podcast Comments
  // =========================================

  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoadingComments(true);

        const response = await getPodcastComments(podcast._id);

        // Backend সরাসরি comments array return করে
        setComments(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to load podcast comments:", error);

        setComments([]);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [podcast._id]);

  // =========================================
  // Track Podcast Play / View
  // =========================================

  const handlePodcastPlay = async () => {
    // একই page visit-এ একবারই view count হবে
    if (hasTrackedPlay.current) {
      return;
    }

    try {
      hasTrackedPlay.current = true;

      const response = await playPodcast(podcast._id);

      if (response?.podcast?.views !== undefined) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to track podcast play:", error);

      // API failed হলে retry করার সুযোগ থাকবে
      hasTrackedPlay.current = false;
    }
  };

  // =========================================
  // Like / Unlike Podcast
  // =========================================

  const handleLike = async () => {
    if (isLiking) {
      return;
    }

    try {
      setIsLiking(true);

      const response = await togglePodcastLike(podcast._id);

      const isLiked = Boolean(response?.liked);

      setLiked(isLiked);

      setLikeCount((previousCount) => {
        if (isLiked) {
          return previousCount + 1;
        }

        return Math.max(0, previousCount - 1);
      });
    } catch (error: any) {
      console.error("Failed to toggle podcast like:", error);

      // Login required
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        router.push("/login");
      }
    } finally {
      setIsLiking(false);
    }
  };

  // =========================================
  // Add Comment
  // =========================================

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const comment = commentText.trim();

    if (!comment || isCommenting) {
      return;
    }

    try {
      setIsCommenting(true);
      setCommentMessage("");

      const response = await addPodcastComment(podcast._id, comment);

      setCommentText("");

      if (response?.comment) {
        setComments((previousComments) => [
          ...previousComments,
          response.comment,
        ]);
      }

      setCommentMessage("আপনার মন্তব্য সফলভাবে জমা হয়েছে।");

      // Stats refresh
      const statsResponse = await getPodcastStats(podcast._id);

      setLikeCount(
        typeof statsResponse?.stats?.likes === "number"
          ? statsResponse.stats.likes
          : 0,
      );

      setCommentCount(
        typeof statsResponse?.stats?.comments === "number"
          ? statsResponse.stats.comments
          : 0,
      );
    } catch (error: any) {
      console.error("Failed to add podcast comment:", error);

      // Login required
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        router.push("/login");
        return;
      }

      setCommentMessage(
        error?.response?.data?.message ||
          "মন্তব্য পাঠানো যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="mt-6">
      {/* =========================================
          Media Player
      ========================================= */}

      <div className="mb-6">
        {/* Video */}

        {podcast.mediaType === "video" && podcast.videoUrl && (
          <video
            src={podcast.videoUrl}
            poster={podcast.thumbnail || undefined}
            controls
            playsInline
            onPlay={handlePodcastPlay}
            className="aspect-video w-full rounded-xl bg-black"
          />
        )}

        {/* Audio */}

        {podcast.mediaType === "audio" && podcast.audioUrl && (
          <div className="rounded-xl border bg-muted/20 p-5">
            {/* Thumbnail */}

            {podcast.thumbnail ? (
              <img
                src={podcast.thumbnail}
                alt={podcast.title}
                className="mb-5 aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <div className="mb-5 flex aspect-video items-center justify-center rounded-lg bg-muted">
                <Mic className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {/* Audio */}

            <audio
              src={podcast.audioUrl}
              controls
              onPlay={handlePodcastPlay}
              className="w-full"
            />
          </div>
        )}

        {/* Missing Video */}

        {podcast.mediaType === "video" && !podcast.videoUrl && (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            Video is not available.
          </div>
        )}

        {/* Missing Audio */}

        {podcast.mediaType === "audio" && !podcast.audioUrl && (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            Audio is not available.
          </div>
        )}
      </div>

      {/* =========================================
          Like + Comments + Views
      ========================================= */}

      <div className="flex flex-wrap items-center gap-3 border-y py-4">
        {/* Like */}

        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition ${
            liked
              ? "border-red-500 bg-red-50 text-red-600"
              : "border-border hover:border-red-500 hover:text-red-500"
          }`}
        >
          {isLiking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          )}

          <span>{liked ? "Liked" : "Like"}</span>

          <span>({likeCount})</span>
        </button>

        {/* Comments Count */}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />

          <span>{commentCount} Comments</span>
        </div>

        {/* Views */}

        <span className="text-sm text-muted-foreground">•</span>

        <span className="text-sm text-muted-foreground">
          {podcast.views ?? 0} views
        </span>
      </div>

      {/* =========================================
          Comments Section
      ========================================= */}

      <section className="mt-8">
        {/* Header */}

        <div className="mb-5 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />

          <h2 className="text-lg font-semibold">Comments</h2>

          <span className="text-sm text-muted-foreground">
            ({commentCount})
          </span>
        </div>

        {/* Comment Form */}

        <form
          onSubmit={handleCommentSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="আপনার মন্তব্য লিখুন..."
            maxLength={500}
            disabled={isCommenting}
            className="min-w-0 flex-1 rounded-md border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={isCommenting || !commentText.trim()}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCommenting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}

            <span>{isCommenting ? "Submitting..." : "Comment"}</span>
          </button>
        </form>

        {/* Comment Message */}

        {commentMessage && (
          <p className="mt-3 text-sm text-muted-foreground">{commentMessage}</p>
        )}

        {/* Comments List */}

        <div className="mt-6 space-y-4">
          {isLoadingComments ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Comments loading...
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              এখনো কোনো comment নেই।
            </div>
          ) : (
            comments.map((comment) => (
              <article
                key={comment._id}
                className="rounded-lg border bg-muted/20 p-4"
              >
                {/* Comment Header */}

                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold">
                    {comment.user?.name ||
                      comment.user?.fullName ||
                      comment.user?.email ||
                      "User"}
                  </span>

                  {comment.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  )}
                </div>

                {/* Comment Text */}

                <p className="break-words text-sm leading-6">{comment.text}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
