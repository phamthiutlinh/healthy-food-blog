'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Article, Recipe } from '../../lib/content';
import { ChatWidget } from './chatbot';
import { ContentCard, SectionHeader } from './ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const image = (value?: string) =>
  value === 'assets/images/articles/healthy-breakfast-editorial.jpeg'
    ? '/assets/images/articles/healthy-breakfast-editorial.jpeg'
    : value || '/assets/images/recipe-placeholder.svg';

const nav = [
  ['Trang chủ', '/'],
  ['Công thức', '/recipes'],
  ['Meal prep', '/meal-prep'],
  ['Góc sống khỏe', '/articles'],
  ['Về chúng mình', '/about'],
];

const chatWidgetEnabled = true; // Set to true to enable the chat widget on all pages. Can be toggled per page if needed.

export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center border-b border-[#eceae4] bg-[#faf9f6]/92 backdrop-blur-[12px] md:h-[105px]">
      <div className="relative mx-auto flex w-full items-center justify-between gap-2 px-[18px] md:px-[72px]">
        <Link
          className="inline-flex min-w-0 items-center gap-2 font-['Playfair_Display'] text-[16px] font-bold leading-none md:gap-2.5 md:text-[36px]"
          href="/"
          aria-label="Nhà bếp của Lyn - Trang chủ"
        >
          <img
            className="h-9 w-9 shrink-0 md:h-11 md:w-11"
            src="/assets/images/logo-lyn-kitchen.svg"
            alt=""
          />
          <span className="hidden whitespace-nowrap xl:block">
            Nhà bếp <span className="text-[#78966c]">của Lyn</span>
          </span>
        </Link>

        {/* Mobile backdrop overlay */}
        <div
          className={`fixed inset-0 top-[68px] z-10 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* Navigation Menu */}
        <nav
          id="mobile-menu"
          className={`fixed left-0 right-0 top-[68px] z-20 flex max-h-[calc(100vh-68px)] flex-col gap-1 border-b border-[#e7e5df] bg-[#faf9f6]/98 px-5 py-5 text-[15px] font-semibold shadow-[0_12px_32px_rgba(47,52,45,.14)] backdrop-blur-lg transition-all duration-300 ease-out md:static md:flex md:max-h-none md:flex-row md:gap-[40px] md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-[17px] md:shadow-none md:translate-y-0 md:opacity-100 md:pointer-events-auto ${
            open
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : '-translate-y-4 opacity-0 pointer-events-none md:pointer-events-auto'
          }`}
        >
          {nav.map(([label, href], index) => {
            const isActive = active === href;
            return (
              <Link
                key={href}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-200 hover:bg-[#78966c]/10 active:scale-[0.99] md:rounded-none md:px-0 md:py-0 md:hover:bg-transparent ${
                  isActive
                    ? 'bg-[#78966c]/15 text-[#547748] font-bold md:bg-transparent md:text-[#78966c]'
                    : 'text-[#2f342d]'
                } ${
                  open
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-3 opacity-0 md:translate-x-0 md:opacity-100'
                }`}
                style={{
                  transitionDelay: open ? `${index * 40 + 40}ms` : '0ms',
                }}
                href={href}
                onClick={() => setOpen(false)}
              >
                <span>{label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#547748] md:hidden" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Animated Hamburger / Close Button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#2f342d] transition-all duration-200 hover:bg-[#78966c]/10 active:scale-90 md:hidden"
          type="button"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <div className="relative flex h-[18px] w-[22px] flex-col justify-between">
            {/* Top Bar */}
            <span
              className={`h-[2.5px] w-full rounded-full transition-all duration-300 ease-in-out origin-center ${
                open ? 'translate-y-[7.75px] rotate-45 bg-[#5d874f]' : 'bg-[#2f342d]'
              }`}
            />
            {/* Middle Bar */}
            <span
              className={`h-[2.5px] w-full rounded-full transition-all duration-200 ease-in-out ${
                open ? 'scale-x-0 opacity-0 bg-[#5d874f]' : 'scale-x-100 opacity-100 bg-[#2f342d]'
              }`}
            />
            {/* Bottom Bar */}
            <span
              className={`h-[2.5px] w-full rounded-full transition-all duration-300 ease-in-out origin-center ${
                open ? '-translate-y-[7.75px] -rotate-45 bg-[#5d874f]' : 'bg-[#2f342d]'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-[70px] border-t border-[#e7e5df] py-[42px] text-[13px] text-[#74776f]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-[18px] md:flex-row md:justify-between md:px-[26px]">
        <span className="inline-flex items-center gap-2.5 font-['Playfair_Display'] text-[24px] font-bold leading-none text-[#2f342d]">
          <img className="h-10 w-10" src="/assets/images/logo-lyn-kitchen.svg" alt="" />
          Nhà bếp <span className="text-[#78966c]">của Lyn</span>
        </span>
        <span>© 2026 · Ăn uống lành mạnh theo cách của bạn.</span>
      </div>
    </footer>
  );
}
export function Shell({
  children,
  active,
  page,
}: {
  children: React.ReactNode;
  active?: string;
  page: string;
}) {
  return (
    <div
      data-page={page}
      className="bg-[#faf9f6] font-['Be_Vietnam_Pro'] text-[15px] leading-[1.65] text-[#2f342d]"
    >
      <Header active={active} />
      {children}
      <Footer />
      <ScrollToTop />
      {chatWidgetEnabled && <ChatWidget />}
    </div>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <ContentCard
      href={`/recipe-detail/${recipe.slug}`}
      image={image(recipe.image)}
      title={recipe.title}
      category={recipe.category}
      description={recipe.description}
      meta={
        <>
          <span>⏱ {recipe.prepTime + recipe.cookTime} phút</span>
          <span>🔥 {recipe.calories} kcal</span>
        </>
      }
    />
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <ContentCard
      href={`/article-detail/${article.slug}`}
      image={image(article.image)}
      title={article.title}
      category={article.category}
      description={article.excerpt}
      meta={
        <>
          <span>📅 {article.date}</span>
          <span>📖 {article.readTime}</span>
        </>
      }
    />
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="mx-auto max-w-[1180px] px-[18px] py-5 md:px-[26px] md:py-10">
      <div className="rounded-2xl bg-gradient-to-br from-[#30372e] to-[#394535] p-[28px] text-center shadow-[0_8px_32px_rgba(47,52,45,0.18)] md:p-[40px]">
        <p className="eyebrow mb-3 border-[#a5c49a]/25 bg-[#a5c49a]/[0.12] text-[#a5c49a]">
          📬 Bản tin hàng tuần
        </p>
        <h2 className="mb-2 font-['Playfair_Display'] text-[24px] text-white">
          Nhận cảm hứng nấu ăn mỗi tuần
        </h2>
        <p className="mb-5 text-[14px] text-[#c5c9c1]">
          Công thức mới, mẹo meal prep và câu chuyện bếp núc — thẳng vào hộp thư của bạn.
        </p>
        {submitted ? (
          <p className="mx-auto max-w-[480px] rounded-full bg-[#78966c] px-[18px] py-[12px] font-semibold text-white">
            Cảm ơn bạn! Hẹn gặp bạn trong bản tin sắp tới. 🌿
          </p>
        ) : (
          <form
            className="mx-auto flex max-w-[480px] flex-col gap-2.5 md:flex-row md:gap-0"
            onSubmit={handleSubmit}
          >
            <input
              className="w-full flex-1 rounded-full border border-white/20 bg-white/10 px-[18px] py-[12px] text-white outline-none placeholder:text-white/50 focus:bg-white/15 md:rounded-r-none"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="Email của bạn"
              aria-label="Email của bạn"
            />
            <button
              className="btn-primary inline-flex w-full justify-center rounded-full bg-[#7f9f71] px-[21px] py-[12px] font-semibold text-white transition hover:-translate-y-px hover:bg-[#6e8f62] md:w-auto md:rounded-l-none"
              type="submit"
            >
              Nhận bản tin
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <section className="py-[48px] pb-[30px] text-center md:py-[74px] md:pb-[50px]">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">
        {title}
      </h1>
      <p className="mx-auto my-[15px] max-w-[600px] text-[#74776f]">{description}</p>
    </section>
  );
}

export function HomePage({ recipes, articles }: { recipes: Recipe[]; articles: Article[] }) {
  const latest = [...articles]
    .sort((a, b) =>
      b.date.split('.').reverse().join('').localeCompare(a.date.split('.').reverse().join(''))
    )
    .slice(0, 6);
  return (
    <Shell page="home" active="/">
      <section className="pt-0 pb-3 md:pb-10">
        <div className="relative flex min-h-[520px] items-end overflow-hidden px-[20px] pb-[28px] pt-[160px] isolate before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-[#f2f0df]/85 before:via-[#f5f2e6]/92 before:to-[#f5f2e6]/96 md:aspect-[1.83] md:min-h-0 md:items-center md:px-[96px] md:py-[72px] md:before:bg-gradient-to-r md:before:from-[#f2f0df]/96 md:before:via-[#f5f2e6]/68 md:before:to-[#f5f2e6]/0">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            src="/assets/videos/banner.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="max-w-[630px]">
            <p className="eyebrow">🌿 &nbsp;Ăn ngon · sống cân bằng</p>
            <h1 className="mt-4 font-['Playfair_Display'] text-[clamp(40px,9vw,64px)] leading-[1.02] md:text-[clamp(48px,5.2vw,84px)]">
              Ăn lành,
              <br />
              <em className="font-normal text-[#638957]">sống chất,</em>
              <br />
              yêu bản thân.
            </h1>
            <p className="my-6 max-w-[510px] text-[15px] text-[#3f463d] md:text-[20px]">
              Những công thức đơn giản, meal prep tiện lợi và thói quen sống khỏe mỗi ngày – để bạn
              luôn tràn đầy <strong className="text-[#638957]">năng lượng</strong> và{' '}
              <strong className="text-[#638957]">hạnh phúc.</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="btn-primary inline-flex rounded-full bg-[#5d874f] px-[24px] py-[14px] font-semibold text-white"
                href="/recipes"
              >
                Khám phá công thức →
              </Link>
              <Link
                className="inline-flex rounded-full bg-white px-[24px] py-[14px] font-semibold text-[#465144] shadow-[0_7px_18px_rgba(47,52,45,.15)]"
                href="/meal-prep"
              >
                Lên thực đơn tuần
              </Link>
            </div>
            <p className="mt-5 max-w-[490px] pl-1 text-[13px] leading-[1.7] text-[#5b6653] md:mt-[31px] md:text-[17px] md:text-[#75816e]">
              🌿 &nbsp;Ăn uống lành mạnh không phải là ép buộc,
              <br className="hidden md:block" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mà là lựa chọn{' '}
              <em className="font-['Playfair_Display'] text-[19px] not-italic text-[#638957] md:text-[21px]">
                yêu thương
              </em>{' '}
              chính mình mỗi ngày.
            </p>
          </div>
        </div>
      </section>
      <ListingSection
        eyebrow="🍳 Bắt đầu từ căn bếp"
        title={
          <>
            Món ngon, <span className="text-highlight">không cầu kỳ</span>
          </>
        }
        href="/recipes"
      >
        <>
          {recipes
            .filter((r) => r.featured)
            .slice(0, 3)
            .map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
        </>
      </ListingSection>
      <section className="bg-[#e8dfd0] py-[52px] md:py-[76px]">
        <div className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
          <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(47,52,45,0.10)] md:grid-cols-[1fr_1.1fr]">
            <div className="p-[38px] md:p-[60px]">
              <p className="eyebrow">📅 Gợi ý trong tuần</p>
              <h2 className="mt-3 font-['Playfair_Display'] text-[clamp(30px,4vw,48px)]">
                Chuẩn bị trước, <span className="text-highlight">thảnh thơi hơn.</span>
              </h2>
              <p className="mt-4">
                Thực đơn 5 ngày với nguyên liệu quen thuộc và cách phối linh hoạt. Dành ít thời gian
                hơn trong bếp, nhiều thời gian hơn cho bạn.
              </p>
              <Link
                className="btn-primary mt-2 inline-flex rounded-full bg-[#78966c] px-[21px] py-[13px] font-semibold text-white"
                href="/meal-prep"
              >
                Xem thực đơn →
              </Link>
            </div>
            <img
              className="order-first h-[260px] w-full object-cover md:order-none md:h-full"
              src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=70"
              alt="Rau củ meal prep"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
      <ListingSection
        eyebrow="📝 Góc sống khỏe"
        title={
          <>
            Đọc chậm <span className="text-highlight">một chút</span>
          </>
        }
        href="/articles"
      >
        {latest.slice(0, 6).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </ListingSection>
      <NewsletterSection />
    </Shell>
  );
}
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-[18px] bottom-[18px] z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#5d874f] text-white shadow-[0_8px_20px_rgba(47,52,45,.28)] transition hover:-translate-y-px hover:bg-[#6e8f62] md:right-[26px] md:bottom-[26px] md:h-12 md:w-12 ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

function ListingSection({
  eyebrow,
  title,
  href,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-5 md:px-8 md:py-10">
      <SectionHeader eyebrow={eyebrow} title={title} href={href} />
      <div className="grid gap-[22px] md:grid-cols-3">{children}</div>
    </section>
  );
}

export function RecipesPage({ recipes }: { recipes: Recipe[] }) {
  const [q, setQ] = useState(''),
    [category, setCategory] = useState('all'),
    [sort, setSort] = useState('default');
  const visible = useMemo(
    () =>
      recipes
        .filter(
          (r) =>
            (category === 'all' || r.category === category) &&
            (r.title.toLowerCase().includes(q.toLowerCase()) ||
              r.description.toLowerCase().includes(q.toLowerCase()))
        )
        .sort((a, b) =>
          sort === 'time'
            ? a.prepTime + a.cookTime - b.prepTime - b.cookTime
            : sort === 'calories'
              ? a.calories - b.calories
              : 0
        ),
    [recipes, q, category, sort]
  );
  return (
    <Shell page="recipesPage" active="/recipes">
      <main className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
        <PageIntro
          eyebrow="🥗 Công thức healthy"
          title={
            <>
              Dễ làm, <span className="text-highlight">đủ đầy</span>, ngon lành
            </>
          }
          description="Những công thức vừa vặn với nhịp sống bận rộn của bạn."
        />
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-[220px] flex-1 rounded-xl border border-[#e7e5df] bg-white px-[15px] py-3 shadow-sm"
            placeholder="Tìm tên món ăn..."
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Tất cả bữa ăn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bữa ăn</SelectItem>
              {['Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Ăn nhẹ'].map((x) => (
                <SelectItem key={x} value={x}>
                  {x}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="min-w-[220px]">
              <SelectValue placeholder="Sắp xếp mặc định" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sắp xếp mặc định</SelectItem>
              <SelectItem value="time">Thời gian nhanh nhất</SelectItem>
              <SelectItem value="calories">Ít calories nhất</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-[13px] text-[#74776f]">{visible.length} công thức</span>
        </div>
        <div className="grid gap-[22px] md:grid-cols-3">
          {visible.length ? (
            visible.map((r) => <RecipeCard key={r.id} recipe={r} />)
          ) : (
            <p className="col-span-full py-8 text-center text-[#74776f]">
              Chưa tìm thấy món phù hợp.
            </p>
          )}
        </div>
      </main>
    </Shell>
  );
}

export function ArticlesPage({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState('Tất cả');
  const filters = ['Tất cả', ...new Set(articles.map((a) => a.category))];
  const visible = active === 'Tất cả' ? articles : articles.filter((a) => a.category === active);
  return (
    <Shell page="articlesPage" active="/articles">
      <main className="mx-auto max-w-[1180px] px-[18px] md:px-[26px]">
        <PageIntro
          eyebrow="Góc sống khỏe"
          title="Những điều nuôi dưỡng bạn"
          description="Ghi chép nhỏ về dinh dưỡng, nhịp sống và sự cân bằng."
        />
        <section className="mb-8 rounded-2xl border border-[#dfe8dc] bg-[#f1f6ef] p-5 md:flex md:items-center md:justify-between md:p-7">
          <div>
            <p className="eyebrow">Thư viện mới</p>
            <h2 className="mt-3 font-['Playfair_Display'] text-[28px]">
              Gợi ý nhỏ cho một nhịp sống dễ chịu
            </h2>
            <p className="mt-2 text-sm text-[#565a52]">
              {visible.length} bài viết để bạn đọc chậm, lưu lại và áp dụng theo cách riêng.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-0">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${active === f ? 'border-[#4f7d56] bg-[#4f7d56] text-white' : 'border-[#cfd9cb] bg-white text-[#4f7d56]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>
        <div className="grid gap-[22px] md:grid-cols-3">
          {visible.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </main>
    </Shell>
  );
}

export function AboutPage() {
  return (
    <Shell page="about" active="/about">
      <main>
        <div className="mx-auto max-w-[1180px] px-[18px] py-[48px] text-center md:py-[74px]">
          <p className="eyebrow">🌿 Một căn bếp đủ chậm</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-[clamp(42px,6vw,76px)]">
            Ăn tốt hơn, sống trọn vẹn hơn.
          </h1>
        </div>
        <section className="mx-auto grid max-w-[1180px] items-center gap-[70px] px-[18px] md:grid-cols-2 md:px-[26px]">
          <img
            className="h-[480px] w-full rounded-2xl object-cover"
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=70"
            alt="Bàn ăn đầy rau củ"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="eyebrow">📜 Câu chuyện của chúng mình</p>
            <h2 className="mt-4 font-['Playfair_Display'] text-[30px]">
              Không cần hoàn hảo để bắt đầu.
            </h2>
            <p className="mt-4">
              Nhà bếp của Lyn được tạo ra cho những người muốn chăm sóc cơ thể nhưng không muốn áp
              lực bởi những quy tắc cứng nhắc.
            </p>
            <p className="mt-4">
              Từ công thức đơn giản, danh sách mua sắm đến meal prep từng tuần, mọi nội dung ở đây
              đều hướng đến một mục tiêu: giúp việc ăn lành mạnh trở nên dễ chịu và thực tế hơn.
            </p>
            <h2 className="mt-[42px] font-['Playfair_Display'] text-[30px]">
              Điều chúng mình hướng tới
            </h2>
            <p className="mt-4">
              Một không gian nhỏ, ấm áp để bạn tìm được cảm hứng cho căn bếp và nhịp sống của riêng
              mình.
            </p>
          </div>
        </section>
      </main>
    </Shell>
  );
}
