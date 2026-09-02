import { TopUtilityBar } from './TopUtilityBar'
import { MainHeader } from './MainHeader'
import { CategoryNavBar } from './CategoryNavBar'
import { getCategories } from '@/features/categories/services/categories.service'

/**
 * Async Server Component — fetches categories once here and passes them
 * down to CategoryNavBar (also reused by MobileNavDrawer via its own
 * fetch, deduped by Next.js's fetch cache when hitting the real API).
 */
export async function Header() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-40 bg-background shadow-sm">
      <TopUtilityBar />
      <MainHeader />
      <CategoryNavBar categories={categories} />
    </header>
  )
}
