"use client";

import { useState } from "react";

type FocusArea = { title: string; description: string };

/** Focus areas set as a typographic index. Selecting one shows its description. */
export default function FocusIndex({ areas }: { areas: FocusArea[] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
      <ul className="flex flex-col">
        {areas.map((area, index) => {
          const active = index === selected;
          return (
            <li key={area.title}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(index)}
                onMouseEnter={() => setSelected(index)}
                onFocus={() => setSelected(index)}
                className={`block w-full text-left font-display text-[clamp(48px,9.5vw,136px)] font-extrabold uppercase leading-[0.95] transition-colors duration-150 ${
                  active ? "text-accent" : "text-muted/70 hover:text-text"
                }`}
              >
                {area.title}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="md:pt-4" aria-live="polite">
        <p className="text-[clamp(20px,2vw,26px)] leading-[1.45] text-text">
          {areas[selected].description}
        </p>
      </div>
    </div>
  );
}
