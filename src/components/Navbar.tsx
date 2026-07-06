'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';

import { HOTEL_INFO } from '@/lib/hotel-data';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/booking', label: 'Booking' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4a853]/35 bg-[#d4a853]/10 text-sm font-semibold tracking-[0.28em] text-[#f5d48b]">
            HPT
          </div>
          <div>
            <p className="font-serif text-xl text-white">{HOTEL_INFO.name}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
              Kupang, NTT
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : item.href.startsWith('/#')
                  ? false
                  : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm transition',
                  active
                    ? 'bg-[#d4a853]/15 text-[#f5d48b]'
                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${HOTEL_INFO.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:border-[#d4a853]/35 hover:text-[#f5d48b]"
          >
            <Phone className="h-4 w-4" />
            {HOTEL_INFO.phone}
          </a>
          <Link
            href="/booking"
            className="rounded-full bg-[#d4a853] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-[#e6bb63]"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex rounded-full border border-white/10 p-2 text-white lg:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-slate-100 transition hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl bg-[#d4a853] px-4 py-3 text-center font-semibold text-slate-950"
            >
              Book Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
