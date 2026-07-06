import "server-only";

import { endOfMonth, formatISO, startOfMonth } from "date-fns";

import {
  createAdminClient,
} from "@/lib/supabase";
import type { Booking, PricingRule, Review, Room, RoomBlock } from "@/lib/types";

export type BookingWithRoom = Booking & { room: Room | null };
export type RoomBlockWithRoom = RoomBlock & { room: Pick<Room, "id" | "name"> | null };

const bookingSelect = "*, room:rooms(*)";
const roomBlockSelect = "*, room:rooms(id,name)";

function throwIfError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardSnapshot() {
  const supabase = createAdminClient();
  const today = formatISO(new Date(), { representation: "date" });
  const monthStart = formatISO(startOfMonth(new Date()), { representation: "date" });
  const monthEnd = formatISO(endOfMonth(new Date()), { representation: "date" });

  const [
    checkInsResult,
    checkOutsResult,
    monthBookingsResult,
    revenueResult,
    totalRoomsResult,
    occupiedRoomsResult,
    recentBookingsResult,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("check_in", today)
      .not("status", "in", "(cancelled,no_show)"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("check_out", today)
      .not("status", "in", "(cancelled,no_show)"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", `${monthStart}T00:00:00`)
      .lte("created_at", `${monthEnd}T23:59:59`),
    supabase
      .from("bookings")
      .select("total_price")
      .gte("created_at", `${monthStart}T00:00:00`)
      .lte("created_at", `${monthEnd}T23:59:59`)
      .in("status", ["confirmed", "checked_in", "checked_out"]),
    supabase
      .from("rooms")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .lte("check_in", today)
      .gt("check_out", today)
      .in("status", ["confirmed", "checked_in"]),
    supabase
      .from("bookings")
      .select(bookingSelect)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  [
    checkInsResult,
    checkOutsResult,
    monthBookingsResult,
    totalRoomsResult,
    occupiedRoomsResult,
    recentBookingsResult,
  ].forEach((result) => throwIfError(result.error));
  throwIfError(revenueResult.error);

  const revenue =
    revenueResult.data?.reduce((sum, booking) => sum + booking.total_price, 0) ?? 0;
  const totalRooms = totalRoomsResult.count ?? 0;
  const occupiedRooms = occupiedRoomsResult.count ?? 0;

  return {
    todayCheckIns: checkInsResult.count ?? 0,
    todayCheckOuts: checkOutsResult.count ?? 0,
    bookingsThisMonth: monthBookingsResult.count ?? 0,
    revenueThisMonth: revenue,
    occupancyRate: totalRooms === 0 ? 0 : (occupiedRooms / totalRooms) * 100,
    recentBookings: (recentBookingsResult.data ?? []) as BookingWithRoom[],
  };
}

type BookingsFilters = {
  from?: string;
  sort?: string;
  status?: string;
  to?: string;
};

export async function getBookings(filters: BookingsFilters = {}) {
  const supabase = createAdminClient();
  let query = supabase.from("bookings").select(bookingSelect);

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.from) {
    query = query.gte("check_in", filters.from);
  }

  if (filters.to) {
    query = query.lte("check_out", filters.to);
  }

  switch (filters.sort) {
    case "date_asc":
      query = query.order("check_in", { ascending: true });
      break;
    case "status":
      query = query.order("status", { ascending: true }).order("check_in", {
        ascending: true,
      });
      break;
    case "created_desc":
      query = query.order("created_at", { ascending: false });
      break;
    case "date_desc":
    default:
      query = query.order("check_in", { ascending: false });
      break;
  }

  const result = await query;
  throwIfError(result.error);
  return (result.data ?? []) as BookingWithRoom[];
}

export async function getBookingById(id: string) {
  const supabase = createAdminClient();
  const result = await supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("id", id)
    .single();

  throwIfError(result.error);
  return result.data as BookingWithRoom;
}

export async function getRooms() {
  const supabase = createAdminClient();
  const result = await supabase.from("rooms").select("*").order("name");
  throwIfError(result.error);
  return (result.data ?? []) as Room[];
}

export async function getPricingRules() {
  const supabase = createAdminClient();
  const result = await supabase
    .from("pricing_rules")
    .select("*")
    .order("date_from", { ascending: true });
  throwIfError(result.error);
  return (result.data ?? []) as PricingRule[];
}

export async function getReviews(status = "all") {
  const supabase = createAdminClient();
  let query = supabase.from("reviews").select("*").order("created_at", {
    ascending: false,
  });

  if (status === "approved") {
    query = query.eq("is_approved", true);
  }

  if (status === "pending") {
    query = query.eq("is_approved", false);
  }

  const result = await query;
  throwIfError(result.error);
  return (result.data ?? []) as Review[];
}

export async function getRoomBlocks() {
  const supabase = createAdminClient();
  const result = await supabase
    .from("room_blocks")
    .select(roomBlockSelect)
    .order("blocked_from", { ascending: true });
  throwIfError(result.error);
  return (result.data ?? []) as RoomBlockWithRoom[];
}
