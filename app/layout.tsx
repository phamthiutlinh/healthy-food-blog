import type { Metadata, Viewport } from 'next';
import '../public/css/style.css';

export const viewport: Viewport = {
  themeColor: '#78966C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://healthy-food-blog.vercel.app'),
  title: 'Nhà bếp của Lyn — Ăn ngon, sống khỏe',
  description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
  applicationName: 'Healthy Blog',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Healthy Blog',
  },
  icons: {
    icon: '/assets/images/logo-lyn-kitchen.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'Nhà bếp của Lyn — Ăn ngon, sống khỏe',
    description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
    siteName: 'Nhà bếp của Lyn',
    images: [
      {
        url: '/assets/images/articles/healthy-breakfast-editorial.jpeg',
        width: 1200,
        height: 630,
        alt: 'Bữa sáng healthy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà bếp của Lyn — Ăn ngon, sống khỏe',
    description: 'Những công thức healthy, meal prep và góc sống khỏe cho một nhịp ăn uống tự nhiên hơn.',
    images: ['/assets/images/articles/healthy-breakfast-editorial.jpeg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BMB6Z09GFZ"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BMB6Z09GFZ');
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
