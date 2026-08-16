'use client';

import { useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import recipes from '@/lib/recipes.json';

export default function RecipesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');

  const categories = ['Tất cả bữa ăn', 'Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Ăn nhẹ'];

  let filtered = [...recipes] as any[];
  if (search) {
    filtered = filtered.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category !== 'all') {
    filtered = filtered.filter((r) => r.category === category);
  }
  if (sort === 'calories') {
    filtered.sort((a, b) => a.calories - b.calories);
  } else if (sort === 'time') {
    filtered.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
  }

  return (
    <main className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
      <section className="py-[48px] pb-[30px] text-center md:py-[74px] md:pb-[50px]">
        <p className="eyebrow">🥗 Công thức healthy</p>
        <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12] mt-4">
          Dễ làm, <span className="text-highlight">đủ đầy</span>, ngon lành
        </h1>
        <p className="mx-auto my-[15px] max-w-[600px] text-[#74776f]">
          Những công thức vừa vặn với nhịp sống bận rộn của bạn.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <input
          id="search"
          type="search"
          className="min-w-[220px] flex-1 rounded-xl border border-[#e7e5df] bg-white px-[15px] py-3 shadow-sm"
          placeholder="Tìm tên món ăn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="category"
          className="rounded-xl border border-[#e7e5df] bg-white p-3 shadow-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'Tất cả bữa ăn' ? 'all' : cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          id="sort"
          className="rounded-xl border border-[#e7e5df] bg-white p-3 shadow-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sắp xếp mặc định</option>
          <option value="time">Thời gian nhanh nhất</option>
          <option value="calories">Ít calories nhất</option>
        </select>
        <span id="result-count" className="ml-auto text-[13px] text-[#74776f]">
          {filtered.length} công thức
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="col-span-full py-8 text-center text-[#74776f]">
          Chưa tìm thấy món phù hợp.
        </p>
      ) : (
        <div className="grid gap-[22px] md:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </main>
  );
}
