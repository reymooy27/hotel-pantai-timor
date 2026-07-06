"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Printer, Send } from "lucide-react";

import { ActionButton } from "@/components/admin/action-button";
import {
  bookingStatusOptions,
  buildBookingWhatsAppMessage,
  humanizeStatus,
  paymentStatusOptions,
} from "@/lib/admin-config";
import type { BookingWithRoom } from "@/lib/admin-data";

export function BookingDetailPanel({ booking }: { booking: BookingWithRoom }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_notes: formData.get("admin_notes"),
          guest_email: formData.get("guest_email"),
          guest_name: formData.get("guest_name"),
          guest_phone: formData.get("guest_phone"),
          notes: formData.get("notes"),
          payment_status: formData.get("payment_status"),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Save failed");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendWhatsApp() {
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: buildBookingWhatsAppMessage(booking),
          phone: booking.guest_phone,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "WhatsApp send failed");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <form className="mt-6 space-y-4" onSubmit={handleSave}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Guest Name</span>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
              defaultValue={booking.guest_name}
              name="guest_name"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Guest Phone</span>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
              defaultValue={booking.guest_phone}
              name="guest_phone"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Guest Email</span>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
              defaultValue={booking.guest_email ?? ""}
              name="guest_email"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Payment Status</span>
            <select
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
              defaultValue={booking.payment_status}
              name="payment_status"
            >
              {paymentStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {humanizeStatus(option)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Guest Notes</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            defaultValue={booking.notes ?? ""}
            name="notes"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Admin Notes</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            defaultValue={booking.admin_notes ?? ""}
            name="admin_notes"
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving..." : "Save booking details"}
        </button>
      </form>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Change status</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {bookingStatusOptions.map((status) => (
            <ActionButton
              body={{ status }}
              className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-500/30 hover:text-white"
              endpoint={`/api/admin/bookings/${booking.id}`}
              key={status}
              method="PUT"
            >
              {humanizeStatus(status)}
            </ActionButton>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Actions</h2>
        <div className="mt-5 grid gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            onClick={() => window.print()}
            type="button"
          >
            <Printer className="h-4 w-4" />
            Print confirmation
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-70"
            disabled={isSending}
            onClick={handleSendWhatsApp}
            type="button"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending..." : "Send WhatsApp notification"}
          </button>
        </div>
      </section>
    </>
  );
}
