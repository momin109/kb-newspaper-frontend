import { apiClient } from "@/lib/axios";
import type { ActivityLog } from "../types/activity.types";

interface ActivityLogsResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
}

interface ActivityLogResponse {
  success: boolean;
  message: string;
  data: ActivityLog;
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const response = await apiClient.get<ActivityLogsResponse>("/activity");

  return response.data.data;
}

export async function updateActivityLog(
  id: string,
  data: {
    action?: string;
    target?: string;
    targetId?: string;
    device?: "mobile" | "desktop" | "tablet";
    ip?: string;
    details?: string;
  },
): Promise<ActivityLog> {
  const response = await apiClient.patch<ActivityLogResponse>(
    `/activity/${id}`,
    data,
  );

  return response.data.data;
}

export async function deleteActivityLog(id: string): Promise<void> {
  await apiClient.delete(`/activity/${id}`);
}
