import { notFound } from 'next/navigation';
import articles from '@/lib/articles.json';

export async function generateStaticParams() {
  return articles.map((article: any) => ({
    id: article.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles.find((a: any) => a.id.toString() === id);
  if (!article) return { title: 'Không tìm thấy' };
  return {
    title: `${article.title} — Nhà bếp của Lyn`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles.find((a: any) => a.id.toString() === id);
  if (!article) notFound();

  const sections = article.sections || [{ heading: 'Gợi ý thực hành', body: article.intro || '', tips: [] }];
  const sectionMarkup = sections
    .map((section: any) => `
      <section>
        <h2>${section.heading}</h2>
        <p>${section.body}</p>
        ${section.tips?.length ? `<ul class="mt-4 space-y-2 rounded-xl bg-[#f1f4ed] p-5 text-[#42483f]">${section.tips.map((tip: string) => `<li class="flex gap-2"><span class="text-[#4f7d56]">✓</span><span>${tip}</span></li>`).join('')}</ul>` : ''}
      </section>
    `).join('');

  return (
    <main className="mx-auto max-w-[1180px] px-[18px] py-[48px] md:px-[26px] md:py-[74px]">
      <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--color-fern-500)]">
        {article.category} · {article.readTime} · {article.date}
      </p>
      <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12]">
        {article.title}
      </h1>
      <p className="text-[19px] text-[#565a52]">{article.excerpt}</p>
      <img
        className="my-[30px] h-[280px] w-full object-cover md:h-[450px] rounded-md"
        src={article.image}
        alt={article.title}
      />
      <div className="article-prose">
        <p className="article-lead">{article.intro}</p>
        {sectionMarkup}
        <aside className="my-9 rounded-2xl border border-[#d5e2d2] bg-[#f1f6ef] p-6">
          <p className="eyebrow">Ghi nhớ</p>
          <p className="mt-3 text-[17px] font-semibold text-[#3b5e41]">
            {article.takeaway || 'Bắt đầu bằng một thay đổi vừa sức và lặp lại theo nhịp của bạn.'}
          </p>
        </aside>
        <h2>Điều quan trọng là sự đều đặn</h2>
        <p>Hãy bắt đầu bằng lựa chọn vừa sức với lịch sống của bạn. Một bữa ăn được chuẩn bị sẵn, một chai nước trên bàn làm việc hoặc 10 phút đi bộ cũng là những bước nhỏ đáng giá.</p>
      </div>
    </main>
  );
}
