import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thiệp cưới Kim Phụng & Đình Chiến',
  description: 'Trân trọng kính mời bạn đến chung vui trong ngày cưới của Kim Phụng và Đình Chiến.',
  openGraph: { title: 'Kim Phụng & Đình Chiến · 16.11.2026', description: 'Một hành trình mới của chúng mình bắt đầu từ hôm nay.', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Thiệp cưới Kim Phụng và Đình Chiến' }] },
  twitter: { card: 'summary_large_image', title: 'Kim Phụng & Đình Chiến · 16.11.2026', description: 'Trân trọng kính mời.', images: ['/og.png'] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
