import type { Metadata } from 'next';

import Reveal from '@/components/Reveal';
import ReviewCard from '@/components/ReviewCard';
import { getApprovedReviews } from '@/lib/hotel';
import { HOTEL_INFO } from '@/lib/hotel-data';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'See guest reviews for Hotel Pantai Timor in Kupang.',
};

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.32em] text-[#d4a853]">
          Guest reviews
        </p>
        <h1 className="mt-4 font-serif text-5xl text-white">
          {HOTEL_INFO.rating.toFixed(1)} rating from {HOTEL_INFO.reviewCount} stays
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          Approved comments from guests who booked and stayed with Hotel Pantai
          Timor.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <Reveal key={review.id} delay={index * 70}>
            <ReviewCard review={review} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
