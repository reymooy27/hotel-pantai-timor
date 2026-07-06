import type { Metadata } from 'next';

import BookingForm from '@/components/BookingForm';
import Reveal from '@/components/Reveal';
import { getPricingRules, getRooms } from '@/lib/hotel';

interface BookingPageProps {
  searchParams: Promise<{ room?: string }>;
}

export const metadata: Metadata = {
  title: 'Booking',
  description: 'Book your stay at Hotel Pantai Timor.',
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const [{ room: roomSlug }, rooms, pricingRules] = await Promise.all([
    searchParams,
    getRooms(),
    getPricingRules(),
  ]);

  const initialRoomId = rooms.find((room) => room.slug === roomSlug)?.id;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
          Direct booking
        </p>
        <h1 className="mt-4 font-serif text-5xl text-white">Reserve your stay.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          Three-step booking flow with room selection, guest details, pricing
          review, and direct confirmation tracking page.
        </p>
      </Reveal>

      <div className="mt-10">
        <BookingForm
          rooms={rooms}
          pricingRules={pricingRules}
          initialRoomId={initialRoomId}
        />
      </div>
    </div>
  );
}
