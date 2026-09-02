import Link from 'next/link'
import { Users, Video, AtSign, Briefcase, Camera } from 'lucide-react'

import { NewsletterForm } from '@/features/newsletter/components/NewsletterForm'
import { AppDownloadBadge } from '@/components/common/AppDownloadBadge'
import { getCategories } from '@/features/categories/services/categories.service'

const QUICK_LINKS = [
  { label: 'গোপনীয়তার নীতি', href: '/privacy-policy' },
  { label: 'শর্তাবলি', href: '/terms' },
  { label: 'মন্তব্য প্রকাশের নীতিমালা', href: '/comment-policy' },
  { label: 'বিজ্ঞাপন', href: '/advertise' },
  { label: 'যোগাযোগ', href: '/contact' },
]

/**
 * Generic icons stand in for platform brand marks — lucide-react
 * dropped brand/logo icons for trademark reasons (same call made in
 * the earlier Vite project).
 */
const SOCIAL_LINKS = [
  { icon: Users, href: '#', label: 'Facebook' },
  { icon: Video, href: '#', label: 'YouTube' },
  { icon: AtSign, href: '#', label: 'X' },
  { icon: Briefcase, href: '#', label: 'LinkedIn' },
  { icon: Camera, href: '#', label: 'Instagram' },
]

/** Async Server Component — fetches its own categories list. */
export async function Footer() {
  const categories = await getCategories()

  return (
    <footer className="mt-10 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-lg font-extrabold text-primary-foreground">
              প্র
            </span>
            <span className="text-xl font-extrabold">
              প্রভাত<span className="text-primary">বার্তা</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">দৈনিক সংবাদপত্র</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            বাংলাদেশ ও বিশ্বের সকল খবর, ব্রেকিং নিউজ, লাইভ নিউজ, রাজনীতি, বাণিজ্য,
            খেলা, বিনোদনসহ সকল সর্বশেষ সংবাদ সবার আগে পড়তে ক্লিক করুন প্রভাতবার্তা
            ডট কম।
          </p>
          <div className="mt-4 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/90 text-background hover:bg-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">বিভাগসমূহ</h4>
          <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
            {categories.slice(0, 8).map((c) => (
              <li key={c._id}>
                <Link href={`/category/${c.slug}`} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="mb-2 mt-5 text-sm font-bold">দ্রুত লিঙ্ক</h4>
          <ul className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">নিউজলেটার</h4>
          <p className="mb-3 text-sm text-muted-foreground">
            প্রভাতবার্তা থেকে প্রতিদিন মেইলে আপডেট পেতে সাবস্ক্রাইব করুন।
          </p>
          <NewsletterForm />
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">মোবাইল অ্যাপস</h4>
          <div className="flex flex-col gap-2">
            <AppDownloadBadge platform="ios" />
            <AppDownloadBadge platform="android" />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            সম্পাদক: সন্তোষ শর্মা | প্রকাশক: মিয়া নুরুদ্দিন আহমেদ অপু — প্রভাতবার্তা
            মিডিয়া লিমিটেড, ঢাকা।
          </p>
          <p>স্বত্ব © প্রভাতবার্তা মিডিয়া লিমিটেড {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
