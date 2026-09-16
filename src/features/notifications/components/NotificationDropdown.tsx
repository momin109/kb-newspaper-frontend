"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationDropdownProps {
  onClose?: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useNotifications();

  async function handleRead(id: string) {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }

  return (
    <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-xl border bg-background shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-bold">নোটিফিকেশন</h3>

          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadCount}টি অপঠিত নোটিফিকেশন
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isMarkingAllAsRead}
            onClick={handleMarkAllAsRead}
          >
            {isMarkingAllAsRead && (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            )}
            সব পড়া হয়েছে
          </Button>
        )}
      </div>

      {/* Notifications */}
      <ScrollArea className="h-[420px]">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center px-5 text-center">
            <p className="text-sm font-medium">কোনো নোটিফিকেশন নেই</p>

            <p className="mt-1 text-xs text-muted-foreground">
              নতুন খবর বা গুরুত্বপূর্ণ আপডেট এলে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} onClick={onClose}>
              <NotificationItem
                notification={notification}
                onRead={handleRead}
              />
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
