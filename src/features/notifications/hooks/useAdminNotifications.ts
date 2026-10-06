"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  CreateNotificationPayload,
  Notification,
  NotificationPagination,
  NotificationType,
} from "../types/notification.types";

import {
  createNotification,
  deleteNotification,
  getAdminNotifications,
} from "../services/notification.service";

interface UseAdminNotificationsParams {
  type?: NotificationType;
  isActive?: boolean;
  initialPage?: number;
  limit?: number;
}

interface UseAdminNotificationsReturn {
  notifications: Notification[];
  pagination: NotificationPagination;

  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  error: string | null;

  page: number;
  setPage: (page: number) => void;

  type: NotificationType | undefined;
  setType: (type: NotificationType | undefined) => void;

  isActive: boolean | undefined;
  setIsActive: (value: boolean | undefined) => void;

  refetch: () => Promise<void>;

  createNotification: (payload: CreateNotificationPayload) => Promise<boolean>;

  handleDelete: (id: string) => Promise<boolean>;
}

const DEFAULT_PAGINATION: NotificationPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

export function useAdminNotifications({
  type: initialType,
  isActive: initialIsActive,
  initialPage = 1,
  limit = 20,
}: UseAdminNotificationsParams = {}): UseAdminNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [pagination, setPagination] = useState<NotificationPagination>({
    ...DEFAULT_PAGINATION,
    page: initialPage,
    limit,
  });

  const [page, setPageState] = useState(initialPage);

  const [type, setType] = useState<NotificationType | undefined>(initialType);

  const [isActive, setIsActive] = useState<boolean | undefined>(
    initialIsActive,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAdminNotifications({
        page,
        limit,
        type,
        isActive,
      });

      setNotifications(response.data);
      setPagination(response.pagination);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications";

      setError(message);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, type, isActive]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Pagination
   */
  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  /**
   * Notification type filter
   */
  const handleSetType = useCallback((newType: NotificationType | undefined) => {
    setType(newType);
    setPageState(1);
  }, []);

  /**
   * Active status filter
   */
  const handleSetIsActive = useCallback((value: boolean | undefined) => {
    setIsActive(value);
    setPageState(1);
  }, []);

  /**
   * Create notification
   */
  const handleCreateNotification = useCallback(
    async (payload: CreateNotificationPayload): Promise<boolean> => {
      try {
        setIsCreating(true);
        setError(null);

        await createNotification(payload);

        // Create হওয়ার পরে latest notification list reload
        await fetchNotifications();

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create notification";

        setError(message);

        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchNotifications],
  );

  /**
   * Delete notification
   */
  const handleDelete = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsDeleting(true);
        setError(null);

        await deleteNotification(id);

        setNotifications((current) =>
          current.filter((notification) => notification._id !== id),
        );

        setPagination((current) => ({
          ...current,
          total: Math.max(0, current.total - 1),
        }));

        // যদি current page-এ শুধু ১টি notification থাকে
        // এবং সেটা delete করার পরে page empty হয়
        if (notifications.length === 1 && page > 1) {
          setPageState((current) => current - 1);
        }

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete notification";

        setError(message);

        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [notifications.length, page],
  );

  return {
    notifications,
    pagination,

    isLoading,
    isCreating,
    isDeleting,
    error,

    page,
    setPage,

    type,
    setType: handleSetType,

    isActive,
    setIsActive: handleSetIsActive,

    refetch: fetchNotifications,

    createNotification: handleCreateNotification,

    handleDelete,
  };
}
