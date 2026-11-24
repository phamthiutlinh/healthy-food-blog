'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CookLesson, CookStep, Heat } from '../../lib/cook';
import { IngredientIcon } from './cook-icons';
import { CookScene } from './cook-scene';
import { Shell } from './site';

type Tab = 'guide' | 'why' | 'cue';

const TABS: { id: Tab; label: string }[] = [
  { id: 'guide', label: 'Hướng dẫn' },
  { id: 'why', label: 'Giải thích' },
  { id: 'cue', label: 'Dấu hiệu đạt' },
];

const HEAT_LEVEL: Record<Heat, number> = { low: 1, medium: 2, high: 3 };

function formatTime(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function Timer({ seconds, stepKey }: { seconds: number; stepKey: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setLeft(seconds);
    setRunning(false);
  }, [seconds, stepKey]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const done = left === 0;

  return (
    <div
      className={`mt-4 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 ${
        done ? 'border-[#c86a3c] bg-[#fdf1e6]' : 'border-[#e2d9c2] bg-white'
      }`}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a8895f]">Hẹn giờ</p>
        <p
          aria-live="polite"
          className={`font-['Playfair_Display'] text-[26px] leading-none tabular-nums ${
            done ? 'text-[#b1542a]' : 'text-[#2f342d]'
          }`}
        >
          {formatTime(left)}
        </p>
        <p className="mt-1 text-[11px] text-[#8b8578]">
          {done
            ? 'Hết giờ — sang bước tiếp theo'
            : running
              ? 'Đang đếm ngược'
              : 'Bấm chạy khi bắt đầu làm'}
        </p>
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setRunning((value) => !value)}
          disabled={done}
          aria-label={running ? 'Tạm dừng hẹn giờ' : 'Chạy hẹn giờ'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#5d874f] text-[15px] text-white transition hover:bg-[#6e8f62] disabled:opacity-40"
        >
          {running ? '❚❚' : '▶'}
        </button>
        <button
          type="button"
          onClick={() => {
            setLeft(seconds);
            setRunning(false);
          }}
          aria-label="Đặt lại hẹn giờ"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0ba] bg-white text-[15px] text-[#6d7367] transition hover:border-[#5d874f]"
        >
          ↺
        </button>
      </div>
    </div>
  );
}

