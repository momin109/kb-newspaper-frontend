"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";

import { getPublicMedia } from "@/features/media/services/media-public.service";
import type { Media } from "@/features/media/types/media.types";

export default function PhotoGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-photo-gallery-home"],
    queryFn: () => getPublicMedia("image", 1, 4),
  });

  const photos = data?.data ?? [];

  const mainPhoto = photos[0];
  const sidePhotos = photos.slice(1, 3);
  const bottomPhoto = photos[3];

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-6">
        <div className="mb-5 flex items-center justify-between border-b-2 border-foreground pb-2">
          <div className="h-7 w-24 animate-pulse rounded bg-muted" />

          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="h-[280px] animate-pulse rounded-md bg-muted sm:col-span-2 sm:row-span-2 sm:h-[360px]" />

          <div className="h-[170px] animate-pulse rounded-md bg-muted" />

          <div className="h-[170px] animate-pulse rounded-md bg-muted" />

          <div className="h-[170px] animate-pulse rounded-md bg-muted" />
        </div>
      </section>
    );
  }

  // Error / Empty state
  if (isError || !mainPhoto) {
    return null;
  }

  return (
    <>
      <section className="py-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-foreground pb-2">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            ছবিঘর
          </h2>

          <Link
            href="/photo"
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            সব দেখুন →
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Main Photo */}
          <button
            type="button"
            onClick={() => setSelectedPhoto(mainPhoto)}
            aria-label={`ছবি দেখুন: ${mainPhoto.title || "ছবি"}`}
            className="group relative h-[280px] overflow-hidden rounded-md sm:col-span-2 sm:row-span-2 sm:h-[360px]"
          >
            <img
              src={mainPhoto.url}
              alt={mainPhoto.title || "ছবি"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {mainPhoto.title && (
              <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white sm:text-base">
                {mainPhoto.title}
              </p>
            )}
          </button>

          {/* Side Photos */}
          {sidePhotos.map((photo) => (
            <button
              key={photo._id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`ছবি দেখুন: ${photo.title || "ছবি"}`}
              className="group relative h-[170px] overflow-hidden rounded-md"
            >
              <img
                src={photo.url}
                alt={photo.title || "ছবি"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

              {photo.title && (
                <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-left text-xs font-medium text-white">
                  {photo.title}
                </p>
              )}
            </button>
          ))}

          {/* Bottom Photo */}
          {bottomPhoto && (
            <button
              type="button"
              onClick={() => setSelectedPhoto(bottomPhoto)}
              aria-label={`ছবি দেখুন: ${bottomPhoto.title || "ছবি"}`}
              className="group relative h-[170px] overflow-hidden rounded-md"
            >
              <img
                src={bottomPhoto.url}
                alt={bottomPhoto.title || "ছবি"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

              {bottomPhoto.title && (
                <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-left text-xs font-medium text-white">
                  {bottomPhoto.title}
                </p>
              )}
            </button>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title || "Photo preview"}
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close photo preview"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-5 sm:top-5"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Container */}
          <div
            className="relative flex max-h-[90vh] max-w-[95vw] flex-col items-center sm:max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title || "Photo"}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />

            {selectedPhoto.title && (
              <p className="mt-3 max-w-2xl text-center text-sm font-medium text-white sm:text-base">
                {selectedPhoto.title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
