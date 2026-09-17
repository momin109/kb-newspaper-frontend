"use client";

import Link from "next/link";
import {
  Search,
  LogIn,
  User,
  Newspaper,
  BookOpen,
  Archive,
  Share2,
  Languages,
  LayoutGrid,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSearchOverlay } from "@/store/slices/uiSlice";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

/** এই ব্লকটা sticky না — স্ক্রল করলে স্বাভাবিকভাবেই স্ক্রল হয়ে চলে যাবে, শুধু CategoryNavBar sticky থাকবে। */
export function MainHeader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  const navItems = [
    { name: "আজকের পত্রিকা", icon: Newspaper, href: "/today" },
    { name: "ই-পেপার", icon: LayoutGrid, href: "/e-paper" },
    { name: "ম্যাগাজিন", icon: BookOpen, href: "/magazine" },
    { name: "আর্কাইভ", icon: Archive, href: "/archive" },
    { name: "সোশ্যাল মিডিয়া", icon: Share2, href: "/social" },
    { name: "বাংলা কনভার্টার", icon: Languages, href: "/converter" },
  ];

  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        {/* Top Row: Logo + Search/User */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-lg font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
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

          {/* Center Navigation */}
          <nav className="flex items-center justify-center gap-1 overflow-x-auto border-t border-border/40 py-2 scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:scale-105 hover:bg-primary/10 hover:text-primary"
              >
                <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="সার্চ করুন"
              onClick={() => dispatch(openSearchOverlay())}
              className="h-9 w-9 rounded-full hover:bg-primary/10"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notification */}
            <div className="relative">
              <NotificationBell />
              <span className="pointer-events-none absolute right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="ml-1 flex items-center gap-2 rounded-full border border-border/60 bg-accent/50 px-3 py-1.5 text-sm font-medium transition-all hover:border-primary/30 hover:bg-accent"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>

                <span className="hidden sm:inline">{user?.fullName}</span>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="h-9 gap-1.5 rounded-full px-4 shadow-lg shadow-primary/20"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">লগইন</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
