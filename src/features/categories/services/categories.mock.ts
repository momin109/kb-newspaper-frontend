import type { Category } from '../types/category.types'

const now = new Date().toISOString()

export const MOCK_CATEGORIES: Category[] = [
  { _id: 'c1', name: 'জাতীয়', slug: 'national', parent: null, isFeatured: true, createdAt: now, updatedAt: now },
  { _id: 'c2', name: 'রাজনীতি', slug: 'politics', parent: null, isFeatured: true, createdAt: now, updatedAt: now },
  { _id: 'c3', name: 'সারাদেশ', slug: 'country', parent: null, isFeatured: false, createdAt: now, updatedAt: now },
  { _id: 'c4', name: 'বিশ্ব', slug: 'world', parent: null, isFeatured: true, createdAt: now, updatedAt: now },
  { _id: 'c5', name: 'খেলা', slug: 'sports', parent: null, isFeatured: true, createdAt: now, updatedAt: now },
  { _id: 'c6', name: 'শিক্ষা', slug: 'education', parent: null, isFeatured: false, createdAt: now, updatedAt: now },
  { _id: 'c7', name: 'বাণিজ্য', slug: 'business', parent: null, isFeatured: true, createdAt: now, updatedAt: now },
  { _id: 'c8', name: 'বিনোদন', slug: 'entertainment', parent: null, isFeatured: true, createdAt: now, updatedAt: now },
  { _id: 'c9', name: 'মতামত', slug: 'opinion', parent: null, isFeatured: false, createdAt: now, updatedAt: now },
  { _id: 'c10', name: 'ভিডিও', slug: 'video', parent: null, isFeatured: false, createdAt: now, updatedAt: now },
]
