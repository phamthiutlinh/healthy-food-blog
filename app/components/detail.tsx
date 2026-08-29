'use client';
import { useRouter } from 'next/navigation';
import type { Article, Recipe } from '../../lib/content';
import { Shell } from './site';
const img = (v?: string) => v || '/assets/images/recipe-placeholder.svg';
const defaultTags: Record<string, string[]> = {
  'Bữa sáng': ['Bữa sáng lành mạnh', 'Năng lượng bền vững'],
  'Bữa trưa': ['Bữa trưa cân bằng', 'Phù hợp mang đi'],
  'Bữa tối': ['Bữa tối đủ đầy', 'Dễ nấu tại nhà'],
  'Ăn nhẹ': ['Ăn nhẹ lành mạnh', 'Nhanh gọn'],
};
export function DetailPage({ item, type }: { item: Recipe | Article; type: 'recipe' | 'article' }) {
  const router = useRouter();
  const recipe = type === 'recipe' ? (item as Recipe) : null;
  const article = type === 'article' ? (item as Article) : null;
  return (
    <Shell page={`${type}Detail`} active={type === 'recipe' ? '/recipes' : '/articles'}>
      <main className="mx-auto max-w-[1180px] px-4 py-5 md:px-8 md:py-10">
        <div className="mx-auto mb-6 max-w-[820px]">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#e7e5df] bg-white px-4 py-2 text-sm font-semibold shadow-sm"
          >
            ← <span>Quay lại</span>
          </button>
        </div>
        <article className="mx-auto max-w-[820px] [&>p]:mt-5 [&_h2]:mt-[42px] [&_h2]:font-['Playfair_Display'] [&_h2]:text-[30px]">
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--color-fern-500)]">
            {item.category} ·{' '}
            {recipe
              ? `${recipe.difficulty || 'Dễ làm'} · ${recipe.prepTime + recipe.cookTime} phút`
              : `${article?.readTime} · ${article?.date}`}
          </p>
          <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">
            {item.title}
          </h1>
          <p className="text-[19px] text-[#565a52]">
            {recipe ? recipe.description : article?.excerpt}
          </p>
          {recipe ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {(recipe.tags || defaultTags[recipe.category] || []).map((tag: string) => (
                <span className="chip" key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
          <img
            className="my-[30px] h-[280px] w-full rounded-md object-cover md:h-[450px]"
            src={img(item.image)}
            alt={item.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/assets/images/recipe-placeholder.svg';
            }}
          />
          {recipe ? (
            <div className="my-[30px] grid grid-cols-2 bg-white md:grid-cols-4">
              <Stat value={`${recipe.prepTime}'`} label="chuẩn bị" />
              <Stat value={`${recipe.cookTime}'`} label="nấu" />
              <Stat value={recipe.servings} label="khẩu phần" />
              <Stat value={recipe.calories} label="kcal / phần" />
            </div>
          ) : null}
          {recipe ? <RecipeBody recipe={recipe} /> : <ArticleBody article={article!} />}
        </article>
      </main>
    </Shell>
  );
}
function RecipeBody({ recipe }: { recipe: Recipe }) {
  const profile: Record<string, any> = {
    'Bữa sáng': {
      tags: ['Bữa sáng lành mạnh', 'Năng lượng bền vững'],
      why: ['Dễ chuẩn bị với các nguyên liệu gần gũi trong căn bếp.', `Mỗi phần có ${recipe.protein}g protein, giúp bạn no lâu hơn vào buổi sáng.`, 'Có thể chuẩn bị trước để buổi sáng bận rộn vẫn ăn uống tử tế.'],
      variations: ['Đổi trái cây hoặc rau củ theo mùa để món ăn luôn mới mẻ.', 'Điều chỉnh lượng gia vị hoặc topping theo khẩu vị của bạn.'],
      serving: 'Dùng ngay khi còn ấm hoặc ăn cùng trái cây tươi và một ly nước.',
      tips: ['Chuẩn bị sẵn nguyên liệu từ tối hôm trước.', 'Nêm nếm vừa phải để giữ vị tự nhiên.'],
      faqs: [['Có thể làm trước không?', 'Có. Chia thành từng phần, làm nguội hẳn và giữ trong hộp kín.'], ['Có thể thay nguyên liệu không?', 'Có. Chọn nguyên liệu cùng nhóm và điều chỉnh gia vị.']],
    },
    'Bữa trưa': { tags: ['Bữa trưa cân bằng', 'Phù hợp mang đi'], why: ['Kết hợp rau củ, tinh bột và protein trong một phần ăn cân bằng.', `Với ${recipe.calories} kcal mỗi phần, món ăn đủ năng lượng.`, 'Dễ chia hộp để mang đi.'], variations: ['Thay rau bằng nguyên liệu theo mùa.', 'Dùng cơm gạo lứt, quinoa hoặc khoai lang.'], serving: 'Chia món thành từng hộp; để sốt hoặc topping riêng.', tips: ['Để nguyên liệu nóng nguội trước khi đóng hộp.', 'Nếm lại sốt sau khi bảo quản.'], faqs: [['Có thể meal prep bao lâu?', 'Ngon nhất trong 2–3 ngày khi bảo quản lạnh.'], ['Hâm nóng thế nào?', 'Chỉ hâm cơm hoặc protein; thêm rau và sốt sau.']] },
    'Bữa tối': { tags: ['Bữa tối đủ đầy', 'Dễ nấu tại nhà'], why: ['Hương vị ấm áp, dễ ăn và phù hợp cho bữa tối.', `Cung cấp ${recipe.protein}g protein mỗi phần.`, 'Các bước rõ ràng, không cần kỹ thuật phức tạp.'], variations: ['Thay rau bằng loại có sẵn.', 'Tăng giảm tinh bột theo mức vận động.'], serving: 'Dùng nóng cùng rau xanh hoặc salad.', tips: ['Cắt sẵn nguyên liệu trước khi bật bếp.', 'Nấu vừa chín để rau còn độ giòn.'], faqs: [['Có thể nấu trước không?', 'Có. Để nguội rồi bảo quản hộp kín.'], ['Làm sao để món không khô?', 'Không hâm quá lâu; thêm nước hoặc sốt khi cần.']] },
    'Ăn nhẹ': { tags: ['Ăn nhẹ lành mạnh', 'Nhanh gọn'], why: ['Gọn nhẹ, phù hợp giữa hai bữa hoặc sau vận động.', 'Nguyên liệu đơn giản, dễ mang theo.', `Mỗi phần khoảng ${recipe.calories} kcal.`], variations: ['Đổi hạt, trái cây hoặc topping.', 'Dùng trái cây chín tự nhiên thay đường.'], serving: 'Dùng giữa buổi cùng trà, cà phê hoặc sữa chua.', tips: ['Chia sẵn thành phần nhỏ.', 'Ưu tiên hộp kín để giữ độ tươi.'], faqs: [['Có thể mang đi không?', 'Có. Chọn hộp kín hoặc túi giữ lạnh.'], ['Có thể thay topping không?', 'Có, nhưng nên giữ khẩu phần vừa phải.']] },
  }[recipe.category] || {};
  const d = {
    tags: recipe.tags || profile.tags || [],
    intro: recipe.intro || `${recipe.title} là một lựa chọn ${String(recipe.category || '').toLowerCase()} tươi ngon, được xây dựng từ ${(recipe.ingredients || []).slice(0, 2).join(' và ').toLowerCase()}. ${recipe.description}`,
    why: recipe.whyItWorks || profile.why || [], variations: recipe.variations || profile.variations || [],
    serving: recipe.servingSuggestions || profile.serving || 'Dùng ngay sau khi hoàn thành.',
    tips: recipe.tips || profile.tips || [], faqs: recipe.faqs || profile.faqs || [],
    storage: recipe.storage || 'Để nguội hoàn toàn trước khi cất hộp kín. Bảo quản ngăn mát 2–3 ngày.',
    notes: recipe.notes || 'Chuẩn bị sẵn nguyên liệu và nêm nếm từng chút một. Điều này giúp bạn dễ kiểm soát cả hương vị lẫn độ chín của món.',
  };
  const list = (items: string[]) => <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>;
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:items-start">
      <div className="article-prose">
      <h2 className="!mt-0">Về món này</h2><p>{d.intro}</p>
      <h2>Vì sao bạn sẽ thích</h2>{list(d.why)}
      <h2>Nguyên liệu bạn cần</h2>
      <p>Ưu tiên nguyên liệu tươi; bạn có thể thay thế linh hoạt nhưng nên giữ tỷ lệ tương tự.</p>
      {list(recipe.ingredients || [])}
      <h2>Hướng dẫn từng bước</h2>
      <ol>{(recipe.steps || []).map((x: string, i: number) => <li key={x}><b>Bước {i + 1}: </b>{x}</li>)}</ol>
      <h2>Biến tấu theo ý thích</h2>{list(d.variations)}
      <h2>Gợi ý dùng món</h2><p>{d.serving}</p>
      <h2>Mẹo để món ngon hơn</h2>{list(d.tips)}
      <h2>Meal prep, bảo quản & hâm nóng</h2>{list(recipe.mealPrepTips || [])}<p>{d.storage}</p>
      <div className="mt-8 rounded-xl bg-[#f1f4ed] p-5"><b className="text-[var(--color-fern-600)]">Lưu ý từ Lyn</b><p className="mt-2">{d.notes}</p></div>
      <h2>Câu hỏi thường gặp</h2>{d.faqs.map(([q, a]: [string, string]) => <details key={q} className="mb-3 rounded-lg border border-[#e7e5df] bg-white px-4 py-3"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-[#565a52]">{a}</p></details>)}
      </div>
      <aside className="rounded-xl border border-[#d8c9a8] bg-[#e8dfd0] p-5 md:sticky md:top-24">
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--color-fern-500)]">Dinh dưỡng tham khảo</span>
        <dl className="mt-3 divide-y divide-[#d8c9a8]/70 text-[14px] leading-[1.45]">
          <div className="flex items-baseline justify-between gap-3 py-[6px]">
            <dt className="text-[#565a52]">Protein</dt>
            <dd><b className="font-semibold text-[#2f342d]">{recipe.protein}g</b></dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-[6px]">
            <dt className="text-[#565a52]">Carbs</dt>
            <dd><b className="font-semibold text-[#2f342d]">{recipe.carbs}g</b></dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-[6px]">
            <dt className="text-[#565a52]">Chất béo</dt>
            <dd><b className="font-semibold text-[#2f342d]">{recipe.fat}g</b></dd>
          </div>
        </dl>
        <p className="mt-3 text-[12px] leading-[1.5] text-[#74776f]">Con số mang tính tham khảo và có thể thay đổi theo nguyên liệu bạn dùng.</p>
      </aside>
    </div>
  );
}
function Stat({ value, label }: { value: string | number; label: string }) { return <div className="border-r border-[#e7e5df] p-[18px] text-center"><b className="block font-['Playfair_Display'] text-[24px] text-[var(--color-fern-500)]">{value}</b>{label}</div>; }
function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="article-prose">
      <p className="article-lead">{article.intro || article.content}</p>
      {(article.sections || []).map((s: any) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
          {s.tips?.length ? (
            <ul className="mt-4 space-y-2 rounded-xl bg-[#f1f4ed] p-5">
              {s.tips.map((x: string) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      <aside className="my-9 rounded-2xl border border-[#d5e2d2] bg-[#f1f6ef] p-6">
        <p className="eyebrow">Ghi nhớ</p>
        <p className="mt-3 text-[17px] font-semibold text-[#3b5e41]">
          {article.takeaway || 'Bắt đầu bằng một thay đổi vừa sức và lặp lại theo nhịp của bạn.'}
        </p>
      </aside>
      {article.video ? (
        <section className="my-10 overflow-hidden rounded-2xl border border-[#e7e5df] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2 px-2 pt-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0e4] text-sm">▶</span>
            <div>
              <p className="text-sm font-bold">Xem thêm bằng video</p>
              <p className="text-xs text-[#74776f]">Một góc cảm hứng để cùng vào bếp</p>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-xl bg-[#e8dfd0]">
            <iframe
              className="h-full w-full border-0"
              src={article.video}
              title={`Video về ${article.title}`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}
      <h2>Điều quan trọng là sự đều đặn</h2><p>Hãy bắt đầu bằng lựa chọn vừa sức với lịch sống của bạn. Một bữa ăn được chuẩn bị sẵn, một chai nước trên bàn làm việc hoặc 10 phút đi bộ cũng là những bước nhỏ đáng giá.</p>
    </div>
  );
}
