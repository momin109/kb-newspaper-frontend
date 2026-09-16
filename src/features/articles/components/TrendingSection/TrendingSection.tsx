import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  slug?: string;
  views?: number;
}

interface Props {
  articles: Article[];
}

export default function TrendingSection({ articles }: Props) {
  return (
    <aside className="w-full">
      <div className="border-b-2 border-red-600 mb-5">
        <h2 className="text-xl font-bold pb-2">ট্রেন্ডিং</h2>
      </div>

      <div className="space-y-4">
        {articles?.slice(0, 10).map((article, index) => (
          <Link
            key={article._id}
            href={`/article/${article.slug || article._id}`}
            className="flex gap-3 group"
          >
            <div
              className="
              w-8 h-8 
              flex items-center justify-center
              bg-red-600
              text-white
              font-bold
              rounded
            "
            >
              {index + 1}
            </div>

            <div>
              <h3
                className="
                text-sm
                font-semibold
                group-hover:text-red-600
                line-clamp-2
              "
              >
                {article.title}
              </h3>

              {article.views && (
                <p className="text-xs text-gray-500 mt-1">
                  {article.views} views
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
