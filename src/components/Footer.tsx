import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

import { HOTEL_INFO } from '@/lib/hotel-data';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-serif text-2xl text-white">{HOTEL_INFO.name}</p>
          <p className="max-w-md text-sm leading-7 text-slate-300">
            Boutique stay in Kupang with coastal mood, practical business
            comfort, and warm local service from check-in to check-out.
          </p>
          <div className="grid gap-3 text-sm text-slate-300">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#d4a853]" />
              <span>{HOTEL_INFO.address}</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#d4a853]" />
              <a href={`tel:${HOTEL_INFO.phone}`}>{HOTEL_INFO.phone}</a>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#d4a853]" />
              <a href={`mailto:${HOTEL_INFO.email}`}>{HOTEL_INFO.email}</a>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-[#d4a853]">
            Explore
          </p>
          <div className="grid gap-3 text-sm text-slate-300">
            <Link href="/">Home</Link>
            <Link href="/rooms">Rooms</Link>
            <Link href="/booking">Booking</Link>
            <Link href="/reviews">Guest Reviews</Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-[#d4a853]">
            Build Credit
          </p>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            Designed and developed for Hotel Pantai Timor.
            <br />
            Digital craft by Webminds Kupang.
          </div>
        </div>
      </div>
    </footer>
  );
}
