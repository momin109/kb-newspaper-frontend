import type { MetadataRoute } from "next";

import { getArticles } from "@/features/articles/services/articles.service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://provatbarta.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch published articles
    const articles = await getArticles();

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },

      {
        url: `${SITE_URL}/podcast`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      },
    ];

    const articleUrls: MetadataRoute.Sitemap = articles
      .filter((article) => article.status === "published")
      .map((article) => ({
        url: `${SITE_URL}/article/${article.slug}`,

        lastModified: article.updatedAt
          ? new Date(article.updatedAt)
          : article.publishedAt
            ? new Date(article.publishedAt)
            : new Date(),

        changeFrequency: "daily",

        priority: 0.8,
      }));

    return [...staticPages, ...articleUrls];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
    ];
  }
}
