"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSearchOverlay } from "@/store/slices/uiSlice";

const POPULAR_TAGS = ["রাজনীতি", "খেলা", "আন্তর্জাতিক"];

export function SearchOverlay() {
  const isOpen = useAppSelector((s) => s.ui.isSearchOverlayOpen);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function runSearch(q: string) {
    if (!q.trim()) return;
    dispatch(closeSearchOverlay());
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setQuery("");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => dispatch(closeSearchOverlay())}
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-lg"
          >
            <div className="flex flex-col gap-4 p-4 pt-14">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch(query);
                }}
                className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="সংবাদ খুঁজুন..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button type="submit" aria-label="সার্চ করুন">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">জনপ্রিয়:</span>
                {POPULAR_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="h-7 rounded-full px-3 text-xs"
                    onClick={() => runSearch(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
