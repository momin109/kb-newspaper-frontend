'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeMobileNav } from '@/store/slices/uiSlice'
import type { Category } from '@/features/categories/types/category.types'

/**
 * Slide-in mobile nav, animated with Framer Motion. Receives categories
 * as a prop from the (server) Header rather than fetching its own copy.
 */
export function MobileNavDrawer({ categories }: { categories: Category[] }) {
  const isOpen = useAppSelector((s) => s.ui.isMobileNavOpen)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => dispatch(closeMobileNav())}
          />
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 flex w-3/4 max-w-sm flex-col bg-background shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="text-lg font-extrabold">
                প্রভাত<span className="text-primary">বার্তা</span>
              </span>
              <button
                onClick={() => dispatch(closeMobileNav())}
                aria-label="বন্ধ করুন"
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto py-2">
              {categories.map((category) => {
                const href = `/category/${category.slug}`
                return (
                  <Link
                    key={category._id}
                    href={href}
                    onClick={() => dispatch(closeMobileNav())}
                    className={cn(
                      'border-b border-border px-4 py-3 text-sm font-medium text-foreground',
                      pathname === href && 'bg-accent text-primary'
                    )}
                  >
                    {category.name}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
