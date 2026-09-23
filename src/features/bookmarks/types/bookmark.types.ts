import type { Article } from "@/features/articles/types/article.types";

export interface Bookmark {
  _id: string;
  user: string;
  article: Article;
  createdAt: string;
  updatedAt: string;
}
