'use client';

import { useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import articles from '@/lib/articles.json';

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const categories = ['Tất cả', ...new Set(articles.map((a: any) => a.category))];
  const filtered = activeFilter === 'Tất cả'
    ? articles
    : articles.filter((a: any) => a.category === activeFilter);

  return (
    <main className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
      <section className="py-[48px] pb-[30px] text-center md:py-[74px] md:pb-[50px]">
        <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#78966c] eyebrow">Góc sống khỏe</p>
        <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">
          Những điều nuôi dưỡng bạn
        </h1>
        <p className="mx-auto my-[15px] max-w-[600px] text-[#74776f]">
          Ghi chép nhỏ về dinh dưỡng, nhịp sống và sự cân bằng.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-[#dfe8dc] bg-[#f1f6ef] p-5 md:flex md:items-center md:justify-between md:p-7">
        <div>
          <p className="eyebrow">Thư viện mới</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-[28px] leading-tight">
            Gợi ý nhỏ cho một nhịp sống dễ chịu
          </h2>
          <p className="mt-2 text-sm text-[#565a52]">
            {filtered.length} bài viết để bạn đọc chậm, lưu lại và áp dụng theo cách riêng.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 md:mt-0">
          {categories.map((filter) => (
            <button
              key={filter}
              data-filter={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${
                activeFilter === filter
                  ? 'border-[#4f7d56] bg-[#4f7d56] text-white'
                  : 'border-[#cfd9cb] bg-white text-[#4f7d56] hover:border-[#4f7d56]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="col-span-full py-8 text-center text-[#74776f]">
          Chưa có bài viết trong mục này.
        </p>
      ) : (
        <div className="grid gap-[22px] md:grid-cols-3">
          {filtered.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
