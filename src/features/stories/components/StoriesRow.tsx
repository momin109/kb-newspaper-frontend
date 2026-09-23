"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import { getPublicStories } from "../services/story-public.service";
import type { Story } from "../types/story.types";
import { StoryViewerModal } from "./StoryViewerModal";

export function StoriesRow() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-stories"],
    queryFn: getPublicStories,
  });

  const stories: Story[] = data?.stories ?? [];

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex shrink-0 flex-col items-center gap-1.5">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted sm:h-20 sm:w-20" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || stories.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {stories.map((story, index) => (
          <button
            key={story._id}
            onClick={() => setActiveIndex(index)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <span className="rounded-full bg-gradient-to-br from-primary via-orange-400 to-yellow-400 p-[2.5px]">
              <span className="block rounded-full bg-background p-[2px]">
                <span className="block h-16 w-16 overflow-hidden rounded-full bg-muted sm:h-20 sm:w-20">
                  {story.thumbnail || story.mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.thumbnail || story.mediaUrl}
                      alt={story.title ?? "story"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </span>
                  )}
                </span>
              </span>
            </span>
            <span className="max-w-[72px] truncate text-xs font-medium text-foreground">
              {story.title ||
                story.author?.fullName ||
                story.author?.name ||
                "স্টোরি"}
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}
