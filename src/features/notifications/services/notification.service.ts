import { apiClient } from "@/lib/axios";

import type {
  CreateNotificationPayload,
  MyNotificationsResponse,
  Notification,
  NotificationPagination,
  NotificationType,
} from "../types/notification.types";

export interface GetAdminNotificationsParams {
  type?: NotificationType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminNotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: NotificationPagination;
}

// ======================================================
// USER
// GET MY NOTIFICATIONS
// ======================================================

export async function getMyNotifications(
  page = 1,
  limit = 20,
): Promise<MyNotificationsResponse> {
  const response = await apiClient.get<MyNotificationsResponse>(
    `/notification/my?page=${page}&limit=${limit}`,
  );

  return response.data;
}

// ======================================================
// USER
// MARK ONE AS READ
// ======================================================

export async function markNotificationAsRead(
  notificationId: string,
): Promise<Notification> {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: Notification;
  }>(`/notification/${notificationId}/read`);

  return response.data.data;
}

// ======================================================
// USER
// MARK ALL AS READ
// ======================================================

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch("/notification/read-all");
}

// ======================================================
// ADMIN / EDITOR
// GET ALL NOTIFICATIONS
// ======================================================

export async function getAllNotifications(
  page = 1,
  limit = 20,
): Promise<MyNotificationsResponse> {
  const response = await apiClient.get<MyNotificationsResponse>(
    `/notification/admin?page=${page}&limit=${limit}`,
  );

  return response.data;
}

// ======================================================
// ADMIN / EDITOR
// CREATE NOTIFICATION
// ======================================================

export async function createNotification(
  payload: CreateNotificationPayload,
): Promise<Notification> {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Notification;
  }>("/notification", payload);

  return response.data.data;
}

// ======================================================
// ADMIN
// DELETE NOTIFICATION
// ======================================================

export async function deleteNotification(
  notificationId: string,
): Promise<void> {
  await apiClient.delete(`/notification/${notificationId}`);
}

// ======================================================
// ADMIN
// GET ALL NOTIFICATIONS WITH FILTERS
// GET /api/notification/admin
// ======================================================

export async function getAdminNotifications(
  params: GetAdminNotificationsParams = {},
): Promise<AdminNotificationsResponse> {
  const query = new URLSearchParams();

  if (params.type) {
    query.set("type", params.type);
  }

  if (params.isActive !== undefined) {
    query.set("isActive", String(params.isActive));
  }

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 20));

  const response = await apiClient.get<AdminNotificationsResponse>(
    `/notification/admin?${query.toString()}`,
  );

  return response.data;
}
