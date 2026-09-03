import { apiClient } from "@/lib/axios";

export interface DashboardStatistics {
  articles: {
    total: number;
    published: number;
    draft: number;
    review: number;
  };

  users: {
    total: number;
  };

  comments: {
    total: number;
  };

  categories: {
    total: number;
  };

  views: {
    total: number;
  };
}

export interface DashboardRecentArticle {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: {
    url: string;
    public_id: string;
  } | null;
  status: "draft" | "review" | "published";
  views: number;
  createdAt: string;
  author?: {
    _id: string;
    fullName: string;
  } | null;
  category?: {
    _id: string;
    name: string;
  } | null;
}

export interface DashboardActivity {
  _id: string;
  action?: string;
  description?: string;
  createdAt: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    statistics: DashboardStatistics;
    recentArticles: DashboardRecentArticle[];
    recentActivities: DashboardActivity[];
  };
}

async function getDashboardStats(): Promise<DashboardResponse> {
  const response = await apiClient.get<DashboardResponse>("/dashboard/stats");

  return response.data;
}

export const dashboardService = {
  getDashboardStats,
};
