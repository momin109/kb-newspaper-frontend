"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  TrendingUp,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

import { getPublicMedia } from "@/features/media/services/media-public.service";

export default function VideoGallerySection() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"video" | "story">("video");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const limit = 7;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-video-gallery", page],
    queryFn: () => getPublicMedia("video", page, limit),
  });

  const videos = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
              <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-[340px] animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-[80px] w-[120px] animate-pulse rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || videos.length === 0) {
    return null;
  }

  const featured = videos[0];
  const listItems = videos.slice(1, 4);
  const bottomItems = videos.slice(4, 7);

  const handleVideoClick = (url: string) => {
    setSelectedVideo(url);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20">
                <Play className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">
                  Video Gallery
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {data?.total || 0} videos available
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 rounded-full bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeTab === "video"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                Videos
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("story")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeTab === "story"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Photo Stories
              </button>
            </div>
          </div>

          {/* Main Video Grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Featured Video - spans 2 columns */}
            {featured && (
              <div className="md:col-span-2">
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => handleVideoClick(featured.url)}
                >
                  <div className="aspect-video">
                    <img
                      src={featured.thumbnail || featured.url}
                      alt={featured.title || "Featured video"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                      <Play className="ml-0.5 h-7 w-7 fill-current" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {featured.title && (
                      <h3 className="line-clamp-2 text-lg font-bold text-white drop-shadow-lg">
                        {featured.title}
                      </h3>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Featured
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute left-4 top-4 rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    Featured
                  </div>
                </div>
              </div>
            )}

            {/* Right sidebar - 3 videos stacked */}
            <div className="space-y-3">
              {listItems.map((video) => (
                <div
                  key={video._id}
                  className="group flex cursor-pointer gap-3 overflow-hidden rounded-xl bg-muted/30 p-2 transition-all hover:bg-muted/50"
                  onClick={() => handleVideoClick(video.url)}
                >
                  <div className="relative h-[70px] w-[110px] shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={video.thumbnail || video.url}
                      alt={video.title || "Video"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/20">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {Math.floor(Math.random() * 5) + 1}:
                        {String(Math.floor(Math.random() * 60)).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row - 3 more videos */}
            {bottomItems.length > 0 && (
              <div className="md:col-span-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {bottomItems.map((video) => (
                  <div
                    key={video._id}
                    className="group cursor-pointer overflow-hidden rounded-xl bg-muted/20 transition-all hover:bg-muted/30"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail || video.url}
                        alt={video.title || "Video"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      {video.title && (
                        <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
                          {video.title}
                        </h3>
                      )}
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sm transition-all hover:border-red-500 hover:bg-red-500/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 px-3 text-sm">
                <span className="font-semibold text-foreground">{page}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{totalPages}</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sm transition-all hover:border-red-500 hover:bg-red-500/5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition-all hover:bg-white/20 hover:scale-110"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl"
            >
              Your browser does not support the video tag.
            </video>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs text-white/30">
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
