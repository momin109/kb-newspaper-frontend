import { ArticleHeroGrid } from "./ArticleHeroGrid";
import { getArticles } from "../services/articles.service";

export async function HeroSection() {
  const articles = await getArticles({ limit: 7 });

  return <ArticleHeroGrid articles={articles} />;
}
