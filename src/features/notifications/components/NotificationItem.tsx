"use client";

import Link from "next/link";
import { AlertCircle, Bell, FileText, Newspaper, Zap } from "lucide-react";

import type { Notification } from "../types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "breaking_news":
      return <Zap className="h-4 w-4" />;

    case "important_news":
      return <AlertCircle className="h-4 w-4" />;

    case "new_article":
      return <Newspaper className="h-4 w-4" />;

    default:
      return <Bell className="h-4 w-4" />;
  }
}

function getNotificationHref(notification: Notification) {
  if (notification.link) {
    return notification.link;
  }

  if (notification.article && typeof notification.article !== "string") {
    return `/article/${notification.article.slug}`;
  }

  return "#";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
}

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const href = getNotificationHref(notification);

  const content = (
    <div
      className={`flex gap-3 border-b p-3 transition hover:bg-muted/50 ${
        !notification.isRead ? "bg-primary/5" : ""
      }`}
      onClick={() => {
        if (!notification.isRead) {
          onRead(notification._id);
        }
      }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm ${
              !notification.isRead ? "font-bold" : "font-medium"
            }`}
          >
            {notification.title}
          </h4>

          {!notification.isRead && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>

        <p className="mt-1 text-[11px] text-muted-foreground">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );

  if (href !== "#") {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
