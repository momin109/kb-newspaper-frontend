import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";

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

interface VideoListPageProps {
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 12;

async function getVideos(page: number): Promise<MediaListResponse> {
  return apiGet<MediaListResponse>(
    `/media/all?type=video&page=${page}&limit=${LIMIT}`,
    { revalidate: 60 },
  );
}

export const metadata: Metadata = {
  title: "ভিডিও সংবাদ | প্রভাতবার্তা",
  description: "প্রভাতবার্তার সব ভিডিও সংবাদ একসাথে দেখুন।",
};

export default async function VideoListPage({
  searchParams,
}: VideoListPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const result = await getVideos(page);
  const videos = result.data;
  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <div className="mb-6 flex items-center justify-between border-b-2 border-foreground pb-2">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          ভিডিও সংবাদ
        </h1>
        <span className="text-sm text-muted-foreground">
          {result.total} টি ভিডিও
        </span>
      </div>

      {videos.length === 0 ? (
        <EmptyState message="এখনো কোনো ভিডিও প্রকাশিত হয়নি।" />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={`/video/${video._id}`}
              className="group block"
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

                {video.sourceType === "youtube" && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    YouTube
                  </span>
                )}
              </div>

              {video.tags?.[0] && (
                <p className="mt-2 text-xs font-semibold text-primary">
                  {video.tags[0]}
                </p>
              )}

              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                {video.title}
              </h3>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href={`/video?page=${Math.max(1, page - 1)}`}
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
            href={`/video?page=${Math.min(totalPages, page + 1)}`}
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
