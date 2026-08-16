import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về chúng mình — Nhà bếp của Lyn',
  description: 'Tìm hiểu câu chuyện Nhà bếp của Lyn: nơi chia sẻ công thức dễ làm và thói quen sống khỏe cho mọi người.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1180px] px-[18px] py-[48px] pb-[30px] text-center md:px-[26px] md:py-[74px] md:pb-[50px]">
        <p className="eyebrow">🌿 Một căn bếp đủ chậm</p>
        <h1 className="font-['Playfair_Display'] text-[clamp(42px,6vw,76px)] leading-[1.12] mt-4">
          Ăn tốt hơn, sống trọn vẹn hơn.
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1180px] items-center gap-[70px] px-[18px] md:grid-cols-2 md:px-[26px]">
        <img
          className="h-[480px] w-full object-cover rounded-2xl shadow-[0_12px_40px_rgba(47,52,45,0.12)]"
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80"
          alt="Bàn ăn đầy rau củ"
        />
        <div className="[&_h2]:mt-[42px] [&_h2]:font-['Playfair_Display'] [&_h2]:text-[30px] [&>p]:mt-4">
          <p className="eyebrow">📜 Câu chuyện của chúng mình</p>
          <h2 className="section-accent">Không cần hoàn hảo để bắt đầu.</h2>
          <p>
            Nhà bếp của Lyn được tạo ra cho những người muốn chăm sóc cơ thể nhưng không muốn áp lực
            bởi những quy tắc cứng nhắc. Chúng mình tin rằng một bữa ăn cân bằng là bữa ăn bạn có
            thể lặp lại với niềm vui.
          </p>
          <p>
            Từ công thức đơn giản, danh sách mua sắm đến meal prep từng tuần, mọi nội dung ở đây đều
            hướng đến một mục tiêu: giúp việc ăn lành mạnh trở nên dễ chịu và thực tế hơn.
          </p>
          <h2>Điều chúng mình hướng tới</h2>
          <p>
            Một không gian nhỏ, ấm áp để bạn tìm được cảm hứng cho căn bếp và nhịp sống của riêng mình.
          </p>
        </div>
      </section>
    </main>
  );
}
