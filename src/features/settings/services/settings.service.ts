import { apiClient } from "@/lib/axios";

import type { Settings, SettingsGeneral } from "../types/settings.types";

interface SettingsResponse {
  success: boolean;
  message: string;
  data: Settings;
}

export const getSettings = async (): Promise<Settings> => {
  const response = await apiClient.get<SettingsResponse>("/settings");

  return response.data.data;
};

export const updateGeneralSettings = async (
  data: Partial<SettingsGeneral>,
): Promise<Settings> => {
  const response = await apiClient.patch<SettingsResponse>(
    "/settings/general",
    data,
  );

  return response.data.data;
};
