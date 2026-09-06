"use client";

import { NewsCard, NewsCardSkeleton } from "@/components/common/NewsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useArticlesClient } from "../hooks/useArticlesClient";

export function LatestNewsSection() {
  const latest = useArticlesClient({
    limit: 5,
    sort: "latest",
  });

  const popular = useArticlesClient({
    limit: 5,
    sort: "popular",
  });

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =========================
            সর্বশেষ সংবাদ
        ========================== */}
        <div className="lg:col-span-2 border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-lg font-bold">সর্বশেষ সংবাদ</h2>
          </div>

          <div className="divide-y divide-border px-4">
            {latest.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="py-3">
                  <NewsCardSkeleton />
                </div>
              ))
            ) : latest.isError ? (
              <div className="py-6">
                <ErrorState onRetry={latest.refetch} />
              </div>
            ) : latest.articles.length === 0 ? (
              <div className="py-6">
                <EmptyState message="কোনো সংবাদ পাওয়া যায়নি।" />
              </div>
            ) : (
              latest.articles.map((article) => (
                <div key={article._id} className="py-3">
                  <NewsCard
                    article={article}
                    variant="compact"
                    showExcerpt={false}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================
            সর্বাধিক পঠিত
        ========================== */}
        <aside className="border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-lg font-bold">সর্বাধিক পঠিত</h2>
          </div>

          <div className="divide-y divide-border px-4">
            {popular.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3 py-4">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded bg-muted" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))
            ) : popular.isError ? (
              <div className="py-6">
                <ErrorState onRetry={popular.refetch} />
              </div>
            ) : popular.articles.length === 0 ? (
              <div className="py-6">
                <EmptyState message="কোনো জনপ্রিয় সংবাদ পাওয়া যায়নি।" />
              </div>
            ) : (
              popular.articles.map((article, index) => (
                <div key={article._id} className="flex gap-3 py-3">
                  {/* Number */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>

                  {/* Article */}
                  <div className="min-w-0 flex-1">
                    <NewsCard
                      article={article}
                      variant="compact"
                      showExcerpt={false}
                      className="border-0 py-0"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
