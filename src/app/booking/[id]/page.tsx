import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, CircleDollarSign, Phone, User } from 'lucide-react';

import Reveal from '@/components/Reveal';
import { getBookingById } from '@/lib/hotel';
import { formatCurrency, formatDisplayDate } from '@/lib/utils';

interface BookingTrackingPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Booking Status',
  description: 'Track your booking confirmation at Hotel Pantai Timor.',
};

export default async function BookingTrackingPage({
  params,
}: BookingTrackingPageProps) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
            Booking tracking
          </p>
          <h1 className="mt-4 font-serif text-5xl text-white">
            Reservation {booking.id.slice(0, 8)}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Current status: <span className="capitalize text-white">{booking.status}</span>
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-3xl text-white">Stay details</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <p className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-[#d4a853]" />
                {formatDisplayDate(booking.check_in)} -{' '}
                {formatDisplayDate(booking.check_out)}
              </p>
              <p className="flex items-center gap-3">
                <CircleDollarSign className="h-4 w-4 text-[#d4a853]" />
                {formatCurrency(booking.total_price)}
              </p>
              <p className="flex items-center gap-3">
                <User className="h-4 w-4 text-[#d4a853]" />
                {booking.num_guests} guest(s)
              </p>
              <p className="text-slate-300">
                Room: <span className="text-white">{booking.room?.name ?? 'Assigned room'}</span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-3xl text-white">Guest details</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <p>{booking.guest_name}</p>
              <p>{booking.guest_email ?? 'No email provided'}</p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#d4a853]" />
                {booking.guest_phone}
              </p>
              <p className="capitalize text-slate-300">
                Payment: <span className="text-white">{booking.payment_status}</span>
              </p>
              <p className="text-slate-300">
                Front desk will contact guest if hotel team needs extra
                verification or arrival updates.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <div className="mt-8 rounded-[32px] border border-white/10 bg-slate-950/40 p-6 text-sm leading-7 text-slate-300">
          Need help with this booking? Contact hotel and mention booking ID{' '}
          <span className="text-white">{booking.id}</span>. You can also go back to{' '}
          <Link href="/booking" className="text-[#f5d48b]">
            booking page
          </Link>
          .
        </div>
      </Reveal>
    </div>
  );
}
