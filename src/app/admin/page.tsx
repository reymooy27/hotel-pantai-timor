import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck2,
  CalendarX2,
  CircleDollarSign,
  Hotel,
} from "lucide-react";

import { StatusBadge } from "@/components/admin/status-badge";
import {
  formatCurrency,
  formatDate,
  formatPercent,
} from "@/lib/admin-config";
import { getDashboardSnapshot } from "@/lib/admin-data";

const quickActions = [
  {
    href: "/admin/bookings?status=pending",
    icon: CalendarCheck2,
    label: "New Booking",
    text: "Open booking queue and confirm new reservations.",
  },
  {
    href: "/admin/blocks",
    icon: BedDouble,
    label: "Block Room",
    text: "Schedule maintenance and room closures.",
  },
];

export default async function AdminDashboardPage() {
  const snapshot = await getDashboardSnapshot();

  const stats = [
    {
      icon: CalendarCheck2,
      label: "Today's check-ins",
      value: snapshot.todayCheckIns,
    },
    {
      icon: CalendarX2,
      label: "Today's check-outs",
      value: snapshot.todayCheckOuts,
    },
    {
      icon: Hotel,
      label: "Bookings this month",
      value: snapshot.bookingsThisMonth,
    },
    {
      icon: CircleDollarSign,
      label: "Revenue this month",
      value: formatCurrency(snapshot.revenueThisMonth),
    },
    {
      icon: BedDouble,
      label: "Occupancy rate",
      value: formatPercent(snapshot.occupancyRate),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5"
              key={stat.label}
            >
              <div className="mb-4 inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent bookings</h2>
              <p className="text-sm text-slate-400">Last 10 reservations across all channels.</p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              href="/admin/bookings"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Stay</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.recentBookings.map((booking) => (
                  <tr
                    className="border-t border-slate-800/80 transition hover:bg-slate-800/40"
                    key={booking.id}
                  >
                    <td className="py-4">
                      <div className="font-medium text-white">{booking.guest_name}</div>
                      <div className="text-xs text-slate-500">{booking.guest_phone}</div>
                    </td>
                    <td className="py-4 text-slate-300">{booking.room?.name ?? "-"}</td>
                    <td className="py-4 text-slate-300">
                      {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    </td>
                    <td className="py-4">
                      <StatusBadge kind="booking" value={booking.status} />
                    </td>
                    <td className="py-4 text-white">{formatCurrency(booking.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-400">
            Shortcuts for daily front office work.
          </p>
          <div className="mt-5 space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  className="block rounded-3xl border border-slate-800 bg-slate-950/80 p-5 transition hover:border-cyan-500/30 hover:bg-slate-950"
                  href={action.href}
                  key={action.href}
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{action.label}</h3>
                  <p className="mt-2 text-sm text-slate-400">{action.text}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
