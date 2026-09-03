import ArticleEditForm from "@/features/articles/admin/ArticleEditForm";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;

  return <ArticleEditForm articleId={id} />;
}
