"use client";

import Link from "next/link";
import Image from "next/image";
import { Quote, User as UserIcon } from "lucide-react";

import { NewsCardSkeleton } from "@/components/common/NewsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { getExcerpt } from "@/features/articles/utils/getExcerpt";
import { useArticlesClient } from "../hooks/useArticlesClient";
import type { Category } from "@/features/categories/types/category.types";

interface OpinionEditorialSectionProps {
  categories: Category[];
}

/**
 * "মতামত ও সম্পাদকীয়" homepage block — opinion category-র সর্বশেষ ৪টা লেখা,
 * প্রতিটা কার্ডে লেখকের ছবি + নাম + পরিচয় (designation) দেখানো হয়।
 */
export function OpinionEditorialSection({
  categories,
}: OpinionEditorialSectionProps) {
  const opinionCategory = categories.find((c) => c.slug === "opinion");

  const { articles, isLoading, isError, refetch } = useArticlesClient({
    category: opinionCategory?._id,
    limit: 4,
    sort: "latest",
  });

  if (!opinionCategory) return null;

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          মতামত ও সম্পাদকীয়
        </h2>
        <Link
          href={`/category/${opinionCategory.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          সব দেখুন <span aria-hidden>›</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <NewsCardSkeleton key={i} />)
        ) : isError ? (
          <div className="col-span-full">
            <ErrorState onRetry={refetch} />
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message="এখনো কোনো মতামত/সম্পাদকীয় প্রকাশিত হয়নি।" />
          </div>
        ) : (
          articles.slice(0, 4).map((article) => (
            <Link
              key={article._id}
              href={`/article/${article.slug}`}
              className="group flex flex-col border-l-4 border-primary/30 pl-4 transition-colors hover:border-primary"
            >
              <Quote className="mb-2 h-6 w-6 rotate-180 fill-primary text-primary" />

              <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
                {article.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {getExcerpt(article.content, 130)}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                  {article.author?.avatar ? (
                    <Image
                      src={article.author.avatar}
                      alt={article.author.fullName}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {article.author?.fullName ?? "প্রভাতবার্তা"}
                  </p>
                  {article.author?.designation && (
                    <p className="truncate text-xs text-muted-foreground">
                      {article.author.designation}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
