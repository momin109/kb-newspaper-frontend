import { HeroSection } from "@/features/articles/components/HeroSection";
import { LatestNewsSection } from "@/features/articles/components/LatestNewsSection";
import { CategoryPreviewBlock } from "@/features/articles/components/CategoryPreviewBlock";
import { getCategories } from "@/features/categories/services/categories.service";

/**
 * Homepage — async Server Component. Fetches categories once here and
 * distributes them to the sections that need them (tab list, preview
 * blocks) rather than each section re-fetching independently.
 */
export default async function HomePage() {
  const categories = await getCategories();

  const tabSlugs = ["national", "politics", "world"];
  const tabCategories = tabSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const previewSlugs = ["sports", "entertainment", "country"];
  const previewCategories = previewSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <HeroSection />
      <LatestNewsSection tabCategories={tabCategories} />
      {previewCategories.map((category) => (
        <CategoryPreviewBlock key={category._id} category={category} />
      ))}
    </div>
  );
}
