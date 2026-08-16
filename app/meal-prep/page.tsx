'use client';

import { useState } from 'react';
import mealPlans from '@/lib/meal-plans.json';

export default function MealPrepPage() {
  const [activePlan, setActivePlan] = useState(mealPlans.length - 1);

  const plan = mealPlans[activePlan];
  const hasNutrition = plan.days.some((d: any) => d[4] != null || d[5] != null);
  const columns = hasNutrition ? 'grid-cols-[90px_repeat(3,1fr)_80px_80px]' : 'grid-cols-[90px_repeat(3,1fr)]';

  return (
    <main>
      <section className="mx-auto max-w-[1180px] px-[18px] py-[48px] pb-[30px] text-center md:px-[26px] md:py-[74px] md:pb-[50px]">
        <p className="eyebrow">🥣 Meal prep tối giản</p>
        <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12] mt-4">
          Thực đơn gợi ý
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1180px] items-center gap-[70px] px-[18px] md:grid-cols-2 md:px-[26px]">
        <img
          className="h-[480px] w-full object-cover rounded-2xl shadow-[0_12px_40px_rgba(47,52,45,0.12)]"
          src="/assets/images/hero-meal-prep.png"
          alt="Meal prep healthy"
        />
        <div>
          <p className="eyebrow">🛒 Danh sách mua sắm</p>
          <h2 className="font-['Playfair_Display'] text-[30px] leading-[1.12] my-3.5 section-accent">
            Mua một lần, dùng cả tuần
          </h2>
          <ul id="shopping" className="grid max-h-[280px] gap-3 overflow-y-auto pr-3 text-sm [&_li]:pl-5 [&_li]:relative [&_li:before]:content-['🌱'] [&_li:before]:absolute [&_li:before]:left-0">
            {plan.shopping.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>
            Chia rau đã rửa và protein thành từng hộp riêng. Khi đến bữa, chỉ cần phối lại theo khẩu vị.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-5 md:px-8 md:py-10">
        <div className="mb-[30px]">
          <p className="eyebrow">📅 Lịch ăn gợi ý</p>
          <h2 className="font-['Playfair_Display'] text-[clamp(30px,4vw,48px)] leading-[1.12] mt-3">
            Cả tuần <span className="text-highlight">không phải nghĩ nhiều</span>
          </h2>
        </div>
        <div className="overflow-auto bg-white px-[15px] py-[10px] md:px-[25px] md:py-[14px] rounded-2xl border border-[#e7e5df] shadow-[0_4px_16px_rgba(47,52,45,0.07)]">
          <div className={`grid min-w-[530px] ${columns} gap-3 border-b border-[#e7e5df] py-[17px] text-[13px] font-bold`}>
            <span>Ngày</span>
            <span>Bữa sáng</span>
            <span>Bữa trưa</span>
            <span>Bữa tối</span>
            {hasNutrition && <span>Calories</span>}
            {hasNutrition && <span>Protein</span>}
          </div>
          {plan.days.map((day: any, i: number) => (
            <div key={i} className={`grid min-w-[530px] ${columns} gap-3 border-b border-[#e7e5df] py-[17px] text-[13px] rounded-lg px-2`}>
              <span className="font-semibold text-[var(--color-fern-600)]">{day.day || '—'}</span>
              <span>{day.breakfast || '—'}</span>
              <span>{day.lunch || '—'}</span>
              <span>{day.dinner || '—'}</span>
              {hasNutrition && <span>{day.calories ? `${day.calories} kcal` : '—'}</span>}
              {hasNutrition && <span>{day.protein || '—'}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-[18px] pt-[30px] text-center">
        {plan.tips?.length > 0 && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#78966c] eyebrow">Mẹo nhỏ</p>
            <ul className="mt-4 text-left [&_li]:mb-2 [&_li]:pl-5 [&_li]:relative [&_li:before]:content-['•'] [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:text-[var(--color-fern-500)]">
              {plan.tips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[760px] px-[18px] py-[88px] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#78966c] eyebrow">Mẹo nhỏ</p>
        <h2 className="font-['Playfair_Display'] text-[clamp(28px,4vw,46px)] leading-[1.12]">
          Meal prep không phải nấu sẵn mọi thứ. Chỉ cần chuẩn bị những điều khiến ngày mai dễ hơn.
        </h2>
      </section>
    </main>
  );
}
