"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { allNews } from "@/lib/news";
import { formatNewsDate } from "@/lib/format";

const tags = ["All", "Announcement", "Workshop", "Event", "Talk", "Project"];

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState("All");

  // Newest first.
  const newestFirst = [...allNews].reverse();
  const items =
    activeTag === "All" ? newestFirst : newestFirst.filter((item) => item.tag === activeTag);

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-10 md:px-10 md:pt-14">
      <h1 className="text-[clamp(48px,10.2vw,150px)] leading-[0.9] text-text">News and events</h1>

      <div
        role="group"
        aria-label="Filter by type"
        className="mt-8 flex gap-6 overflow-x-auto pb-1 md:mt-10"
      >
        {tags.map((tag) => {
          const active = tag === activeTag;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 py-2 text-[18px] font-medium transition-colors duration-150 ${
                active ? "text-accent underline decoration-2 underline-offset-8" : "text-muted hover:text-text"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="mt-16 text-[19px] text-muted">Nothing in this category yet.</p>
      )}

      {/* EVENT RULER: real posters strung along a dated line, newest first */}
      {items.length > 0 && (
        <section aria-label="Events on a timeline" className="mt-10">
          <ol className="flex snap-x gap-5 overflow-x-auto pb-6 md:gap-6">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="relative w-[64vw] shrink-0 snap-start sm:w-[44vw] md:w-0 md:min-w-[170px] md:flex-1"
              >
                <Reveal delay={index * 0.05} y={28}>
                  <Link href={`/news/${item.id}`} className="group block">
                    <Image
                      src={item.image}
                      alt={item.title.trim()}
                      width={800}
                      height={1000}
                      priority={index < 3}
                      sizes="(min-width: 768px) 20vw, 64vw"
                      className="aspect-[4/5] w-full bg-surface object-contain transition-opacity duration-150 group-hover:opacity-90"
                    />
                    <div className="mt-5 border-t-2 border-control pt-4 group-hover:border-accent">
                      <p className="text-[16px] font-semibold text-accent">
                        {formatNewsDate(item.date)}
                      </p>
                      <p className="mt-1 font-display text-[22px] font-extrabold uppercase leading-[1] text-text group-hover:text-accent">
                        {item.title.trim()}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* READING LIST: titles and summaries */}
      {items.length > 0 && (
        <section aria-label="All stories" className="mt-24 md:mt-36">
          <ul className="flex flex-col gap-14 md:gap-20">
            {items.map((item) => (
              <li key={item.id} className="grid gap-3 md:grid-cols-[1fr_3fr] md:gap-10">
                <Reveal className="md:contents">
                  <p className="text-[16px] text-muted md:pt-3">
                    {item.tag}
                    <br />
                    {formatNewsDate(item.date)} · {item.readTime}
                  </p>
                  <div>
                    <Link
                      href={`/news/${item.id}`}
                      className="block font-display text-[clamp(31px,5.1vw,75px)] font-extrabold uppercase leading-[0.95] text-text hover:text-accent"
                    >
                      {item.title.trim()}
                    </Link>
                    {item.bio.trim() && (
                      <p className="mt-4 max-w-2xl text-[19px] leading-[1.55] text-muted">
                        {item.bio.trim()}
                      </p>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
