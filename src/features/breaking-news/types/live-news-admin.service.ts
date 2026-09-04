import { apiClient } from "@/lib/axios";

export interface LiveNewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface LiveNewsResponse {
  success: boolean;
  totalResults: number;
  articles: LiveNewsArticle[];
}

export async function getLiveNews(): Promise<LiveNewsResponse> {
  const response = await apiClient.get<LiveNewsResponse>("/news/live-news");

  return response.data;
}

export async function getBangladeshNews(): Promise<LiveNewsResponse> {
  const response = await apiClient.get<LiveNewsResponse>(
    "/news/live-news-bangladesh",
  );

  return response.data;
}
