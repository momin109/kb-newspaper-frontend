'use client'

import { useState } from 'react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { NewsCard, NewsCardSkeleton } from '@/components/common/NewsCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { TrendingSidebar } from '@/features/trending/components/TrendingSidebar'
import { useArticlesClient } from '../hooks/useArticlesClient'
import type { Category } from '@/features/categories/types/category.types'

interface LatestNewsSectionProps {
  /** Categories to build tabs from (in addition to the always-present "সর্বশেষ" tab). */
  tabCategories: Category[]
}

/** Client Component — tabbed সর্বশেষ/[categories] list next to the TrendingSidebar. */
export function LatestNewsSection({ tabCategories }: LatestNewsSectionProps) {
  const [tab, setTab] = useState('latest')
  const activeCategoryId =
    tab === 'latest' ? undefined : tabCategories.find((c) => c.slug === tab)?._id

  const { articles, isLoading, isError, refetch } = useArticlesClient({
    category: activeCategoryId,
    limit: 7,
  })

  return (
    <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="latest">সর্বশেষ</TabsTrigger>
            {tabCategories.map((c) => (
              <TabsTrigger key={c._id} value={c.slug}>
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tab}>
            {isLoading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-3">
                    <NewsCardSkeleton />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : articles.length === 0 ? (
              <EmptyState message="এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।" />
            ) : (
              <div className="divide-y divide-border">
                {articles.map((article) => (
                  <div key={article._id} className="py-3 first:pt-0">
                    <NewsCard article={article} variant="compact" />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TrendingSidebar />
    </section>
  )
}
