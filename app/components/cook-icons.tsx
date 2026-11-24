import type { IngredientId } from '../../lib/cook';

/**
 * Bộ icon hoạt hình cho từng nguyên liệu / dụng cụ trong Chế độ nấu.
 * Cùng một khung 64×64, nét mảnh màu #3f4638, màu phẳng ấm — để khi đặt
 * cạnh nhau trên nền ảnh thật, chúng vẫn đọc được như một bộ.
 */
const STROKE = { stroke: '#3f4638', strokeWidth: 2.2, strokeLinejoin: 'round' as const };

function Shape({ id }: { id: IngredientId }) {
  switch (id) {
    case 'chicken':
      return (
        <g {...STROKE}>
          <path
            d="M16 24c2-9 12-14 21-11 7 2 11 9 10 16-1 6-6 9-9 14-2 4-7 8-12 6-5-2-6-8-8-13-2-6-3-8-2-12Z"
            fill="#f3c6b0"
          />
          <path d="M23 22c7-5 15-4 20 1" fill="none" stroke="#e0a78e" />
          <ellipse cx="27" cy="30" rx="5" ry="3" fill="#f9dcd0" stroke="none" opacity=".9" />
        </g>
      );
    case 'salmon':
      return (
        <g {...STROKE}>
          <path d="M8 37c11-10 35-13 48-5-9 12-34 18-48 5Z" fill="#ef8f66" />
          <path
            d="M19 31c4 4 4 11 0 15M29 28c4 5 4 13 0 17M39 26c4 5 4 14 0 18"
            fill="none"
            stroke="#f8c7ad"
          />
          <path d="M9 39c10 5 28 6 40-1" fill="none" stroke="#d4744d" />
        </g>
      );
    case 'board':
      return (
        <g {...STROKE}>
          <rect x="7" y="19" width="40" height="28" rx="6" fill="#c99a63" />
          <rect x="47" y="28" width="11" height="10" rx="5" fill="#b48853" />
          <path d="M15 28h23M15 36h17" fill="none" stroke="#a97b48" />
        </g>
      );
    case 'knife':
      return (
        <g {...STROKE}>
          <path d="M8 44 42 16l8 6-28 24-14-2Z" fill="#dfe3dc" />
          <path d="M8 44l14 2 3-3-13-4-4 5Z" fill="#c3c8bf" />
          <path d="M42 16l7-2c4-1 7 2 7 6 0 4-3 7-7 6l-7-4-8-6Z" fill="#3f5638" />
        </g>
      );
    case 'towel':
      return (
        <g {...STROKE}>
          <rect x="14" y="15" width="36" height="34" rx="6" fill="#fbf8ef" />
          <path d="M14 24h36" fill="none" />
          <path d="M20 32h24M20 39h17" fill="none" stroke="#cfc6ad" />
        </g>
      );
    case 'sauce':
      return (
        <g {...STROKE}>
          <path d="M12 31h40c0 12-9 20-20 20s-20-8-20-20Z" fill="#efe6cf" />
          <ellipse cx="32" cy="31" rx="20" ry="6" fill="#5a3620" />
          <ellipse cx="26" cy="29.5" rx="5" ry="1.8" fill="#8a5a34" stroke="none" />
        </g>
      );
    case 'spoon':
      return (
        <g {...STROKE}>
          <path d="M48 13 29 36" fill="none" stroke="#b9bdb4" strokeWidth="4.5" />
          <ellipse cx="24" cy="42" rx="8" ry="6" fill="#d9dcd6" transform="rotate(-40 24 42)" />
        </g>
      );
    case 'honey':
      return (
        <g {...STROKE}>
          <rect x="22" y="25" width="20" height="27" rx="6" fill="#e9b64c" />
          <rect x="24" y="17" width="16" height="9" rx="3" fill="#8a6b3c" />
          <path d="M29 34h6v7h-6z" fill="#f7dda0" stroke="none" />
          <path d="M42 30c4 5 4 10 0 13" fill="none" stroke="#d79b2a" />
        </g>
      );
    case 'bowl':
      return (
        <g {...STROKE}>
          <path d="M10 30h44c0 13-10 22-22 22S10 43 10 30Z" fill="#f6f2e6" />
          <ellipse cx="32" cy="30" rx="22" ry="5" fill="#e6dfc9" />
          <path d="M21 32c6 5 16 5 22 0" fill="none" stroke="#cfc6ad" />
        </g>
      );
    case 'salad-bowl':
      return (
        <g {...STROKE}>
          <path d="M20 27c-1-7 3-11 8-13-2 5-1 9 3 13" fill="#8fbf6b" />
          <path d="M31 27c-1-8 4-13 9-14-3 6-1 10 4 14" fill="#7fae5c" />
          <circle cx="24" cy="26" r="3.4" fill="#d9574f" />
          <path d="M10 30h44c0 13-10 22-22 22S10 43 10 30Z" fill="#f6f2e6" />
          <ellipse cx="32" cy="30" rx="22" ry="5" fill="#e6dfc9" />
        </g>
      );
    case 'timer':
      return (
        <g {...STROKE}>
          <circle cx="32" cy="35" r="17" fill="#fbf8ef" />
          <path d="M32 35V25M32 35l7 5" fill="none" />
          <path d="M26 13h12v5H26z" fill="#5d874f" />
          <path d="M32 18v-3" fill="none" />
        </g>
      );
    case 'pan':
      return (
        <g {...STROKE}>
          <circle cx="28" cy="34" r="16" fill="#4a4d45" />
          <circle cx="28" cy="34" r="10.5" fill="#5d6057" stroke="none" />
          <path d="M43 31l16 4" fill="none" stroke="#3f423b" strokeWidth="6" />
        </g>
      );
    case 'flame':
      return (
        <g {...STROKE}>
          <path
            d="M32 10c2 9 12 13 12 24a12 12 0 0 1-24 0c0-6 4-9 6-14 2 4 6 5 6 9 3-6 1-13 0-19Z"
            fill="#e08a3c"
          />
          <path d="M32 34c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 3-5 5-10Z" fill="#f3c07a" stroke="none" />
        </g>
      );
    case 'oil':
      return (
        <g {...STROKE}>
          <rect x="25" y="21" width="16" height="31" rx="6" fill="#cfe3a8" />
          <rect x="28" y="11" width="10" height="11" rx="3" fill="#6f8f5a" />
          <path d="M25 38h16v9a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5Z" fill="#e7c65c" />
        </g>
      );
    case 'broccoli':
      return (
        <g {...STROKE}>
          <path d="M32 44v12" fill="none" stroke="#5d8a41" strokeWidth="6" />
          <circle cx="22" cy="32" r="9" fill="#6fae5c" />
          <circle cx="32" cy="26" r="10" fill="#7fbe67" />
          <circle cx="42" cy="32" r="9" fill="#6fae5c" />
          <circle cx="27" cy="39" r="7" fill="#5f9c4e" />
          <circle cx="38" cy="39" r="7" fill="#5f9c4e" />
        </g>
      );
    case 'steam':
      return (
        <g fill="none" stroke="#93a7a0" strokeWidth="3.4" strokeLinecap="round">
          <path d="M20 50c-8-7 8-11 0-18s8-11 0-18" />
          <path d="M32 52c-8-7 8-11 0-18s8-11 0-18" />
          <path d="M44 50c-8-7 8-11 0-18s8-11 0-18" />
        </g>
      );
    case 'rice-bowl':
      return (
        <g {...STROKE}>
          <path d="M13 32h38c0 12-8.5 20-19 20s-19-8-19-20Z" fill="#fbf8ef" />
          <path d="M17 32c3-8 8.5-12 15-12s12 4 15 12Z" fill="#f1ecdb" />
          <ellipse cx="26" cy="28" rx="6" ry="3" fill="#b57a44" stroke="none" />
          <ellipse cx="38" cy="27" rx="5" ry="3" fill="#a86a38" stroke="none" />
        </g>
      );
    case 'salt':
      return (
        <g {...STROKE}>
          <path d="M24 26h16v22a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4Z" fill="#eae3d0" />
          <path d="M26 17h12l2 9H24Z" fill="#b9bdb4" />
          <circle cx="30" cy="21" r="1" fill="#6d7367" stroke="none" />
          <circle cx="34" cy="21" r="1" fill="#6d7367" stroke="none" />
          <circle cx="32" cy="24" r="1" fill="#6d7367" stroke="none" />
        </g>
      );
    case 'lemon':
      return (
        <g {...STROKE}>
          <path d="M14 37a18 18 0 0 1 36 0Z" fill="#e9d96a" />
          <path d="M14 37h36" fill="none" stroke="#b9a93f" />
          <path d="M32 37V23M32 37l-11-6M32 37l11-6" fill="none" stroke="#c9b94a" />
        </g>
      );
    case 'tongs':
      return (
        <g {...STROKE}>
          <path
            d="M19 54c0-15 3-28 13-42M45 54c0-15-3-28-13-42"
            fill="none"
            stroke="#cfd3c9"
            strokeWidth="5"
          />
          <circle cx="32" cy="12" r="3.4" fill="#8e948a" />
        </g>
      );
    case 'asparagus':
      return (
        <g {...STROKE}>
          <path d="M23 55c-2-15-2-28 2-40" fill="none" stroke="#7fae5c" strokeWidth="5.5" />
          <path d="M32 55c0-15 1-27 6-38" fill="none" stroke="#8fbf6b" strokeWidth="5.5" />
          <path d="M41 55c2-14 4-24 9-33" fill="none" stroke="#6f9c4f" strokeWidth="5.5" />
          <path d="M25 15c3-5 7-2 6 3M38 17c3-5 7-2 6 3" fill="#5d8a41" />
        </g>
      );
    case 'lettuce':
      return (
        <g {...STROKE}>
          <path
            d="M32 55c-12 0-20-8-20-18 0-6 4-10 8-10-2-6 3-12 10-12s12 6 10 12c4 0 8 4 8 10 0 10-8 18-16 18Z"
            fill="#8fbf6b"
          />
          <path
            d="M32 20v32M24 28c2 6 2 14 0 22M40 28c-2 6-2 14 0 22"
            fill="none"
            stroke="#6f9c4f"
          />
        </g>
      );
    case 'avocado':
      return (
        <g {...STROKE}>
          <path d="M32 11c8 0 14 10 14 21s-6 21-14 21-14-10-14-21 6-21 14-21Z" fill="#6f9c4f" />
          <path d="M32 17c6 0 10 8 10 15s-4 14-10 14-10-7-10-14 4-15 10-15Z" fill="#d9e8a0" />
          <circle cx="32" cy="34" r="6" fill="#a9773f" />
        </g>
      );
    case 'tomato':
      return (
        <g {...STROKE}>
          <circle cx="32" cy="36" r="16" fill="#d9574f" />
          <path d="M32 21v-6M32 19l-7-5M32 19l7-5" fill="none" stroke="#5d8a41" strokeWidth="3" />
          <ellipse cx="26" cy="31" rx="4" ry="3" fill="#ef8b83" stroke="none" />
        </g>
      );
    default:
      return <circle cx="32" cy="32" r="18" fill="#e6dfc9" {...STROKE} />;
  }
}

export function IngredientIcon({ id, className }: { id: IngredientId; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <Shape id={id} />
    </svg>
  );
}
