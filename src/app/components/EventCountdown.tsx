"use client";

import { useEffect, useState } from "react";

const EVENT_NAME = "Carnival";
const EVENT_DATE_LABEL = "Wednesday 18 November 2026, 5:00 pm (UAE time)";
const EVENT_TIMESTAMP = new Date("2026-11-18T17:00:00+04:00").getTime();

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingUntilEvent(now: number): Remaining {
  const difference = Math.max(EVENT_TIMESTAMP - now, 0);
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function EventCountdown() {
  // Start empty so the server render and the first client render match.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(remainingUntilEvent(Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const units: [string, number | null][] = [
    ["Days", remaining?.days ?? null],
    ["Hours", remaining?.hours ?? null],
    ["Minutes", remaining?.minutes ?? null],
    ["Seconds", remaining?.seconds ?? null],
  ];

  return (
    <section aria-labelledby="next-event" className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
          <h2
            id="next-event"
            className="text-[clamp(36px,5vw,72px)] leading-[0.95] text-text"
          >
            Next up: {EVENT_NAME}
          </h2>
          <p className="text-[18px] text-muted">{EVENT_DATE_LABEL}</p>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-x-3 md:mt-14 md:gap-x-10">
          {units.map(([label, value]) => (
            <div key={label}>
              <p className="font-display text-[clamp(56px,15vw,224px)] font-extrabold leading-[0.85] tabular-nums text-ember">
                {value === null ? "--" : String(value).padStart(2, "0")}
              </p>
              <p className="mt-3 text-[16px] text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
