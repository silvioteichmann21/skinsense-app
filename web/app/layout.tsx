import type { Metadata } from 'next';
import { DM_Sans, Space_Mono } from 'next/font/google';

import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkinSense — Know your skin. Own your glow.',
  description:
    'Guided 3-angle face scan, on-device analysis, zone-by-zone skin report, and personalized AM/PM routines. Join the waitlist for early access.',
  icons: {
    icon: '/images/landing/app-icon-v2.png',
    apple: '/images/landing/app-icon-v2.png',
  },
  openGraph: {
    title: 'SkinSense — Know your skin. Own your glow.',
    description:
      'Guided face scan, clinical-style report, and personalized routines—private, on your device.',
    type: 'website',
    images: [{ url: '/images/landing/guide-hero-v2.png', width: 1200, height: 1200, alt: 'SkinSense app' }],
  },
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
