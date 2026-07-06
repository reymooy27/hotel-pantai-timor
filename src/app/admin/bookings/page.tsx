import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  bookingStatusOptions,
  formatCurrency,
  formatDate,
  getFirstValue,
} from "@/lib/admin-config";
import { getBookings } from "@/lib/admin-data";

type BookingsPageProps = {
  searchParams: Promise<{
    from?: string | string[];
    sort?: string | string[];
    status?: string | string[];
    to?: string | string[];
  }>;
};

export default async function AdminBookingsPage({
  searchParams,
}: BookingsPageProps) {
  const filters = await searchParams;
  const status = getFirstValue(filters.status, "all");
  const sort = getFirstValue(filters.sort, "date_desc");
  const from = getFirstValue(filters.from);
  const to = getFirstValue(filters.to);

  const bookings = await getBookings({ from, sort, status, to });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Bookings</h1>
            <p className="mt-1 text-sm text-slate-400">
              Filter by status, date range, or review reservations by timeline.
            </p>
          </div>

          <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Status
              </span>
              <select
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                defaultValue={status}
                name="status"
              >
                <option value="all">All</option>
                {bookingStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                From
              </span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                defaultValue={from}
                name="from"
                type="date"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                To
              </span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                defaultValue={to}
                name="to"
                type="date"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Sort
              </span>
              <select
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                defaultValue={sort}
                name="sort"
              >
                <option value="date_desc">Stay date: newest first</option>
                <option value="date_asc">Stay date: oldest first</option>
                <option value="status">Status</option>
                <option value="created_desc">Created time</option>
              </select>
            </label>

            <button
              className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 lg:col-span-4"
              type="submit"
            >
              Apply filters
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Guest</th>
                <th className="pb-3 font-medium">Room</th>
                <th className="pb-3 font-medium">Stay</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  className="border-t border-slate-800/80 align-top transition hover:bg-slate-800/40"
                  key={booking.id}
                >
                  <td className="py-4">
                    <Link
                      className="block rounded-2xl px-1 py-1 transition hover:text-cyan-300"
                      href={`/admin/bookings/${booking.id}`}
                    >
                      <div className="font-medium text-white">{booking.guest_name}</div>
                      <div className="text-xs text-slate-500">{booking.guest_phone}</div>
                      <div className="mt-1 text-xs text-slate-400">{booking.source}</div>
                    </Link>
                  </td>
                  <td className="py-4 text-slate-300">
                    <div>{booking.room?.name ?? "-"}</div>
                    <div className="text-xs text-slate-500">
                      {formatCurrency(booking.total_price)}
                    </div>
                  </td>
                  <td className="py-4 text-slate-300">
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                  </td>
                  <td className="py-4">
                    <StatusBadge kind="payment" value={booking.payment_status} />
                  </td>
                  <td className="py-4">
                    <StatusBadge kind="booking" value={booking.status} />
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {booking.status === "pending" ? (
                        <ActionButton
                          body={{ status: "confirmed" }}
                          className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200"
                          endpoint={`/api/admin/bookings/${booking.id}`}
                          method="PUT"
                        >
                          Confirm
                        </ActionButton>
                      ) : null}
                      {booking.status !== "cancelled" ? (
                        <ActionButton
                          body={{ status: "cancelled" }}
                          className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200"
                          confirmText="Cancel this booking?"
                          endpoint={`/api/admin/bookings/${booking.id}`}
                          method="PUT"
                        >
                          Cancel
                        </ActionButton>
                      ) : null}
                      {booking.status === "confirmed" ? (
                        <ActionButton
                          body={{ status: "checked_in" }}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200"
                          endpoint={`/api/admin/bookings/${booking.id}`}
                          method="PUT"
                        >
                          Check-in
                        </ActionButton>
                      ) : null}
                      {booking.status === "checked_in" ? (
                        <ActionButton
                          body={{ status: "checked_out" }}
                          className="rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1.5 text-xs font-medium text-slate-200"
                          endpoint={`/api/admin/bookings/${booking.id}`}
                          method="PUT"
                        >
                          Check-out
                        </ActionButton>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
