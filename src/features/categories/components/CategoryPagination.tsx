import Link from "next/link";

interface CategoryPaginationProps {
  slug: string;
  currentPage: number;
  totalPages: number;
}

export function CategoryPagination({
  slug,
  currentPage,
  totalPages,
}: CategoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`/category/${slug}?page=${currentPage - 1}`}
          className="rounded border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          ← আগের পাতা
        </Link>
      )}

      <span className="px-3 text-sm">
        পাতা {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={`/category/${slug}?page=${currentPage + 1}`}
          className="rounded border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          পরের পাতা →
        </Link>
      )}
    </div>
  );
}
