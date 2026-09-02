"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { toggleMobileNav } from "@/store/slices/uiSlice";
import type { Category } from "@/features/categories/types/category.types";

/** Client Component (needs usePathname for the active-tab underline + dispatches the mobile drawer). */
export function CategoryNavBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  return (
    <nav className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-3 sm:px-4">
        <Link
          href="/"
          className={cn(
            "flex h-11 shrink-0 items-center justify-center px-2 text-muted-foreground hover:text-primary",
            pathname === "/" && "text-primary",
          )}
          aria-label="হোম"
        >
          <Home className="h-5 w-5" />
        </Link>

        <div className="flex flex-1 items-center gap-4 overflow-x-auto scrollbar-none sm:gap-5">
          {categories.map((category) => {
            const href = `/category/${category.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={category._id}
                href={href}
                className={cn(
                  "relative flex h-11 shrink-0 items-center whitespace-nowrap text-sm font-medium text-foreground/80 hover:text-primary",
                  isActive &&
                    "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']",
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0"
          aria-label="সব ক্যাটাগরি দেখুন"
          onClick={() => dispatch(toggleMobileNav())}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
