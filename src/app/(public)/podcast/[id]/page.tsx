import { notFound } from "next/navigation";

import { getPublicPodcast } from "@/features/podcasts/services/podcast-public.service";
import PodcastDetailsClient from "@/features/podcasts/components/PodcastDetailsClient";

interface PodcastDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PodcastDetailsPage({
  params,
}: PodcastDetailsPageProps) {
  const { id } = await params;

  let podcast;

  try {
    const response = await getPublicPodcast(id);

    podcast = response?.podcast;
  } catch (error) {
    console.error("Failed to fetch podcast:", error);

    notFound();
  }

  if (!podcast) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* =========================================
            Podcast Thumbnail
        ========================================= */}

        {podcast.thumbnail && (
          <img
            src={podcast.thumbnail}
            alt={podcast.title}
            className="h-[300px] w-full object-cover"
          />
        )}

        {/* =========================================
            Podcast Information
        ========================================= */}

        <div className="space-y-5 p-6">
          {/* Category + Title */}

          <div>
            <p className="text-sm text-muted-foreground">{podcast.category}</p>

            <h1 className="mt-2 text-3xl font-bold">{podcast.title}</h1>
          </div>

          {/* Description */}

          {podcast.description && (
            <p className="leading-7 text-muted-foreground">
              {podcast.description}
            </p>
          )}

          {/* Basic Information */}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>👁 {podcast.views ?? 0} views</span>

            {podcast.duration ? (
              <span>
                {Math.floor(podcast.duration / 60)}:
                {String(podcast.duration % 60).padStart(2, "0")}
              </span>
            ) : null}
          </div>

          {/* =========================================
              Client Features
              Audio / Video
              Like
              Comments
              View Tracking
          ========================================= */}

          <PodcastDetailsClient podcast={podcast} />
        </div>
      </div>
    </div>
  );
}
