"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  ZoomIn,
  Grid3X3,
  List,
  CalendarDays,
  FileText,
  ArrowUpRight,
  BookOpen,
  Clock,
  Sparkles,
  TrendingUp,
  Newspaper,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock Data with safe image URLs
const mockEPapers = [
  {
    id: 1,
    date: "০৯ সেপ্টেম্বর, ২০২৬",
    dateEn: "September 09, 2026",
    edition: "প্রথম সংস্করণ",
    pages: 16,
    thumbnail: "/images/epaper-1.jpg",
    headline: "বাজেটে শিক্ষা খাতে বরাদ্দ বাড়ল",
    subHeadline: "শিক্ষার মানোন্নয়নে বিশেষ প্রকল্প গ্রহণ",
    categories: ["সামনের পাতা", "জাতীয়", "অর্থনীতি"],
    isLatest: true,
    views: 12450,
    downloads: 3450,
  },
  {
    id: 2,
    date: "০৮ সেপ্টেম্বর, ২০২৬",
    dateEn: "September 08, 2026",
    edition: "দ্বিতীয় সংস্করণ",
    pages: 14,
    thumbnail: "/images/epaper-2.jpg",
    headline: "নতুন শিল্পনীতির খসড়া অনুমোদন",
    subHeadline: "শিল্প খাতে বিনিয়োগ বাড়ানোর উদ্যোগ",
    categories: ["শিল্প", "অর্থনীতি"],
    isLatest: false,
    views: 8750,
    downloads: 2100,
  },
  {
    id: 3,
    date: "০৭ সেপ্টেম্বর, ২০২৬",
    dateEn: "September 07, 2026",
    edition: "প্রথম সংস্করণ",
    pages: 18,
    thumbnail: "/images/epaper-3.jpg",
    headline: "আবহাওয়া পূর্বাভাসে বড় পরিবর্তন",
    subHeadline: "ঘূর্ণিঝড়ের সম্ভাবনা, সতর্কতা জারি",
    categories: ["আবহাওয়া", "পরিবেশ"],
    isLatest: false,
    views: 6300,
    downloads: 1800,
  },
  {
    id: 4,
    date: "০৬ সেপ্টেম্বর, ২০২৬",
    dateEn: "September 06, 2026",
    edition: "প্রথম সংস্করণ",
    pages: 12,
    thumbnail: "/images/epaper-4.jpg",
    headline: "ক্রিকেট বিশ্বকাপে বাংলাদেশের সম্ভাবনা",
    subHeadline: "শক্তিশালী দল নিয়ে বিশ্বকাপে যাচ্ছে বাংলাদেশ",
    categories: ["খেলাধুলা"],
    isLatest: false,
    views: 15200,
    downloads: 4200,
  },
  {
    id: 5,
    date: "০৫ সেপ্টেম্বর, ২০২৬",
    dateEn: "September 05, 2026",
    edition: "প্রথম সংস্করণ",
    pages: 16,
    thumbnail: "/images/epaper-5.jpg",
    headline: "রপ্তানি আয়ে নতুন রেকর্ড",
    subHeadline: "গত মাসে রপ্তানি আয় ৫ বিলিয়ন ডলার",
    categories: ["অর্থনীতি", "আন্তর্জাতিক"],
    isLatest: false,
    views: 9400,
    downloads: 2800,
  },
  {
    id: 6,
    date: "০৪ সেপ্টেম্বর, ২০২৬",
    dateEn: "September 04, 2026",
    edition: "দ্বিতীয় সংস্করণ",
    pages: 14,
    thumbnail: "/images/epaper-6.jpg",
    headline: "ডিজিটাল বাংলাদেশের নতুন অধ্যায়",
    subHeadline: "স্মার্ট বাংলাদেশ বিনির্মাণে সরকারের উদ্যোগ",
    categories: ["প্রযুক্তি", "জাতীয়"],
    isLatest: false,
    views: 7800,
    downloads: 2200,
  },
];

