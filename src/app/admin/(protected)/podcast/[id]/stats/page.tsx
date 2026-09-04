"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader2,
  MessageSquare,
  Mic,
  Video,
} from "lucide-react";

import { getPodcastStats } from "@/features/podcasts/services/podcast-admin.service";

export default function PodcastStatsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-podcast-stats", id],
    queryFn: () => getPodcastStats(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push("/admin/podcast")}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Podcasts
        </button>

        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            Failed to load podcast statistics.
          </p>
        </div>
      </div>
    );
  }

  const { podcast, stats } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/podcast")}
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Podcasts
          </button>

          <h1 className="text-2xl font-semibold">Podcast Statistics</h1>

          <p className="text-sm text-muted-foreground">
            View performance statistics for this podcast.
          </p>
        </div>
      </div>

      {/* Podcast Info */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Thumbnail */}
          <div className="h-32 w-full overflow-hidden rounded-lg bg-muted sm:w-52">
            {podcast.thumbnail ? (
              <img
                src={podcast.thumbnail}
                alt={podcast.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                {podcast.mediaType === "video" ? (
                  <Video className="h-10 w-10 text-muted-foreground" />
                ) : (
                  <Mic className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{podcast.title}</h2>

            {podcast.description && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {podcast.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs">
                {podcast.category}
              </span>

              <span className="rounded-md bg-muted px-2 py-1 text-xs">
                {podcast.mediaType}
              </span>

              {podcast.isPremium && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Views */}
        <StatCard
          title="Views"
          value={podcast.views}
          icon={<Eye className="h-5 w-5" />}
        />

        {/* Likes */}
        <StatCard
          title="Likes"
          value={stats.likes}
          icon={<Heart className="h-5 w-5" />}
        />

        {/* Comments */}
        <StatCard
          title="Approved Comments"
          value={stats.comments}
          icon={<MessageSquare className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Stat Card
========================================================= */

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-muted p-2">{icon}</div>

        <span className="text-2xl font-semibold">{value}</span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
