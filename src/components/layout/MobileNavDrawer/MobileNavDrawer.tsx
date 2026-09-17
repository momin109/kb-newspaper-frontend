"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Search,
  LayoutDashboard,
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  PlayCircle,
  Archive,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileNav, openSearchOverlay } from "@/store/slices/uiSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Category } from "@/features/categories/types/category.types";

const ADMIN_ROLES = ["admin", "editor", "journalist"];

/**
 * শুধু মোবাইল/ট্যাবলেটে (md:hidden) দেখা যাবে — ডেস্কটপে হ্যামবার্গার ক্লিক করলে
 * CategoryNavBar-এর মেগা মেনু (উপর থেকে ড্রপডাউন) খোলে, এই সাইড-ড্রয়ার না।
 */
export function MobileNavDrawer({ categories }: { categories: Category[] }) {
  const isOpen = useAppSelector((s) => s.ui.isMobileNavOpen);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const close = () => dispatch(closeMobileNav());
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={close}
          />
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-background shadow-2xl md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Link
                href="/"
                onClick={close}
                className="flex items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground">
                  প্র
                </span>
                <span className="text-lg font-extrabold">
                  প্রভাত<span className="text-primary">বার্তা</span>
                </span>
              </Link>
              <button
                onClick={close}
                aria-label="বন্ধ করুন"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Search */}
              <div className="px-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    dispatch(openSearchOverlay());
                  }}
                  className="flex h-11 w-full items-center gap-2 rounded-full border border-border bg-muted/40 px-4 text-sm text-muted-foreground"
                >
                  <Search className="h-4 w-4" />
                  সংবাদ খুঁজুন...
                </button>
              </div>

              {/* User block */}
              <div className="mx-4 mt-4 rounded-2xl border border-border/60 bg-muted/30 p-3">
                {isAuthenticated && user ? (
                  <Link
                    href="/profile"
                    onClick={close}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.fullName.charAt(0)
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-foreground">
                        {user.fullName}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserIcon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-foreground">
                        অতিথি ব্যবহারকারী
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        লগইন করে সব সুবিধা নিন
                      </span>
                    </span>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={isAdmin ? "/admin" : "/profile"}
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        {isAdmin ? "ড্যাশবোর্ড" : "প্রোফাইল"}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          close();
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        লগ আউট
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        লগইন
                      </Link>
                      <Link
                        href="/register"
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                      >
                        রেজিস্ট্রেশন
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Quick links */}
              <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/e-paper"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  ই-পেপার
                </Link>
                <Link
                  href="/archive"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                >
                  <Archive className="h-3.5 w-3.5" />
                  আর্কাইভ
                </Link>
              </div>

              {/* Categories */}
              <nav className="mt-4 pb-6">
                <Link
                  href="/"
                  onClick={close}
                  className={cn(
                    "mx-2 mb-1 flex items-center rounded-xl border-l-4 px-3 py-2.5 text-sm font-bold",
                    pathname === "/"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-foreground hover:bg-muted",
                  )}
                >
                  সর্বশেষ
                </Link>

                {categories.map((category) => {
                  const href = `/category/${category.slug}`;
                  const hasChildren = (category.children?.length ?? 0) > 0;
                  const isExpanded = expandedId === category._id;
                  const isActive = pathname === href;

                  return (
                    <div key={category._id} className="mx-2">
                      <div className="flex items-center justify-between rounded-xl px-3 hover:bg-muted">
                        <Link
                          href={href}
                          onClick={close}
                          className={cn(
                            "flex-1 py-3 text-sm font-medium",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {category.name}
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : category._id)
                            }
                            aria-label="সাব ক্যাটাগরি"
                            className="p-2 text-muted-foreground"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                isExpanded && "rotate-180",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {hasChildren && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden pl-3"
                          >
                            {category.children!.map((sub) => (
                              <Link
                                key={sub._id}
                                href={`/category/${sub.slug}`}
                                onClick={close}
                                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
