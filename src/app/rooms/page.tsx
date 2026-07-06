import type { Metadata } from 'next';

import Reveal from '@/components/Reveal';
import RoomCard from '@/components/RoomCard';
import { getRooms } from '@/lib/hotel';

export const metadata: Metadata = {
  title: 'Rooms',
  description: 'Browse Standard, Deluxe, and Suite rooms at Hotel Pantai Timor.',
};

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
          Room collection
        </p>
        <h1 className="mt-4 font-serif text-5xl text-white">Choose your stay.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          Three room types with practical amenities, direct booking, and clear
          weekday, weekend, and high-season pricing.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <Reveal key={room.id} delay={index * 90}>
            <RoomCard room={room} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
