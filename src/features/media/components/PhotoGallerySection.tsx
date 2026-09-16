"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Grid,
  Image as ImageIcon,
} from "lucide-react";
import { getPublicMedia } from "@/features/media/services/media-public.service";

export default function PhotoGallerySection() {
  const [page, setPage] = useState(1);
  const limit = 9;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPhotoTitle, setSelectedPhotoTitle] = useState<string | null>(
    null,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-photo-gallery", page],
    queryFn: () => getPublicMedia("image", page, limit),
  });

  const photos = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  // Take first 6 photos for the grid
  const displayPhotos = photos.slice(0, 6);
  const mainPhoto = displayPhotos[0];
  const rightPhotos = displayPhotos.slice(1, 4);
  const bottomPhotos = displayPhotos.slice(4, 6);

  const handlePhotoClick = (url: string, title: string | null) => {
    setSelectedPhoto(url);
    setSelectedPhotoTitle(title);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setSelectedPhotoTitle(null);
    document.body.style.overflow = "unset";
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-muted" />
            <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 row-span-2 h-[400px] animate-pulse rounded-2xl bg-muted" />
            <div className="h-[195px] animate-pulse rounded-2xl bg-muted" />
            <div className="h-[195px] animate-pulse rounded-2xl bg-muted" />
            <div className="col-span-2 h-[195px] animate-pulse rounded-2xl bg-muted" />
            <div className="h-[195px] animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || photos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-6">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">
                  Photo Gallery
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {data?.total || 0} photos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
              <Grid className="h-3.5 w-3.5" />
              <span>Latest</span>
            </div>
          </div>

          {/* Gallery Grid - Facebook Cover Style */}
          <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-2 shadow-xl shadow-black/10">
            {/* Left side - 66% (Main large photo) */}
            <div className="col-span-2 row-span-2">
              {mainPhoto && (
                <div
                  className="group relative h-[400px] cursor-pointer overflow-hidden rounded-xl"
                  onClick={() =>
                    handlePhotoClick(mainPhoto.url, mainPhoto.title)
                  }
                >
                  <img
                    src={mainPhoto.url}
                    alt={mainPhoto.title || "Main photo"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                    {mainPhoto.title && (
                      <h3 className="text-lg font-bold leading-tight drop-shadow-lg">
                        {mainPhoto.title}
                      </h3>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
                      <ZoomIn className="h-3.5 w-3.5" />
                      <span>Click to enlarge</span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    Featured
                  </div>

                  {/* View counter */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-sm">
                    <Camera className="h-3 w-3" />
                    <span>1</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - 33% (3 small stacked photos) */}
            <div className="flex flex-col gap-2">
              {rightPhotos.map((photo) => (
                <div
                  key={photo._id}
                  className="group relative flex-1 cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => handlePhotoClick(photo.url, photo.title)}
                >
                  <div className="h-[126px]">
                    <img
                      src={photo.url}
                      alt={photo.title || "Photo"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {photo.title && (
                      <p className="line-clamp-1 text-[10px] font-medium drop-shadow-lg">
                        {photo.title}
                      </p>
                    )}
                  </div>
                  <div className="absolute right-1.5 top-1.5 rounded-full bg-black/40 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomIn className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row - spans full width (2 more photos) */}
            {bottomPhotos.length > 0 && (
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {bottomPhotos.map((photo) => (
                  <div
                    key={photo._id}
                    className="group relative cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => handlePhotoClick(photo.url, photo.title)}
                  >
                    <div className="h-[190px]">
                      <img
                        src={photo.url}
                        alt={photo.title || "Photo"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {photo.title && (
                        <p className="line-clamp-1 text-sm font-medium drop-shadow-lg">
                          {photo.title}
                        </p>
                      )}
                    </div>
                    <div className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ZoomIn className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sm transition-all hover:border-blue-500 hover:bg-blue-500/5 disabled:opacity-30"
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sm transition-all hover:border-blue-500 hover:bg-blue-500/5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal - Premium */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition-all hover:bg-white/20 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt={selectedPhotoTitle || "Photo"}
              className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
            />

            {selectedPhotoTitle && (
              <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent p-5">
                <p className="text-center text-base font-medium text-white drop-shadow-lg">
                  {selectedPhotoTitle}
                </p>
              </div>
            )}

            {/* Navigation hint */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs text-white/30">
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
