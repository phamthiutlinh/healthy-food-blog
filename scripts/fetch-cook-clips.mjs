/**
 * Tải clip minh họa công đoạn nấu ăn từ Pexels (giấy phép Pexels: dùng miễn phí,
 * không bắt buộc ghi nguồn), cắt 2,4 giây, crop 16:10 và encode thành GIF 720×450.
 *
 * Chạy: npm run fetch:cook-clips
 * File mp4 gốc được giữ ở scripts/.tmp-videos để lần sau không phải tải lại.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'public/assets/images/cook/clips';
const TMP_DIR = 'scripts/.tmp-videos';
const WIDTH = 480;
const HEIGHT = 300;
const FPS = 8;
const DURATION = 1.8;

/**
 * Mỗi mục là một công đoạn: `motion` trùng với field `motion` trong lib/cook.ts.
 * `start` là giây bắt đầu đoạn cắt — chọn chỗ tay/dụng cụ đang thao tác rõ nhất.
 * `focus` chỉ dùng cho video dọc: 0 = mép trên, 1 = mép dưới.
 */
const CLIPS = [
  // Thái / băm trên thớt
  { motion: 'chop', id: 28736047, start: 2.6, source: 'Chopping vegetables on wooden board' },
  { motion: 'slice', id: 5644999, start: 4.0, source: 'Slicing zucchini on chopping board' },
  // Khuấy sốt trong bát
  { motion: 'stir', id: 5657572, start: 5.0, source: 'Mixing ingredients in stainless bowl' },
  // Thấm khô / ướp
  { motion: 'pat', id: 7592577, start: 4.0, source: 'Hands holding raw salmon' },
  { motion: 'marinate', id: 6107301, start: 1.4, source: 'Raw chicken with garlic and rosemary' },
  // Khứa da cá
  { motion: 'score', id: 3296400, start: 1.2, source: 'Cutting salmon slab' },
  // Rắc muối
  { motion: 'season', id: 10432095, start: 3.2, source: 'Dusting salt on raw fish' },
  // Làm nóng chảo
  { motion: 'hot-pan', id: 6107294, start: 2.4, source: 'Chicken breasts on induction stove with oil' },
  // Áp chảo
  { motion: 'sear', id: 6107305, start: 3.0, source: 'Chicken breasts frying in pan' },
  // Hấp rau
  { motion: 'steam', id: 854564, start: 2.4, source: 'Sauteed broccoli' },
  // Rửa rau
  { motion: 'wash', id: 3872466, start: 0.4, source: 'Washing vegetables under running water' },
  // Trộn salad
  { motion: 'toss', id: 3195728, start: 3.4, source: 'Chef tossing vegetable salad' },
  // Rưới sốt lên cơm / hoàn thiện món
  { motion: 'plate', id: 10200314, start: 0.6, focus: 0.42, source: 'Teriyaki chicken with soy sauce' },
  { motion: 'drizzle', id: 6161931, start: 3.0, source: 'Olive oil poured over fresh vegetables' },
  // Nghỉ & bày đĩa
  { motion: 'rest', id: 3296470, start: 1.6, source: 'Chef plating salmon' },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const only = process.argv.slice(2);
const selected = only.length ? CLIPS.filter((clip) => only.includes(clip.motion)) : CLIPS;

if (!selected.length) {
  console.error(`Không có công đoạn nào khớp: ${only.join(', ')}`);
  process.exit(1);
}

function videoFile(clip) {
  return path.join(TMP_DIR, `${clip.motion}-${clip.id}.mp4`);
}

function download(clip) {
  const file = videoFile(clip);
  if (fs.existsSync(file) && fs.statSync(file).size > 100_000) return file;

  const url = `https://www.pexels.com/download/video/${clip.id}/`;
  execFileSync('curl', ['-sSL', '--fail', '-o', file, url], { stdio: ['ignore', 'ignore', 'inherit'] });

  const size = fs.statSync(file).size;
  if (size < 100_000) throw new Error(`Tải hỏng ${clip.motion}: ${size} byte`);
  return file;
}

function probe(file) {
  const json = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    file,
  ]);
  const { width, height } = JSON.parse(json).streams[0];
  return { width, height };
}

function encode(clip) {
  const input = download(clip);
  const { width, height } = probe(input);

  // Video dọc: thu về đúng bề rộng khung rồi cắt một dải ngang quanh chủ thể.
  // Video ngang: thu về đúng chiều cao khung rồi cắt bớt hai bên.
  const geometry =
    width < height
      ? `scale=${WIDTH}:-2:flags=lanczos,crop=${WIDTH}:${HEIGHT}:0:(ih-${HEIGHT})*${clip.focus ?? 0.45}`
      : `scale=-2:${HEIGHT}:flags=lanczos,crop=${WIDTH}:${HEIGHT}`;

  const filter = [
    `[0:v]${geometry},hqdn3d=6:4:9:9,fps=${FPS},split[a][b]`,
    `[a]palettegen=max_colors=72:stats_mode=full[p]`,
    `[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
  ].join(';');

  const output = path.join(OUT_DIR, `${clip.motion}.gif`);
  execFileSync(
    'ffmpeg',
    [
      '-y', '-loglevel', 'error',
      '-ss', String(clip.start),
      '-i', input,
      '-t', String(DURATION),
      '-filter_complex', filter,
      '-loop', '0',
      output,
    ],
    { stdio: 'inherit' },
  );

  const kb = Math.round(fs.statSync(output).size / 1024);
  console.log(`${clip.motion.padEnd(10)} ${String(kb).padStart(4)} KB  ← ${clip.source}`);
}

for (const clip of selected) encode(clip);
console.log(`\nXong ${selected.length} GIF trong ${OUT_DIR}`);
