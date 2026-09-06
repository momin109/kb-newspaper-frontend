import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { formatBanglaRelativeTime } from "@/lib/relativeTime";
import { getExcerpt } from "@/features/articles/utils/getExcerpt";
import type { Article } from "@/features/articles/types/article.types";

export type NewsCardVariant =
  | "default"
  | "compact"
  | "featured"
  | "horizontal"
  | "list";

interface NewsCardProps {
  article: Article;
  variant?: NewsCardVariant;
  showExcerpt?: boolean;
  className?: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80";

/**
 * The single most-reused component. Purely presentational — receives an
 * Article (matching the real backend shape) as a prop. `thumbnail` can
 * be null on the real backend (not every article has one uploaded), so
 * every variant falls back to a placeholder image.
 */
export function NewsCard({
  article,
  variant = "default",
  showExcerpt = true,
  className,
}: NewsCardProps) {
  const href = `/article/${article.slug}`;
  const imageUrl = article.thumbnail?.url ?? FALLBACK_IMAGE;
  const timeLabel = article.publishedAt
    ? formatBanglaRelativeTime(article.publishedAt)
    : formatBanglaRelativeTime(article.createdAt);

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex gap-3 py-3 first:pt-0 border-b border-border last:border-0",
          className,
        )}
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
            {article.title}
          </h4>
          <span className="mt-1 block text-xs text-muted-foreground">
            {timeLabel}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex w-64 shrink-0 flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-md",
          className,
        )}
      >
        <div className="relative h-36 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="256px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
            {article.title}
          </h4>
          <span className="mt-auto text-xs text-muted-foreground">
            {timeLabel}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className={cn(
          "group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-sm",
          className,
        )}
      >
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="relative flex flex-col gap-2 p-4 sm:p-5">
          {article.category && <CategoryBadge name={article.category.name} />}
          <h2 className="line-clamp-3 text-lg font-bold leading-snug text-white sm:text-xl">
            {article.title}
          </h2>
          {showExcerpt && (
            <p className="line-clamp-2 text-sm text-white/85">
              {getExcerpt(article.content)}
            </p>
          )}
          <span className="text-xs text-white/70">{timeLabel}</span>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex gap-4 rounded-sm border border-border bg-card p-3 transition-shadow hover:shadow-md sm:p-4",
          className,
        )}
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-sm sm:h-32 sm:w-48">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="192px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {article.category && (
            <CategoryBadge name={article.category.name} className="w-fit" />
          )}
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary sm:text-base">
            {article.title}
          </h3>
          {showExcerpt && (
            <p className="line-clamp-2 hidden text-sm text-muted-foreground sm:block">
              {getExcerpt(article.content, 150)}
            </p>
          )}
          <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span>{timeLabel}</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.views}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative h-40 w-full overflow-hidden sm:h-44">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 25vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {article.category && (
          <CategoryBadge
            name={article.category.name}
            className="absolute left-2 top-2"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary sm:text-base">
          {article.title}
        </h3>
        {showExcerpt && (
          <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            {getExcerpt(article.content)}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-muted-foreground">
          <span>{timeLabel}</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
