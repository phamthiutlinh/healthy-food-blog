import { NextResponse } from 'next/server';
import { contentIndex, fallbackSources, searchContent, type SearchHit } from '../../../lib/search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'https://ollama.com';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4:31b';
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// Naive per-instance limiter: keeps a serverless cold start from being abused for free tokens.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 15;
}

const RULES = [
  'Bạn là trợ lý ảo của blog "Nhà bếp của Lyn" — chuyên về ăn uống lành mạnh, công thức healthy và meal prep.',
  'QUY TẮC BẮT BUỘC:',
  '1. Luôn ưu tiên dữ liệu trong phần "NỘI DUNG TRÊN BLOG" bên dưới. Đó là nguồn sự thật duy nhất về công thức, bài viết và đường dẫn.',
  '2. Chỉ dùng đúng đường dẫn xuất hiện trong dữ liệu, viết dạng tương đối (ví dụ /recipe-detail/oat-yogurt-berries). Tuyệt đối không bịa slug hay tên miền như yourblog.com.',
  '3. Nếu dữ liệu không có nội dung phù hợp, hãy nói rõ blog chưa có bài đó, rồi mới trả lời bằng kiến thức chung và gợi ý món gần nhất có trong danh mục.',
  '4. Luôn kèm ít nhất một liên kết dạng markdown [Tên món](/recipe-detail/slug) khi nhắc tới nội dung trên blog.',
  '5. Trả lời bằng tiếng Việt, thân thiện, dưới 150 từ. Dùng gạch đầu dòng cho nguyên liệu hoặc các bước.',
  '6. Bạn không phải bác sĩ: với câu hỏi bệnh lý, khuyên người dùng gặp chuyên gia.',
].join('\n');

function buildSystemPrompt(matches: SearchHit[]) {
  const context = matches.length ? matches.map((match) => match.text).join('\n\n') : contentIndex();
  const header = matches.length
    ? 'NỘI DUNG TRÊN BLOG (kết quả tìm kiếm phù hợp nhất với câu hỏi):'
    : 'NỘI DUNG TRÊN BLOG (không tìm thấy kết quả khớp — đây là toàn bộ danh mục hiện có):';
  return `${RULES}\n\n${header}\n${context}`;
}


export async function POST(request: Request) {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chưa cấu hình OLLAMA_API_KEY.' }, { status: 500 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Bạn hỏi hơi nhanh, thử lại sau một phút nhé.' }, { status: 429 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!messages.length) {
    return NextResponse.json({ error: 'Thiếu nội dung câu hỏi.' }, { status: 400 });
  }

  // Follow-ups like "gửi link đi" carry no keywords, so retrieval reuses the last few user turns.
  const question = messages
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map((m) => m.content)
    .join(' ');
  const matches = searchContent(question);
  const sources = matches.length
    ? matches.map(({ title, href }) => ({ title, href }))
    : fallbackSources();

  const upstream = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: true,
      think: false,
      options: { temperature: 0.3, num_predict: 600 },
      messages: [{ role: 'system', content: buildSystemPrompt(matches) }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    console.error('Ollama error', upstream.status, await upstream.text().catch(() => ''));
    return NextResponse.json({ error: 'Không kết nối được tới Ollama Cloud.' }, { status: 502 });
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  let emitted = false;

  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const payload = JSON.parse(line);
            const text = payload?.message?.content;
            if (text) {
              emitted = true;
              controller.enqueue(encoder.encode(text));
            }
          } catch {
            // ignore partial/keep-alive lines
          }
        }
      },
      flush(controller) {
        if (!emitted) {
          const list = sources.map((s) => `- [${s.title}](${s.href})`).join('\n');
          controller.enqueue(
            encoder.encode(`Mình chưa kịp soạn câu trả lời. Bạn xem thử các nội dung này nhé:\n${list}`),
          );
        }
      },
    }),
  );

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Chat-Sources': Buffer.from(JSON.stringify(sources), 'utf8').toString('base64'),
    },
  });
}
