"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark as BookmarkIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteBookmark,
  getMyBookmarks,
} from "@/features/bookmarks/services/bookmark.service";
import { formatBanglaRelativeTime } from "@/lib/relativeTime";

export default function BookmarksPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: () => getMyBookmarks(1, 50),
  });

  const removeMutation = useMutation({
    mutationFn: (articleId: string) => deleteBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      toast.success("সংরক্ষণ থেকে সরানো হয়েছে");
    },
    onError: () => toast.error("সরানো যায়নি"),
  });

  const bookmarks = data?.data ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookmarkIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            সংরক্ষিত আর্টিকেল
          </h1>
          <p className="text-sm text-muted-foreground">
            পরে পড়ার জন্য আপনার সংরক্ষণ করা সব খবর
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <p className="text-center text-muted-foreground">
          সংরক্ষিত আর্টিকেল লোড করা যায়নি
        </p>
      )}

      {!isLoading && !isError && bookmarks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">
            এখনো কোনো আর্টিকেল সংরক্ষণ করেননি
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            খবর দেখতে হোমপেজে যান
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark._id}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-3"
          >
            {bookmark.article.thumbnail?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bookmark.article.thumbnail.url}
                alt={bookmark.article.title}
                className="h-16 w-24 shrink-0 rounded-lg object-cover"
              />
            )}

            <div className="min-w-0 flex-1">
              <Link
                href={`/article/${bookmark.article.slug}`}
                className="line-clamp-2 text-sm font-bold text-foreground hover:text-primary sm:text-base"
              >
                {bookmark.article.title}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatBanglaRelativeTime(bookmark.createdAt)} সংরক্ষণ করা
                হয়েছে
              </p>
            </div>

            <button
              onClick={() => removeMutation.mutate(bookmark.article._id)}
              disabled={removeMutation.isPending}
              aria-label="সরান"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
