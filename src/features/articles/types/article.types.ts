import type { Category } from '@/features/categories/types/category.types'

export type ArticleStatus = 'draft' | 'review' | 'published'

export interface ArticleMediaFile {
  url: string
  public_id: string
  resource_type: 'image' | 'video'
}

/**
 * Matches kb-newspaper-server's Article model exactly (models/article.model.js).
 * Notably: no `excerpt` field (derived client-side from `content`), image
 * is `thumbnail: { url, public_id }` not a plain string, `category`/
 * `author` come back populated as partial objects from the list/detail
 * endpoints (see article.controller.js .populate() calls).
 */
export interface Article {
  _id: string
  title: string
  slug: string
  content: string
  thumbnail: { url: string; public_id: string } | null
  mediaFiles: ArticleMediaFile[]
  category: Pick<Category, '_id' | 'name'> | null
  tags: string[]
  author: { _id: string; fullName: string } | null
  shareCount: number
  status: ArticleStatus
  isPremium: boolean
  views: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}
