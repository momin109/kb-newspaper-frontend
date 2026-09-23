export type MediaType = "image" | "video";
export type MediaSourceType = "upload" | "youtube";

export interface Media {
  _id: string;
  title?: string;
  url: string;
  type: MediaType;
  sourceType?: MediaSourceType;
  youtubeId?: string;
  thumbnail?: string;
  uploadedBy?: string;
  category?: string;
  tags: string[];
  isPublished: boolean;
  public_id: string;
  createdAt: string;
  updatedAt: string;
}
