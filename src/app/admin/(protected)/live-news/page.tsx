"use client";

import { useQuery } from "@tanstack/react-query";
// import {
//   getBangladeshNews,
//   getLiveNews,
//   type LiveNewsArticle,
// } from "@/features/breaking-news/services/live-news-admin.service";

import { useState } from "react";
import { ExternalLink, RefreshCw, Search, Newspaper } from "lucide-react";
import {
  getBangladeshNews,
  getLiveNews,
  LiveNewsArticle,
} from "@/features/breaking-news/types/live-news-admin.service";

export default function LiveNewsPage() {
  const [type, setType] = useState<"international" | "bangladesh">(
    "international",
  );

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-live-news", type],
    queryFn: type === "international" ? getLiveNews : getBangladeshNews,
  });

  const articles = data?.articles ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Live News</h1>
          <p className="text-sm text-muted-foreground">
            Latest news fetched from NewsAPI.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setType("international")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            type === "international"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          International
        </button>

        <button
          onClick={() => setType("bangladesh")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            type === "bangladesh"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Bangladesh
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading news...
          </div>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load news.</p>

          <button
            onClick={() => refetch()}
            className="mt-3 rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && articles.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border">
          <Newspaper className="mb-3 h-10 w-10 text-muted-foreground" />

          <h3 className="font-medium">No news found</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            There are no news articles available right now.
          </p>
        </div>
      )}

      {/* News */}
      {!isLoading && !isError && articles.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total results: {data?.totalResults ?? articles.length}
            </p>
          </div>

          <div className="grid gap-4">
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NewsCard({ article }: { article: LiveNewsArticle }) {
  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {article.urlToImage ? (
          <div className="h-48 w-full shrink-0 md:h-auto md:w-64">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-48 w-full shrink-0 items-center justify-center bg-muted md:h-auto md:w-64">
            <Newspaper className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{article.source?.name ?? "Unknown source"}</span>

            <span>•</span>

            <span>{new Date(article.publishedAt).toLocaleString()}</span>
          </div>

          <h2 className="line-clamp-2 text-lg font-semibold">
            {article.title}
          </h2>

          {article.description && (
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {article.description}
            </p>
          )}

          <div className="mt-auto pt-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Read Original
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
