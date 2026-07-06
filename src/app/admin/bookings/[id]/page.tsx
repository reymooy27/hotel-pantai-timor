import { BookingDetailPanel } from "@/components/admin/booking-detail-panel";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  bookingStatusOptions,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/admin-config";
import { getBookingById } from "@/lib/admin-data";

type BookingDetailPageProps = {
  params: Promise<{ id: string }>;
};

const timelineLabels = [
  { key: "pending", text: "Booking created" },
  { key: "confirmed", text: "Reservation confirmed" },
  { key: "checked_in", text: "Guest checked in" },
  { key: "checked_out", text: "Guest checked out" },
];

export default async function AdminBookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params;
  const booking = await getBookingById(id);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                Booking #{booking.id.slice(0, 8)}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white">
                {booking.guest_name}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {booking.room?.name ?? "-"} • {formatDate(booking.check_in)} -{" "}
                {formatDate(booking.check_out)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge kind="booking" value={booking.status} />
              <StatusBadge kind="payment" value={booking.payment_status} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard label="Phone" value={booking.guest_phone} />
            <InfoCard label="Email" value={booking.guest_email ?? "-"} />
            <InfoCard label="Guests" value={String(booking.num_guests)} />
            <InfoCard label="ID Number" value={booking.guest_id_number ?? "-"} />
            <InfoCard label="Source" value={booking.source} />
            <InfoCard label="Payment Method" value={booking.payment_method ?? "-"} />
            <InfoCard label="Created" value={formatDateTime(booking.created_at)} />
            <InfoCard label="Total" value={formatCurrency(booking.total_price)} />
          </div>

          <BookingDetailPanel booking={booking} />
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">Status timeline</h2>
            <div className="mt-5 space-y-4">
              {timelineLabels.map((item) => {
                const active =
                  bookingStatusOptions.indexOf(booking.status) >=
                    bookingStatusOptions.indexOf(item.key as typeof booking.status) &&
                  booking.status !== "cancelled";

                return (
                  <div className="flex gap-3" key={item.key}>
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        active ? "bg-cyan-400" : "bg-slate-700"
                      }`}
                    />
                    <div>
                      <p className={active ? "text-white" : "text-slate-400"}>{item.text}</p>
                      <p className="text-xs text-slate-500">
                        {active ? formatDateTime(booking.updated_at) : "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
              {booking.status === "cancelled" ? (
                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-rose-400" />
                  <div>
                    <p className="text-white">Booking cancelled</p>
                    <p className="text-xs text-slate-500">{formatDateTime(booking.updated_at)}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}
