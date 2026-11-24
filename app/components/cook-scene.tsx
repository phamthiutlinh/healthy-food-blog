import type { CookLesson, CookStep } from '../../lib/cook';
import { IngredientIcon } from './cook-icons';

/**
 * Clip minh họa công đoạn cắt từ video Pexels (giấy phép Pexels, miễn phí).
 * Mỗi công đoạn dùng chung một GIF để khỏi phải tải 18 file.
 */
const CLIP_BY_MOTION: Record<string, string> = {
  chop: 'chop',
  slice: 'slice',
  cut: 'slice',
  stir: 'stir',
  pat: 'pat',
  marinate: 'marinate',
  score: 'score',
  season: 'season',
  'hot-pan': 'hot-pan',
  sear: 'sear',
  steam: 'steam',
  wash: 'wash',
  toss: 'toss',
  plate: 'plate',
  drizzle: 'drizzle',
  rest: 'rest',
};

function clipSrc(motion: CookStep['motion']) {
  const name = CLIP_BY_MOTION[motion] ?? 'chop';
  return `/assets/images/cook/clips/${name}.gif`;
}

function formatClock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * Khung hình của Chế độ nấu: GIF minh họa công đoạn của bước đang chọn,
 * ảnh thật của bước làm nền (hiện ra khi GIF chưa tải xong hoặc khi người
 * dùng tắt chuyển động), và icon riêng cho từng nguyên liệu / dụng cụ.
 */
export function CookScene({
  lesson,
  steps,
  index,
}: {
  lesson: CookLesson;
  steps: CookStep[];
  index: number;
}) {
  const step = steps[index];
  const hot = step.items.some((item) => item.icon === 'steam' || item.icon === 'flame');

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#ded4bb] bg-[#14120e] shadow-[0_18px_45px_rgba(47,52,45,.22)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {steps.map((item, i) => (
          <div
            key={item.photo}
            className="cook-frame absolute inset-0"
            data-active={i === index}
            aria-hidden={i !== index}
          >
            <img
              src={item.photo}
              alt={item.photoAlt}
              width={1400}
              height={875}
              className="cook-photo h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </div>
        ))}

        {/* GIF minh họa công đoạn của bước đang chọn */}
        <div key={index} className="cook-clip" aria-hidden="true">
          <img
            src={clipSrc(step.motion)}
            alt=""
            width={480}
            height={300}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* Lớp phủ để chữ luôn đọc được trên mọi tấm ảnh / clip */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,12,.5)_0%,rgba(18,16,12,.05)_26%,rgba(18,16,12,0)_44%,rgba(16,14,10,.78)_100%)]" />

        {/* Hơi nước chỉ hiện ở bước liên quan đến lửa / hấp */}
        {hot ? (
          <div className="cook-steam pointer-events-none absolute inset-0" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 md:p-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#f6f2e6] backdrop-blur-sm md:text-[11px]">
            <span className="cook-live-dot inline-block h-1.5 w-1.5 rounded-full bg-[#a8cf8e]" />
            Bước {index + 1}/{steps.length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-[#f6f2e6] backdrop-blur-sm tabular-nums">
            {step.timerSeconds
              ? `⏱ ${formatClock(step.timerSeconds)}`
              : lesson.equipment.split(' · ')[0]}
          </span>
        </div>

        <div
          key={`${index}-caption`}
          className="cook-caption absolute inset-x-0 bottom-0 p-4 pb-6 md:p-5 md:pb-7"
        >
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e9dfc6]/80">
            {index === 0 ? 'Chuẩn bị' : index === steps.length - 1 ? 'Hoàn thiện' : 'Đang nấu'} ·{' '}
            {lesson.protein === 'salmon'
              ? 'cá hồi'
              : lesson.protein === 'chicken'
                ? 'gà'
                : 'rau củ'}
          </p>
          <h2 className="mt-1 font-['Playfair_Display'] text-[23px] leading-tight text-[#fbf8ef] drop-shadow-[0_2px_6px_rgba(0,0,0,.35)] md:text-[28px]">
            {step.title}
          </h2>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {step.items.map((item, i) => (
              <li
                key={item.label}
                className="cook-item inline-flex items-center gap-1.5 rounded-full border border-[#ebe3cf] bg-[#fbf8ef]/95 py-1 pl-1.5 pr-2.5 text-[11px] font-semibold text-[#3b4238] shadow-[0_3px_10px_rgba(20,18,12,.18)]"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <IngredientIcon id={item.icon} className="h-5 w-5" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Tiến độ từng bước, chạy theo bước đang chọn */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
          <div
            className="h-full rounded-r-full bg-[#a8cf8e] transition-[width] duration-500 ease-out"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
