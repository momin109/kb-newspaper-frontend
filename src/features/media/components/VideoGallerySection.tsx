"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Play, X } from "lucide-react";
import { useState } from "react";

import { getPublicMedia } from "@/features/media/services/media-public.service";
import type { Media } from "@/features/media/types/media.types";

function formatDuration(seconds?: number) {
  const total = seconds ?? 0;
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VideoGallerySection() {
  const [activeVideo, setActiveVideo] = useState<Media | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-video-news", 1],
    queryFn: () => getPublicMedia("video", 1, 4),
  });

  const videos = data?.data ?? [];

  const closeModal = () => setActiveVideo(null);

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="mb-5 h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || videos.length === 0) return null;

  return (
    <>
      <section className="py-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-foreground pb-2">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            ভিডিও সংবাদ
          </h2>
          <Link
            href="/video"
            className="text-sm font-medium text-primary hover:underline"
          >
            সব দেখুন →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          {videos.map((video) => (
            <button
              key={video._id}
              type="button"
              onClick={() => setActiveVideo(video)}
              className="group block text-left"
            >
              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title || "ভিডিও"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={video.url}
                    muted
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-md">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </div>

                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {formatDuration()}
                </span>
              </div>

              {video.tags?.[0] && (
                <p className="mt-2 text-xs font-semibold text-primary">
                  {video.tags[0]}
                </p>
              )}

              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                {video.title}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* Player modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              {activeVideo.sourceType === "youtube" && activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title || "YouTube video"}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.url}
                  controls
                  autoPlay
                  className="h-full w-full"
                />
              )}
            </div>
            {activeVideo.title && (
              <p className="mt-3 text-center text-sm font-medium text-white">
                {activeVideo.title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
