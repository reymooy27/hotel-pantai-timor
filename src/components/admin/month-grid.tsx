import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { CalendarEvent } from "@/lib/admin-config";

type MonthGridProps = {
  events: CalendarEvent[];
  months?: number;
};

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toneClasses(tone: string) {
  switch (tone) {
    case "amber":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "rose":
      return "border-rose-500/30 bg-rose-500/10 text-rose-200";
    default:
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
  }
}

export function MonthGrid({ events, months = 3 }: MonthGridProps) {
  const baseDate = new Date();
  const monthDates = Array.from({ length: months }, (_, index) => {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() + index, 1);
    return date;
  });

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {monthDates.map((monthDate) => {
        const days = eachDayOfInterval({
          start: startOfWeek(startOfMonth(monthDate)),
          end: endOfWeek(endOfMonth(monthDate)),
        });

        return (
          <section
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
            key={monthDate.toISOString()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {format(monthDate, "MMMM yyyy")}
              </h3>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Calendar
              </span>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {weekLabels.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const activeEvents = events.filter(
                  (event) => dayKey >= event.start && dayKey <= event.end
                );

                return (
                  <div
                    className={`min-h-24 rounded-2xl border p-2 text-xs ${
                      isSameMonth(day, monthDate)
                        ? "border-slate-800 bg-slate-950/80"
                        : "border-slate-900 bg-slate-950/40 text-slate-600"
                    }`}
                    key={day.toISOString()}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                          isToday(day)
                            ? "bg-cyan-500 text-slate-950"
                            : "text-slate-300"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {activeEvents.slice(0, 2).map((event) => (
                        <div
                          className={`rounded-xl border px-2 py-1 leading-tight ${toneClasses(
                            event.tone
                          )}`}
                          key={`${event.label}-${event.start}`}
                        >
                          {event.label}
                        </div>
                      ))}
                      {activeEvents.length > 2 ? (
                        <div className="text-[11px] text-slate-500">
                          +{activeEvents.length - 2} more
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
