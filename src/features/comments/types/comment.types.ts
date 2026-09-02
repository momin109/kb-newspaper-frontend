/** Matches kb-newspaper-server's Comment model exactly (models/comment.model.js). */
export interface Comment {
  _id: string
  article: string
  user: { _id: string; fullName: string } | null
  text: string
  parent: string | null
  likes: string[] // user ids who liked
  isApproved: boolean
  createdAt: string
  updatedAt: string
  replies?: Comment[] // nested one level, added by getCommentsByArticle
}
