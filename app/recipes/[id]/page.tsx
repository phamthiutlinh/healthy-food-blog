import { notFound } from 'next/navigation';
import recipes from '@/lib/recipes.json';

export async function generateStaticParams() {
  return recipes.map((recipe: any) => ({
    id: recipe.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = recipes.find((r: any) => r.id.toString() === id);
  if (!recipe) return { title: 'Không tìm thấy' };
  return {
    title: `${recipe.title} — Nhà bếp của Lyn`,
    description: recipe.description,
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = recipes.find((r: any) => r.id.toString() === id);
  if (!recipe) notFound();

  const list = (items: string[]) => `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;

  return (
    <main className="mx-auto max-w-[1180px] px-[18px] py-[48px] md:px-[26px] md:py-[74px]">
      <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--color-fern-500)]">
        {recipe.category} · {recipe.prepTime + recipe.cookTime} phút
      </p>
      <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">
        {recipe.title}
      </h1>
      <p className="text-[19px] text-[#565a52]">{recipe.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="chip">{recipe.category}</span>
      </div>
      <img
        className="my-[30px] h-[280px] w-full object-cover md:h-[450px] rounded-md"
        src={recipe.image}
        alt={recipe.title}
      />
      <div className="grid grid-cols-2 bg-white md:grid-cols-4">
        <div className="border-r border-[#e7e5df] p-[18px] text-center">
          <b className="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">{recipe.prepTime}'</b>
          chuẩn bị
        </div>
        <div className="p-[18px] text-center md:border-r md:border-[#e7e5df]">
          <b className="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">{recipe.cookTime}'</b>
          nấu
        </div>
        <div className="border-r border-[#e7e5df] p-[18px] text-center">
          <b className="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">{recipe.servings}</b>
          khẩu phần
        </div>
        <div className="p-[18px] text-center">
          <b className="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">{recipe.calories}</b>
          kcal / phần
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_270px] md:gap-[68px]">
        <div className="[&_h2]:mt-10 [&_h2]:font-['Playfair_Display'] [&_h2]:text-[30px] [&_li]:mb-[10px]">
          <h2 className="!mt-0">Nguyên liệu bạn cần</h2>
          <p>Ưu tiên nguyên liệu tươi; bạn có thể thay thế linh hoạt nhưng nên giữ tỷ lệ tương tự để món vẫn cân bằng.</p>
          <ul>{recipe.ingredients.map((ing: string, i: number) => <li key={i}>{ing}</li>)}</ul>
          <h2>Hướng dẫn từng bước</h2>
          <ol>{recipe.steps.map((step: string, i: number) => <li key={i}><b>Bước {i + 1}: </b>{step}</li>)}</ol>
        </div>
        <aside className="h-max rounded-xl bg-[#e8dfd0] p-[25px] md:sticky md:top-24">
          <span className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--color-fern-500)]">Dinh dưỡng tham khảo</span>
          <p><b>{recipe.protein}g</b> protein<br /><b>{recipe.carbs}g</b> carbs<br /><b>{recipe.fat}g</b> chất béo</p>
          <p>Con số mang tính tham khảo và có thể thay đổi theo nguyên liệu bạn dùng.</p>
        </aside>
      </div>
    </main>
  );
}
