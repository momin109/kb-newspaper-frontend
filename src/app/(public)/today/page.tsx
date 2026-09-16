"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  Newspaper,
  Clock,
  Sparkles,
  ArrowRight,
  Share2,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  User,
  Tag,
  Layers,
  Award,
  Flame,
  Star,
  AlertCircle,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data
const mockNews = [
  {
    id: 1,
    title: "বাজেটে শিক্ষা খাতে বরাদ্দ বাড়ল",
    subtitle:
      "শিক্ষার মানোন্নয়নে বিশেষ প্রকল্প গ্রহণ, গবেষণায় জোর দেওয়া হবে",
    category: "জাতীয়",
    subCategory: "শিক্ষা",
    image: "/images/news-1.jpg",
    date: "০৯ সেপ্টেম্বর, ২০২৬",
    time: "১০:৩০ AM",
    author: "মোহাম্মদ রহমান",
    authorImage: "/images/author-1.jpg",
    views: 12450,
    likes: 2340,
    comments: 456,
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    excerpt:
      "২০২৬-২৭ অর্থবছরের বাজেটে শিক্ষা খাতে বরাদ্দ উল্লেখযোগ্য হারে বৃদ্ধি পেয়েছে। প্রাথমিক থেকে উচ্চশিক্ষা পর্যন্ত সকল স্তরে মানোন্নয়নে বিভিন্ন প্রকল্প গ্রহণ করা হয়েছে।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 2,
    title: "নতুন শিল্পনীতির খসড়া অনুমোদন",
    subtitle: "শিল্প খাতে বিনিয়োগ বাড়ানোর উদ্যোগ, কর্মসংস্থান সৃষ্টিতে জোর",
    category: "অর্থনীতি",
    subCategory: "শিল্প",
    image: "/images/news-2.jpg",
    date: "০৮ সেপ্টেম্বর, ২০২৬",
    time: "০২:১৫ PM",
    author: "সাবিনা ইয়াসমিন",
    authorImage: "/images/author-2.jpg",
    views: 8750,
    likes: 1200,
    comments: 234,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    excerpt:
      "জাতীয় শিল্পনীতি ২০২৬-এর খসড়া অনুমোদন দিয়েছে মন্ত্রিসভা। নতুন নীতিতে দেশীয় শিল্পের বিকাশ ও কর্মসংস্থান সৃষ্টিতে বিশেষ গুরুত্ব দেওয়া হয়েছে।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 3,
    title: "আবহাওয়া পূর্বাভাসে বড় পরিবর্তন",
    subtitle: "ঘূর্ণিঝড়ের সম্ভাবনা, সতর্কতা জারি করেছে আবহাওয়া অধিদপ্তর",
    category: "পরিবেশ",
    subCategory: "আবহাওয়া",
    image: "/images/news-3.jpg",
    date: "০৭ সেপ্টেম্বর, ২০২৬",
    time: "০৯:৪৫ AM",
    author: "কামাল হোসেন",
    authorImage: "/images/author-3.jpg",
    views: 6300,
    likes: 890,
    comments: 167,
    isBreaking: true,
    isFeatured: false,
    isTrending: false,
    excerpt:
      "আবহাওয়া অধিদপ্তর জানিয়েছে, আগামী ৭২ ঘণ্টার মধ্যে উপকূলীয় এলাকায় ঘূর্ণিঝড় আঘাত হানতে পারে। মাছ ধরার নৌকাগুলোকে নিরাপদ আশ্রয়ে ফিরে যাওয়ার নির্দেশ দেওয়া হয়েছে।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 4,
    title: "ক্রিকেট বিশ্বকাপে বাংলাদেশের সম্ভাবনা",
    subtitle:
      "শক্তিশালী দল নিয়ে বিশ্বকাপে যাচ্ছে বাংলাদেশ, আশাবাদী ক্রিকেট বোর্ড",
    category: "খেলাধুলা",
    subCategory: "ক্রিকেট",
    image: "/images/news-4.jpg",
    date: "০৬ সেপ্টেম্বর, ২০২৬",
    time: "০৬:২০ PM",
    author: "তানজিনা আক্তার",
    authorImage: "/images/author-4.jpg",
    views: 15200,
    likes: 3400,
    comments: 890,
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    excerpt:
      "আসন্ন ক্রিকেট বিশ্বকাপে বাংলাদেশ দলের সম্ভাবনা নিয়ে আশাবাদী ক্রিকেট বোর্ড। দলে রয়েছে অভিজ্ঞ ও তরুণদের সমন্বয়ে শক্তিশালী স্কোয়াড।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 5,
    title: "রপ্তানি আয়ে নতুন রেকর্ড",
    subtitle: "গত মাসে রপ্তানি আয় ৫ বিলিয়ন ডলার, অর্থনীতিতে ইতিবাচক সংকেত",
    category: "অর্থনীতি",
    subCategory: "রপ্তানি",
    image: "/images/news-5.jpg",
    date: "০৫ সেপ্টেম্বর, ২০২৬",
    time: "১১:১০ AM",
    author: "মোঃ আলী",
    authorImage: "/images/author-5.jpg",
    views: 9400,
    likes: 1560,
    comments: 345,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    excerpt:
      "গত আগস্ট মাসে দেশের রপ্তানি আয় ৫ বিলিয়ন ডলার অতিক্রম করেছে, যা দেশের অর্থনীতির জন্য ইতিবাচক সংকেত। পোশাক, চামড়া ও ওষুধ খাত ভালো করেছে।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 6,
    title: "ডিজিটাল বাংলাদেশের নতুন অধ্যায়",
    subtitle:
      "স্মার্ট বাংলাদেশ বিনির্মাণে সরকারের উদ্যোগ, ডিজিটাল সেবায় বৈপ্লবিক পরিবর্তন",
    category: "প্রযুক্তি",
    subCategory: "ডিজিটাল",
    image: "/images/news-6.jpg",
    date: "০৪ সেপ্টেম্বর, ২০২৬",
    time: "০৩:৫০ PM",
    author: "নাসরিন সুলতানা",
    authorImage: "/images/author-6.jpg",
    views: 7800,
    likes: 1100,
    comments: 289,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    excerpt:
      "ডিজিটাল বাংলাদেশের দ্বিতীয় পর্যায়ে স্মার্ট বাংলাদেশ বিনির্মাণে সরকার নানা উদ্যোগ গ্রহণ করেছে। ডিজিটাল সেবা সহজলভ্য করার জন্য কাজ চলছে।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 7,
    title: "শিক্ষার্থীদের জন্য নতুন বৃত্তি প্রকল্প",
    subtitle: "মেধাবী ও অসহায় শিক্ষার্থীদের জন্য বিশেষ বৃত্তি প্রকল্প ঘোষণা",
    category: "শিক্ষা",
    subCategory: "বৃত্তি",
    image: "/images/news-7.jpg",
    date: "০৩ সেপ্টেম্বর, ২০২৬",
    time: "০৮:৩০ AM",
    author: "ড. মোঃ নুরুল ইসলাম",
    authorImage: "/images/author-7.jpg",
    views: 5200,
    likes: 780,
    comments: 134,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    excerpt:
      "শিক্ষা মন্ত্রণালয় মেধাবী ও আর্থিকভাবে অসহায় শিক্ষার্থীদের জন্য বিশেষ বৃত্তি প্রকল্প ঘোষণা করেছে।",
    content: "বিস্তারিত সংবাদ...",
  },
  {
    id: 8,
    title: "কৃষি খাতে নতুন প্রযুক্তির ব্যবহার",
    subtitle: "ড্রোন ও এআই প্রযুক্তি ব্যবহার করে কৃষি উৎপাদন বাড়ানোর উদ্যোগ",
    category: "কৃষি",
    subCategory: "প্রযুক্তি",
    image: "/images/news-8.jpg",
    date: "০২ সেপ্টেম্বর, ২০২৬",
    time: "০৪:১৫ PM",
    author: "মোঃ সাদিক",
    authorImage: "/images/author-8.jpg",
    views: 4600,
    likes: 670,
    comments: 98,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    excerpt:
      "কৃষি খাতে ড্রোন ও কৃত্রিম বুদ্ধিমত্তা প্রযুক্তি ব্যবহার করে উৎপাদন বাড়ানোর উদ্যোগ নিয়েছে সরকার।",
    content: "বিস্তারিত সংবাদ...",
  },
];

