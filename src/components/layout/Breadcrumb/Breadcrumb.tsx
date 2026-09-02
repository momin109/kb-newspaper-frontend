import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

/** Simple হোম / ক্যাটাগরি / ... trail, reused on category and article pages. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center gap-1 hover:text-primary">
        <ChevronLeft className="h-3.5 w-3.5" />
        হোম
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <span className="opacity-50">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
