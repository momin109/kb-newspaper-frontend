"use client";

import { useState } from "react";
import Link from "next/link";

import { NewsCard, NewsCardSkeleton } from "@/components/common/NewsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useArticlesClient } from "../hooks/useArticlesClient";
import type { Category } from "@/features/categories/types/category.types";

const TABS: { label: string; slug: string | null }[] = [
  { label: "সর্বশেষ", slug: null },
  { label: "জাতীয়", slug: "national" },
  { label: "বিশ্ব", slug: "world" },
  { label: "বাণিজ্য", slug: "business" },
  { label: "খেলা", slug: "sports" },
];

interface CountrywideNewsSectionProps {
  categories: Category[];
}

/**
 * "সারাদেশ" homepage block — tab-switchable (client, since a Server
 * Component can't respond to tab clicks), always shows 6 articles.
 * Full pagination lives on /news, linked via "আরও সংবাদ দেখুন".
 */
export function CountrywideNewsSection({
  categories,
}: CountrywideNewsSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeCategory = activeSlug
    ? categories.find((c) => c.slug === activeSlug)
    : null;

  const { articles, isLoading, isError, refetch } = useArticlesClient({
    category: activeCategory?._id,
    limit: 6,
    sort: "latest",
  });

  const moreHref = activeSlug ? `/news?category=${activeSlug}` : "/news";

  return (
    <section className="py-6">
      {/* Header + tabs */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b-2 border-primary pb-0">
        <h2 className="whitespace-nowrap px-1 py-2 text-lg font-bold text-foreground sm:text-xl">
          সারাদেশ
        </h2>

        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveSlug(tab.slug)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors ${
                activeSlug === tab.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid — 6 cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
        ) : isError ? (
          <div className="col-span-full">
            <ErrorState onRetry={refetch} />
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message="এই বিভাগে এখনো কোনো সংবাদ নেই।" />
          </div>
        ) : (
          articles
            .slice(0, 6)
            .map((article) => <NewsCard key={article._id} article={article} />)
        )}
      </div>

      {/* সব দেখুন */}
      <div className="mt-5 text-center">
        <Link
          href={moreHref}
          className="inline-block rounded-md border border-primary px-6 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          আরও সংবাদ দেখুন
        </Link>
      </div>
    </section>
  );
}
