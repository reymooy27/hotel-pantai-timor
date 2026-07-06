import { format } from "date-fns";

import type { Booking, PricingRule, Review, RoomBlock } from "@/lib/types";

export const HOTEL_NAME = "Hotel Pantai Timor";
export const ADMIN_COOKIE_NAME = "admin_password";

export const bookingStatusOptions: Booking["status"][] = [
  "pending",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
];

export const paymentStatusOptions: Booking["payment_status"][] = [
  "unpaid",
  "partial",
  "paid",
  "refunded",
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

export function formatDate(value: string) {
  return format(new Date(value), "dd MMM yyyy");
}

export function formatDateTime(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function getFirstValue(
  value: string | string[] | undefined,
  fallback = ""
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function getBookingStatusTone(status: Booking["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/15 text-yellow-300 ring-yellow-500/30";
    case "confirmed":
      return "bg-blue-500/15 text-blue-300 ring-blue-500/30";
    case "checked_in":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
    case "checked_out":
      return "bg-slate-500/15 text-slate-300 ring-slate-500/30";
    case "cancelled":
      return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
    case "no_show":
      return "bg-orange-500/15 text-orange-300 ring-orange-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-slate-500/30";
  }
}

export function getPaymentStatusTone(status: Booking["payment_status"]) {
  switch (status) {
    case "unpaid":
      return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
    case "partial":
      return "bg-yellow-500/15 text-yellow-300 ring-yellow-500/30";
    case "paid":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
    case "refunded":
      return "bg-slate-500/15 text-slate-300 ring-slate-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-slate-500/30";
  }
}

export function humanizeStatus(value: string) {
  return value.replaceAll("_", " ");
}

type WhatsAppBooking = Pick<
  Booking,
  | "id"
  | "guest_name"
  | "check_in"
  | "check_out"
  | "total_price"
  | "status"
  | "payment_status"
> & {
  room?: { name: string | null } | null;
};

export function buildBookingWhatsAppMessage(booking: WhatsAppBooking) {
  return [
    `Halo ${booking.guest_name},`,
    "",
    `Reservasi ${HOTEL_NAME} Anda:`,
    `Kode: ${booking.id}`,
    `Kamar: ${booking.room?.name ?? "-"}`,
    `Check-in: ${formatDate(booking.check_in)}`,
    `Check-out: ${formatDate(booking.check_out)}`,
    `Status: ${humanizeStatus(booking.status)}`,
    `Pembayaran: ${humanizeStatus(booking.payment_status)}`,
    `Total: ${formatCurrency(booking.total_price)}`,
    "",
    "Terima kasih.",
  ].join("\n");
}

type CalendarRange = {
  start: string;
  end: string;
  label: string;
  tone: string;
};

export function pricingRulesToCalendarEvents(rules: PricingRule[]): CalendarRange[] {
  return rules.map((rule) => ({
    start: rule.date_from,
    end: rule.date_to,
    label: `${rule.name} x${rule.multiplier}`,
    tone: "amber",
  }));
}

export function roomBlocksToCalendarEvents(
  blocks: (RoomBlock & { room?: { name: string | null } | null })[]
): CalendarRange[] {
  return blocks.map((block) => ({
    start: block.blocked_from,
    end: block.blocked_to,
    label: `${block.room?.name ?? "Room"}${block.reason ? `: ${block.reason}` : ""}`,
    tone: "rose",
  }));
}

export function reviewStatusLabel(review: Review) {
  return review.is_approved ? "approved" : "pending";
}

export type CalendarEvent = CalendarRange;
