'use client'

import { useState, useEffect } from 'react'
import { Share2 } from 'lucide-react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { NewsCard } from '@/components/common/NewsCard'
import { EmptyState } from '@/components/common/EmptyState'
import { useArticlesClient } from '@/features/articles/hooks/useArticlesClient'
import { getTrendingArticles } from '@/features/articles/services/articles.service'
import type { Article } from '@/features/articles/types/article.types'

/** Client Component — tabbed সর্বশেষ/জনপ্রিয় widget used on the homepage and article pages. */
export function TrendingSidebar() {
  const [tab, setTab] = useState('latest')
  const { articles: latest, isLoading: latestLoading } = useArticlesClient({ limit: 5 })

  const [trending, setTrending] = useState<Article[]>([])
  const [trendingLoading, setTrendingLoading] = useState(true)

  useEffect(() => {
    getTrendingArticles(5)
      .then(setTrending)
      .finally(() => setTrendingLoading(false))
  }, [])

  return (
    <aside className="rounded-lg border border-border bg-card p-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="latest">সর্বশেষ</TabsTrigger>
          <TabsTrigger value="popular">জনপ্রিয়</TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          {latestLoading ? (
            <SidebarSkeleton />
          ) : latest.length === 0 ? (
            <EmptyState message="কোনো সংবাদ পাওয়া যায়নি।" />
          ) : (
            <ol className="divide-y divide-border">
              {latest.map((article, idx) => (
                <li key={article._id} className="flex gap-3 py-3 first:pt-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <NewsCard article={article} variant="compact" showExcerpt={false} className="border-0 py-0" />
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="popular">
          {trendingLoading ? (
            <SidebarSkeleton />
          ) : trending.length === 0 ? (
            <EmptyState message="কোনো সংবাদ পাওয়া যায়নি।" />
          ) : (
            <ol className="divide-y divide-border">
              {trending.map((article, idx) => (
                <li key={article._id} className="flex gap-3 py-3 first:pt-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <NewsCard article={article} variant="compact" showExcerpt={false} className="border-0 py-0" />
                </li>
              ))}
            </ol>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Share2 className="h-4 w-4" /> সোশ্যাল মিডিয়ায় আমরা
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span className="rounded-md bg-secondary px-3 py-2 text-center font-medium">ফেসবুক</span>
          <span className="rounded-md bg-secondary px-3 py-2 text-center font-medium">ইউটিউব</span>
          <span className="rounded-md bg-secondary px-3 py-2 text-center font-medium">এক্স</span>
          <span className="rounded-md bg-secondary px-3 py-2 text-center font-medium">ইনস্টাগ্রাম</span>
        </div>
      </div>
    </aside>
  )
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
