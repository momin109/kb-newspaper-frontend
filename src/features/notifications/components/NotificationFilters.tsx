"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { NotificationType } from "../types/notification.types";

interface NotificationFiltersProps {
  type: NotificationType | undefined;
  isActive: boolean | undefined;

  setType: (type: NotificationType | undefined) => void;
  setIsActive: (value: boolean | undefined) => void;
}

const NOTIFICATION_TYPES: {
  value: NotificationType;
  label: string;
}[] = [
  {
    value: "breaking_news",
    label: "Breaking News",
  },
  {
    value: "important_news",
    label: "Important News",
  },
  {
    value: "new_article",
    label: "New Article",
  },
  {
    value: "system",
    label: "System",
  },
];

export function NotificationFilters({
  type,
  isActive,
  setType,
  setIsActive,
}: NotificationFiltersProps) {
  const handleReset = () => {
    setType(undefined);
    setIsActive(undefined);
  };

  const hasActiveFilters = type !== undefined || isActive !== undefined;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Notification Type */}
        <Select
          value={type ?? "all"}
          onValueChange={(value) => {
            setType(value === "all" ? undefined : (value as NotificationType));
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Notification Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>

            {NOTIFICATION_TYPES.map((notificationType) => (
              <SelectItem
                key={notificationType.value}
                value={notificationType.value}
              >
                {notificationType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active Status */}
        <Select
          value={
            isActive === undefined ? "all" : isActive ? "active" : "inactive"
          }
          onValueChange={(value) => {
            if (value === "all") {
              setIsActive(undefined);
            } else {
              setIsActive(value === "active");
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>

            <SelectItem value="active">Active</SelectItem>

            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
        disabled={!hasActiveFilters}
        className="w-full sm:w-auto"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
