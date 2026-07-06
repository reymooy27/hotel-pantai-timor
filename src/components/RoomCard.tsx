import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BedDouble, Users, Waves } from 'lucide-react';

import type { Room } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f5d48b]">
          {room.type}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl text-white">{room.name}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {room.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Start from
            </p>
            <p className="mt-2 text-xl font-semibold text-[#f5d48b]">
              {formatCurrency(room.price_weekday)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
            <Users className="h-4 w-4 text-[#d4a853]" />
            {room.max_guests} guests
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
            <BedDouble className="h-4 w-4 text-[#d4a853]" />
            {room.bed_type ?? 'Premium bed'}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
            <Waves className="h-4 w-4 text-[#d4a853]" />
            {room.size_sqm ?? 0} sqm
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#f5d48b]"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/booking?room=${room.slug}`}
            className="rounded-full bg-[#d4a853] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#e6bb63]"
          >
            Book room
          </Link>
        </div>
      </div>
    </article>
  );
}
