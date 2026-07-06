"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { ActionButton } from "@/components/admin/action-button";
import { formatCurrency } from "@/lib/admin-config";
import type { Room } from "@/lib/types";

export function RoomsManager({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id"));

    setSavingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/rooms", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.get("description"),
          id,
          name: formData.get("name"),
          price_high_season: Number(formData.get("price_high_season")) || null,
          price_weekday: Number(formData.get("price_weekday")),
          price_weekend: Number(formData.get("price_weekend")),
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
      setSavingId(null);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      {rooms.map((room) => (
        <form
          className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
          key={room.id}
          onSubmit={handleSave}
        >
          <input name="id" type="hidden" value={room.id} />

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">{room.name}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    room.is_active
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-500/15 text-slate-300"
                  }`}
                >
                  {room.is_active ? "active" : "inactive"}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">{room.description}</p>
            </div>

            <ActionButton
              body={{ id: room.id, is_active: !room.is_active }}
              className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              endpoint="/api/admin/rooms"
              method="PATCH"
            >
              {room.is_active ? "Set inactive" : "Set active"}
            </ActionButton>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Room Name</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                defaultValue={room.name}
                name="name"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Weekday Price</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                defaultValue={room.price_weekday}
                name="price_weekday"
                type="number"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Weekend Price</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                defaultValue={room.price_weekend}
                name="price_weekend"
                type="number"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">High Season Price</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                defaultValue={room.price_high_season ?? ""}
                name="price_high_season"
                type="number"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm text-slate-300">Description</span>
            <textarea
              className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              defaultValue={room.description ?? ""}
              name="description"
            />
          </label>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Current base range: {formatCurrency(room.price_weekday)} -{" "}
              {formatCurrency(room.price_weekend)}
            </div>
            <button
              className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
              disabled={savingId === room.id}
              type="submit"
            >
              {savingId === room.id ? "Saving..." : "Save room"}
            </button>
          </div>
        </form>
      ))}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
