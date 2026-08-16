import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nhà bếp của Lyn — Ăn ngon, sống khỏe',
  description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
  openGraph: {
    type: 'website',
    siteName: 'Nhà bếp của Lyn',
    title: 'Nhà bếp của Lyn — Ăn ngon, sống khỏe',
    description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
    url: 'https://healthy-food-blog.vercel.app/',
    images: [{
      url: '/assets/images/articles/og-image.jpeg',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà bếp của Lyn — Ăn ngon, sống khỏe',
    description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
    images: ['/assets/images/articles/og-image.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-[#faf9f6] font-['Be_Vietnam_Pro'] text-[15px] leading-[1.65] text-[#2f342d]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
