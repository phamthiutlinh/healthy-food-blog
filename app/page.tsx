import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import ArticleCard from '@/components/ArticleCard';
import recipes from '@/lib/recipes.json';
import articles from '@/lib/articles.json';

export default function HomePage() {
  const featuredRecipes = recipes.filter((r: any) => r.featured).slice(0, 3);
  const latestArticles = [...articles]
    .sort((a: any, b: any) => {
      const [dayA, monthA, yearA] = (a.date || '00.00.0000').split('.').map(Number);
      const [dayB, monthB, yearB] = (b.date || '00.00.0000').split('.').map(Number);
      return Date.UTC(yearB, monthB - 1, dayB) - Date.UTC(yearA, monthA - 1, dayA);
    })
    .slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-0 pb-3 md:pb-10">
        <div className="relative flex min-h-[520px] items-end overflow-hidden px-[20px] pb-[28px] pt-[160px] text-[#293329] isolate before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-[#f2f0df]/85 before:via-[#f5f2e6]/92 before:to-[#f5f2e6]/96 md:aspect-[1.83] md:min-h-0 md:max-h-[866px] md:items-center md:px-[96px] md:py-[72px] md:before:bg-gradient-to-r md:before:from-[#f2f0df]/96 md:before:via-[#f5f2e6]/68 md:before:to-[#f5f2e6]/0">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            src="/assets/videos/banner.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="max-w-[630px] md:-mt-2">
            <p className="eyebrow">🌿 &nbsp;Ăn ngon · sống cân bằng</p>
            <h1 className="mt-4 font-['Playfair_Display'] text-[clamp(40px,9vw,64px)] leading-[1.02] tracking-[-.03em] md:mt-5 md:text-[clamp(48px,5.2vw,84px)] md:leading-[.98] md:tracking-[-.04em]">
              Ăn lành,<br />
              <em className="font-normal text-[#638957]">sống chất,</em><br />
              yêu bản thân.
            </h1>
            <p className="mt-4 mb-6 max-w-[510px] text-[15px] leading-[1.65] text-[#3f463d] md:my-[25px] md:mb-[34px] md:text-[20px] md:text-[#4c5349]">
              Những công thức đơn giản, meal prep tiện lợi và thói quen sống khỏe mỗi ngày –<br className="hidden md:block" />
              để bạn luôn tràn đầy <strong className="font-semibold text-[#638957]">năng lượng</strong> và <strong className="font-semibold text-[#638957]">hạnh phúc.</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary inline-flex items-center rounded-full bg-[#5d874f] px-[24px] py-[14px] text-[15px] font-semibold text-white shadow-[0_7px_15px_rgba(64,101,54,.18)] transition hover:-translate-y-px hover:bg-[#4c7541] md:px-[27px] md:py-[16px] md:text-[16px]" href="/recipes">
                Khám phá công thức →
              </Link>
              <Link className="inline-flex items-center rounded-full bg-white px-[24px] py-[14px] text-[15px] font-semibold text-[#465144] shadow-[0_7px_18px_rgba(47,52,45,.15)] transition hover:-translate-y-px hover:bg-[#fdfdfb] md:px-[30px] md:py-[16px] md:text-[16px]" href="/meal-prep">
                Lên thực đơn tuần
              </Link>
            </div>
            <p className="mt-5 max-w-[490px] pl-1 text-[13px] leading-[1.7] text-[#5b6653] md:mt-[31px] md:text-[17px] md:text-[#75816e]">
              🌿 &nbsp; Ăn uống lành mạnh không phải là ép buộc,<br className="hidden md:block" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mà là lựa chọn <em className="font-['Playfair_Display'] text-[19px] not-italic text-[#638957] md:text-[21px]">yêu thương</em> chính mình mỗi ngày.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="mx-auto max-w-[1180px] px-4 py-5 md:px-8 md:py-10">
        <div className="mb-[30px] flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">🍳 Bắt đầu từ căn bếp</p>
            <h2 className="font-['Playfair_Display'] text-[clamp(30px,4vw,48px)] leading-[1.12] mt-3">
              Món ngon, <span className="text-highlight">không cầu kỳ</span>
            </h2>
          </div>
          <Link className="whitespace-nowrap font-bold text-[#78966c] hover:text-[#526b49] transition-colors" href="/recipes">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-[22px] md:grid-cols-3">
          {featuredRecipes.map((recipe: any) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Meal Prep CTA */}
      <section className="bg-[#e8dfd0] py-[52px] md:py-[76px]">
        <div className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
          <div className="grid bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(47,52,45,0.10)] md:grid-cols-[1fr_1.1fr]">
            <div className="px-[25px] py-[38px] md:p-[60px]">
              <p className="eyebrow">📅 Gợi ý trong tuần</p>
              <h2 className="font-['Playfair_Display'] text-[clamp(30px,4vw,48px)] leading-[1.12] mt-3">
                Chuẩn bị trước, <span className="text-highlight">thảnh thơi hơn.</span>
              </h2>
              <p className="mt-4">
                Thực đơn 5 ngày với nguyên liệu quen thuộc và cách phối linh hoạt. Dành ít thời gian hơn trong bếp, nhiều thời gian hơn cho bạn.
              </p>
              <Link className="btn-primary mt-2 inline-flex items-center rounded-full bg-[#78966c] px-[21px] py-[13px] font-semibold text-white transition hover:-translate-y-px hover:bg-[#526b49]" href="/meal-prep">
                Xem thực đơn →
              </Link>
            </div>
            <img
              className="order-first h-[260px] w-full object-cover md:order-none md:h-full md:min-h-[340px]"
              src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1000&q=80"
              alt="Rau củ meal prep"
            />
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mx-auto max-w-[1180px] px-4 py-5 md:px-8 md:py-10">
        <div className="mb-[30px] flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">📝 Góc sống khỏe</p>
            <h2 className="font-['Playfair_Display'] text-[clamp(30px,4vw,48px)] leading-[1.12] mt-3">
              Đọc chậm <span className="text-highlight">một chút</span>
            </h2>
          </div>
          <Link className="whitespace-nowrap font-bold text-[#78966c] hover:text-[#526b49] transition-colors" href="/articles">
            Xem bài viết →
          </Link>
        </div>
        <div className="grid gap-[22px] md:grid-cols-3">
          {latestArticles.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
        <div className="rounded-2xl bg-gradient-to-br from-[#2f342d] to-[#3d4a39] p-[28px] text-center shadow-[0_8px_32px_rgba(47,52,45,0.18)] md:p-[40px]">
          <p className="eyebrow mb-3" style={{ color: '#a5c49a', background: 'rgba(165, 196, 154, 0.12)', borderColor: 'rgba(165, 196, 154, 0.25)' }}>
            📬 Bản tin hàng tuần
          </p>
          <h3 className="font-['Playfair_Display'] text-[24px] text-white mb-2">
            Nhận cảm hứng nấu ăn mỗi tuần
          </h3>
          <p className="text-[#c5c9c1] text-[14px] mb-5">
            Công thức mới, mẹo meal prep và câu chuyện bếp núc — thẳng vào hộp thư của bạn.
          </p>
          <form className="js-signup flex max-w-[480px] mx-auto flex-col gap-2.5 md:flex-row md:gap-0">
            <input
              className="w-full flex-1 rounded-full md:rounded-r-none bg-white/10 border border-white/20 px-[18px] py-[12px] text-white placeholder:text-white/50 outline-none focus:bg-white/15"
              type="email"
              required
              placeholder="Email của bạn"
            />
            <button
              className="btn-primary inline-flex w-full justify-center rounded-full md:w-auto md:rounded-l-none bg-[#78966c] px-[21px] py-[12px] font-semibold text-white transition hover:-translate-y-px hover:bg-[#5e7a55]"
              type="submit"
            >
              Nhận bản tin
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
