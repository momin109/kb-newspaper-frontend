import { Eye, Clock, User } from 'lucide-react'
import { CategoryBadge } from '@/components/common/CategoryBadge'
import { formatBanglaRelativeTime } from '@/lib/relativeTime'
import { getExcerpt } from '../utils/getExcerpt'
import type { Article } from '../types/article.types'

const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])

function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/** Headline, meta row (author/date/read-time/views), and a short lead excerpt. */
export function ArticleHeader({ article }: { article: Article }) {
  const readMinutes = estimateReadMinutes(article.content)
  const timeLabel = article.publishedAt
    ? formatBanglaRelativeTime(article.publishedAt)
    : formatBanglaRelativeTime(article.createdAt)

  return (
    <div className="mb-4">
      {article.category && <CategoryBadge name={article.category.name} className="mb-3" />}
      <h1 className="text-2xl font-extrabold leading-snug sm:text-3xl">{article.title}</h1>
      <p className="mt-3 text-base text-muted-foreground">{getExcerpt(article.content, 180)}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4 text-sm text-muted-foreground">
        {article.author && (
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author.fullName}
          </span>
        )}
        <span>{timeLabel}</span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {toBn(readMinutes)} মিনিট পড়ার সময়
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {toBn(article.views)} বার পড়া হয়েছে
        </span>
      </div>
    </div>
  )
}
