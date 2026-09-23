import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { apiGet } from "@/lib/api-fetch";

import type { Media } from "@/features/media/types/media.types";

interface VideoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getVideoById(id: string): Promise<Media | null> {
  try {
    const res = await apiGet<{
      success: boolean;
      message: string;
      data: Media;
    }>(`/media/${id}`);

    return res.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;

  const video = await getVideoById(slug);

  if (!video) {
    return {
      title: "ভিডিও পাওয়া যায়নি | প্রভাতবার্তা",
    };
  }

  return {
    title: `${video.title ?? "ভিডিও সংবাদ"} | প্রভাতবার্তা`,

    openGraph: {
      images: video.thumbnail ? [video.thumbnail] : [],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;

  const video = await getVideoById(slug);

  if (!video || video.type !== "video") {
    notFound();
  }

  const isYoutube = video.sourceType === "youtube" && video.youtubeId;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <article className="overflow-hidden rounded-lg border border-border bg-card">
        {/* TITLE */}
        <div className="p-5">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {video.title ?? "ভিডিও সংবাদ"}
          </h1>
        </div>

        {/* PLAYER */}
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {isYoutube ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title ?? "ভিডিও সংবাদ"}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={video.url}
              controls
              autoPlay
              poster={video.thumbnail || undefined}
              className="h-full w-full"
            >
              আপনার ব্রাউজার video tag সাপোর্ট করে না।
            </video>
          )}
        </div>

        {/* INFO */}
        <div className="p-5">
          <div className="text-sm text-muted-foreground">
            প্রকাশিত: {new Date(video.createdAt).toLocaleDateString("bn-BD")}
          </div>

          {video.tags && video.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
