import type { Metadata } from "next";
import Link from "next/link";

import { apiGet } from "@/lib/api-fetch";
import { EmptyState } from "@/components/common/EmptyState";
import type { Media } from "@/features/media/types/media.types";

interface MediaListResponse {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: Media[];
}

interface PhotoListPageProps {
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 12;

async function getPhotos(page: number): Promise<MediaListResponse> {
  return apiGet<MediaListResponse>(
    `/media/all?type=image&page=${page}&limit=${LIMIT}`,
    { revalidate: 60 },
  );
}

export const metadata: Metadata = {
  title: "ছবিঘর | প্রভাতবার্তা",
  description: "প্রভাতবার্তার সব ছবি একসাথে দেখুন।",
};

export default async function PhotoListPage({
  searchParams,
}: PhotoListPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const result = await getPhotos(page);
  const photos = result.data;
  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <div className="mb-6 flex items-center justify-between border-b-2 border-foreground pb-2">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">ছবিঘর</h1>
        <span className="text-sm text-muted-foreground">
          {result.total} টি ছবি
        </span>
      </div>

      {photos.length === 0 ? (
        <EmptyState message="এখনো কোনো ছবি প্রকাশিত হয়নি।" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <Link
              key={photo._id}
              href={`/photo/${photo._id}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-md"
            >
              <img
                src={photo.url}
                alt={photo.title || "ছবি"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              {photo.title && (
                <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-xs font-medium text-white sm:text-sm">
                  {photo.title}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href={`/photo?page=${Math.max(1, page - 1)}`}
            aria-disabled={page === 1}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              page === 1
                ? "pointer-events-none opacity-40"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            আগের পাতা
          </Link>

          <span className="px-2 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>

          <Link
            href={`/photo?page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page === totalPages}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              page === totalPages
                ? "pointer-events-none opacity-40"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            পরের পাতা
          </Link>
        </div>
      )}
    </div>
  );
}
