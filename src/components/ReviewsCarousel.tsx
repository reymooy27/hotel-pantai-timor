'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ReviewCard from '@/components/ReviewCard';
import type { Review } from '@/lib/types';

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = reviews.length;

  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [total]);

  if (total === 0) {
    return null;
  }

  const active = reviews[index];

  return (
    <div className="space-y-6">
      <ReviewCard review={active} />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {reviews.map((review, reviewIndex) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setIndex(reviewIndex)}
              className={
                reviewIndex === index
                  ? 'h-2.5 w-8 rounded-full bg-[#d4a853]'
                  : 'h-2.5 w-2.5 rounded-full bg-white/20'
              }
              aria-label={`Go to review ${reviewIndex + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((current) => (current - 1 + total) % total)}
            className="rounded-full border border-white/10 p-3 text-white transition hover:border-[#d4a853]/40 hover:text-[#f5d48b]"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % total)}
            className="rounded-full border border-white/10 p-3 text-white transition hover:border-[#d4a853]/40 hover:text-[#f5d48b]"
            aria-label="Next review"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