const categories = [
  "সব",
  "জাতীয়",
  "অর্থনীতি",
  "খেলাধুলা",
  "প্রযুক্তি",
  "শিক্ষা",
  "পরিবেশ",
  "কৃষি",
];

// Safe Image Component
function SafeImage({ src, alt, className, fill, sizes, priority }: any) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <Newspaper className="h-12 w-12 text-primary/30" />
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

export default function TodayNewspaperPage() {
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [activeTab, setActiveTab] = useState("latest");

  const filteredNews =
    selectedCategory === "সব"
      ? mockNews
      : mockNews.filter((news) => news.category === selectedCategory);

  const breakingNews = mockNews.filter((news) => news.isBreaking);
  const featuredNews = mockNews.filter((news) => news.isFeatured);
  const trendingNews = mockNews.filter((news) => news.isTrending);
  const latestNews = filteredNews;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <AlertCircle className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm uppercase tracking-wider">
                  ব্রেকিং নিউজ
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  {breakingNews.map((news, index) => (
                    <span key={news.id} className="inline-block mx-8">
                      {news.title}
                      {index < breakingNews.length - 1 && " • "}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border-b border-primary/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm text-primary border border-primary/20">
              <Calendar className="h-4 w-4" />
              <span>আজকের তারিখ: ০৯ সেপ্টেম্বর, ২০২৬</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              আজকের <span className="text-primary">পত্রিকা</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-lg">
              দেশের গুরুত্বপূর্ণ সব সংবাদ এক জায়গায়। পড়ুন, জানুন, বিশ্লেষণ
              করুন।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <Newspaper className="h-4 w-4 text-primary" />
                <span>{mockNews.length} টি সংবাদ</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>সর্বশেষ আপডেট</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-block h-8 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/60" />
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  ফিচার্ড সংবাদ
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map((news, index) => (
                <Card
                  key={news.id}
                  className={`group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div
                        className={`relative ${index === 0 ? "md:w-2/5 h-64 md:h-auto" : "md:w-2/5 h-56 md:h-auto"} overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200`}
                      >
                        <SafeImage
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 40vw"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border-0">
                            {news.category}
                          </Badge>
                          {news.isBreaking && (
                            <Badge className="bg-red-500/90 backdrop-blur-md text-white border-0 animate-pulse">
                              ব্রেকিং
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div
                        className={`flex-1 p-6 md:p-8 flex flex-col justify-center ${index === 0 ? "bg-gradient-to-br from-white to-slate-50/80" : "bg-white"}`}
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <User className="h-3 w-3" />
                          <span>{news.author}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>{news.time}</span>
                        </div>
                        <h3
                          className={`font-bold mb-2 group-hover:text-primary transition-colors ${index === 0 ? "text-2xl" : "text-xl"} leading-tight`}
                        >
                          {news.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {news.subtitle}
                        </p>
                        <p className="text-muted-foreground/80 text-sm line-clamp-2 mb-4">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {news.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {news.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {news.comments}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="rounded-full gap-1.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all"
                          >
                            পড়ুন
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-border/60">
          <span className="text-sm font-medium text-muted-foreground mr-2">
            বিভাগ:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

        {/* Tabs: Latest, Trending, Popular */}
        <Tabs
          defaultValue="latest"
          className="mb-8"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-secondary/20 p-1 rounded-full border border-border/50">
            <TabsTrigger
              value="latest"
              className="rounded-full data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
            >
              <Clock className="h-4 w-4 mr-2" />
              সর্বশেষ
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="rounded-full data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
            >
              <Flame className="h-4 w-4 mr-2" />
              ট্রেন্ডিং
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="rounded-full data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
            >
              <Award className="h-4 w-4 mr-2" />
              জনপ্রিয়
            </TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="mt-6">
            <NewsGrid news={filteredNews} />
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <NewsGrid news={trendingNews} />
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            <NewsGrid
              news={[...mockNews].sort((a, b) => b.views - a.views).slice(0, 6)}
            />
          </TabsContent>
        </Tabs>

        {/* Sidebar with Trending Tags */}
        <div className="mt-12 pt-8 border-t border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                জনপ্রিয় ট্যাগ
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "বাংলাদেশ",
                  "অর্থনীতি",
                  "শিক্ষা",
                  "প্রযুক্তি",
                  "ক্রিকেট",
                  "রাজনীতি",
                  "বিনোদন",
                  "বিশ্ব",
                  "চাকরি",
                  "বিজ্ঞান",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-secondary/30 hover:bg-secondary rounded-full text-sm cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                সাবস্ক্রাইব
              </h3>
              <div className="flex flex-col gap-2">
                <Button className="w-full gap-2 rounded-full">
                  <Bell className="h-4 w-4" />
                  নিউজলেটার সাবস্ক্রাইব
                </Button>
                <Button variant="outline" className="w-full gap-2 rounded-full">
                  <Share2 className="h-4 w-4" />
                  শেয়ার করুন
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

// News Grid Component
function NewsGrid({ news }: { news: any[] }) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/30" />
        <p className="text-muted-foreground mt-4">কোন সংবাদ পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

// News Card Component
function NewsCard({ news }: { news: any }) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg hover:shadow-primary/20 rounded-2xl">
      <CardContent className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <SafeImage
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border-0 text-xs">
              {news.category}
            </Badge>
            {news.isBreaking && (
              <Badge className="bg-red-500/90 backdrop-blur-md text-white border-0 text-xs animate-pulse">
                ব্রেকিং
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/70 text-xs">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              {news.author}
            </div>
            <span>{news.time}</span>
          </div>
        </div>
        <div className="p-5">
          <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {news.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {news.subtitle}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {news.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {news.comments}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 w-8 p-0 group-hover:bg-primary/10"
            >
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