function Temperature({ step }: { step: CookStep }) {
  if (!step.temperature) return null;
  const level = HEAT_LEVEL[step.temperature.heat];
  return (
    <div className="mt-4 rounded-xl border border-[#e2d9c2] bg-white px-3.5 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a8895f]">Nhiệt độ</p>
        <div className="flex gap-1" aria-label={`Mức lửa ${level}/3`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              aria-hidden="true"
              className={`text-[15px] leading-none ${n <= level ? 'opacity-100' : 'opacity-20 grayscale'}`}
            >
              🔥
            </span>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-[14px] font-semibold text-[#3b4238]">{step.temperature.label}</p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= level ? 'bg-[#dd7a3c]' : 'bg-[#eae3d0]'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function CookModePage({ lesson, recipeTitle }: { lesson: CookLesson; recipeTitle: string }) {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<Tab>('guide');
  const [done, setDone] = useState<Set<number>>(new Set());
  const railRef = useRef<HTMLDivElement>(null);

  const steps = lesson.steps;
  const step = steps[index];
  const finished = done.size === steps.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(steps.length - 1, next)));
      setTab('guide');
    },
    [steps.length]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo(index + 1);
      if (event.key === 'ArrowLeft') goTo(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  useEffect(() => {
    railRef.current
      ?.querySelector<HTMLElement>(`[data-step="${index}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [index]);

  const markDone = () => {
    setDone((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    if (index < steps.length - 1) goTo(index + 1);
  };

  const progress = Math.round((done.size / steps.length) * 100);

  return (
    <Shell page="cook" active="/recipes">
      <main className="mx-auto max-w-[1180px] px-[18px] pb-10 pt-5 md:px-[26px] md:pt-8">
        {/* Thanh trên: quay lại, tên món, tiến độ */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link
            href={`/recipe-detail/${lesson.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#e2d9c2] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#3b4238] shadow-sm transition hover:border-[#5d874f]"
          >
            ← Công thức
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a8895f]">
              Chế độ nấu · dẫn từng bước
            </p>
            <h1 className="truncate font-['Playfair_Display'] text-[24px] leading-tight md:text-[30px]">
              {recipeTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[11px] text-[#8b8578]">{lesson.equipment}</p>
              <p className="text-[11px] text-[#8b8578]">~{lesson.totalMinutes} phút</p>
            </div>
            <div className="rounded-xl border border-[#e2d9c2] bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a8895f]">
                Bước
              </p>
              <p className="font-['Playfair_Display'] text-[18px] leading-none">
                {index + 1}
                <span className="text-[13px] text-[#8b8578]">/{steps.length}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#eae3d0]">
          <div
            className="h-full rounded-full bg-[#5d874f] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          {/* Ảnh thật của bước + icon nguyên liệu */}
          <div>
            <CookScene lesson={lesson} steps={steps} index={index} />
            <p className="mt-2 px-1 text-[12px] text-[#8b8578]">
              Ảnh thật của bước đang chọn · mỗi nguyên liệu có icon riêng · dùng ← → để chuyển bước
            </p>
          </div>

          {/* Panel hướng dẫn */}
          <section className="rounded-2xl border border-[#e2d9c2] bg-[#fbf8ef] p-4 shadow-[0_8px_24px_rgba(47,52,45,.08)] md:p-5">
            <div
              className="flex gap-1 rounded-full bg-[#f1ecdb] p-1"
              role="tablist"
              aria-label="Nội dung bước"
            >
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex-1 rounded-full px-2 py-1.5 text-[12px] font-bold transition ${
                    tab === item.id
                      ? 'bg-white text-[#3b4238] shadow-[0_2px_6px_rgba(47,52,45,.10)]'
                      : 'text-[#8b8578] hover:text-[#3b4238]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-3">
              <span
                className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold ${
                  done.has(index)
                    ? 'border-[#5d874f] bg-[#5d874f] text-white'
                    : 'border-[#dd7a3c] bg-[#fdf1e6] text-[#b1542a]'
                }`}
              >
                {done.has(index) ? '✓' : index + 1}
              </span>
              <div className="min-w-0">
                <h2 className="font-['Playfair_Display'] text-[22px] leading-tight">
                  {step.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#a8895f]">
                  <IngredientIcon id={step.items[0].icon} className="h-4 w-4" />
                  {tab === 'guide'
                    ? 'Các bước làm'
                    : tab === 'why'
                      ? 'Vì sao lại vậy'
                      : 'Nhìn gì để biết đạt'}
                </p>
              </div>
            </div>

            <p
              key={`${index}-${tab}`}
              className="cook-swap mt-3 min-h-[76px] text-[14px] leading-[1.7] text-[#454b41]"
            >
              {tab === 'guide' ? step.instruction : tab === 'why' ? step.why : step.cue}
            </p>

            <Temperature step={step} />
            {step.timerSeconds ? <Timer seconds={step.timerSeconds} stepKey={index} /> : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Bước trước"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8d0ba] bg-white text-[16px] text-[#3b4238] transition hover:border-[#5d874f] disabled:opacity-35"
              >
                ←
              </button>
              <button
                type="button"
                onClick={markDone}
                disabled={index === steps.length - 1 && done.has(index)}
                className="flex-1 rounded-xl bg-[#5d874f] px-4 py-3 text-[14px] font-bold text-white transition hover:-translate-y-px hover:bg-[#6e8f62] disabled:opacity-50"
              >
                {done.has(index) ? '✓ Đã xong' : 'Xong bước này →'}
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === steps.length - 1}
                aria-label="Bước sau"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8d0ba] bg-white text-[16px] text-[#3b4238] transition hover:border-[#5d874f] disabled:opacity-35"
              >
                →
              </button>
            </div>

            {finished ? (
              <div className="mt-3 rounded-xl border border-[#cfe0c8] bg-[#eef4ea] px-3.5 py-3">
                <p className="text-[13px] font-bold text-[#3b5e41]">Món đã hoàn thành 🎉</p>
                <Link
                  href={`/recipe-detail/${lesson.slug}`}
                  className="text-[12px] font-semibold text-[#4f7d56] underline underline-offset-2"
                >
                  Xem lại công thức & mẹo bảo quản →
                </Link>
              </div>
            ) : null}
          </section>
        </div>

        {/* Dải bước */}
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#8b8578]">
            Các bước của món ({done.size}/{steps.length} xong)
          </p>
          <div
            ref={railRef}
            className="-mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Chọn bước"
          >
            {steps.map((item, i) => {
              const isActive = i === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  data-step={i}
                  onClick={() => goTo(i)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group min-w-[158px] shrink-0 snap-center overflow-hidden rounded-xl border text-left transition md:min-w-[176px] ${
                    isActive
                      ? 'border-[#c86a3c] shadow-[0_8px_20px_rgba(200,106,60,.18)]'
                      : 'border-[#e2d9c2] hover:border-[#b9c9ae]'
                  }`}
                >
                  <span className="relative block h-[64px] w-full overflow-hidden bg-[#eae3d0]">
                    <img
                      src={item.photo}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,12,.45)_0%,rgba(18,16,12,0)_60%,rgba(18,16,12,.18)_100%)]" />
                    <span className="absolute left-2 top-1.5 text-[10px] font-bold tracking-[.08em] text-white/95">
                      BƯỚC {i + 1}
                    </span>
                    {done.has(i) ? (
                      <span className="absolute right-2 top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#5d874f] text-[9px] text-white">
                        ✓
                      </span>
                    ) : (
                      <IngredientIcon
                        id={item.items[0].icon}
                        className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full bg-[#fbf8ef]/90 p-[1px]"
                      />
                    )}
                  </span>
                  <span
                    className={`block px-[13px] pb-[11px] pt-2 ${isActive ? 'bg-[#fdf1e6]' : 'bg-white'}`}
                  >
                    <span
                      className={`block text-[13px] font-semibold leading-snug ${isActive ? 'text-[#b1542a]' : 'text-[#3b4238]'}`}
                    >
                      {item.title}
                    </span>
                    {item.timerSeconds ? (
                      <span className="mt-1 block text-[11px] text-[#a8895f]">
                        ⏱ {formatTime(item.timerSeconds)}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </Shell>
  );
}
