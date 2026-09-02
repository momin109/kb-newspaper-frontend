import { NewsCard } from '@/components/common/NewsCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Article } from '../types/article.types'

/** Vertical list of article cards used below the category hero block. */
export function CategoryArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <EmptyState message="এই বিভাগে আর কোনো সংবাদ নেই।" />
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => (
        <NewsCard key={article._id} article={article} variant="list" />
      ))}
    </div>
  )
}
