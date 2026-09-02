import { NewsCard } from '@/components/common/NewsCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Article } from '../types/article.types'

/**
 * Pure presentational hero layout: 1 large featured card + a 2x2 grid
 * of smaller cards. Shared by the homepage (HeroSection wraps this with
 * its own fetch) and the category page (which fetches once via
 * getCategoryWithArticles and passes the slice straight in) — keeps the
 * fetch and the layout decoupled so this markup isn't duplicated.
 */
export function ArticleHeroGrid({
  articles,
  emptyMessage = 'এই মুহূর্তে কোনো সংবাদ নেই।',
}: {
  articles: Article[]
  emptyMessage?: string
}) {
  if (articles.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  const [featured, ...rest] = articles

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <NewsCard article={featured} variant="featured" className="h-72 sm:h-96" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {rest.slice(0, 4).map((article) => (
          <NewsCard key={article._id} article={article} showExcerpt={false} />
        ))}
      </div>
    </div>
  )
}
