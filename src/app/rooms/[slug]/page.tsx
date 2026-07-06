import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Check, Clock3, Users } from 'lucide-react';

import BookingForm from '@/components/BookingForm';
import Calendar from '@/components/Calendar';
import Reveal from '@/components/Reveal';
import { getPricingRules, getRoomBySlug } from '@/lib/hotel';
import { formatCurrency } from '@/lib/utils';

interface RoomDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RoomDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  return {
    title: room ? room.name : 'Room',
    description: room?.description ?? 'Room detail page',
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params;
  const [room, pricingRules] = await Promise.all([
    getRoomBySlug(slug),
    getPricingRules(),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
          {room.type} room
        </p>
        <h1 className="mt-4 font-serif text-5xl text-white">{room.name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          {room.description}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] border border-white/10">
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div className="grid gap-4">
          {room.images.slice(1, 3).map((image, index) => (
            <Reveal key={image} delay={index * 80}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-white/10">
                <Image
                  src={image}
                  alt={`${room.name} gallery ${index + 2}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_0.7fr_0.6fr]">
        <Reveal>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-3xl text-white">Amenities</h2>
            <ul className="mt-5 grid gap-3 text-sm text-slate-200">
              {room.amenities.map((amenity) => (
                <li key={amenity} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-[#d4a853]" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-3xl text-white">Pricing</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm">
                <span className="text-slate-300">Weekday</span>
                <span className="font-semibold text-[#f5d48b]">
                  {formatCurrency(room.price_weekday)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm">
                <span className="text-slate-300">Weekend</span>
                <span className="font-semibold text-[#f5d48b]">
                  {formatCurrency(room.price_weekend)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm">
                <span className="text-slate-300">High season</span>
                <span className="font-semibold text-[#f5d48b]">
                  {formatCurrency(room.price_high_season ?? room.price_weekend)}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="font-serif text-3xl text-white">Stay facts</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <p className="flex items-center gap-3">
                <Users className="h-4 w-4 text-[#d4a853]" />
                Up to {room.max_guests} guests
              </p>
              <p className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#d4a853]" />
                Check-in from 14:00, check-out by 12:00
              </p>
              <p className="flex items-center gap-3">
                <Check className="h-4 w-4 text-[#d4a853]" />
                Seasonal rules applied automatically in booking total
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <Calendar roomSlug={room.slug} />
        </Reveal>
        <Reveal delay={100}>
          <BookingForm
            rooms={[room]}
            pricingRules={pricingRules}
            initialRoomId={room.id}
            lockRoomSelection
          />
        </Reveal>
      </div>
    </div>
  );
}
