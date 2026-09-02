'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ShareBar } from '@/components/common/ShareBar'
import { TagList } from '@/components/common/TagList'
import type { Article } from '../types/article.types'

const FONT_SIZE_CLASSES = ['text-sm', 'text-base', 'text-lg'] as const
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80'

/**
 * Client Component — holds the font-size toggle's local state (scoped
 * to this one article instance, not global — so plain useState, no
 * Redux) and renders the top ShareBar, featured image, body, tags, and
 * bottom ShareBar together since the font-size control needs to affect
 * the body text below it.
 */
export function ArticleReadingArea({ article, url }: { article: Article; url: string }) {
  const [fontSizeIndex, setFontSizeIndex] = useState(1) // default: text-base

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-border py-2">
        <ShareBar url={url} title={article.title} />
        <div className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground">ফন্ট সাইজ:</span>
          <button
            onClick={() => setFontSizeIndex((i) => Math.max(0, i - 1))}
            disabled={fontSizeIndex === 0}
            aria-label="ফন্ট ছোট করুন"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setFontSizeIndex((i) => Math.min(FONT_SIZE_CLASSES.length - 1, i + 1))}
            disabled={fontSizeIndex === FONT_SIZE_CLASSES.length - 1}
            aria-label="ফন্ট বড় করুন"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={article.thumbnail?.url ?? FALLBACK_IMAGE}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div
        className={cn(
          'max-w-none space-y-4 leading-relaxed text-foreground',
          FONT_SIZE_CLASSES[fontSizeIndex]
        )}
      >
        {article.content.split('\n').map((paragraph, idx) =>
          paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
        )}
      </div>

      <div className="mt-6">
        <TagList tags={article.tags} />
      </div>

      <div className="mt-6 border-y border-border py-3">
        <ShareBar url={url} title={article.title} />
      </div>
    </div>
  )
}
