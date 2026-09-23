import type { Metadata } from "next";
import Link from "next/link";

import { NewsCard } from "@/components/common/NewsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { getCategories } from "@/features/categories/services/categories.service";
import { getArticlesPage } from "@/features/articles/services/articles.service";

interface NewsListPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

const LIMIT = 12;

const TABS: { label: string; slug: string | null }[] = [
  { label: "সর্বশেষ", slug: null },
  { label: "জাতীয়", slug: "national" },
  { label: "বিশ্ব", slug: "world" },
  { label: "বাণিজ্য", slug: "business" },
  { label: "খেলা", slug: "sports" },
];

export const metadata: Metadata = {
  title: "সারাদেশ | প্রভাতবার্তা",
  description: "প্রভাতবার্তার সব সংবাদ একসাথে দেখুন।",
};

export default async function NewsListPage({
  searchParams,
}: NewsListPageProps) {
  const { category: categorySlug, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const categories = await getCategories();
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  const { articles, pagination } = await getArticlesPage({
    category: activeCategory?._id,
    page,
    limit: LIMIT,
    sort: "latest",
  });

  const pageHref = (p: number) =>
    categorySlug
      ? `/news?category=${categorySlug}&page=${p}`
      : `/news?page=${p}`;

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      {/* Header + tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-1 border-b-2 border-primary pb-0">
        <h1 className="px-1 py-2 text-xl font-bold text-foreground sm:text-2xl">
          সারাদেশ
        </h1>

        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => {
            const isActive = (tab.slug ?? null) === (categorySlug ?? null);
            const href = tab.slug ? `/news?category=${tab.slug}` : "/news";
            return (
              <Link
                key={tab.label}
                href={href}
                className={`whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {articles.length === 0 ? (
        <EmptyState message="এখনো কোনো সংবাদ প্রকাশিত হয়নি।" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              page === 1
                ? "pointer-events-none opacity-40"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            আগের পাতা
          </Link>

          <span className="px-2 text-sm text-muted-foreground">
            {page} / {pagination.totalPages}
          </span>

          <Link
            href={pageHref(Math.min(pagination.totalPages, page + 1))}
            aria-disabled={page === pagination.totalPages}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              page === pagination.totalPages
                ? "pointer-events-none opacity-40"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            পরের পাতা
          </Link>
        </div>
      )}
    </div>
  );
}