const mockCategories = [
  "সব",
  "সামনের পাতা",
  "জাতীয়",
  "অর্থনীতি",
  "আন্তর্জাতিক",
  "খেলাধুলা",
  "প্রযুক্তি",
  "বিনোদন",
];

// Image Component with error handling
function SafeImage({ src, alt, className, fill, sizes, priority }: any) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <Newspaper className="h-16 w-16 text-primary/30" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      unoptimized
    />
  );
}

export default function EPaperPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredPapers =
    selectedCategory === "সব"
      ? mockEPapers
      : mockEPapers.filter((paper) =>
          paper.categories.includes(selectedCategory),
        );

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const currentItems = filteredPapers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-1/4 h-1/2 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm text-primary border border-primary/20 shadow-lg shadow-primary/5">
              <Sparkles className="h-4 w-4" />
              <span>ডিজিটাল সংস্করণ</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span className="text-xs">ই-পেপার</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary/70 bg-clip-text text-transparent">
              ই-পেপার
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-muted-foreground text-lg leading-relaxed">
              প্রতিদিনের সংবাদপত্রের ডিজিটাল সংস্করণ। যেকোনো সময়,
              <span className="text-primary font-medium">
                {" "}
                যেকোনো জায়গায়
              </span>{" "}
              পড়ুন।
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <Calendar className="h-4 w-4 text-primary" />
                <span>আজ প্রকাশিত: {mockEPapers[0].date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <Newspaper className="h-4 w-4 text-primary" />
                <span>{mockEPapers.length} টি সংস্করণ</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>মোট দর্শক: ৫৯,৮০০+</span>
              </div>
            </div>

            {/* Device Mockup */}
            <div className="flex items-center gap-4 mt-2 text-muted-foreground/60">
              <Monitor className="h-5 w-5" />
              <span className="text-xs">ডেস্কটপ</span>
              <span className="w-px h-4 bg-border" />
              <Tablet className="h-5 w-5" />
              <span className="text-xs">ট্যাবলেট</span>
              <span className="w-px h-4 bg-border" />
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">মোবাইল</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Featured Edition - Today's Paper */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="inline-block h-8 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/60" />
              <h2 className="text-2xl font-bold">আজকের সংস্করণ</h2>
              <Badge className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/30 animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                সর্বশেষ
              </Badge>
            </div>
          </div>

          <Card className="group overflow-hidden border-0 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 rounded-2xl">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-2/5 h-80 md:h-auto overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <SafeImage
                    src={mockEPapers[0].thumbnail}
                    alt={mockEPapers[0].headline}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className="bg-white/90 backdrop-blur-md text-foreground shadow-lg border-0">
                      <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                      ফিচার্ড
                    </Badge>
                    <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground shadow-lg border-0">
                      {mockEPapers[0].pages} পৃষ্ঠা
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Eye className="h-3.5 w-3.5" />
                      {mockEPapers[0].views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Download className="h-3.5 w-3.5" />
                      {mockEPapers[0].downloads.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {mockEPapers[0].categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold leading-tight">
                        {mockEPapers[0].headline}
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        {mockEPapers[0].subHeadline}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {mockEPapers[0].edition}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{mockEPapers[0].date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/60">
                    <Button
                      size="lg"
                      className="gap-2 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      সম্পূর্ণ পড়ুন
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 rounded-full"
                    >
                      <Download className="h-4 w-4" />
                      ডাউনলোড
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="gap-2 rounded-full"
                    >
                      <ZoomIn className="h-4 w-4" />
                      প্রিভিউ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-1">
              বিভাগ:
            </span>
            {mockCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-secondary/20 p-1 rounded-full border border-border/50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`rounded-full transition-all ${
                viewMode === "grid" ? "shadow-lg shadow-primary/20" : ""
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">গ্রিড</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`rounded-full transition-all ${
                viewMode === "list" ? "shadow-lg shadow-primary/20" : ""
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">তালিকা</span>
            </Button>
          </div>
        </div>

        {/* E-Paper Grid/List View */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {currentItems.map((paper, index) =>
            viewMode === "grid" ? (
              <EPaperCard key={paper.id} paper={paper} index={index} />
            ) : (
              <EPaperListItem key={paper.id} paper={paper} />
            ),
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`rounded-full w-10 h-10 ${
                  currentPage === page
                    ? "shadow-lg shadow-primary/30 scale-105"
                    : ""
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Archive Section */}
        <div className="mt-20 pt-10 border-t border-border/60">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="inline-block h-8 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/60" />
              <h2 className="text-2xl font-bold">আর্কাইভ</h2>
              <Badge variant="secondary" className="font-normal">
                <Layers className="h-3 w-3 mr-1" />
                {mockEPapers.length - 1} টি সংস্করণ
              </Badge>
            </div>
            <Link
              href="/archive"
              className="text-sm text-primary hover:underline flex items-center gap-1.5 font-medium group"
            >
              সব দেখুন
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {mockEPapers.slice(1).map((paper) => (
              <ArchiveCard key={paper.id} paper={paper} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Grid Card Component
function EPaperCard({ paper, index }: { paper: any; index: number }) {
  const delay = `${(index % 3) * 100}ms`;

  return (
    <Card
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg hover:shadow-primary/20 rounded-2xl"
      style={{ animationDelay: delay }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <SafeImage
            src={paper.thumbnail}
            alt={paper.date}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {paper.isLatest && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-400 text-white border-0 shadow-lg shadow-amber-500/30 text-xs">
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                নতুন
              </Badge>
            )}
            <Badge className="bg-white/90 backdrop-blur-md text-foreground border-0 shadow-lg text-xs">
              {paper.edition}
            </Badge>
          </div>

          {/* Content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h4 className="font-bold text-white text-base leading-tight line-clamp-2 mb-1.5">
              {paper.headline}
            </h4>
            <p className="text-white/70 text-xs line-clamp-1 mb-2">
              {paper.subHeadline}
            </p>
            <div className="flex items-center justify-between text-white/60">
              <div className="flex items-center gap-2 text-[10px]">
                <Calendar className="h-3 w-3" />
                {paper.date}
                <span className="w-0.5 h-0.5 rounded-full bg-white/30" />
                {paper.pages} পাতা
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Eye className="h-3 w-3" />
                {paper.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Hover overlay actions */}
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
            <Button
              size="sm"
              className="rounded-full shadow-lg bg-white text-foreground hover:bg-white/90"
            >
              <Eye className="h-4 w-4 mr-1" />
              পড়ুন
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full shadow-lg"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full shadow-lg"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced List Item Component
function EPaperListItem({ paper }: { paper: any }) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-md hover:shadow-primary/20 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            <SafeImage
              src={paper.thumbnail}
              alt={paper.date}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 192px"
            />
            {paper.isLatest && (
              <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0 shadow-lg shadow-amber-500/30 text-[10px]">
                নতুন
              </Badge>
            )}
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {paper.categories.map((cat: string) => (
                <span
                  key={cat}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
              {paper.headline}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {paper.subHeadline}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {paper.edition}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{paper.date}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{paper.pages} পৃষ্ঠা</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {paper.views.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                size="sm"
                className="rounded-full gap-1.5 shadow-lg shadow-primary/20"
              >
                <Eye className="h-3.5 w-3.5" />
                পড়ুন
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                ডাউনলোড
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full gap-1.5"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                প্রিভিউ
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Archive Card Component
function ArchiveCard({ paper }: { paper: any }) {
  return (
    <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-md hover:shadow-primary/20 rounded-2xl">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <SafeImage
            src={paper.thumbnail}
            alt={paper.date}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-sm font-semibold">{paper.date}</p>
            <p className="text-xs opacity-80">{paper.edition}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-xs gap-1 rounded-full"
              >
                <Eye className="h-3 w-3" />
                পড়ুন
              </Button>
            </div>
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Badge className="bg-black/50 backdrop-blur-sm text-white border-0 text-[9px] px-1.5 py-0.5">
              {paper.pages} পৃষ্ঠা
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
