import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="card">
      <Link href={`/articles/${article.id}`} className="block">
        <div className="overflow-hidden">
          <img
            className="h-[235px] w-full object-cover"
            src={article.image}
            loading="lazy"
            decoding="async"
            alt={article.title}
          />
        </div>
        <div className="p-5">
          <span className="chip">{article.category}</span>
          <h3 className="mt-[10px] mb-[8px] font-['Playfair_Display'] text-[22px] leading-[1.18] line-clamp-2">
            {article.title}
          </h3>
          <p className="text-[14px] text-[#565a52] line-clamp-2">{article.excerpt}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-[12px] gap-y-1 text-[12px] text-[#74776f] border-t border-[#f0ede8] pt-3">
            <span>📅 {article.date}</span>
            <span>📖 {article.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
