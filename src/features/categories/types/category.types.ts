/** Matches kb-newspaper-server's Category model exactly (models/category.model.js). */
export interface Category {
  _id: string
  name: string
  slug: string
  parent: string | null // ObjectId of parent category, or null for a main category
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}
