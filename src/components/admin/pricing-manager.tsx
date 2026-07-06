"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { ActionButton } from "@/components/admin/action-button";
import type { PricingRule } from "@/lib/types";

export function PricingManager({ rules }: { rules: PricingRule[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState("");

  async function submitRule(
    event: React.FormEvent<HTMLFormElement>,
    method: "POST" | "PUT",
    busyLabel: string
  ) {
    event.preventDefault();
    setError("");
    setBusyKey(busyLabel);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/pricing", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_from: formData.get("date_from"),
          date_to: formData.get("date_to"),
          id: formData.get("id"),
          is_active: formData.get("is_active") === "on",
          multiplier: Number(formData.get("multiplier")),
          name: formData.get("name"),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Request failed");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
      event.currentTarget.reset();
    } finally {
      setBusyKey("");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-2xl font-semibold text-white">Seasonal pricing</h1>
          <p className="mt-1 text-sm text-slate-400">
            Add multipliers for holidays, peak travel, and special campaigns.
          </p>

          <form
            className="mt-6 grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 md:grid-cols-2"
            onSubmit={(event) => submitRule(event, "POST", "create")}
          >
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-slate-300">Rule name</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                name="name"
                placeholder="Natal & Tahun Baru"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Date from</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                name="date_from"
                type="date"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Date to</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                name="date_to"
                type="date"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Multiplier</span>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                defaultValue="1.5"
                name="multiplier"
                step="0.01"
                type="number"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              <input className="accent-cyan-400" defaultChecked name="is_active" type="checkbox" />
              Active rule
            </label>
            <button
              className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 md:col-span-2 disabled:opacity-70"
              disabled={busyKey === "create"}
              type="submit"
            >
              {busyKey === "create" ? "Adding..." : "Add pricing rule"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <h2 className="text-lg font-semibold text-white">Rules list</h2>
          <div className="mt-4 space-y-3">
            {rules.map((rule) => (
              <form
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                key={rule.id}
                onSubmit={(event) => submitRule(event, "PUT", rule.id)}
              >
                <input name="id" type="hidden" value={rule.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none md:col-span-2"
                    defaultValue={rule.name}
                    name="name"
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                    defaultValue={rule.date_from}
                    name="date_from"
                    type="date"
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                    defaultValue={rule.date_to}
                    name="date_to"
                    type="date"
                  />
                  <input
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                    defaultValue={rule.multiplier}
                    name="multiplier"
                    step="0.01"
                    type="number"
                  />
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                    <input
                      className="accent-cyan-400"
                      defaultChecked={rule.is_active}
                      name="is_active"
                      type="checkbox"
                    />
                    Active
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
                    disabled={busyKey === rule.id}
                    type="submit"
                  >
                    {busyKey === rule.id ? "Saving..." : "Save"}
                  </button>
                  <ActionButton
                    body={{ id: rule.id }}
                    className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200"
                    confirmText="Delete pricing rule?"
                    endpoint="/api/admin/pricing"
                    method="DELETE"
                  >
                    Delete
                  </ActionButton>
                </div>
              </form>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
