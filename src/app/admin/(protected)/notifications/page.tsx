import { NotificationAdminPage } from "@/features/notifications/components/NotificationAdminPage";
import { Bell } from "lucide-react";

// import { NotificationAdminPage } from "@/features/notifications/components/NotificationAdminPage";

export const metadata = {
  title: "Notifications | Admin",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bell className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>

          <p className="text-sm text-muted-foreground">
            Create and manage user notifications
          </p>
        </div>
      </div>

      <NotificationAdminPage />
    </div>
  );
}
