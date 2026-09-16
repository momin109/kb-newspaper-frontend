"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useAdminNotifications } from "../hooks/useAdminNotifications";
import { CreateNotificationForm } from "./CreateNotificationForm";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationTable } from "./NotificationTable";
import { DeleteNotificationDialog } from "./DeleteNotificationDialog";

export function NotificationAdminPage() {
  const [showCreate, setShowCreate] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string | undefined>(undefined);

  const {
    notifications,
    pagination,
    isLoading,
    isDeleting,

    page,
    setPage,

    type,
    setType,

    isActive,
    setIsActive,

    handleDelete,
  } = useAdminNotifications({
    initialPage: 1,
    limit: 20,
  });

  const selectedNotification = notifications.find(
    (notification) => notification._id === deleteId,
  );

  function openDeleteDialog(id: string) {
    const notification = notifications.find((item) => item._id === id);

    setDeleteId(id);
    setDeleteTitle(notification?.title);
  }

  function closeDeleteDialog() {
    if (isDeleting) {
      return;
    }

    setDeleteId(null);
    setDeleteTitle(undefined);
  }

  async function confirmDelete() {
    if (!deleteId) {
      return;
    }

    const success = await handleDelete(deleteId);

    if (success) {
      toast.success("Notification deleted successfully");

      setDeleteId(null);
      setDeleteTitle(undefined);
    } else {
      toast.error("Notification delete করা যায়নি");
    }
  }

  function handleCreateSuccess() {
    setShowCreate(false);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}{" "}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <div>
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Notification Management</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            মোট {pagination.total}টি notification
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowCreate((previous) => !previous)}
        >
          <Plus className="mr-2 h-4 w-4" />

          {showCreate ? "Close Form" : "Create Notification"}
        </Button>
      </div>
      {/* Create Notification */}
      {showCreate && (
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Create Notification</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              সকল logged-in user-এর জন্য notification তৈরি করুন।
            </p>
          </div>

          <CreateNotificationForm onSuccess={handleCreateSuccess} />
        </div>
      )}
      {/* Filters */}
      <NotificationFilters
        type={type}
        isActive={isActive}
        setType={setType}
        setIsActive={setIsActive}
      />
      {/* Notification Table */}
      <NotificationTable
        notifications={notifications}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onDelete={openDeleteDialog}
      />
      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span className="min-w-10 text-center text-sm font-medium">
              {page}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Delete Confirmation */}
      <DeleteNotificationDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        notificationTitle={selectedNotification?.title ?? deleteTitle}
      />
    </div>
  );
}
