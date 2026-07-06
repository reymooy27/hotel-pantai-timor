"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import {
  BedDouble,
  CalendarRange,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  NotebookPen,
  PanelLeftClose,
  Power,
  Tags,
} from "lucide-react";

import { HOTEL_NAME } from "@/lib/admin-config";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: NotebookPen },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/pricing", label: "Pricing", icon: Tags },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/admin/blocks", label: "Room Blocks", icon: CalendarRange },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      startTransition(() => {
        router.push("/admin/login");
        router.refresh();
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-900/95 px-5 py-6 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                Admin Panel
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">{HOTEL_NAME}</h2>
            </div>
            <button
              className="rounded-full border border-slate-700 p-2 text-slate-300 lg:hidden"
              onClick={() => setOpen(false)}
              type="button"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open ? (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-full border border-slate-700 p-2 text-slate-300 lg:hidden"
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Hotel Operations
                  </p>
                  <h1 className="text-lg font-semibold text-white">{HOTEL_NAME}</h1>
                </div>
              </div>

              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                disabled={isLoggingOut}
                onClick={handleLogout}
                type="button"
              >
                <Power className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
