"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "../schemas/newsletterSchema";
import { subscribeNewsletter } from "../services/newsletter.service";

/** Email-only subscribe form shown in the footer. RHF + Zod, feedback via Sonner. */
export function NewsletterForm() {
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  async function onSubmit(values: NewsletterFormValues) {
    setIsPending(true);
    try {
      await subscribeNewsletter(values);
      toast.success("সাবস্ক্রাইব সফল হয়েছে!");
      reset();
    } catch {
      toast.error("সাবস্ক্রাইব করা যায়নি, আবার চেষ্টা করুন।");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="আপনার ইমেইল ঠিকানা"
          className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          {...register("email")}
        />
      </div>
      {errors.email && (
        <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
      )}
      <Button type="submit" disabled={isPending} className="mt-2 w-full">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        সাবস্ক্রাইব করুন
      </Button>
    </form>
  );
}
