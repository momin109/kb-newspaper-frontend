import { apiClient } from "@/lib/axios";
import type { User, UserRole } from "../types/user.types";

interface UsersResponse {
  success: boolean;
  total: number;
  message: string;
  data: User[];
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export async function getAdminUsers(): Promise<User[]> {
  const response = await apiClient.get<UsersResponse>("/user/all");

  return response.data.data;
}

export async function updateUserRole(
  id: string,
  role: UserRole,
): Promise<User> {
  const response = await apiClient.patch<UserResponse>(
    `/user/users/${id}/role`,
    { role },
  );

  return response.data.data;
}

export async function banUser(id: string, reason?: string): Promise<User> {
  const response = await apiClient.patch<UserResponse>(
    `/user/users/${id}/ban`,
    {
      reason: reason || "Violation of policy",
    },
  );

  return response.data.data;
}

export async function unbanUser(id: string): Promise<User> {
  const response = await apiClient.patch<UserResponse>(
    `/user/users/${id}/unban`,
  );

  return response.data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/user/users/${id}`);
}
