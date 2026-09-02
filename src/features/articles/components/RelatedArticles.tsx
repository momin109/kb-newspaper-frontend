import { NewsCard } from '@/components/common/NewsCard'
import { EmptyState } from '@/components/common/EmptyState'
import { getArticles } from '../services/articles.service'

/** Server Component — same-category articles, excluding the current one. */
export async function RelatedArticles({
  categoryId,
  excludeArticleId,
}: {
  categoryId: string
  excludeArticleId: string
}) {
  const all = await getArticles({ category: categoryId, limit: 5 })
  const related = all.filter((a) => a._id !== excludeArticleId).slice(0, 4)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-bold">এ সম্পর্কিত আরও খবর</h3>
      {related.length === 0 ? (
        <EmptyState message="সম্পর্কিত কোনো সংবাদ নেই।" />
      ) : (
        <div className="flex flex-col gap-3">
          {related.map((article) => (
            <NewsCard
              key={article._id}
              article={article}
              variant="compact"
              showExcerpt={false}
              className="border-0 py-0"
            />
          ))}
        </div>
      )}
    </div>
  )
}
