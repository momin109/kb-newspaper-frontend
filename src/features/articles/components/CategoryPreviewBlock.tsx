import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { NewsCard } from '@/components/common/NewsCard'
import { EmptyState } from '@/components/common/EmptyState'
import { getArticles } from '../services/articles.service'
import type { Category } from '@/features/categories/types/category.types'

interface CategoryPreviewBlockProps {
  category: Category
  limit?: number
}

/** Server Component — one category's article grid + "see all" link. */
export async function CategoryPreviewBlock({ category, limit = 4 }: CategoryPreviewBlockProps) {
  const articles = await getArticles({ category: category._id, limit })

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between border-b-2 border-primary pb-2">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <span className="h-5 w-1.5 rounded bg-primary" />
          {category.name}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center text-sm font-medium text-primary hover:underline"
        >
          সব দেখুন <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {articles.length === 0 ? (
        <EmptyState message={`${category.name} বিভাগে এখনো কোনো সংবাদ নেই।`} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} showExcerpt={false} />
          ))}
        </div>
      )}
    </section>
  )
}
