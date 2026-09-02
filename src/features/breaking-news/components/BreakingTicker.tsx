import Link from 'next/link'
import { getBreakingNews } from '../services/breakingNews.service'

/**
 * Server Component — no client JS needed here; the marquee is pure CSS
 * (`animate-marquee` in globals.css) and hover-to-pause works via CSS
 * `:hover` alone, so this never needs 'use client'.
 */
export async function BreakingTicker() {
  const items = await getBreakingNews()
  if (items.length === 0) return null

  const loopItems = [...items, ...items]

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden py-2">
      <span className="inline-flex shrink-0 items-center gap-1 rounded bg-white/15 px-2 py-0.5 text-xs font-bold">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        সর্বশেষ
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-xs sm:text-sm">
          {loopItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={item.link}
              className="inline-flex items-center gap-2 hover:underline"
            >
              {item.text}
              <span aria-hidden className="opacity-60">•</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
