import { apiClient } from "@/lib/axios";
import type { AuthUser } from "../types/auth.types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthResponse {
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
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  // ⚠️ backend endpoint ধরে নেওয়া হয়েছে — না মিললে path পাল্টান
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  async getMe(token: string): Promise<MeResponse> {
    const response = await apiClient.get<MeResponse>("/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
