import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

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
      title: "Photo not found",
    };
  }

  return {
    title: `${video.title ?? "Photo Story"} | প্রভাতবার্তা`,

    openGraph: {
      images: video.url ? [video.url] : [],
    },
  };
}

export default async function PhotoPage({ params }: VideoPageProps) {
  const { slug } = await params;

  const photo = await getVideoById(slug);

  if (!photo) {
    notFound();
  }

  return (
    <main
      className="
      mx-auto
      max-w-7xl
      px-4
      py-8
    "
    >
      <article
        className="
        overflow-hidden
        rounded-lg
        border
        border-border
        bg-card
      "
      >
        {/* TITLE */}

        <div className="p-5">
          <h1
            className="
            text-2xl
            font-bold
            leading-tight
            sm:text-3xl
          "
          >
            {photo.title ?? "Photo Story"}
          </h1>
        </div>

        {/* IMAGE */}

        <div
          className="
          relative
          aspect-video
          w-full
          overflow-hidden
        "
        >
          <Image
            src={photo.url}
            alt={photo.title ?? "Photo Story"}
            fill
            sizes="
              (max-width:768px)100vw,
              1200px
            "
            className="
              object-cover
            "
            priority
          />
        </div>

        {/* INFO */}

        <div className="p-5">
          <div
            className="
            text-sm
            text-muted-foreground
          "
          >
            Published: {new Date(photo.createdAt).toLocaleDateString("bn-BD")}
          </div>
        </div>
      </article>
    </main>
  );
}
