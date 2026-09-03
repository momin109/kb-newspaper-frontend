import { apiClient } from "@/lib/axios";
import type { AuthUser } from "../types/auth.types";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  data: AuthUser;
}

interface MeResponse {
  success: boolean;
  data: AuthUser;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload,
    );

    return response.data;
  },

  async getMe(token: string): Promise<MeResponse> {
    const response = await apiClient.get<MeResponse>("/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
