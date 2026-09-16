"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAdminNotifications } from "../hooks/useAdminNotifications";
import type { NotificationType } from "../types/notification.types";

interface CreateNotificationFormProps {
  onSuccess?: () => void;
}

export function CreateNotificationForm({
  onSuccess,
}: CreateNotificationFormProps) {
  const { createNotification, isCreating } = useAdminNotifications();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("system");
  const [article, setArticle] = useState("");
  const [link, setLink] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      await createNotification({
        title: title.trim(),
        message: message.trim(),
        type,
        article: article.trim() || null,
        link: link.trim() || null,
        user: null,
      });

      toast.success("Notification created successfully");

      setTitle("");
      setMessage("");
      setType("system");
      setArticle("");
      setLink("");

      onSuccess?.();
    } catch (error) {
      console.error("Create notification error:", error);

      toast.error("Notification তৈরি করা যায়নি");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="notification-title" className="text-sm font-medium">
          Title
        </label>

        <Input
          id="notification-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="যেমন: নতুন ব্রেকিং নিউজ"
          disabled={isCreating}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="notification-message" className="text-sm font-medium">
          Message
        </label>

        <Textarea
          id="notification-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Notification message লিখুন..."
          rows={4}
          disabled={isCreating}
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notification Type</label>

        <Select
          value={type}
          onValueChange={(value) => setType(value as NotificationType)}
          disabled={isCreating}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="breaking_news">Breaking News</SelectItem>

            <SelectItem value="important_news">Important News</SelectItem>

            <SelectItem value="new_article">New Article</SelectItem>

            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Article */}
      <div className="space-y-2">
        <label htmlFor="notification-article" className="text-sm font-medium">
          Article ID
          <span className="ml-2 text-xs text-muted-foreground">Optional</span>
        </label>

        <Input
          id="notification-article"
          value={article}
          onChange={(event) => setArticle(event.target.value)}
          placeholder="MongoDB Article ID"
          disabled={isCreating}
        />

        <p className="text-xs text-muted-foreground">
          কোনো article-এর সাথে notification যুক্ত করতে Article ID দিন।
        </p>
      </div>

      {/* Link */}
      <div className="space-y-2">
        <label htmlFor="notification-link" className="text-sm font-medium">
          Link
          <span className="ml-2 text-xs text-muted-foreground">Optional</span>
        </label>

        <Input
          id="notification-link"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="/article/example-slug"
          disabled={isCreating}
        />

        <p className="text-xs text-muted-foreground">
          Notification click করলে কোথায় যাবে।
        </p>
      </div>

      {/* Recipient info */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm font-medium">Recipient</p>

        <p className="mt-1 text-xs text-muted-foreground">
          এই notification সকল active logged-in user-এর জন্য যাবে।
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Create Notification
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
