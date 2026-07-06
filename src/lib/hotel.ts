import { format, subDays } from 'date-fns';

import {
  blockOverlapsRange,
  enumerateBlockedDates,
  enumerateBookedDates,
  getMonthWindow,
  rangesOverlap,
} from '@/lib/booking';
import {
  LOCAL_BLOCK_FALLBACK,
  LOCAL_BOOKING_FALLBACK,
  LOCAL_PRICING_RULES,
  LOCAL_REVIEW_FALLBACK,
  LOCAL_ROOM_FALLBACK,
  type AvailabilityBooking,
} from '@/lib/hotel-data';
import {
  createAdminClient,
  hasAdminSupabase,
  hasPublicSupabase,
  supabase,
} from '@/lib/supabase';
import type { Booking, PricingRule, Review, Room, RoomBlock } from '@/lib/types';

function mergeRoomWithFallback(room: Room) {
  const fallback = LOCAL_ROOM_FALLBACK.find((item) => item.slug === room.slug);

  if (!fallback) {
    return room;
  }

  return {
    ...fallback,
    ...room,
    amenities: room.amenities?.length ? room.amenities : fallback.amenities,
    images: room.images?.length ? room.images : fallback.images,
    description: room.description ?? fallback.description,
  };
}

export async function getRooms() {
  if (!hasPublicSupabase) {
    return LOCAL_ROOM_FALLBACK;
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)
      .order('price_weekday', { ascending: true });

    if (error || !data) {
      return LOCAL_ROOM_FALLBACK;
    }

    return (data as Room[]).map(mergeRoomWithFallback);
  } catch {
    return LOCAL_ROOM_FALLBACK;
  }
}

export async function getRoomBySlug(slug: string) {
  if (!hasPublicSupabase) {
    return LOCAL_ROOM_FALLBACK.find((room) => room.slug === slug) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return LOCAL_ROOM_FALLBACK.find((room) => room.slug === slug) ?? null;
    }

    return mergeRoomWithFallback(data as Room);
  } catch {
    return LOCAL_ROOM_FALLBACK.find((room) => room.slug === slug) ?? null;
  }
}

export async function getApprovedReviews() {
  if (!hasPublicSupabase) {
    return LOCAL_REVIEW_FALLBACK;
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return LOCAL_REVIEW_FALLBACK;
    }

    return data as Review[];
  } catch {
    return LOCAL_REVIEW_FALLBACK;
  }
}

export async function getPricingRules() {
  if (!hasAdminSupabase) {
    return LOCAL_PRICING_RULES;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true)
      .order('date_from', { ascending: true });

    if (error || !data || data.length === 0) {
      return LOCAL_PRICING_RULES;
    }

    return data as PricingRule[];
  } catch {
    return LOCAL_PRICING_RULES;
  }
}

export async function getBookingById(id: string) {
  const client = hasAdminSupabase
    ? createAdminClient()
    : hasPublicSupabase
      ? supabase
      : null;

  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('bookings')
      .select('*, room:rooms(*)')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const booking = data as Booking;

    if (booking.room) {
      booking.room = mergeRoomWithFallback(booking.room);
    }

    return booking;
  } catch {
    return null;
  }
}

function filterFallbackBookings(roomId: string, month: string) {
  const { monthStartKey, nextMonthStartKey } = getMonthWindow(month);

  return LOCAL_BOOKING_FALLBACK.filter(
    (booking) =>
      booking.room_id === roomId &&
      rangesOverlap(
        booking.check_in,
        booking.check_out,
        monthStartKey,
        nextMonthStartKey
      )
  );
}

function filterFallbackBlocks(roomId: string, month: string) {
  const { monthStartKey, nextMonthStartKey } = getMonthWindow(month);

  return LOCAL_BLOCK_FALLBACK.filter(
    (block) =>
      block.room_id === roomId &&
      blockOverlapsRange(
        block.blocked_from,
        block.blocked_to,
        monthStartKey,
        nextMonthStartKey
      )
  );
}

export async function getRoomAvailabilityBySlug(slug: string, month: string) {
  const room = await getRoomBySlug(slug);

  if (!room) {
    return null;
  }

  let bookings: AvailabilityBooking[] = filterFallbackBookings(room.id, month);
  let blocks: RoomBlock[] = filterFallbackBlocks(room.id, month);

  if (hasAdminSupabase) {
    try {
      const admin = createAdminClient();
      const { monthStartKey, monthEndKey, nextMonthStartKey } =
        getMonthWindow(month);

      const [{ data: bookingData }, { data: blockData }] = await Promise.all([
        admin
          .from('bookings')
          .select('id, room_id, check_in, check_out, status')
          .eq('room_id', room.id)
          .neq('status', 'cancelled')
          .neq('status', 'no_show')
          .lt('check_in', nextMonthStartKey)
          .gt('check_out', monthStartKey),
        admin
          .from('room_blocks')
          .select('*')
          .eq('room_id', room.id)
          .lte('blocked_from', monthEndKey)
          .gte('blocked_to', monthStartKey),
      ]);

      if (bookingData) {
        bookings = bookingData as AvailabilityBooking[];
      }

      if (blockData) {
        blocks = blockData as RoomBlock[];
      }
    } catch {
      // Fallback already loaded.
    }
  }

  const bookedDates = Array.from(
    new Set(bookings.flatMap((booking) => enumerateBookedDates(booking.check_in, booking.check_out)))
  );
  const blockedDates = Array.from(
    new Set(blocks.flatMap((block) => enumerateBlockedDates(block.blocked_from, block.blocked_to)))
  );
  const { monthStart, monthEnd } = getMonthWindow(month);
  const monthDates = [];

  for (
    let day = monthStart;
    day <= monthEnd;
    day = new Date(day.getTime() + 86400000)
  ) {
    monthDates.push(format(day, 'yyyy-MM-dd'));
  }

  const unavailable = new Set([...bookedDates, ...blockedDates]);
  const availableDates = monthDates.filter((date) => !unavailable.has(date));

  return {
    room,
    month,
    bookings,
    blocks,
    bookedDates,
    blockedDates,
    availableDates,
  };
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  let bookings: AvailabilityBooking[] = LOCAL_BOOKING_FALLBACK.filter(
    (booking) =>
      booking.room_id === roomId &&
      rangesOverlap(booking.check_in, booking.check_out, checkIn, checkOut)
  );
  let blocks: RoomBlock[] = LOCAL_BLOCK_FALLBACK.filter(
    (block) =>
      block.room_id === roomId &&
      blockOverlapsRange(block.blocked_from, block.blocked_to, checkIn, checkOut)
  );

  if (hasAdminSupabase) {
    try {
      const admin = createAdminClient();
      const lastStayDate = format(subDays(new Date(`${checkOut}T00:00:00`), 1), 'yyyy-MM-dd');
      const { data: bookingData } = await admin
        .from('bookings')
        .select('id, room_id, check_in, check_out, status')
        .eq('room_id', roomId)
        .neq('status', 'cancelled')
        .neq('status', 'no_show')
        .lt('check_in', checkOut)
        .gt('check_out', checkIn);

      const { data: blockData } = await admin
        .from('room_blocks')
        .select('*')
        .eq('room_id', roomId)
        .lte('blocked_from', lastStayDate)
        .gte('blocked_to', checkIn);

      if (bookingData) {
        bookings = bookingData as AvailabilityBooking[];
      }

      if (blockData) {
        blocks = blockData as RoomBlock[];
      }
    } catch {
      // Fallback already loaded.
    }
  }

  return {
    available: bookings.length === 0 && blocks.length === 0,
    bookings,
    blocks,
  };
}
