"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { ActionButton } from "@/components/admin/action-button";
import type { RoomBlockWithRoom } from "@/lib/admin-data";
import type { Room } from "@/lib/types";

type BlocksManagerProps = {
  blocks: RoomBlockWithRoom[];
  rooms: Room[];
};

export function BlocksManager({ blocks, rooms }: BlocksManagerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocked_from: formData.get("blocked_from"),
          blocked_to: formData.get("blocked_to"),
          reason: formData.get("reason"),
          room_id: formData.get("room_id"),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Create failed");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
      event.currentTarget.reset();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-2xl font-semibold text-white">Room blocks</h1>
          <p className="mt-1 text-sm text-slate-400">
            Reserve dates for maintenance, private use, or renovation downtime.
          </p>

          <form
            className="mt-6 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
            onSubmit={handleCreate}
          >
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Room</span>
              <select
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                name="room_id"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Blocked from</span>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  name="blocked_from"
                  type="date"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Blocked to</span>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  name="blocked_to"
                  type="date"
                />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Reason</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                name="reason"
                placeholder="maintenance"
              />
            </label>
            <button
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Adding..." : "Add block"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <h2 className="text-lg font-semibold text-white">Current blocks</h2>
          <div className="mt-4 space-y-3">
            {blocks.map((block) => (
              <div
                className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                key={block.id}
              >
                <div>
                  <p className="font-medium text-white">{block.room?.name ?? "Room"}</p>
                  <p className="text-sm text-slate-400">
                    {block.blocked_from} - {block.blocked_to}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{block.reason ?? "No reason"}</p>
                </div>
                <ActionButton
                  body={{ id: block.id }}
                  className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200"
                  confirmText="Delete room block?"
                  endpoint="/api/admin/blocks"
                  method="DELETE"
                >
                  Delete
                </ActionButton>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
