"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Mic, Play } from "lucide-react";

import { getPublicPodcasts } from "@/features/podcasts/services/podcast-public.service";

import type { Podcast } from "@/features/podcasts/types/podcast.types";

function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
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

export default function PodcastSection() {
  const router = useRouter();

  // =========================================
  // Get Public Podcasts
  // =========================================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-podcasts"],
    queryFn: getPublicPodcasts,
  });

  const podcasts: Podcast[] = data?.podcasts ?? [];

  // =========================================
  // Podcast Details Navigation
  // =========================================

  const handlePodcastClick = (podcastId: string) => {
    router.push(`/podcast/${podcastId}`);
  };

  // =========================================
  // Loading
  // =========================================

  if (isLoading) {
    return (
      <section className="py-6">
        {/* Header Skeleton */}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-sm bg-muted" />

            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="flex items-center gap-1">
            <div className="h-8 w-8 animate-pulse rounded-sm bg-muted" />

            <div className="h-8 w-8 animate-pulse rounded-sm bg-muted" />
          </div>
        </div>

        {/* Cards Skeleton */}

        <div className="grid grid-cols-2 overflow-hidden rounded-md border md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-r border-b">
              <div className="aspect-video animate-pulse bg-muted" />

              <div className="space-y-2 p-3">
                <div className="h-4 animate-pulse rounded bg-muted" />

                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================================
  // Error
  // =========================================

  if (isError) {
    return null;
  }

  // =========================================
  // Empty
  // =========================================

  if (podcasts.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      {/* =========================================
          Header
      ========================================= */}

      <div className="mb-4 flex items-center justify-between">
        {/* Title */}

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-red-600 text-white">
            <Mic className="h-4 w-4" />
          </div>

          <h2 className="text-lg font-semibold text-foreground">পডকাস্ট</h2>
        </div>

        {/* Navigation */}

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-sm border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Previous podcasts"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-sm border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Next podcasts"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =========================================
          Podcast Cards
      ========================================= */}

      <div className="grid grid-cols-2 overflow-hidden rounded-md border md:grid-cols-3 lg:grid-cols-5">
        {podcasts.slice(0, 5).map((podcast) => (
          <article
            key={podcast._id}
            onClick={() => handlePodcastClick(podcast._id)}
            className="min-w-0 cursor-pointer border-r border-b bg-background transition hover:bg-muted/30"
          >
            {/* =====================================
                Thumbnail
            ===================================== */}

            <div className="relative aspect-video overflow-hidden bg-muted">
              {podcast.thumbnail ? (
                <img
                  src={podcast.thumbnail}
                  alt={podcast.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Mic className="h-10 w-10 text-muted-foreground" />
                </div>
              )}

              {/* Episode */}

              <span className="absolute left-2 top-2 rounded-sm bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white">
                পর্ব
              </span>

              {/* Duration */}

              <span className="absolute right-2 top-2 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                {formatDuration(podcast.duration)}
              </span>

              {/* Play Button */}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePodcastClick(podcast._id);
                }}
                className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md transition hover:scale-110 hover:bg-white"
                aria-label={`Play ${podcast.title}`}
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </button>
            </div>

            {/* =====================================
                Content
            ===================================== */}

            <div className="p-3">
              <h3 className="line-clamp-2 text-sm font-semibold leading-5">
                {podcast.title}
              </h3>

              <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>◷</span>

                <span>{formatDate(podcast.createdAt)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
