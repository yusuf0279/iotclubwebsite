import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Reveal } from "@/components/motion";
import { roles } from "@/lib/team";
import { allNews } from "@/lib/news";
import { formatNewsDate } from "@/lib/format";

export const metadata = {
  title: "About",
  description:
    "What the AUS IoT Club builds, how its members are organised, and what it has done since launch.",
};

// Parse as numbers so "2026-09-5" sorts before "2026-09-15".
const toDay = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

const timeline = [...allNews].sort((a, b) => toDay(a.date) - toDay(b.date));

const triptych = [
  {
    src: "/media/gallery/robot-cultural-event.jpeg",
    alt: "A club member posing beside the club robot at a cultural event stand",
  },
  {
    src: "/media/gallery/iot-photo-5.jpeg",
    alt: "A club member pointing up at the Internet of Things sign above the club's booth",
  },
  {
    src: "/media/gallery/iot-photo-2.jpeg",
    alt: "Club members posing together at a campus event",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO: type over a triptych of photos */}
      <section className="mx-auto max-w-[1280px] px-5 pt-10 md:px-10 md:pt-14">
        <h1 className="text-[clamp(48px,11vw,170px)] leading-[0.9] text-text">About the club</h1>
        <div className="mt-8 grid grid-cols-3 gap-2 md:mt-12 md:gap-5">
          {triptych.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 0.06} y={32}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={900}
                height={1200}
                priority={index === 0}
                sizes="(min-width: 1280px) 400px, 33vw"
                className="aspect-[3/5] w-full object-cover md:aspect-[3/4]"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATEMENT */}
      <section className="mx-auto max-w-[1280px] px-5 pt-28 md:px-10 md:pt-44">
        <Reveal>
          <p className="max-w-[22ch] text-[clamp(30px,5vw,76px)] font-medium leading-[1.08] text-text sm:max-w-[28ch] md:max-w-[26ch]">
            A student community for people who want to build things that sense, connect and act.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-10 max-w-xl text-[19px] leading-[1.6] text-muted">
            Members work on embedded hardware, software and automation, and they learn by building
            together: in workshops, at hackathons and at campus events.
          </p>
        </Reveal>
      </section>

      {/* GROUPS */}
      <section aria-labelledby="groups" className="mx-auto max-w-[1280px] px-5 pt-28 md:px-10 md:pt-44">
        <h2 id="groups" className="text-[clamp(17px,1.7vw,22px)] font-semibold normal-case tracking-normal text-muted">
          How the club is organised
        </h2>
        <ul className="mt-8 flex flex-col font-display text-[clamp(32px,5.6vw,80px)] font-extrabold uppercase leading-[1.05] text-text">
          {roles.map((role, index) => (
            <li
              key={role}
              className="flex items-baseline gap-4 border-t border-divider py-3 last:border-b md:gap-8 md:py-4"
            >
              <span aria-hidden="true" className="w-[2ch] shrink-0 text-[0.4em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              {role}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/team" variant="ghost">
            Meet the team
          </ButtonLink>
        </div>
      </section>

      {/* HISTORY */}
      <section aria-labelledby="history" className="mx-auto max-w-[1280px] px-5 pt-28 md:px-10 md:pt-44">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <h2 id="history" className="text-[clamp(17px,1.7vw,22px)] font-semibold normal-case tracking-normal text-muted">
              Since launch
            </h2>
            <p className="mt-3 font-display text-[clamp(82px,14.4vw,221px)] font-extrabold leading-[0.85] text-accent md:sticky md:top-10">
              2026
            </p>
          </div>

          <ol className="flex flex-col gap-12 md:gap-16">
            {timeline.map((item) => (
              <li key={item.id}>
                <Reveal>
                  <time dateTime={item.date} className="text-[16px] font-medium text-accent">
                    {formatNewsDate(item.date)} · {item.tag}
                  </time>
                  <Link
                    href={`/news/${item.id}`}
                    className="mt-2 block font-display text-[clamp(27px,3.7vw,54px)] font-extrabold uppercase leading-[0.98] text-text hover:text-accent"
                  >
                    {item.title.trim()}
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
