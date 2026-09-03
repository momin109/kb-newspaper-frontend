import { apiClient } from "@/lib/axios";
import type { ActivityLog } from "../types/activity.types";

interface ActivityLogsResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const response = await apiClient.get<ActivityLogsResponse>("/activity");

  return response.data.data;
}
