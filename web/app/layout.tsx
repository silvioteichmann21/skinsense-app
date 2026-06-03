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
    'SkinSense scans your face on-device, delivers a clinical-style skin report, and builds a personalized AM/PM routine. Join the waitlist for early access.',
  openGraph: {
    title: 'SkinSense',
    description: 'Botanical precision meets on-device skin intelligence.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
