import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import WhatsAppFloat from '@/components/WhatsAppFloat';

import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Hotel Pantai Timor',
    template: '%s | Hotel Pantai Timor',
  },
  description:
    'Luxury coastal stay in Kupang, NTT with room booking, guest reviews, and direct reservation flow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${playfair.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-slate-950 text-white antialiased">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.18),_transparent_45%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(15,23,42,0.92))]" />
          <Navbar />
          <main className="relative flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
