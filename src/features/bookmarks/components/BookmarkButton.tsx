"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { checkBookmark, toggleBookmark } from "../services/bookmark.service";

/** লগইন করা না থাকলে ক্লিকে /login-এ পাঠিয়ে দেয়। */
export function BookmarkButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const queryClient = useQueryClient();

  const { data: bookmarked = false } = useQuery({
    queryKey: ["bookmark-status", articleId],
    queryFn: () => checkBookmark(articleId),
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(articleId),
    onSuccess: (res) => {
      queryClient.setQueryData(["bookmark-status", articleId], res.bookmarked);
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      toast.success(
        res.bookmarked ? "সংরক্ষণ করা হয়েছে" : "সংরক্ষণ থেকে সরানো হয়েছে",
      );
    },
    onError: () => {
      toast.error("কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন");
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-label={bookmarked ? "সংরক্ষণ থেকে সরান" : "সংরক্ষণ করুন"}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
        bookmarked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      <BookmarkIcon className={cn("h-4 w-4", bookmarked && "fill-current")} />
      {bookmarked ? "সংরক্ষিত" : "সংরক্ষণ করুন"}
    </button>
  );
}
