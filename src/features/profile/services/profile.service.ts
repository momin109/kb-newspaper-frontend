// features/profile/services/profile.service.ts

// import { apiClient } from "@/lib/api-client";
import { apiClient } from "@/lib/axios";
import type {
  ChangePasswordPayload,
  Profile,
  UpdateProfilePayload,
} from "../types/profile.types";

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** GET /api/user/me — client-only (needs the Redux-held JWT via apiClient). */
export async function getMe(): Promise<Profile> {
  const res = await apiClient.get<ApiEnvelope<Profile>>("/user/me");
  return res.data.data;
}

/** PATCH /api/user/me — multipart when an avatar file is included. */
export async function updateMe(
  payload: UpdateProfilePayload,
  avatarFile?: File | null,
): Promise<Profile> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (avatarFile) formData.append("avatar", avatarFile);

  const res = await apiClient.patch<ApiEnvelope<Profile>>("/user/me", formData);
  return res.data.data;
}

/** PATCH /api/user/me/password */
export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.patch("/user/me/password", payload);
}
