import { apiClient } from "@/lib/axios";

import type {
  DailyTraffic,
  DeviceStat,
  PeakHour,
  ReportOverview,
  TopArticle,
} from "../types/report.types";

interface ReportOverviewResponse {
  success: boolean;
  message: string;
  data: ReportOverview;
}

interface DailyTrafficResponse {
  success: boolean;
  message: string;
  data: DailyTraffic[];
}

interface DeviceStatsResponse {
  success: boolean;
  message: string;
  data: DeviceStat[];
}

interface PeakHoursResponse {
  success: boolean;
  message: string;
  data: PeakHour[];
}

interface TopArticlesResponse {
  success: boolean;
  message: string;
  data: TopArticle[];
}

export async function getReportOverview(): Promise<ReportOverview> {
  const response =
    await apiClient.get<ReportOverviewResponse>("/report/overview");

  return response.data.data;
}

export async function getDailyTraffic(): Promise<DailyTraffic[]> {
  const response = await apiClient.get<DailyTrafficResponse>("/report/traffic");

  return response.data.data;
}

export async function getDeviceStats(): Promise<DeviceStat[]> {
  const response = await apiClient.get<DeviceStatsResponse>("/report/devices");

  return response.data.data;
}

export async function getPeakHours(): Promise<PeakHour[]> {
  const response = await apiClient.get<PeakHoursResponse>("/report/peak-hours");

  return response.data.data;
}

export async function getTopArticles(): Promise<TopArticle[]> {
  const response = await apiClient.get<TopArticlesResponse>(
    "/report/top-articles",
  );

  return response.data.data;
}

export const reportService = {
  getReportOverview,
  getDailyTraffic,
  getDeviceStats,
  getPeakHours,
  getTopArticles,
};
