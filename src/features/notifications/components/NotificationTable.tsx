"use client";

import { Bell, CalendarDays, Loader2, User, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type {
  Notification,
  NotificationType,
} from "../types/notification.types";

interface NotificationTableProps {
  notifications: Notification[];
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG: Record<
  NotificationType,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  breaking_news: {
    label: "Breaking News",
    variant: "destructive",
  },
  important_news: {
    label: "Important News",
    variant: "default",
  },
  new_article: {
    label: "New Article",
    variant: "secondary",
  },
  system: {
    label: "System",
    variant: "outline",
  },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getRecipient(notification: Notification) {
  if (!notification.user) {
    return "সকল ব্যবহারকারী";
  }

  return notification.user.fullName || notification.user.email;
}

export function NotificationTable({
  notifications,
  isLoading,
  isDeleting,
  onDelete,
}: NotificationTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Notification loading...
        </div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-card px-4 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="text-sm font-semibold">No notifications found</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          এই filter-এর জন্য কোনো notification পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Notification</th>

              <th className="px-4 py-3 font-semibold">Type</th>

              <th className="px-4 py-3 font-semibold">Recipient</th>

              <th className="px-4 py-3 font-semibold">Status</th>

              <th className="px-4 py-3 font-semibold">Created</th>

              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {notifications.map((notification) => {
              const typeConfig = TYPE_CONFIG[notification.type];

              return (
                <tr
                  key={notification._id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Notification */}
                  <td className="max-w-[360px] px-4 py-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {notification.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {notification.message}
                        </p>

                        {notification.article && (
                          <p className="mt-1 truncate text-xs text-primary">
                            Article: {notification.article.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4">
                    <Badge variant={typeConfig.variant}>
                      {typeConfig.label}
                    </Badge>
                  </td>

                  {/* Recipient */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />

                      <span className="max-w-[160px] truncate">
                        {getRecipient(notification)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={notification.isActive ? "default" : "outline"}
                        className="w-fit"
                      >
                        {notification.isActive ? "Active" : "Inactive"}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {notification.isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(notification.createdAt)}
                    </div>

                    {notification.createdBy && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        By {notification.createdBy.fullName}
                      </p>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting}
                      onClick={() => onDelete(notification._id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete notification"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y md:hidden">
        {notifications.map((notification) => {
          const typeConfig = TYPE_CONFIG[notification.type];

          return (
            <div key={notification._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold">{notification.title}</h3>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  onClick={() => onDelete(notification._id)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>

                <Badge variant={notification.isActive ? "default" : "outline"}>
                  {notification.isActive ? "Active" : "Inactive"}
                </Badge>

                <Badge variant="outline">
                  {notification.isRead ? "Read" : "Unread"}
                </Badge>
              </div>

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium">Recipient:</span>{" "}
                  {getRecipient(notification)}
                </p>

                <p className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(notification.createdAt)}
                </p>

                {notification.createdBy && (
                  <p>Created by: {notification.createdBy.fullName}</p>
                )}
              </div>

              {notification.article && (
                <p className="mt-2 truncate text-xs text-primary">
                  Article: {notification.article.title}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
