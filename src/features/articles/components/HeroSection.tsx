import { ArticleHeroGrid } from "./ArticleHeroGrid";
import { getArticles } from "../services/articles.service";
import { getPublicMedia } from "@/features/media/services/media-public.service";

export async function HeroSection() {
  const articles = await getArticles({
    limit: 7,
  });

  const videos = await getPublicMedia("video", 1, 5);

  const photos = await getPublicMedia("image", 1, 5);

  return (
    <ArticleHeroGrid
      articles={articles}
      videos={videos.data}
      photos={photos.data}
    />
  );
}
