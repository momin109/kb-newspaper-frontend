"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileNav, closeMobileNav } from "@/store/slices/uiSlice";
import type { Category } from "@/features/categories/types/category.types";

export function CategoryNavBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isMenuOpen = useAppSelector((s) => s.ui.isMobileNavOpen);

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
    // 👇 এখানে আগে bg-background/95 backdrop-blur ছিল — মেগা মেনু খোলা থাকলে
    // পেছনের কালো ব্যাকড্রপ বেয়ে এসে ধূসর দেখাচ্ছিল। এখন সলিড bg-background।
    <nav className="sticky top-0 z-40 border-t border-border bg-background">
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
          <Link
            href="/"
            className={cn(
              "shrink-0 whitespace-nowrap py-3 text-base font-semibold text-foreground/80 transition-colors hover:text-primary",
              pathname === "/" && "text-primary",
            )}
          >
            সর্বশেষ
          </Link>

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
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Hover dropdown — একটা category-র sub-category */}
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
            className="fixed z-50 hidden min-w-[200px] origin-top-left overflow-hidden rounded-lg border border-border bg-background py-2 shadow-lg md:block"
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

      {/* ডেস্কটপ মেগা মেনু — হ্যামবার্গারে ক্লিক করলে উপর থেকে নেমে আসে */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="mega-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 hidden bg-black/40 md:block"
              onClick={() => dispatch(closeMobileNav())}
            />
            <motion.div
              key="mega-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-40 hidden border-b border-border bg-background shadow-2xl md:block"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-6 gap-y-8 px-6 py-8 lg:grid-cols-5">
                {categories.map((category) => (
                  <div key={category._id}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => dispatch(closeMobileNav())}
                      className="mb-2 block text-sm font-bold text-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                    {(category.children?.length ?? 0) > 0 && (
                      <ul className="space-y-1.5">
                        {category.children!.map((sub) => (
                          <li key={sub._id}>
                            <Link
                              href={`/category/${sub.slug}`}
                              onClick={() => dispatch(closeMobileNav())}
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
