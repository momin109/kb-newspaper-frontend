"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(),

    queryFn: dashboardService.getDashboardStats,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
}
