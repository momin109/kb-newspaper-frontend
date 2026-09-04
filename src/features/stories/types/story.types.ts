export type StoryMediaType = "image" | "video";

export interface StoryAuthor {
  _id: string;
  name?: string;
  fullName?: string;
}

export interface Story {
  _id: string;
  title?: string;
  mediaType: StoryMediaType;
  mediaUrl: string;
  thumbnail?: string;
  author: StoryAuthor | null;
  views: number;
  viewers?: string[];
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
