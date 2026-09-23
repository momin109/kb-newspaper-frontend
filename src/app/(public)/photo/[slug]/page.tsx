import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { apiGet } from "@/lib/api-fetch";

import type { Media } from "@/features/media/types/media.types";

interface PhotoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPhotoById(id: string): Promise<Media | null> {
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
}: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;

  const photo = await getPhotoById(slug);

  if (!photo || photo.type !== "image") {
    return {
      title: "ছবি পাওয়া যায়নি | প্রভাতবার্তা",
    };
  }

  return {
    title: `${photo.title ?? "ছবিঘর"} | প্রভাতবার্তা`,

    openGraph: {
      images: photo.url ? [photo.url] : [],
    },
  };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params;

  const photo = await getPhotoById(slug);

  // এখানে type guard-টা জরুরি — কোনো ভিডিওর _id দিয়ে এই URL-এ আসলে
  // `photo.url` একটা .mp4/YouTube link হবে, যেটা next/image দিয়ে render করা যায় না
  if (!photo || photo.type !== "image") {
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
            {photo.title ?? "ছবিঘর"}
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
            alt={photo.title ?? "ছবিঘর"}
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
            প্রকাশিত: {new Date(photo.createdAt).toLocaleDateString("bn-BD")}
          </div>

          {photo.tags && photo.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {photo.tags.map((tag) => (
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
