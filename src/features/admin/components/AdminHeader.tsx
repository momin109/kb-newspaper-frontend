"use client";

import { Menu, Search, Bell } from "lucide-react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-lg border px-3 sm:flex">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2 hover:bg-muted"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="ml-2 flex items-center gap-3 border-l pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.fullName || "Admin"}</p>

            <p className="text-xs capitalize text-muted-foreground">
              {user?.role || "admin"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user?.fullName?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
