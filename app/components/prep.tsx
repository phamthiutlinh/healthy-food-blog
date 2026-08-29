'use client';
import { useEffect, useRef, useState } from 'react';
import type { MealPlan } from '../../lib/content';
import { PageIntro, Shell } from './site';

function MealPlanPicker({
  plans,
  activeIndex,
  onChange,
}: {
  plans: MealPlan[];
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const lastScrollIndex = useRef<number | null>(null);
  const isScrolling = useRef(false);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    const updateFromScroll = () => {
      const cards = [...picker.querySelectorAll<HTMLElement>('[data-plan-index]')];
      const center = picker.getBoundingClientRect().left + picker.clientWidth / 2;
      const closest = cards.reduce((best, card) =>
        Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) <
        Math.abs(best.getBoundingClientRect().left + best.offsetWidth / 2 - center)
          ? card
          : best
      );
      if (closest) {
        const nextIndex = Number(closest.dataset.planIndex);
        // Avoid a state update on every scroll frame. Apart from unnecessary
        // rerenders, that used to restart scrollIntoView while moving between
        // cards and caused a visible glitch on the third plan.
        if (lastScrollIndex.current !== nextIndex) {
          lastScrollIndex.current = nextIndex;
          onChange(nextIndex);
        }
      }
    };

    let frame = 0;
    const handleScroll = () => {
      isScrolling.current = true;
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(() => {
        isScrolling.current = false;
      }, 100);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateFromScroll);
    };

    picker.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      picker.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, [onChange]);

  useEffect(() => {
    // A scroll-driven index change should not immediately start another
    // smooth scroll. Clicks and arrow buttons still get centered here.
    if (isScrolling.current) return;
    pickerRef.current
      ?.querySelector<HTMLElement>(`[data-plan-index="${activeIndex}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  const move = (direction: number) => {
    const next = Math.max(0, Math.min(plans.length - 1, activeIndex + direction));
    onChange(next);
  };

  return (
    <section className="mx-auto max-w-[1180px] px-[18px] pb-8 md:px-[26px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-left text-xs font-bold uppercase tracking-[.14em] text-[#74776f]">
          Vuốt để chọn thực đơn
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
            className="rounded-full border border-[#d9ddd4] bg-white px-3 py-1.5 text-lg leading-none disabled:opacity-40"
            aria-label="Thực đơn trước"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={activeIndex === plans.length - 1}
            className="rounded-full border border-[#d9ddd4] bg-white px-3 py-1.5 text-lg leading-none disabled:opacity-40"
            aria-label="Thực đơn tiếp theo"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={pickerRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 pt-1 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Chọn thực đơn"
      >
        {plans.map((plan, index) => (
          <button
            key={plan.title}
            type="button"
            data-plan-index={index}
            onClick={() => onChange(index)}
            aria-current={index === activeIndex ? 'true' : undefined}
            className={`min-w-[260px] snap-center rounded-2xl border p-5 text-left shadow-[0_4px_16px_rgba(47,52,45,.07)] transition hover:-translate-y-0.5 hover:border-[#78966c] md:min-w-[310px] ${index === activeIndex ? 'border-[#5f9d67] bg-[#f1f4ed] shadow-[0_12px_24px_rgba(47,52,45,.10)]' : 'border-[#e7e5df] bg-white'}`}
          >
            <span className="text-[11px] font-bold uppercase tracking-[.14em] text-[#5f9d67]">
              Thực đơn {index + 1} · 7 ngày
            </span>
            <span className="mt-2 block font-['Playfair_Display'] text-[22px] leading-[1.2]">
              {plan.title}
            </span>
            <span className="mt-2 block text-[13px] leading-relaxed text-[#74776f]">
              {plan.description}
            </span>
            <span className="mt-4 block text-xs font-semibold text-[#4f7d56]">
              {plan.shopping.length} nguyên liệu · Xem thực đơn →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function PrepPage({ plans }: { plans: MealPlan[] }) {
  // Đồng bộ với thực đơn mặc định của nội dung gốc: thực đơn 1 của Lyn.
  const [index, setIndex] = useState(0);
  const p = plans[index];
  const selectPlan = (nextIndex: number) => setIndex(nextIndex);
  return (
    <Shell page="prep" active="/meal-prep">
      <main>
        <PageIntro eyebrow="🥣 Meal prep tối giản" title={p.title} description={p.description} />
        <MealPlanPicker plans={plans} activeIndex={index} onChange={selectPlan} />
        <section className="mx-auto grid max-w-[1180px] items-center gap-[70px] px-[18px] md:grid-cols-2 md:px-[26px]">
          <img
            className="h-[480px] w-full rounded-2xl object-cover"
            src="/assets/images/hero-meal-prep.png"
            alt="Meal prep healthy"
            decoding="async"
          />
          <div>
            <p className="eyebrow">🛒 Danh sách mua sắm</p>
            <h2 className="my-3.5 font-['Playfair_Display'] text-[30px]">
              Mua một lần, dùng cả tuần
            </h2>
            <ul className="grid max-h-[280px] gap-3 overflow-y-auto pr-3 text-sm">
              {p.shopping.map((x) => (
                <li key={x}>🌱 {x}</li>
              ))}
            </ul>
            <p>
              Chia rau đã rửa và protein thành từng hộp riêng. Khi đến bữa, chỉ cần phối lại theo khẩu
              vị.
            </p>
          </div>
        </section>
        <section id="plan-schedule" className="mx-auto max-w-[1180px] scroll-mt-[80px] px-4 py-5 md:px-8 md:py-10">
          <div className="mb-[30px]">
            <p className="eyebrow">📅 Lịch ăn gợi ý</p>
            <h2 className="mt-3 font-['Playfair_Display'] text-[clamp(30px,4vw,48px)] leading-[1.12]">
              Cả tuần <span className="text-highlight">không phải nghĩ nhiều</span>
            </h2>
          </div>
          <div className="overflow-auto rounded-2xl border border-[#e7e5df] bg-white px-[15px] py-[10px] shadow-[0_4px_16px_rgba(47,52,45,0.07)] md:px-[25px] md:py-[14px]">
            <div className="grid min-w-[700px] grid-cols-[90px_repeat(3,1fr)_80px_80px] gap-3 border-b border-[#e7e5df] py-[17px] text-[13px] font-bold">
              <span>Ngày</span>
              <span>Bữa sáng</span>
              <span>Bữa trưa</span>
              <span>Bữa tối</span>
              <span>Calories</span>
              <span>Protein</span>
            </div>
            {p.days.map((d: any, dayIndex: number) => {
              const row = Array.isArray(d)
                ? {
                    day: d[0],
                    breakfast: d[1],
                    lunch: d[2],
                    dinner: d[3],
                    calories: d[4],
                    protein: d[5],
                  }
                : d;
              return (
                <div
                  key={row.day ?? dayIndex}
                  className={`grid min-w-[700px] grid-cols-[90px_repeat(3,1fr)_80px_80px] gap-3 border-b border-[#e7e5df] py-[17px] text-[13px] ${dayIndex === 3 ? 'rounded-lg bg-[#f5f7f4]' : ''}`}
                >
                  <b className="px-2 font-semibold text-[#4f7d56]">{row.day}</b>
                  <span>{row.breakfast}</span>
                  <span>{row.lunch}</span>
                  <span>{row.dinner}</span>
                  <span>{row.calories} kcal</span>
                  <span>{row.protein}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Shell>
  );
}
