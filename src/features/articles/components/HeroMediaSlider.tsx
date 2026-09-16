"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Play, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Media } from "@/features/media/types/media.types";

// import type { Media } from "../types/media.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80";

interface HeroMediaSliderProps {
  videos: Media[];
  photos: Media[];
}

export function HeroMediaSlider({ videos, photos }: HeroMediaSliderProps) {
  const [activeTab, setActiveTab] = useState<"video" | "photo">("video");

  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderItems = activeTab === "video" ? videos : photos;

  // tab change হলে slider reset

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Auto slide

  useEffect(() => {
    if (sliderItems.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderItems.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderItems.length]);

  if (!sliderItems.length) {
    return null;
  }

  const currentMedia = sliderItems[currentIndex];

  const imageUrl = currentMedia.thumbnail || currentMedia.url || FALLBACK_IMAGE;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
  };

  const previousSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-sm
        border
        border-border
        bg-card
      "
    >
      {/* TAB */}

      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`
            flex-1
            py-3
            text-sm
            font-semibold
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
            ${activeTab === "photo" ? "text-primary" : "text-muted-foreground"}
          `}
        >
          📷 ফটো স্টোরি
        </button>
      </div>

      {/* MAIN SLIDER */}

      <div className="relative h-[330px]">
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
            h-full
            w-full
          "
        >
          <Image
            key={currentMedia._id}
            src={imageUrl}
            alt={currentMedia.title ?? "Media"}
            fill
            sizes="400px"
            className="
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/90
              via-black/40
              to-transparent
            "
          />

          {/* CENTER ICON */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              flex
              h-14
              w-14
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              shadow-xl
            "
          >
            {activeTab === "video" ? (
              <Play className="h-6 w-6 fill-black" />
            ) : (
              <Camera className="h-6 w-6" />
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
                mt-3
                line-clamp-2
                text-lg
                font-bold
              "
            >
              {currentMedia.title ?? "Media Story"}
            </h3>
          </div>
        </Link>

        {/* LEFT BUTTON */}

        {sliderItems.length > 1 && (
          <button
            type="button"
            onClick={previousSlide}
            className="
                absolute
                left-4
                top-1/2
                z-20
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/50
                text-white
                backdrop-blur
                transition
                hover:bg-black/80
              "
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* RIGHT BUTTON */}

        {sliderItems.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            className="
                absolute
                right-4
                top-1/2
                z-20
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/50
                text-white
                backdrop-blur
                transition
                hover:bg-black/80
              "
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
