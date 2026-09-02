import { ArticleHeroGrid } from './ArticleHeroGrid'
import { getArticles } from '../services/articles.service'

/** Server Component — above-the-fold content fetched at request time for best SEO/perf. */
export async function HeroSection() {
  const articles = await getArticles({ limit: 5 })
  return <ArticleHeroGrid articles={articles} />
}
