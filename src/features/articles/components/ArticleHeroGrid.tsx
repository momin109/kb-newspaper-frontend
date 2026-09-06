import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { NewsCard } from "@/components/common/NewsCard";
import { formatBanglaRelativeTime } from "@/lib/relativeTime";

import type { Article } from "../types/article.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80";

export function ArticleHeroGrid({
  articles,
  emptyMessage = "এই মুহূর্তে কোনো সংবাদ নেই।",
}: {
  articles: Article[];
  emptyMessage?: string;
}) {
  if (articles.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const featured = articles[0];
  const middleArticles = articles.slice(1, 4);

  const videoArticle =
    articles.find((article) =>
      article.mediaFiles?.some((media) => media.resource_type === "video"),
    ) ??
    articles[4] ??
    articles[1];

  const videoImage = videoArticle?.thumbnail?.url ?? FALLBACK_IMAGE;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* =========================
            FEATURED NEWS
        ========================== */}
        <div className="lg:col-span-6">
          <NewsCard
            article={featured}
            variant="featured"
            showExcerpt
            className="h-[300px] rounded-sm sm:h-[360px] lg:h-[390px]"
          />
        </div>

        {/* =========================
            MIDDLE NEWS LIST
        ========================== */}
        <div className="flex flex-col divide-y divide-border border border-border bg-card lg:col-span-3">
          {middleArticles.map((article) => {
            const imageUrl = article.thumbnail?.url ?? FALLBACK_IMAGE;

            return (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="group flex gap-3 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {article.category && (
                    <CategoryBadge
                      name={article.category.name}
                      className="mb-1 text-[10px]"
                    />
                  )}

                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                    {article.title}
                  </h3>

                  <span className="mt-1 block text-[11px] text-muted-foreground">
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
            VIDEO NEWS
        ========================== */}
        {videoArticle && (
          <Link
            href={`/article/${videoArticle.slug}`}
            className="group relative min-h-[300px] overflow-hidden bg-black lg:col-span-3 lg:min-h-0"
          >
            <Image
              src={videoImage}
              alt={videoArticle.title}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Video icon */}
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="mb-2 inline-flex rounded-sm bg-primary px-2 py-1 text-[11px] font-semibold text-white">
                ভিডিও
              </span>

              <h3 className="line-clamp-3 text-base font-bold leading-snug text-white sm:text-lg">
                {videoArticle.title}
              </h3>

              <span className="mt-2 block text-xs text-white/70">
                {formatBanglaRelativeTime(
                  videoArticle.publishedAt ?? videoArticle.createdAt,
                )}
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* =========================
          SMALL NEWS STRIP
      ========================== */}
      {articles.length > 4 && (
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 sm:grid-cols-4">
          {articles.slice(4, 8).map((article) => (
            <NewsCard
              key={article._id}
              article={article}
              variant="compact"
              showExcerpt={false}
              className="border border-border bg-card p-2"
            />
          ))}
        </div>
      )}
    </section>
  );
}
