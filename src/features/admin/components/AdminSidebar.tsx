"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  MessageSquare,
  Users,
  Mail,
  Settings,
  LogOut,
  X,
  History,
  NewspaperIcon,
  ImageIcon,
  Mic,
  BarChart3,
  Settings2,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: Newspaper,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Mail,
  },
  {
    title: "Activity Logs",
    href: "/admin/activity-logs",
    icon: History,
  },
  {
    title: "Live News",
    href: "/admin/live-news",
    icon: NewspaperIcon,
  },
  {
    title: "Stories",
    href: "/admin/stories",
    icon: ImageIcon,
  },
  {
    title: "Podcasts",
    href: "/admin/podcast",
    icon: Mic,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: BarChart3,
  },
];

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex w-64 flex-col
        border-r bg-background
        transition-transform duration-200
        lg:static lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Newspaper className="h-5 w-5" />
          </div>

          <span className="text-lg">Provat Barta</span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 hover:bg-muted lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Management
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <div className="my-4 border-t" />

        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          System
        </p>

        <Link
          href="/admin/settings"
          onClick={onClose}
          className={`
            flex items-center gap-3 rounded-lg px-3 py-2.5
            text-sm font-medium
            ${
              pathname.startsWith("/admin/settings")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }
          `}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
