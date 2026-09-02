import Link from 'next/link'
import { Tag } from 'lucide-react'

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-muted-foreground" />
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/search?q=${encodeURIComponent(tag)}`}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
