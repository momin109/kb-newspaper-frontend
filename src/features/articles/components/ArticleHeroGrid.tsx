import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/common/EmptyState";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { NewsCard } from "@/components/common/NewsCard";
import { formatBanglaRelativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";

import type { Article } from "../types/article.types";
import type { Media } from "@/features/media/types/media.types";

import { HeroMediaSlider } from "@/features/media/components/MediaStorySlider";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80";

interface ArticleHeroGridProps {
  articles: Article[];

  videos?: Media[];

  photos?: Media[];

  emptyMessage?: string;

  // NEW — video/photo story slider কলামটা দেখাবে কিনা। Homepage-এর জন্য
  // default true (আগের মতোই), category page-এ false পাঠানো হয়।
  showMediaSlider?: boolean;
}

export function ArticleHeroGrid({
  articles,

  videos = [],

  photos = [],

  emptyMessage = "এই মুহূর্তে কোনো সংবাদ নেই।",

  showMediaSlider = true,
}: ArticleHeroGridProps) {
  if (!articles || articles.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const featured = articles[0];

  const middleArticles = articles.slice(1, 4);

  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-1
          gap-3
          lg:grid-cols-12
          lg:items-stretch
        "
      >
        {/* =========================
            FEATURED NEWS
        ========================== */}

        <div className={showMediaSlider ? "lg:col-span-6" : "lg:col-span-7"}>
          <NewsCard
            article={featured}
            variant="featured"
            showExcerpt
            className="
              h-[390px]
              rounded-sm
            "
          />
        </div>

        {/* =========================
            MIDDLE NEWS LIST
        ========================== */}

        <div
          className={cn(
            "flex h-[390px] flex-col overflow-hidden divide-y divide-border border border-border bg-card",
            showMediaSlider ? "lg:col-span-3" : "lg:col-span-5",
          )}
        >
          {middleArticles.map((article) => {
            const imageUrl = article.thumbnail?.url ?? FALLBACK_IMAGE;

            return (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="
                    group
                    flex
                    flex-1
                    gap-3
                    p-3
                    transition-colors
                    hover:bg-muted/50
                  "
              >
                <div
                  className="
                      relative
                      h-[72px]
                      w-[96px]
                      shrink-0
                      overflow-hidden
                    "
                >
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    sizes="96px"
                    className="
                        object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {article.category && (
                    <CategoryBadge
                      name={article.category.name}
                      className="mb-1 text-[10px]"
                    />
                  )}

                  <h3
                    className="
                        line-clamp-2
                        text-sm
                        font-semibold
                        leading-snug
                        group-hover:text-primary
                      "
                  >
                    {article.title}
                  </h3>

                  <span
                    className="
                        mt-1
                        block
                        text-[11px]
                        text-muted-foreground
                      "
                  >
                    {formatBanglaRelativeTime(
                      article.publishedAt ?? article.createdAt,
                    )}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* =========================
            VIDEO / PHOTO STORY SLIDER
            (শুধু showMediaSlider=true হলে দেখাবে — homepage-এ default true)
        ========================== */}

        {showMediaSlider && (
          <div
            className="
              h-[390px]
              lg:col-span-3
            "
          >
            <HeroMediaSlider videos={videos} photos={photos} />
          </div>
        )}
      </div>

      {/* =========================
          SMALL NEWS STRIP
      ========================== */}

      {articles.length > 4 && (
        <div
          className="
              mt-3
              grid
              grid-cols-2
              gap-3
              border-t
              border-border
              pt-3
              sm:grid-cols-4
            "
        >
          {articles.slice(4, 8).map((article) => (
            <NewsCard
              key={article._id}
              article={article}
              variant="compact"
              showExcerpt={false}
              className="
                    border
                    border-border
                    bg-card
                    p-2
                  "
            />
          ))}
        </div>
      )}
    </section>
  );
}
