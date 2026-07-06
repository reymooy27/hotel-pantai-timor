"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type ActionButtonProps = {
  body?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  confirmText?: string;
  endpoint: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  onSuccess?: () => void;
};

export function ActionButton({
  body,
  children,
  className,
  confirmText,
  endpoint,
  method = "PATCH",
  onSuccess,
}: ActionButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Request failed");
        return;
      }

      onSuccess?.();
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        className={className}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        {isPending ? "Working..." : children}
      </button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
