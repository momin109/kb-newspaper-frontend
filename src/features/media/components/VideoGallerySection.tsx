"use client";

import { useQuery } from "@tanstack/react-query";
import { Play, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useState } from "react";

import { getPublicMedia } from "@/features/media/services/media-public.service";

export default function VideoGallerySection() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"video" | "story">("video");

  const limit = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-video-gallery", page],
    queryFn: () => getPublicMedia("video", page, limit),
  });

  const videos = data?.data ?? [];

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-[340px] animate-pulse rounded-sm bg-muted" />
      </section>
    );
  }

  if (isError || videos.length === 0) {
    return null;
  }

  const featured = videos[0];
  const listItems = videos.slice(1, 4);

  return (
    <section className="overflow-hidden bg-slate-950 py-0">
      {/* =========================================
          Tab Header
      ========================================= */}
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "video"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            ভিডিও
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "story"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            ফটো স্টোরি
          </button>
        </div>

        <button
          type="button"
          className="text-xs text-slate-400 transition hover:text-white"
        >
          সব দেখুন →
        </button>
      </div>

      {/* =========================================
          Featured + List layout
      ========================================= */}
      <div className="mt-3 grid grid-cols-1 gap-1 md:grid-cols-2">
        {/* Featured (large) */}
        {featured && (
          <article className="group relative aspect-video cursor-pointer overflow-hidden">
            <img
              src={featured.thumbnail || featured.url}
              alt={featured.title || "Video"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition group-hover:scale-110">
              <Play className="ml-0.5 h-6 w-6 fill-current" />
            </div>

            {featured.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-white">
                  {featured.title}
                </h3>
              </div>
            )}
          </article>
        )}

        {/* List (right side, stacked rows) */}
        <div className="flex flex-col divide-y divide-white/10 bg-slate-900">
          {listItems.map((video) => (
            <article
              key={video._id}
              className="group flex cursor-pointer gap-3 p-2.5"
            >
              <div className="relative h-[64px] w-[96px] shrink-0 overflow-hidden">
                <img
                  src={video.thumbnail || video.url}
                  alt={video.title || "Video"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-4 w-4 fill-white text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium leading-5 text-white/90 group-hover:text-white">
                  {video.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* =========================================
          Pagination indicator
      ========================================= */}
      <div className="flex h-8 items-center justify-center gap-2 border-t border-white/5 text-[11px] text-slate-400">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-sm p-1 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <span>
          {page} / {totalPages} পেজ
        </span>

        <button
          type="button"
          onClick={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
          disabled={page >= totalPages}
          className="rounded-sm p-1 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}
