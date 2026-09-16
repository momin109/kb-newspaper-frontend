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

export interface NotificationCreatedBy {
  _id: string;
  fullName: string;
  email: string;
}

export interface Notification {
  _id: string;

  user: string | NotificationUser | null;

  title: string;
  message: string;

  type: NotificationType;

  article: string | NotificationArticle | null;

  isRead: boolean;
  isActive: boolean;

  link: string | null;

  createdBy: NotificationCreatedBy | null;

  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MyNotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  unreadCount: number;
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
