import { HeroSection } from "@/features/articles/components/HeroSection";
import { LatestNewsSection } from "@/features/articles/components/LatestNewsSection";
import { CategoryPreviewBlock } from "@/features/articles/components/CategoryPreviewBlock";
import { getCategories } from "@/features/categories/services/categories.service";
import { SportsEntertainmentSection } from "@/features/articles/components/SportsEntertainmentSection";

import PodcastSection from "@/features/podcasts/components/PodcastSection";
import PhotoGallerySection from "@/features/media/components/PhotoGallerySection";
import VideoGallerySection from "@/features/media/components/VideoGallerySection";
/**
 * Homepage — async Server Component. Fetches categories once here and
 * distributes them to the sections that need them (tab list, preview
 * blocks) rather than each section re-fetching independently.
 */
export default async function HomePage() {
  const categories = await getCategories();

  const sportsCategory = categories.find(
    (category) => category.slug === "sports",
  );

  const entertainmentCategory = categories.find(
    (category) => category.slug === "entertainment",
  );

  const tabSlugs = ["national", "politics", "world"];
  const tabCategories = tabSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const previewSlugs = [
    "national",
    "politics",
    "country",
    "world",
    "education",
    "business",
    "opinion",
    "video",
  ];
  const previewCategories = previewSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto max-w-7xl divide-y divide-border px-3 py-6 sm:px-4">
      <div className="pb-8">
        <HeroSection />
      </div>
      <div className="py-8">
        <LatestNewsSection />
      </div>
      <div className="py-8">
        <SportsEntertainmentSection
          sportsCategory={sportsCategory}
          entertainmentCategory={entertainmentCategory}
        />
      </div>

      {/* {previewCategories.map((category) => (
        <CategoryPreviewBlock key={category._id} category={category} />
      ))} */}
      <div className="py-8">
        <PhotoGallerySection />
      </div>
      <div className="py-8">
        <VideoGallerySection />
      </div>
      <div className="pt-8">
        <PodcastSection />
      </div>
    </div>
  );
}
