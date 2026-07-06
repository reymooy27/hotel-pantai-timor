import { Star } from 'lucide-react';

import type { Review } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.24)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-serif text-2xl text-white">{review.guest_name}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Verified guest
          </p>
        </div>
        <div className="flex items-center gap-1 text-[#f5d48b]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-4 w-4"
              fill={index < review.rating ? 'currentColor' : 'transparent'}
            />
          ))}
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-200">
        {review.comment ?? 'Pleasant stay and smooth booking experience.'}
      </p>
    </article>
  );
}
