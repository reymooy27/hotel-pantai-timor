import { NextResponse } from 'next/server';

import { calculateStayPricing, getNights } from '@/lib/booking';
import { checkRoomAvailability, getPricingRules, getRooms } from '@/lib/hotel';
import { createAdminClient, hasAdminSupabase, hasPublicSupabase, supabase } from '@/lib/supabase';
import type { BookingFormData } from '@/lib/types';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: BookingFormData;

  try {
    body = (await request.json()) as BookingFormData;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const rooms = await getRooms();
  const room = rooms.find((item) => item.id === body.room_id);

  if (!room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  if (!body.guest_name?.trim()) {
    return NextResponse.json({ error: 'Guest name is required.' }, { status: 400 });
  }

  if (!body.guest_phone?.trim()) {
    return NextResponse.json({ error: 'Guest phone is required.' }, { status: 400 });
  }

  if (!body.guest_email?.trim() || !isValidEmail(body.guest_email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  if (!body.guest_id_number?.trim()) {
    return NextResponse.json(
      { error: 'KTP or passport number is required.' },
      { status: 400 }
    );
  }

  if (!body.check_in || !body.check_out || getNights(body.check_in, body.check_out) < 1) {
    return NextResponse.json(
      { error: 'Check-in and check-out dates are invalid.' },
      { status: 400 }
    );
  }

  if (body.num_guests < 1 || body.num_guests > room.max_guests) {
    return NextResponse.json(
      { error: `Guest count must be between 1 and ${room.max_guests}.` },
      { status: 400 }
    );
  }

  const availability = await checkRoomAvailability(
    body.room_id,
    body.check_in,
    body.check_out
  );

  if (!availability.available) {
    return NextResponse.json(
      { error: 'Selected dates are no longer available.' },
      { status: 409 }
    );
  }

  const pricingRules = await getPricingRules();
  const quote = calculateStayPricing(room, body.check_in, body.check_out, pricingRules);

  const insertPayload = {
    room_id: body.room_id,
    guest_name: body.guest_name.trim(),
    guest_email: body.guest_email.trim(),
    guest_phone: body.guest_phone.trim(),
    guest_id_number: body.guest_id_number.trim(),
    check_in: body.check_in,
    check_out: body.check_out,
    num_guests: body.num_guests,
    total_price: quote.total,
    notes: body.notes?.trim() || null,
    source: 'website',
  };

  if (!hasPublicSupabase && !hasAdminSupabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured for booking submission yet.' },
      { status: 503 }
    );
  }

  try {
    const client = hasAdminSupabase ? createAdminClient() : supabase;
    const { data, error } = await client
      .from('bookings')
      .insert(insertPayload)
      .select('id')
      .single();

    if (error || !data) {
      throw error ?? new Error('Insert failed.');
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Booking could not be created right now.' },
      { status: 500 }
    );
  }
}
