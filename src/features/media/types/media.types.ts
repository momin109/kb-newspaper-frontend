export type MediaType = "image" | "video";

export interface Media {
  _id: string;
  title?: string;
  url: string;
  type: MediaType;
  thumbnail?: string;
  uploadedBy?: string;
  category?: string;
  tags: string[];
  isPublished: boolean;
  public_id: string;
  createdAt: string;
  updatedAt: string;
}
