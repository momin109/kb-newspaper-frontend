export type PodcastMediaType = "audio" | "video";

export interface PodcastAuthor {
  _id: string;
  name?: string;
  fullName?: string;
}

export interface Podcast {
  _id: string;
  title: string;
  description?: string;
  mediaType: PodcastMediaType;

  audioUrl?: string;
  videoUrl?: string;
  thumbnail?: string;

  category: string;
  duration?: number;

  author?: PodcastAuthor | null;

  isPremium: boolean;
  publishAt?: string | null;
  views: number;

  createdAt: string;
  updatedAt: string;
}
