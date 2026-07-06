import { NextResponse } from 'next/server';

import { getBookingById } from '@/lib/hotel';

export async function GET(
  _request: Request,
  context: RouteContext<'/api/bookings/[id]'>
) {
  const { id } = await context.params;
  const booking = await getBookingById(id);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  return NextResponse.json(booking);
}
