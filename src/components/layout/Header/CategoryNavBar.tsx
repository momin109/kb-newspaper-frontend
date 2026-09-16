"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Menu, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { toggleMobileNav } from "@/store/slices/uiSlice";
import type { Category } from "@/features/categories/types/category.types";

export function CategoryNavBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleEnter = (category: Category) => {
    if (!category.children?.length) {
      setOpenCategory(null);
      return;
    }
    clearCloseTimer();
    const el = itemRefs.current[category._id];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom });
    }
    setOpenCategory(category);
  };

  const handleLeave = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenCategory(null), 120);
  };

  return (
    <nav className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-3 sm:px-4">
        <Link
          href="/"
          className={cn(
            "flex h-12 shrink-0 items-center justify-center px-2 text-muted-foreground transition-colors hover:text-primary",
            pathname === "/" && "text-primary",
          )}
          aria-label="হোম"
        >
          <Home className="h-5 w-5" />
        </Link>

        <div className="flex flex-1 items-center gap-5 overflow-x-auto scrollbar-none sm:gap-6">
          {categories.map((category) => {
            const href = `/category/${category.slug}`;
            const isActive = pathname === href;
            const hasChildren = (category.children?.length ?? 0) > 0;
            const isOpen = openCategory?._id === category._id;

            return (
              <div
                key={category._id}
                ref={(el) => {
                  itemRefs.current[category._id] = el;
                }}
                onMouseEnter={() => handleEnter(category)}
                onMouseLeave={handleLeave}
              >
                <Link
                  href={href}
                  className={cn(
                    "group relative flex h-12 shrink-0 items-center gap-1 whitespace-nowrap text-base font-medium text-foreground/80 transition-colors hover:text-primary",
                    isActive && "text-primary",
                  )}
                >
                  {category.name}
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-200",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </div>
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

      <AnimatePresence>
        {openCategory && (openCategory.children?.length ?? 0) > 0 && (
          <motion.div
            key={openCategory._id}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={handleLeave}
            className="fixed z-50 min-w-[200px] origin-top-left overflow-hidden rounded-lg border border-border bg-background py-2 shadow-lg"
            style={{ left: dropdownPos.left, top: dropdownPos.top + 4 }}
          >
            {openCategory.children!.map((sub) => (
              <Link
                key={sub._id}
                href={`/category/${sub.slug}`}
                className="group/item relative block whitespace-nowrap py-2.5 pl-4 pr-6 text-base text-foreground/80 transition-colors hover:text-primary"
              >
                <span className="absolute inset-y-1 left-0 w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-150 group-hover/item:scale-y-100" />
                {sub.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
