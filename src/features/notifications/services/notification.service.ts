import { apiClient } from "@/lib/axios";

import type {
  MyNotificationsResponse,
  NotificationResponse,
} from "../types/notification.types";

export interface NotificationArticle {
  _id: string;
  title: string;
  slug: string;
}

export interface NotificationUser {
  _id: string;
  fullName: string;
  email: string;
}

export type NotificationType =
  | "breaking_news"
  | "important_news"
  | "new_article"
  | "system";

export interface Notification {
  _id: string;
  user: NotificationUser | null;
  title: string;
  message: string;
  type: NotificationType;
  article: NotificationArticle | null;
  isRead: boolean;
  isActive: boolean;
  link: string | null;
  createdBy?: NotificationUser | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationListResponse {
  success: boolean;
  message: string;
  data: Notification[];
  unreadCount?: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAdminNotificationsParams {
  type?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminNotificationsResponse {
  success: boolean;
  message: string;
  data: import("../types/notification.types").Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ======================================================
// USER
// GET MY NOTIFICATIONS
// ======================================================

export async function getMyNotifications(
  page = 1,
  limit = 20,
): Promise<NotificationListResponse> {
  const response = await apiClient.get<NotificationListResponse>(
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
): Promise<NotificationListResponse> {
  const response = await apiClient.get<NotificationListResponse>(
    `/notification/admin?page=${page}&limit=${limit}`,
  );

  return response.data;
}

// ======================================================
// ADMIN / EDITOR
// CREATE NOTIFICATION
// ======================================================

export interface CreateNotificationPayload {
  user?: string | null;
  title: string;
  message: string;
  type?: NotificationType;
  article?: string | null;
  link?: string | null;
}

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

/**
 * ADMIN
 * GET /api/notification/admin
 */
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
