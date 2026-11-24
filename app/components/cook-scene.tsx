import type { CookLesson, CookStep, SceneId } from '../../lib/cook';

const COLORS = {
  bg: '#f4efe2',
  bgLine: '#e3d9c2',
  wood: '#c99a63',
  woodDark: '#a97b48',
  woodLight: '#dcb37e',
  stone: '#6b6b62',
  stoneDark: '#3f423b',
  cream: '#f6f2e6',
  creamLine: '#cfc6ad',
  green: '#4f7d56',
  greenLight: '#7fa06f',
  flame: '#dd7a3c',
  flameLight: '#f0a85c',
  metal: '#d9dcd6',
  metalLine: '#b3b7ae',
};

const PROTEIN: Record<CookLesson['protein'], { main: string; edge: string }> = {
  chicken: { main: '#ecc0a9', edge: '#d79b80' },
  salmon: { main: '#e6916a', edge: '#c96f4c' },
  veg: { main: '#8fae6b', edge: '#6f8f4f' },
};

function Halo({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse className="cook-halo" cx={cx} cy={cy} rx={rx} ry={ry} />;
}

/** Khay bếp nhìn từ trên xuống. Mỗi bước chỉ làm sáng những vật dụng liên quan. */
export function CookScene({ lesson, step }: { lesson: CookLesson; step: CookStep }) {
  const on = (id: SceneId) => step.focus.includes(id);
  const active = (id: SceneId) => (on(id) ? 'true' : 'false');
  const protein = PROTEIN[lesson.protein];
  const sauceFill =
    lesson.protein === 'chicken' ? '#8a5430' : lesson.protein === 'salmon' ? '#dcd0a8' : '#d9c37a';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e2d9c2] bg-[#f4efe2] shadow-[0_10px_30px_rgba(47,52,45,.10)]">
      <svg
        className="block h-full w-full"
        viewBox="0 0 800 520"
        role="img"
        aria-label={`Sơ đồ khay bếp cho bước ${step.title}`}
      >
        <defs>
          <radialGradient id="cook-pan" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#4a4d45" />
            <stop offset="100%" stopColor={COLORS.stoneDark} />
          </radialGradient>
          <linearGradient id="cook-board" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.woodLight} />
            <stop offset="100%" stopColor={COLORS.wood} />
          </linearGradient>
        </defs>

        <rect width="800" height="520" fill={COLORS.bg} />

        {/* Đường đồng mức mờ — giữ cảm giác "bản đồ" như ảnh tham chiếu */}
        <g stroke={COLORS.bgLine} strokeWidth="1.5" fill="none" opacity=".85">
          <path d="M-20 90c90-40 150 30 240 10s160-90 260-60 180 10 340-30" />
          <path d="M-20 130c90-40 150 30 240 10s160-90 260-60 180 10 340-30" />
          <path d="M-20 470c120-50 210 20 320-10s190-70 300-40 160 20 240-20" />
          <path d="M-20 510c120-50 210 20 320-10s190-70 300-40 160 20 240-20" />
        </g>

        {/* Thớt + nguyên liệu */}
        <g className="cook-obj" data-active={active('board')}>
          <Halo cx={186} cy={330} rx={140} ry={98} />
          <rect x="62" y="252" width="248" height="156" rx="18" fill={COLORS.woodDark} opacity=".55" />
          <rect x="58" y="248" width="248" height="156" rx="16" fill="url(#cook-board)" />
          <rect x="72" y="262" width="220" height="128" rx="11" fill="#e2bb85" opacity=".55" />
          <g stroke={COLORS.wood} strokeWidth="2" opacity=".45" fill="none">
            <path d="M92 300h180M88 330h200M96 362h176M100 344h150" />
          </g>
          <g>
            <ellipse cx="140" cy="316" rx="38" ry="24" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
            <ellipse cx="212" cy="352" rx="34" ry="22" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
            <ellipse cx="160" cy="382" rx="30" ry="20" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
          </g>
          {lesson.protein === 'veg' ? (
            <g>
              <circle cx="240" cy="304" r="13" fill="#d4574f" />
              <circle cx="268" cy="322" r="11" fill="#d4574f" />
              <circle cx="252" cy="378" r="15" fill="#7fae5c" stroke="#5d8a41" strokeWidth="2" />
            </g>
          ) : null}
        </g>

        {/* Dao */}
        <g className="cook-obj" data-active={active('knife')}>
          <Halo cx={330} cy={208} rx={120} ry={54} />
          <g className={on('knife') ? 'cook-chop' : undefined}>
            <path
              d="M424 190 L216 206 L216 230 L424 212 Z"
              fill={COLORS.metal}
              stroke={COLORS.metalLine}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M216 230 L424 212 L424 218 L216 236 Z" fill="#c3c7bd" />
            <path
              d="M424 188 h66 a12 12 0 0 1 12 12 v14 a12 12 0 0 1 -12 12 h-66 z"
              fill="#3f5638"
              stroke="#2f4229"
              strokeWidth="2"
            />
            <circle cx="448" cy="204" r="3.5" fill="#c8cfc2" />
            <circle cx="472" cy="204" r="3.5" fill="#c8cfc2" />
          </g>
        </g>

        {/* Bát trộn */}
        <g className="cook-obj" data-active={active('bowl')}>
          <Halo cx={640} cy={152} rx={108} ry={96} />
          <ellipse cx="646" cy="168" rx="80" ry="74" fill="#cfc6ad" opacity=".5" />
          <circle cx="640" cy="152" r="78" fill="#eae3d0" stroke={COLORS.creamLine} strokeWidth="3" />
          <circle cx="640" cy="152" r="64" fill={COLORS.cream} />
          <g className={on('bowl') ? 'cook-swirl' : undefined}>
            <ellipse cx="640" cy="152" rx="46" ry="38" fill={sauceFill} opacity=".9" />
            <path
              d="M618 150c14-14 32 12 46-4"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              opacity=".55"
              strokeLinecap="round"
            />
          </g>
          <g opacity=".9">
            <rect x="694" y="112" width="9" height="86" rx="4" fill="#c9a978" transform="rotate(16 698 155)" />
            <rect x="706" y="112" width="9" height="86" rx="4" fill="#b9975f" transform="rotate(16 710 155)" />
          </g>
        </g>

        {/* Chai sốt */}
        <g className="cook-obj" data-active={active('sauce')}>
          <Halo cx={566} cy={306} rx={48} ry={54} />
          <rect x="548" y="282" width="34" height="58" rx="9" fill="#42553d" stroke="#2f4229" strokeWidth="2" />
          <rect x="556" y="266" width="18" height="18" rx="4" fill="#6c7f63" />
          <rect x="554" y="306" width="22" height="18" rx="3" fill="#e8e2cd" opacity=".85" />
        </g>

        {/* Chanh */}
        <g className="cook-obj" data-active={active('lime')}>
          <Halo cx={716} cy={466} rx={54} ry={44} />
          <circle cx="704" cy="462" r="26" fill="#7fae4f" stroke="#5d8a41" strokeWidth="2" />
          <circle cx="704" cy="462" r="18" fill="#cfe098" />
          <path d="M704 462 L704 446 M704 462 L716 454 M704 462 L716 470 M704 462 L704 478" stroke="#a8c46a" strokeWidth="2" />
        </g>

        {/* Chảo */}
        <g className="cook-obj" data-active={active('pan')}>
          <Halo cx={430} cy={352} rx={148} ry={130} />
          <g transform="rotate(26 430 352)">
            <rect x="524" y="338" width="118" height="28" rx="13" fill="#4f5049" stroke="#3c3d37" strokeWidth="2" />
            <rect x="524" y="346" width="118" height="7" rx="3" fill="#666861" opacity=".7" />
          </g>
          <circle cx="430" cy="352" r="104" fill={COLORS.stone} stroke="#57574f" strokeWidth="3" />
          <circle cx="430" cy="352" r="90" fill="url(#cook-pan)" />
          <g>
            <ellipse cx="392" cy="336" rx="34" ry="24" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
            <ellipse cx="452" cy="366" rx="30" ry="22" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
            {lesson.protein === 'veg' ? (
              <circle cx="470" cy="326" r="16" fill="#7fae5c" stroke="#5d8a41" strokeWidth="2" />
            ) : (
              <ellipse cx="470" cy="320" rx="20" ry="12" fill="#7fae5c" stroke="#5d8a41" strokeWidth="2" />
            )}
          </g>
          <ellipse cx="404" cy="330" rx="26" ry="12" fill="#ffffff" opacity=".12" />
        </g>

        {/* Lửa dưới chảo */}
        <g className="cook-obj" data-active={active('flame')}>
          <Halo cx={430} cy={352} rx={150} ry={132} />
          <g className={on('flame') ? 'cook-flame' : undefined} fill={COLORS.flame}>
            <path d="M338 442c-4-26 12-44 16-56 8 16 22 26 18 50 0 10-10 18-18 18s-16-4-16-12z" opacity=".9" />
            <path d="M392 456c-4-30 14-50 18-64 9 18 25 30 20 58 0 12-11 20-20 20s-18-4-18-14z" opacity=".95" />
            <path d="M452 454c-4-28 13-48 17-62 9 18 24 30 19 56 0 12-10 20-19 20s-17-4-17-14z" opacity=".9" />
            <path d="M500 440c-3-24 11-40 15-52 7 15 20 25 16 46 0 10-9 17-16 17s-15-4-15-11z" opacity=".75" />
          </g>
          <g className={on('flame') ? 'cook-flame' : undefined} fill={COLORS.flameLight} opacity=".85">
            <path d="M352 444c-3-16 8-28 11-36 5 10 14 17 11 32 0 7-6 12-11 12s-11-3-11-8z" />
            <path d="M462 452c-3-16 8-28 11-36 5 10 14 17 11 32 0 7-6 12-11 12s-11-3-11-8z" />
          </g>
        </g>

        {/* Hơi nước */}
        <g className="cook-obj" data-active={active('steam')} stroke="#bfae8d" strokeWidth="5" fill="none" strokeLinecap="round">
          <path className="cook-steam-line" d="M378 236c-14-18 14-28 0-46s14-26 0-44" />
          <path className="cook-steam-line" d="M432 226c-14-18 14-28 0-46s14-26 0-42" />
          <path className="cook-steam-line" d="M486 238c-14-18 14-28 0-46s14-26 0-44" />
        </g>

        {/* Đĩa / hộp thành phẩm */}
        <g className="cook-obj" data-active={active('plate')}>
          <Halo cx={640} cy={398} rx={92} ry={80} />
          <circle cx="644" cy="404" r="64" fill="#cfc6ad" opacity=".45" />
          <circle cx="640" cy="398" r="62" fill="#fbf8ef" stroke={COLORS.creamLine} strokeWidth="3" />
          <circle cx="640" cy="398" r="46" fill="#f1ecdb" />
          <ellipse cx="626" cy="392" rx="18" ry="12" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
          <ellipse cx="656" cy="408" rx="16" ry="11" fill={protein.main} stroke={protein.edge} strokeWidth="2" />
          <circle cx="654" cy="382" r="11" fill="#7fae5c" stroke="#5d8a41" strokeWidth="2" />
          <path d="M616 418c8-6 18-6 26-2" stroke="#d9c9a2" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      {step.chips?.map((chip) => (
        <span
          key={chip.label}
          className={`pointer-events-none absolute max-w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-[.08em] shadow-[0_3px_10px_rgba(47,52,45,.12)] md:text-[11px] ${
            chip.tone === 'fire'
              ? 'border-[#e3b189] bg-[#fdf1e6] text-[#a9552a]'
              : 'border-[#d8d0ba] bg-[#fbf8ef]/95 text-[#4a5344]'
          }`}
          style={{ left: `${(chip.x / 800) * 100}%`, top: `${(chip.y / 520) * 100}%` }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}
