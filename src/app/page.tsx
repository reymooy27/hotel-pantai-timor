import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Plane,
  ShieldCheck,
  Star,
  Wifi,
} from 'lucide-react';

import Reveal from '@/components/Reveal';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import RoomCard from '@/components/RoomCard';
import { getApprovedReviews, getRooms } from '@/lib/hotel';
import { HOTEL_FEATURES, HOTEL_INFO } from '@/lib/hotel-data';

const featureIcons = [ShieldCheck, Wifi, CheckCircle2, Plane];

export default async function Home() {
  const [rooms, reviews] = await Promise.all([getRooms(), getApprovedReviews()]);

  return (
    <div className="pb-20">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-16">
        <Reveal className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
            Coastal luxury in Kupang
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight text-white sm:text-6xl">
            Stay near Timor shoreline with polished comfort and local warmth.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {HOTEL_INFO.name} blends practical business travel comfort with warm
            leisure atmosphere, minutes from city center and sea breeze.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#d4a853] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#e6bb63]"
            >
              Book your stay
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rooms"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white transition hover:border-[#d4a853]/35 hover:text-[#f5d48b]"
            >
              Explore rooms
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6">
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex items-center gap-2 text-[#f5d48b]">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-2xl font-semibold text-white">
                  {HOTEL_INFO.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {HOTEL_INFO.reviewCount} guest reviews
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-2xl font-semibold text-white">24/7</p>
              <p className="mt-2 text-sm text-slate-300">
                Front desk and arrival support
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_40px_120px_rgba(2,6,23,0.45)]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <Image
              src={rooms[2]?.images[0] ?? rooms[0].images[0]}
              alt="Hotel Pantai Timor hero room"
              width={1200}
              height={1400}
              priority
              className="aspect-[4/5] h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 z-20 w-full p-6 sm:p-8">
              <div className="max-w-sm rounded-[28px] border border-white/10 bg-slate-950/70 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-[#d4a853]">
                  Signature stay
                </p>
                <p className="mt-3 font-serif text-3xl text-white">
                  Suite with sea-breeze mood
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Spacious lounge, balcony, and premium bedding for longest rest
                  after flights or island business trips.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
                Rooms
              </p>
              <h2 className="mt-4 font-serif text-4xl text-white">
                Three room categories. Clear pricing.
              </h2>
            </div>
            <Link
              href="/rooms"
              className="hidden rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-[#d4a853]/35 hover:text-[#f5d48b] md:inline-flex"
            >
              See all rooms
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <Reveal key={room.id} delay={index * 100}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <Reveal>
          <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(212,168,83,0.16),rgba(15,23,42,0.15))] p-8">
            <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
              About hotel
            </p>
            <h2 className="mt-4 font-serif text-4xl text-white">
              Designed for business ease and coastal downtime.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Hotel Pantai Timor serves travelers who need clean, polished rooms,
              fast connection, and direct support while staying in Kupang.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {HOTEL_FEATURES.map((feature, index) => {
            const Icon = featureIcons[index];

            return (
              <Reveal key={feature.title} delay={index * 80}>
                <article className="h-full rounded-[28px] border border-white/10 bg-white/5 p-6">
                  <Icon className="h-8 w-8 text-[#d4a853]" />
                  <h3 className="mt-5 font-serif text-2xl text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-24 grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <Reveal>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
              Guest voice
            </p>
            <h2 className="mt-4 font-serif text-4xl text-white">
              Trusted by returning guests.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Consistent comfort, practical location, and responsive staff shape
              most reviews.
            </p>
            <Link
              href="/reviews"
              className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-[#d4a853]/35 hover:text-[#f5d48b]"
            >
              Read all reviews
            </Link>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <ReviewsCarousel reviews={reviews.slice(0, 6)} />
        </Reveal>
      </section>

      <section
        id="contact"
        className="mx-auto mt-24 grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"
      >
        <Reveal>
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
              Contact
            </p>
            <h2 className="mt-4 font-serif text-4xl text-white">
              Find us in Kupang.
            </h2>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-[#d4a853]" />
                <span>{HOTEL_INFO.address}</span>
              </p>
              <p>{HOTEL_INFO.phone}</p>
              <p>{HOTEL_INFO.email}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-2">
            <iframe
              title="Hotel Pantai Timor location"
              src={HOTEL_INFO.mapEmbed}
              className="h-[420px] w-full rounded-[28px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
