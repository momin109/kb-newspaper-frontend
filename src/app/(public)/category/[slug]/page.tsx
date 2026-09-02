import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ArticleHeroGrid } from '@/features/articles/components/ArticleHeroGrid'
import { CategoryArticleList } from '@/features/articles/components/CategoryArticleList'
import { TrendingSidebar } from '@/features/trending/components/TrendingSidebar'
import { getCategoryWithArticles } from '@/features/categories/services/categories.service'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getCategoryWithArticles(slug)
  if (!result) return { title: 'ক্যাটাগরি পাওয়া যায়নি | প্রভাতবার্তা' }

  return {
    title: `${result.category.name} | প্রভাতবার্তা`,
    description: `প্রভাতবার্তায় ${result.category.name} বিভাগের সর্বশেষ সংবাদ পড়ুন।`,
  }
}

/**
 * Async Server Component. Uses the backend's dedicated
 * GET /api/category/all/:slug endpoint (its own comment calls this the
 * "🔥 main feature") which returns the category + all its published
 * articles in one call — no separate getArticles({category}) request
 * needed here.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const result = await getCategoryWithArticles(slug)

  if (!result) {
    notFound()
  }

  const { category, articles } = result
  const heroArticles = articles.slice(0, 5)
  const listArticles = articles.slice(5)

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <Breadcrumb items={[{ label: category.name }]} />

      <div className="mb-3 flex items-center gap-2 border-b-2 border-primary pb-2">
        <span className="h-6 w-2 rounded bg-primary" />
        <h1 className="text-xl font-extrabold sm:text-2xl">{category.name}</h1>
      </div>

      <ArticleHeroGrid
        articles={heroArticles}
        emptyMessage={`${category.name} বিভাগে এখনো কোনো সংবাদ প্রকাশিত হয়নি।`}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-extrabold">আরও {category.name} সংবাদ</h2>
          <CategoryArticleList articles={listArticles} />
        </div>
        <TrendingSidebar />
      </div>
    </div>
  )
}
