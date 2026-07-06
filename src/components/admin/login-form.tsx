"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { LockKeyhole } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Login failed");
        return;
      }

      startTransition(() => {
        router.push("/admin");
        router.refresh();
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Admin password</span>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
          <LockKeyhole className="h-4 w-4 text-slate-500" />
          <input
            autoComplete="current-password"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            type="password"
            value={password}
          />
        </div>
      </label>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <button
        className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Checking..." : "Enter dashboard"}
      </button>
    </form>
  );
}
