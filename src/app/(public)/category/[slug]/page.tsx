import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleHeroGrid } from "@/features/articles/components/ArticleHeroGrid";
import { CategoryArticleList } from "@/features/articles/components/CategoryArticleList";
import { TrendingSidebar } from "@/features/trending/components/TrendingSidebar";
import { getCategoryWithArticles } from "@/features/categories/services/categories.service";
import { CategoryPagination } from "@/features/categories/components/CategoryPagination";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryWithArticles(slug);
  if (!result) return { title: "ক্যাটাগরি পাওয়া যায়নি | প্রভাতবার্তা" };

  const parentName =
    typeof result.category.parent === "object" && result.category.parent?.name
      ? ` - ${result.category.parent.name}`
      : "";

  return {
    title: `${result.category.name}${parentName} | প্রভাতবার্তা`,
    description: `প্রভাতবার্তায় ${result.category.name} বিভাগের সর্বশেষ সংবাদ পড়ুন।`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const page = Math.max(Number(pageParam) || 1, 1);

  const result = await getCategoryWithArticles(slug, page, 12);

  if (!result) {
    notFound();
  }

  const {
    category,
    articles,
    pagination,
    subCategories = [],
    siblingCategories = [],
  } = result;

  const parentObj =
    typeof category.parent === "object" && category.parent?._id
      ? category.parent
      : null;

  // Build hierarchical breadcrumb items
  const breadcrumbItems = [];
  if (parentObj) {
    breadcrumbItems.push({
      label: parentObj.name,
      href: `/category/${parentObj.slug}`,
    });
  }
  breadcrumbItems.push({ label: category.name });

  // Build subcategory navigation chips
  const navChips: Array<{ label: string; href: string; active: boolean }> = [];

  if (parentObj) {
    // Current is a subcategory: show parent (All) + current + siblings
    navChips.push({
      label: `সব (${parentObj.name})`,
      href: `/category/${parentObj.slug}`,
      active: false,
    });
    navChips.push({
      label: category.name,
      href: `/category/${category.slug}`,
      active: true,
    });
    siblingCategories.forEach((sib) => {
      navChips.push({
        label: sib.name,
        href: `/category/${sib.slug}`,
        active: false,
      });
    });
  } else if (subCategories.length > 0) {
    // Current is a main category: show All + its subcategories
    navChips.push({
      label: "সব",
      href: `/category/${category.slug}`,
      active: true,
    });
    subCategories.forEach((sub) => {
      navChips.push({
        label: sub.name,
        href: `/category/${sub.slug}`,
        active: false,
      });
    });
  }

  const heroArticles = page === 1 ? articles.slice(0, 5) : [];
  const listArticles = page === 1 ? articles.slice(5) : articles;

  const totalArticles = pagination?.total ?? articles.length;

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      {/* Breadcrumb with full parent-child hierarchy */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Category Header */}
      <div className="mb-3 flex items-center gap-2 border-b-2 border-primary pb-2">
        <span className="h-6 w-2 rounded bg-primary" />
        <h1 className="text-xl font-extrabold sm:text-2xl">{category.name}</h1>
      </div>

      {/* Subcategory Navigation Chips */}
      {navChips.length > 0 && (
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {navChips.map((chip, idx) => (
            <Link
              key={idx}
              href={chip.href}
              className={`shrink-0 rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-colors ${
                chip.active
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/70 text-foreground/80 hover:bg-muted hover:text-foreground"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <ArticleHeroGrid
        articles={heroArticles}
        showMediaSlider={false}
        emptyMessage="এই বিভাগে বর্তমানে কোনো সংবাদ নেই।"
      />

      {/* List Articles & Trending Section */}
      {totalArticles > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* 
              Fix empty state bug:
              Only render "আরও সংবাদ" and CategoryArticleList if there are actually list articles,
              or if we are on page > 1. If page 1 has 1-5 articles, they are all in the hero grid!
            */}
            {listArticles.length > 0 ? (
              <>
                <h2 className="mb-3 text-lg font-extrabold">
                  আরও {category.name} সংবাদ
                </h2>
                <CategoryArticleList articles={listArticles} />
                <CategoryPagination
                  slug={slug}
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </>
            ) : page > 1 ? (
              <CategoryArticleList articles={[]} />
            ) : null}
          </div>

          <TrendingSidebar />
        </div>
      )}

      {/* If 0 articles, still show TrendingSidebar neatly */}
      {totalArticles === 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2" />
          <TrendingSidebar />
        </div>
      )}
    </div>
  );
}
