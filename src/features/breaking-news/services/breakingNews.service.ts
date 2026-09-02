import type { BreakingNewsItem } from '../types/breakingNews.types'

/**
 * The backend has NO dedicated breaking-news CRUD (only a `/api/news`
 * route that proxies an external NewsAPI.org feed — see
 * controllers/liveNews.controller.js). Until a real breaking-news
 * module is added to the backend, this ticker is mock-only.
 * TODO: replace with a real call once the backend exposes one, e.g.
 * GET /api/breaking-news.
 */
const MOCK_BREAKING_NEWS: BreakingNewsItem[] = [
  { id: 'b1', text: 'বাংলাদেশি জাহাজ হরমুজ প্রণালি অতিক্রমের অনুমতি পায়নি', link: '#' },
  { id: 'b2', text: 'তাপমাত্রা বাড়তে পারে, বজ্রবৃষ্টি নিয়ে নতুন তথ্য', link: '#' },
  { id: 'b3', text: 'জ্বালানি তেলের দাম কবে স্বাভাবিক হবে, জানালেন বিশেষজ্ঞরা', link: '#' },
  { id: 'b4', text: 'থাইল্যান্ডে রিসোর্ট থেকে নারীসহ ২১ বাংলাদেশি গ্রেপ্তার', link: '#' },
]

export async function getBreakingNews(): Promise<BreakingNewsItem[]> {
  return MOCK_BREAKING_NEWS
}
