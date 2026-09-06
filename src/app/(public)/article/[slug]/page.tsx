import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleHeader } from "@/features/articles/components/ArticleHeader";
import { ArticleReadingArea } from "@/features/articles/components/ArticleReadingArea";
import { RelatedArticles } from "@/features/articles/components/RelatedArticles";
import { PremiumGate } from "@/features/articles/components/PremiumGate";
import { CommentSection } from "@/features/comments/components/CommentSection";
import { TrendingSidebar } from "@/features/trending/components/TrendingSidebar";
import { getArticleBySlug } from "@/features/articles/services/articles.service";
import { getCommentsByArticle } from "@/features/comments/services/comments.service";
import { getExcerpt } from "@/features/articles/utils/getExcerpt";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);

  if (result.status !== "ok") {
    return { title: "সংবাদ পাওয়া যায়নি | প্রভাতবার্তা" };
  }

  const { article } = result;
  return {
    title: `${article.title} | প্রভাতবার্তা`,
    description: getExcerpt(article.content, 160),
    openGraph: {
      title: article.title,
      description: getExcerpt(article.content, 160),
      images: article.thumbnail ? [article.thumbnail.url] : [],
    },
  };
}

/**
 * Async Server Component. Fetches the article (handling not_found/
 * premium_locked explicitly — see the service's TODO on the auth-cookie
 * gap) and its comments (keyed by the article's _id, not its slug — a
 * real quirk of this backend's comment endpoint).
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "premium_locked") {
    return (
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
        <PremiumGate />
      </div>
    );
  }

  const { article } = result;
  const comments = await getCommentsByArticle(article._id);
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://provatbarta.com"}/article/${article.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
      <div className="mb-4 sm:mb-6">
        <Breadcrumb
          items={
            article.category
              ? [{ label: article.category.name }, { label: article.title }]
              : [{ label: article.title }]
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-8 lg:col-span-2">
          <ArticleHeader article={article} />
          <ArticleReadingArea article={article} url={articleUrl} />
          <CommentSection articleId={article._id} initialComments={comments} />
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:h-fit lg:self-start">
          <TrendingSidebar />
          {article.category && (
            <RelatedArticles
              categoryId={article.category._id}
              excludeArticleId={article._id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// import type { Metadata } from 'next'
// import { notFound } from 'next/navigation'

// import { Breadcrumb } from '@/components/layout/Breadcrumb'
// import { ArticleHeader } from '@/features/articles/components/ArticleHeader'
// import { ArticleReadingArea } from '@/features/articles/components/ArticleReadingArea'
// import { RelatedArticles } from '@/features/articles/components/RelatedArticles'
// import { PremiumGate } from '@/features/articles/components/PremiumGate'
// import { CommentSection } from '@/features/comments/components/CommentSection'
// import { TrendingSidebar } from '@/features/trending/components/TrendingSidebar'
// import { getArticleBySlug } from '@/features/articles/services/articles.service'
// import { getCommentsByArticle } from '@/features/comments/services/comments.service'
// import { getExcerpt } from '@/features/articles/utils/getExcerpt'

// interface ArticlePageProps {
//   params: Promise<{ slug: string }>
// }

// export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
//   const { slug } = await params
//   const result = await getArticleBySlug(slug)

//   if (result.status !== 'ok') {
//     return { title: 'সংবাদ পাওয়া যায়নি | প্রভাতবার্তা' }
//   }

//   const { article } = result
//   return {
//     title: `${article.title} | প্রভাতবার্তা`,
//     description: getExcerpt(article.content, 160),
//     openGraph: {
//       title: article.title,
//       description: getExcerpt(article.content, 160),
//       images: article.thumbnail ? [article.thumbnail.url] : [],
//     },
//   }
// }

// /**
//  * Async Server Component. Fetches the article (handling not_found/
//  * premium_locked explicitly — see the service's TODO on the auth-cookie
//  * gap) and its comments (keyed by the article's _id, not its slug — a
//  * real quirk of this backend's comment endpoint).
//  */
// export default async function ArticlePage({ params }: ArticlePageProps) {
//   const { slug } = await params
//   const result = await getArticleBySlug(slug)

//   if (result.status === 'not_found') {
//     notFound()
//   }

//   if (result.status === 'premium_locked') {
//     return (
//       <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
//         <PremiumGate />
//       </div>
//     )
//   }

//   const { article } = result
//   const comments = await getCommentsByArticle(article._id)
//   const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://provatbarta.com'}/article/${article.slug}`

//   return (
//     <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
//       <Breadcrumb
//         items={
//           article.category
//             ? [{ label: article.category.name }, { label: article.title }]
//             : [{ label: article.title }]
//         }
//       />

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <ArticleHeader article={article} />
//           <ArticleReadingArea article={article} url={articleUrl} />
//           <CommentSection articleId={article._id} initialComments={comments} />
//         </div>

//         <div className="flex flex-col gap-6">
//           <TrendingSidebar />
//           {article.category && (
//             <RelatedArticles categoryId={article.category._id} excludeArticleId={article._id} />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
