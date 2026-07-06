import { NextResponse } from 'next/server';

import { getRoomAvailabilityBySlug } from '@/lib/hotel';

function isValidMonth(value: string | null) {
  return Boolean(value && /^\d{4}-\d{2}$/.test(value));
}

export async function GET(
  request: Request,
  context: RouteContext<'/api/rooms/[slug]/availability'>
) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!isValidMonth(month)) {
    return NextResponse.json(
      { error: 'Query parameter month=YYYY-MM is required.' },
      { status: 400 }
    );
  }

  const availability = await getRoomAvailabilityBySlug(slug, month!);

  if (!availability) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  return NextResponse.json({
    room: {
      id: availability.room.id,
      slug: availability.room.slug,
      name: availability.room.name,
    },
    month: availability.month,
    bookedDates: availability.bookedDates,
    blockedDates: availability.blockedDates,
    availableDates: availability.availableDates,
  });
}
