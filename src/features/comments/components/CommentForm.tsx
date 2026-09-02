"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import {
  commentSchema,
  type CommentFormValues,
} from "../schemas/commentSchema";
import { postComment } from "../services/comments.service";
import type { Comment } from "../types/comment.types";

/**
 * The real backend requires auth to post a comment (verifyToken on
 * POST /comment/create — no guest path). If the reader isn't logged
 * in, this shows a login prompt instead of a form.
 */
export function CommentForm({
  articleId,
  onPosted,
}: {
  articleId: string;
  onPosted?: (comment: Comment) => void;
}) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({ resolver: zodResolver(commentSchema) });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-3">
        <p className="text-sm text-muted-foreground">মন্তব্য করতে লগইন করুন।</p>
        <Button asChild size="sm" variant="outline">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            লগইন
          </Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(values: CommentFormValues) {
    setIsPending(true);
    try {
      const created = await postComment({
        article: articleId,
        text: values.text,
      });
      toast.success("মন্তব্যটি জমা হয়েছে, অনুমোদনের পর প্রকাশিত হবে।");
      reset();
      onPosted?.(created);
    } catch {
      toast.error("মন্তব্য জমা দেওয়া যায়নি, আবার চেষ্টা করুন।");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-2"
    >
      <textarea
        rows={3}
        placeholder="আপনার মন্তব্য লিখুন..."
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        {...register("text")}
      />
      {errors.text && (
        <p className="text-xs text-destructive">{errors.text.message}</p>
      )}
      <Button
        type="submit"
        disabled={isPending}
        size="sm"
        className="w-fit self-end"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        মন্তব্য করুন
      </Button>
    </form>
  );
}
