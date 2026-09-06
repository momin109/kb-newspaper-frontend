import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/features/categories/types/category.types";
import { getArticles } from "../services/articles.service";
import { EmptyState } from "@/components/common/EmptyState";

interface SportsEntertainmentSectionProps {
  sportsCategory?: Category;
  entertainmentCategory?: Category;
}

export async function SportsEntertainmentSection({
  sportsCategory,
  entertainmentCategory,
}: SportsEntertainmentSectionProps) {
  const [sportsArticles, entertainmentArticles] = await Promise.all([
    sportsCategory
      ? getArticles({
          category: sportsCategory._id,
          limit: 3,
        })
      : Promise.resolve([]),

    entertainmentCategory
      ? getArticles({
          category: entertainmentCategory._id,
          limit: 3,
        })
      : Promise.resolve([]),
  ]);

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* ================= খেলাধুলা ================= */}
        <CategoryColumn
          title="খেলাধুলা"
          href="/category/sports"
          articles={sportsArticles}
          accent="green"
        />

        {/* ================= Advertisement ================= */}
        <div className="flex min-h-[250px] items-center justify-center border border-border bg-muted/40">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl">
              📢
            </div>

            <h3 className="mb-2 text-sm font-semibold text-primary">
              বিজ্ঞাপন
            </h3>

            <p className="mb-4 text-xs text-muted-foreground">
              আপনার ব্যবসার জন্য জায়গাটি বিজ্ঞাপন দিন
            </p>

            <Link
              href="/contact"
              className="inline-flex bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              যোগাযোগ করুন
            </Link>
          </div>
        </div>

        {/* ================= বিনোদন ================= */}
        <CategoryColumn
          title="বিনোদন"
          href="/category/entertainment"
          articles={entertainmentArticles}
          accent="purple"
        />
      </div>
    </section>
  );
}

interface CategoryColumnProps {
  title: string;
  href: string;
  articles: Awaited<ReturnType<typeof getArticles>>;
  accent: "green" | "purple";
}

function CategoryColumn({
  title,
  href,
  articles,
  accent,
}: CategoryColumnProps) {
  const borderColor =
    accent === "green" ? "border-emerald-500" : "border-violet-500";

  if (!articles.length) {
    return (
      <div className="border border-border bg-card">
        <Header title={title} href={href} borderColor={borderColor} />

        <div className="p-4">
          <EmptyState message="এই মুহূর্তে কোনো সংবাদ নেই।" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card">
      <Header title={title} href={href} borderColor={borderColor} />

      <div className="divide-y divide-border">
        {articles.map((article) => (
          <Link
            key={article._id}
            href={`/article/${article.slug}`}
            className="flex gap-3 p-2.5 transition-colors hover:bg-muted/50"
          >
            <div className="relative h-[58px] w-[72px] shrink-0 overflow-hidden">
              {article.thumbnail?.url ? (
                <Image
                  src={article.thumbnail.url}
                  alt={article.title}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  ছবি
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-medium leading-5 text-foreground">
                {article.title}
              </h3>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("bn-BD")
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Header({
  title,
  href,
  borderColor,
}: {
  title: string;
  href: string;
  borderColor: string;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b-2 px-3 py-2 ${borderColor}`}
    >
      <h2 className="text-base font-bold text-foreground">{title}</h2>

      <Link
        href={href}
        className="text-[11px] text-muted-foreground transition hover:text-primary"
      >
        আরও →
      </Link>
    </div>
  );
}
