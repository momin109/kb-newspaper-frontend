"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Eye,
  FileText,
  Loader2,
  MessageSquare,
  Users,
} from "lucide-react";

import {
  getDailyTraffic,
  getDeviceStats,
  getPeakHours,
  getReportOverview,
  getTopArticles,
} from "@/features/reports/services/report.service";

export default function ReportsPage() {
  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useQuery({
    queryKey: ["report-overview"],
    queryFn: getReportOverview,
  });

  const {
    data: topArticles,
    isLoading: articlesLoading,
    isError: articlesError,
  } = useQuery({
    queryKey: ["report-top-articles"],
    queryFn: getTopArticles,
  });

  const {
    data: dailyTraffic,
    isLoading: trafficLoading,
    isError: trafficError,
  } = useQuery({
    queryKey: ["report-daily-traffic"],
    queryFn: getDailyTraffic,
  });

  const {
    data: deviceStats,
    isLoading: devicesLoading,
    isError: devicesError,
  } = useQuery({
    queryKey: ["report-device-stats"],
    queryFn: getDeviceStats,
  });

  const {
    data: peakHours,
    isLoading: peakHoursLoading,
    isError: peakHoursError,
  } = useQuery({
    queryKey: ["report-peak-hours"],
    queryFn: getPeakHours,
  });

  const isLoading =
    overviewLoading ||
    articlesLoading ||
    trafficLoading ||
    devicesLoading ||
    peakHoursLoading;

  const hasError =
    overviewError ||
    articlesError ||
    trafficError ||
    devicesError ||
    peakHoursError;

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">Failed to load reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>

        <p className="text-sm text-muted-foreground">
          Monitor website traffic and content performance.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard
          title="Total Views"
          value={overview?.totalViews ?? 0}
          icon={<Eye className="h-5 w-5" />}
        />

        <ReportCard
          title="Unique Visitors"
          value={overview?.uniqueVisitors ?? 0}
          icon={<Users className="h-5 w-5" />}
        />

        <ReportCard
          title="Published Articles"
          value={overview?.totalArticles ?? 0}
          icon={<FileText className="h-5 w-5" />}
        />

        <ReportCard
          title="Total Comments"
          value={overview?.totalComments ?? 0}
          icon={<MessageSquare className="h-5 w-5" />}
        />
      </div>

      {/* Top Articles */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">Top Articles</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Most viewed articles based on article view activity.
          </p>
        </div>

        {topArticles && topArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-5 py-3 text-left font-medium">#</th>

                  <th className="px-5 py-3 text-left font-medium">Article</th>

                  <th className="px-5 py-3 text-left font-medium">Category</th>

                  <th className="px-5 py-3 text-right font-medium">Views</th>
                </tr>
              </thead>

              <tbody>
                {topArticles.map((article, index) => {
                  const category =
                    typeof article.category === "string"
                      ? article.category
                      : (article.category?.name ?? "—");

                  return (
                    <tr
                      key={article._id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-5 py-4 text-muted-foreground">
                        {index + 1}
                      </td>

                      <td className="max-w-md px-5 py-4">
                        <p className="line-clamp-1 font-medium">
                          {article.title}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {category}
                      </td>

                      <td className="px-5 py-4 text-right font-medium">
                        {article.views.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No article view data available.
          </div>
        )}
      </div>
      {/* Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Traffic */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />

              <h2 className="font-semibold">Daily Traffic</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Article views during the last 7 days.
            </p>
          </div>

          <div className="space-y-4">
            {dailyTraffic?.map((item) => {
              const maxViews = Math.max(
                ...(dailyTraffic?.map((item) => item.views) ?? [1]),
                1,
              );

              const percentage = (item.views / maxViews) * 100;

              return (
                <div key={item.day} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.day}</span>

                    <span className="font-medium">
                      {item.views.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Stats */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />

              <h2 className="font-semibold">Device Statistics</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Visitor activity by device.
            </p>
          </div>

          <div className="space-y-4">
            {deviceStats?.map((item) => (
              <div
                key={item.device}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium capitalize">{item.device}</p>

                  <p className="text-xs text-muted-foreground">
                    {item.count.toLocaleString()} views
                  </p>
                </div>

                <span className="text-sm font-semibold">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />

            <h2 className="font-semibold">Peak Hours</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Article views by popular time periods.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {peakHours?.map((item) => (
            <div key={item.label} className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>

              <p className="mt-2 text-2xl font-semibold">
                {item.value.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Report Card
========================================================= */

interface ReportCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function ReportCard({ title, value, icon }: ReportCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-muted p-2">{icon}</div>

        <span className="text-2xl font-semibold">{value.toLocaleString()}</span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
