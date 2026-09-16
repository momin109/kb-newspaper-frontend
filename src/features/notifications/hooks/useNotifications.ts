"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service";

export const NOTIFICATION_QUERY_KEY = ["notifications"];

export function useNotifications() {
  const queryClient = useQueryClient();

  /**
   * Get user's notifications
   */
  const notificationsQuery = useQuery({
    queryKey: NOTIFICATION_QUERY_KEY,
    queryFn: () => getMyNotifications(1, 20),
    staleTime: 30 * 1000,
  });

  /**
   * Mark one notification as read
   */
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
      });
    },
  });

  /**
   * Mark all notifications as read
   */
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
      });
    },
  });

  return {
    notifications: notificationsQuery.data?.data ?? [],

    unreadCount: notificationsQuery.data?.unreadCount ?? 0,

    isLoading: notificationsQuery.isLoading,

    isError: notificationsQuery.isError,

    markAsRead: markAsReadMutation.mutateAsync,

    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead: markAllAsReadMutation.mutateAsync,

    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    refetch: notificationsQuery.refetch,
  };
}
