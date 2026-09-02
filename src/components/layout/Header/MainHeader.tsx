"use client";

import Link from "next/link";
import { Search, Bell, LogIn, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSearchOverlay } from "@/store/slices/uiSlice";

/** Client Component — dispatches Redux UI actions (search overlay) and reads auth state. */
export function MainHeader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-3 py-3 sm:px-4">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-lg font-extrabold text-primary-foreground">
          প্র
        </span>
        <span>
          <span className="block text-xl font-extrabold leading-none tracking-tight">
            প্রভাত<span className="text-primary">বার্তা</span>
          </span>
          <span className="block text-[11px] leading-tight text-muted-foreground">
            দৈনিক সংবাদপত্র
          </span>
        </span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="সার্চ করুন"
          onClick={() => dispatch(openSearchOverlay())}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="নোটিফিকেশন"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {isAuthenticated ? (
          <Link
            href="/profile"
            className="ml-1 flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium hover:bg-accent"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.fullName}</span>
          </Link>
        ) : (
          <Link href="/login">
            <Button size="sm" className="ml-1 gap-1.5">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">লগইন</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
