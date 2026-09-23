"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { viewStory } from "../services/story-public.service";
import type { Story } from "../types/story.types";

const IMAGE_DURATION_MS = 5000;

export function StoryViewerModal({
  stories,
  initialIndex,
  onClose,
}: {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewedRef = useRef<Set<string>>(new Set());

  const story = stories[index];

  const goNext = () => {
    setIndex((i) => {
      if (i >= stories.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
  };

  const goPrev = () => {
    setIndex((i) => Math.max(0, i - 1));
  };

  // ভিউ ট্র্যাকিং — প্রতিটা স্টোরি প্রথমবার দেখানোর সময় একবারই কল হবে
  useEffect(() => {
    if (!story || viewedRef.current.has(story._id)) return;
    viewedRef.current.add(story._id);
    viewStory(story._id).catch(() => {});
  }, [story]);

  // প্রোগ্রেস — ছবির জন্য টাইমার, ভিডিওর জন্য onTimeUpdate থেকে হিসাব হয়
  useEffect(() => {
    setProgress(0);
    if (!story || story.mediaType === "video" || paused) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / IMAGE_DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        goNext();
      }
    }, 50);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, story?._id, story?.mediaType]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-black sm:h-[90vh]">
        {/* Progress bars */}
        <div className="absolute inset-x-2 top-2 z-20 flex gap-1">
          {stories.map((s, i) => (
            <div
              key={s._id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white transition-[width] duration-75 ease-linear"
                style={{
                  width:
                    i < index ? "100%" : i === index ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute inset-x-3 top-6 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs">
              {(story.author?.fullName || story.author?.name || "প্র").charAt(
                0,
              )}
            </span>
            <span className="truncate">
              {story.author?.fullName || story.author?.name || "প্রভাতবার্তা"}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="rounded-full p-1.5 text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Media */}
        <div
          className="relative flex flex-1 items-center justify-center"
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {story.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={story.mediaUrl}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              onEnded={goNext}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={story.mediaUrl}
              alt={story.title ?? "story"}
              className="h-full w-full object-contain"
            />
          )}

          {story.title && (
            <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white drop-shadow">
              {story.title}
            </p>
          )}
        </div>

        {/* Tap zones */}
        <button
          onClick={goPrev}
          aria-label="আগের স্টোরি"
          className="group absolute inset-y-0 left-0 flex w-1/3 items-center justify-start pl-1"
        >
          <ChevronLeft className="h-6 w-6 text-white/0 transition-opacity group-hover:text-white/70" />
        </button>
        <button
          onClick={goNext}
          aria-label="পরের স্টোরি"
          className="group absolute inset-y-0 right-0 flex w-1/3 items-center justify-end pr-1"
        >
          <ChevronRight className="h-6 w-6 text-white/0 transition-opacity group-hover:text-white/70" />
        </button>
      </div>
    </div>
  );
}
