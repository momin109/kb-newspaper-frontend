"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

import { getPublicMedia } from "@/features/media/services/media-public.service";

export default function PhotoGallerySection() {
  const [page, setPage] = useState(1);

  const limit = 6;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-photo-gallery", page],
    queryFn: () => getPublicMedia("image", page, limit),
  });

  const photos = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-[340px] animate-pulse rounded-sm bg-muted" />
      </section>
    );
  }

  if (isError || photos.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-red-600 text-white">
          <Camera className="h-4 w-4" />
        </div>

        <h2 className="text-base font-bold text-foreground">ফটোগ্যালারি</h2>

        <div className="h-[3px] flex-1 bg-red-600" />
      </div>

      {/* Gallery */}
      <div className="overflow-hidden bg-slate-950">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {/* Left side — 2 large stacked photos, caption overlaid */}
          <div className="grid gap-1 md:col-span-2">
            {photos.slice(0, 2).map((photo) => (
              <article
                key={photo._id}
                onClick={() => setSelectedPhoto(photo.url)}
                className="group relative aspect-[16/9] cursor-pointer overflow-hidden"
              >
                <img
                  src={photo.url}
                  alt={photo.title || "Photo"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                {/* Photo-count badge */}
                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-sm bg-black/60 text-white backdrop-blur-sm">
                  <Camera className="h-3.5 w-3.5" />
                </div>

                {/* Title */}
                {photo.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="line-clamp-2 text-sm font-medium leading-5 text-white">
                      {photo.title}
                    </h3>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Right side — 4 small stacked photos, caption below image */}
          <div className="grid gap-1">
            {photos.slice(2, 6).map((photo) => (
              <article
                key={photo._id}
                onClick={() => setSelectedPhoto(photo.url)}
                className="group flex cursor-pointer flex-col overflow-hidden bg-slate-900"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title || "Photo"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {photo.title && (
                  <div className="px-2.5 py-2">
                    <h3 className="line-clamp-2 text-xs font-medium leading-4 text-white/90">
                      {photo.title}
                    </h3>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Pagination indicator */}
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
      </div>
    </section>
  );
}
