'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';

import { calculateStayPricing, getNights } from '@/lib/booking';
import type { BookingFormData, PricingRule, Room } from '@/lib/types';
import { cn, formatCurrency, formatDisplayDate } from '@/lib/utils';

interface BookingFormProps {
  rooms: Room[];
  pricingRules: PricingRule[];
  initialRoomId?: string;
  lockRoomSelection?: boolean;
}

const steps = ['Stay', 'Guest', 'Confirm'];

const emptyForm: BookingFormData = {
  room_id: '',
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  guest_id_number: '',
  check_in: '',
  check_out: '',
  num_guests: 1,
  notes: '',
};

export default function BookingForm({
  rooms,
  pricingRules,
  initialRoomId,
  lockRoomSelection = false,
}: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BookingFormData>({
    ...emptyForm,
    room_id: initialRoomId ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = rooms.find((room) => room.id === form.room_id) ?? null;
  const quote =
    selectedRoom && form.check_in && form.check_out
      ? calculateStayPricing(selectedRoom, form.check_in, form.check_out, pricingRules)
      : { nights: 0, total: 0, breakdown: [] };

  const canProceedStay =
    Boolean(form.room_id) &&
    Boolean(form.check_in) &&
    Boolean(form.check_out) &&
    getNights(form.check_in, form.check_out) > 0;

  const canProceedGuest =
    Boolean(form.guest_name.trim()) &&
    Boolean(form.guest_phone.trim()) &&
    Boolean(form.guest_email?.trim()) &&
    Boolean(form.guest_id_number?.trim()) &&
    form.num_guests > 0 &&
    (!selectedRoom || form.num_guests <= selectedRoom.max_guests);

  async function submitBooking() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as
        | { id: string }
        | { error: string };

      if (!response.ok || !('id' in payload)) {
        throw new Error(
          'error' in payload ? payload.error : 'Booking request failed.'
        );
      }

      router.push(`/booking/${payload.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Booking request failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {steps.map((label, index) => (
            <div
              key={label}
              className={cn(
                'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm',
                index <= step
                  ? 'border-[#d4a853]/35 bg-[#d4a853]/10 text-[#f5d48b]'
                  : 'border-white/10 text-slate-400'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  index < step
                    ? 'bg-[#d4a853] text-slate-950'
                    : index === step
                      ? 'bg-[#d4a853]/20 text-[#f5d48b]'
                      : 'bg-white/5 text-slate-300'
                )}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {label}
            </div>
          ))}
        </div>

        {step === 0 ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-3xl text-white">Select room and dates</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Pick stay period first. Final price updates with weekend or seasonal
                rates.
              </p>
            </div>

            {!lockRoomSelection ? (
              <div className="grid gap-4 md:grid-cols-3">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, room_id: room.id, num_guests: 1 }))
                    }
                    className={cn(
                      'rounded-[24px] border p-4 text-left transition',
                      form.room_id === room.id
                        ? 'border-[#d4a853]/40 bg-[#d4a853]/10'
                        : 'border-white/10 bg-slate-950/20 hover:border-white/20'
                    )}
                  >
                    <p className="font-serif text-2xl text-white">{room.name}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {formatCurrency(room.price_weekday)} weekday
                    </p>
                  </button>
                ))}
              </div>
            ) : selectedRoom ? (
              <div className="rounded-[24px] border border-[#d4a853]/30 bg-[#d4a853]/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#f5d48b]">
                  Selected room
                </p>
                <p className="mt-2 font-serif text-2xl text-white">
                  {selectedRoom.name}
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-200">Check-in</span>
                <input
                  type="date"
                  value={form.check_in}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      check_in: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-200">Check-out</span>
                <input
                  type="date"
                  value={form.check_out}
                  min={form.check_in || undefined}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      check_out: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-3xl text-white">Guest information</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Fill main guest data for confirmation and check-in verification.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm text-slate-200">Full name</span>
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      guest_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-200">Phone / WhatsApp</span>
                <input
                  type="tel"
                  value={form.guest_phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      guest_phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-200">Email</span>
                <input
                  type="email"
                  value={form.guest_email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      guest_email: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-200">KTP / passport</span>
                <input
                  type="text"
                  value={form.guest_id_number}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      guest_id_number: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-200">Guests</span>
                <input
                  type="number"
                  min={1}
                  max={selectedRoom?.max_guests ?? 6}
                  value={form.num_guests}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      num_guests: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm text-slate-200">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-[#d4a853]/40"
                />
              </label>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-3xl text-white">Review and confirm</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Final check before sending reservation request to hotel team.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/20 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Room
                  </p>
                  <p className="mt-2 text-lg text-white">{selectedRoom?.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Stay
                  </p>
                  <p className="mt-2 text-lg text-white">
                    {form.check_in && form.check_out
                      ? `${formatDisplayDate(form.check_in)} - ${formatDisplayDate(form.check_out)}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Guest
                  </p>
                  <p className="mt-2 text-lg text-white">{form.guest_name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Contact
                  </p>
                  <p className="mt-2 text-lg text-white">{form.guest_phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-5">
              {quote.breakdown.map((night) => (
                <div
                  key={night.date}
                  className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 text-sm last:border-none last:pb-0"
                >
                  <div>
                    <p className="text-white">{formatDisplayDate(night.date)}</p>
                    <p className="text-slate-400">
                      {night.label}
                      {night.ruleName ? ` · ${night.ruleName}` : ''}
                    </p>
                  </div>
                  <p className="font-medium text-[#f5d48b]">
                    {formatCurrency(night.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            className={cn(
              'rounded-full border px-5 py-3 text-sm font-medium transition',
              step === 0
                ? 'cursor-not-allowed border-white/5 text-slate-500'
                : 'border-white/10 text-white hover:border-[#d4a853]/35 hover:text-[#f5d48b]'
            )}
            disabled={step === 0}
          >
            Back
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={() => {
                if ((step === 0 && !canProceedStay) || (step === 1 && !canProceedGuest)) {
                  setError('Complete current step before continuing.');
                  return;
                }

                setError(null);
                startTransition(() => {
                  setStep((current) => current + 1);
                });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#d4a853] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#e6bb63]"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void submitBooking()}
              disabled={submitting}
              className="rounded-full bg-[#d4a853] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#e6bb63] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Confirm booking'}
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[#d4a853]">
            Booking summary
          </p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span>Room</span>
              <span className="text-right text-white">
                {selectedRoom?.name ?? 'Choose room'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Nights</span>
              <span className="text-white">{quote.nights}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Guests</span>
              <span className="text-white">{form.num_guests}</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between gap-3">
                <span>Total</span>
                <span className="text-xl font-semibold text-[#f5d48b]">
                  {formatCurrency(quote.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          Reservation requests are checked by hotel staff before final arrival
          instructions. Need quick help instead?{' '}
          <Link href="/#contact" className="text-[#f5d48b]">
            Contact front desk
          </Link>
          .
        </div>
      </aside>
    </div>
  );
}
