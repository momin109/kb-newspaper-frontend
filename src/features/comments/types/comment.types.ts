/** Matches kb-newspaper-server's Comment model exactly (models/comment.model.js). */
export interface Comment {
  _id: string;

  article: { _id: string; title: string } | null;

  user: { _id: string; fullName: string } | null;

  text: string;

  parent: string | null;

  likes: string[];

  isApproved: boolean;

  createdAt: string;

  updatedAt: string;

  replies?: Comment[];
}
