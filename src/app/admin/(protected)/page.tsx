"use client";

import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardStats();

  const statistics = data?.data.statistics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here&apos;s an overview of your newspaper.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            Failed to load dashboard data.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Articles",
            value: statistics?.articles.total,
          },
          {
            title: "Published Articles",
            value: statistics?.articles.published,
          },
          {
            title: "Comments",
            value: statistics?.comments.total,
          },
          {
            title: "Users",
            value: statistics?.users.total,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{item.title}</p>

            <p className="mt-2 text-2xl font-semibold">
              {isLoading ? "..." : (item.value?.toLocaleString() ?? "0")}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Draft Articles</p>

          <p className="mt-2 text-2xl font-semibold">
            {isLoading
              ? "..."
              : (statistics?.articles.draft.toLocaleString() ?? "0")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Review Articles</p>

          <p className="mt-2 text-2xl font-semibold">
            {isLoading
              ? "..."
              : (statistics?.articles.review.toLocaleString() ?? "0")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Categories</p>

          <p className="mt-2 text-2xl font-semibold">
            {isLoading
              ? "..."
              : (statistics?.categories.total.toLocaleString() ?? "0")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Views</p>

          <p className="mt-2 text-2xl font-semibold">
            {isLoading
              ? "..."
              : (statistics?.views.total.toLocaleString() ?? "0")}
          </p>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Recent Articles</h2>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading articles...</p>
          ) : data?.data.recentArticles.length ? (
            data.data.recentArticles.map((article) => (
              <div
                key={article._id}
                className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {article.title}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {article.category?.name ?? "Uncategorized"}
                    {" • "}
                    {article.author?.fullName ?? "Unknown"}
                  </p>
                </div>

                <span className="shrink-0 text-xs capitalize text-muted-foreground">
                  {article.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent articles found.
            </p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Recent Activity</h2>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          ) : data?.data.recentActivities.length ? (
            data.data.recentActivities.map((activity) => (
              <div
                key={activity._id}
                className="border-b pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm">
                  {activity.description ??
                    activity.action ??
                    "Activity recorded"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {activity.user?.fullName ?? "System"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
