export type NotificationType =
  | "breaking_news"
  | "important_news"
  | "new_article"
  | "system";

export interface NotificationUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface NotificationArticle {
  _id: string;
  title: string;
  slug: string;
}

export interface AdminNotification {
  _id: string;
  user: NotificationUser | null;
  title: string;
  message: string;
  type: NotificationType;
  article: NotificationArticle | null;
  isRead: boolean;
  isActive: boolean;
  link: string | null;
  createdBy: NotificationUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAdminNotificationsResponse {
  success: boolean;
  message: string;
  data: AdminNotification[];
  pagination: NotificationPagination;
}

export interface CreateNotificationPayload {
  user?: string | null;
  title: string;
  message: string;
  type: NotificationType;
  article?: string | null;
  link?: string | null;
}
