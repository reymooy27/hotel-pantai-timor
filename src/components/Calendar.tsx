'use client';

import { format, startOfMonth } from 'date-fns';
import { useEffect, useState, useTransition } from 'react';
import { DayPicker } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';

interface AvailabilityPayload {
  month: string;
  bookedDates: string[];
  blockedDates: string[];
  availableDates: string[];
}

interface CalendarProps {
  roomSlug: string;
  initialMonth?: string;
}

export default function Calendar({
  roomSlug,
  initialMonth,
}: CalendarProps) {
  const baseMonth = initialMonth
    ? startOfMonth(new Date(`${initialMonth}-01T00:00:00`))
    : startOfMonth(new Date());
  const [month, setMonth] = useState(baseMonth);
  const [availability, setAvailability] = useState<AvailabilityPayload | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        const monthKey = format(month, 'yyyy-MM');
        const response = await fetch(
          `/api/rooms/${roomSlug}/availability?month=${monthKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to load availability.');
        }

        const payload = (await response.json()) as AvailabilityPayload;

        if (!cancelled) {
          setAvailability(payload);
          setError(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Failed to load availability.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [month, roomSlug]);

  const booked = availability?.bookedDates.map((date) => new Date(`${date}T00:00:00`)) ?? [];
  const blocked = availability?.blockedDates.map((date) => new Date(`${date}T00:00:00`)) ?? [];
  const available =
    availability?.availableDates.map((date) => new Date(`${date}T00:00:00`)) ?? [];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-[#d4a853]">
            <CalendarDays className="h-4 w-4" />
            Availability
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Green available, red booked, gray blocked.
          </p>
        </div>
        {loading || isPending ? (
          <span className="text-sm text-slate-400">Loading...</span>
        ) : null}
      </div>

      <DayPicker
        mode="single"
        month={month}
        onMonthChange={(nextMonth) => {
          setLoading(true);
          setError(null);
          startTransition(() => {
            setMonth(startOfMonth(nextMonth));
          });
        }}
        showOutsideDays
        modifiers={{
          booked,
          blocked,
          available,
        }}
        modifiersClassNames={{
          booked: 'rdp-booked',
          blocked: 'rdp-blocked',
          available: 'rdp-available',
        }}
        className="hotel-calendar"
      />

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-300">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Available
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Booked
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
          Blocked
        </span>
      </div>
    </div>
  );
}
