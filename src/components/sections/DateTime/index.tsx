"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/content/wedding";
import { DrawPath, Reveal } from "@/components/motion";
import {
  buildIcs,
  countdown,
  googleCalendarUrl,
  monthGrid,
  zonedParts,
  type CalendarEvent,
  type Countdown,
} from "./ics";

const LOCALE = "es-CO";
const { date, date_section: copy, couple, events } = wedding;
const start = new Date(date.iso);
const parts = zonedParts(start, date.timezone);
const weeks = monthGrid(parts.year, parts.month);

const fmt = (o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: date.timezone, ...o });
const monthName = fmt({ month: "long", year: "numeric" }).format(start);
const longDate = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
  start,
);
const weekdays = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(LOCALE, { weekday: "narrow", timeZone: "UTC" }).format(
    new Date(Date.UTC(2023, 0, 1 + i)),
  ),
);
const unit = (n: number, u: "day" | "hour" | "minute") =>
  new Intl.NumberFormat(LOCALE, { style: "unit", unit: u, unitDisplay: "long" })
    .formatToParts(n)
    .filter((p) => p.type === "unit")
    .map((p) => p.value)
    .join("")
    .trim();

const ceremony = events[0];
const calEvent: CalendarEvent = {
  title: `${couple.partnerA} & ${couple.partnerB}`,
  start,
  location:
    [ceremony.name, ceremony.address].filter((s) => !s.startsWith("TODO")).join(", ") || undefined,
  description: wedding.quote,
};

const HEART =
  "M20 33 C9 25 3 18 3.5 11.5 C4 6 8 3 12 3.4 C16 3.8 18.5 6 20 9.5 C21.5 5.8 25 3 29 3.3 C33 3.6 37 7 36.6 12 C36 18.5 30 25 20 33 Z";

function downloadIcs() {
  const blob = new Blob([buildIcs(calEvent)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "boda.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function useCountdown(): Countdown | null {
  const [c, setC] = useState<Countdown | null>(null);
  useEffect(() => {
    const tick = () => setC(countdown(start, new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return c;
}

const btn =
  "inline-flex min-h-11 items-center justify-center rounded-s border border-accent px-m text-base text-accent " +
  "transition-colors duration-(--dur-quick) ease-out-quart hover:bg-accent hover:text-paper cursor-pointer";

export function DateTime() {
  const c = useCountdown();
  const cells = c
    ? ([
        [c.days, "day"],
        [c.hours, "hour"],
        [c.minutes, "minute"],
      ] as const)
    : null;

  return (
    <section className="paper relative px-gutter py-chapter text-ink">
      <div className="mx-auto flex max-w-[26rem] flex-col gap-xl">
        <Reveal>
          <h2 className="display text-2xl text-accent">{copy.title}</h2>
          <p className="mt-s text-lg capitalize text-ink-soft first-letter:capitalize">
            {longDate}
          </p>
        </Reveal>

        <Reveal>
          <div role="group" aria-label={monthName} className="border-y border-line py-m">
            <p className="display mb-s text-center text-xl capitalize">{monthName}</p>
            <table className="w-full table-fixed text-center">
              <thead>
                <tr>
                  {weekdays.map((d, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="pb-2xs text-xs font-medium uppercase text-metal-ink"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((w, wi) => (
                  <tr key={wi}>
                    {w.map((d, di) => {
                      const mark = d === parts.day;
                      return (
                        <td key={di} className="h-11 p-0 align-middle">
                          {d && (
                            <span
                              className={`relative mx-auto flex h-11 w-11 items-center justify-center ${mark ? "font-bold text-seal" : "text-ink-soft"}`}
                              aria-current={mark ? "date" : undefined}
                            >
                              {mark && (
                                <DrawPath
                                  d={HEART}
                                  viewBox="0 0 40 36"
                                  stroke="var(--seal)"
                                  strokeWidth={1.8}
                                  className="absolute inset-0 m-auto h-[2.9rem] w-[3.2rem] -translate-y-px"
                                />
                              )}
                              <span className="relative">{d}</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal>
          <div aria-live="off" className="min-h-[7.5rem]">
            {c && !c.past && cells && (
              <>
                <p className="text-base text-ink-soft">{copy.countdownLabel}</p>
                <dl className="mt-s grid grid-cols-3 divide-x divide-line">
                  {cells.map(([n, u]) => (
                    <div key={u} className="px-2xs text-center first:pl-0 last:pr-0">
                      <dd className="display m-0 text-3xl tabular-nums text-accent">{n}</dd>
                      <dt className="text-xs text-ink-soft">{unit(n, u)}</dt>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        </Reveal>

        <Reveal className="flex flex-col gap-xs sm:flex-row">
          <button type="button" className={btn} onClick={downloadIcs}>
            {copy.calendarButton}
          </button>
          <a
            className={btn}
            href={googleCalendarUrl(calEvent)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Calendar
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default DateTime;
