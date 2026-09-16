"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Play, Camera } from "lucide-react";

import type { Media } from "../types/media.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80";

interface HeroMediaSliderProps {
  videos: Media[];
  photos: Media[];
}

export function HeroMediaSlider({ videos, photos }: HeroMediaSliderProps) {
  const [activeTab, setActiveTab] = useState<"video" | "photo">("video");

  const items = activeTab === "video" ? videos : photos;

  const currentMedia = items[0];

  if (!currentMedia) {
    return null;
  }

  const imageUrl = currentMedia.thumbnail || currentMedia.url || FALLBACK_IMAGE;

  return (
    <div
      className="
      overflow-hidden
      rounded-sm
      border
      border-border
      bg-card
    "
    >
      {/* TAB HEADER */}

      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`
            flex-1
            py-3
            text-sm
            font-semibold
            transition
            ${activeTab === "video" ? "text-primary" : "text-muted-foreground"}
          `}
        >
          ▶ ভিডিও স্টোরি
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("photo")}
          className={`
            flex-1
            py-3
            text-sm
            font-semibold
            transition
            ${activeTab === "photo" ? "text-primary" : "text-muted-foreground"}
          `}
        >
          📷 ফটো স্টোরি
        </button>
      </div>

      {/* MAIN MEDIA CARD */}

      <Link
        href={
          activeTab === "video"
            ? `/video/${currentMedia._id}`
            : `/photo/${currentMedia._id}`
        }
        className="
          group
          relative
          block
          h-[280px]
          overflow-hidden
        "
      >
        <Image
          src={imageUrl}
          alt={currentMedia.title ?? "Media"}
          fill
          sizes="(min-width:1024px) 25vw,100vw"
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />

        <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/30
          to-transparent
        "
        />

        {/* PLAY / PHOTO ICON */}

        <div
          className="
          absolute
          left-1/2
          top-1/2
          flex
          h-12
          w-12
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          text-black
          shadow-lg
        "
        >
          {activeTab === "video" ? (
            <Play className="h-5 w-5 fill-black" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </div>

        {/* TITLE */}

        <div
          className="
          absolute
          bottom-0
          left-0
          right-0
          p-4
          text-white
        "
        >
          <span
            className="
            inline-flex
            rounded-sm
            bg-primary
            px-2
            py-1
            text-xs
            font-semibold
          "
          >
            {activeTab === "video" ? "ভিডিও" : "ফটো স্টোরি"}
          </span>

          <h3
            className="
            mt-2
            line-clamp-2
            text-base
            font-bold
          "
          >
            {currentMedia.title ?? "মিডিয়া স্টোরি"}
          </h3>
        </div>
      </Link>

      {/* SMALL SLIDER LIST */}

      {items.length > 1 && (
        <div
          className="
            flex
            gap-2
            overflow-x-auto
            p-3
          "
        >
          {items.slice(1).map((item) => (
            <Link
              key={item._id}
              href={
                activeTab === "video"
                  ? `/video/${item._id}`
                  : `/photo/${item._id}`
              }
              className="
                    relative
                    h-16
                    w-24
                    shrink-0
                    overflow-hidden
                    rounded-sm
                  "
            >
              <Image
                src={item.thumbnail || item.url || FALLBACK_IMAGE}
                alt={item.title ?? "media"}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
