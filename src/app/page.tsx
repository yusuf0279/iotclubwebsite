import Image from "next/image";
import Link from "next/link";
import EventCountdown from "@/app/components/EventCountdown";
import FocusIndex from "@/components/focus-index";
import { ButtonLink, Reveal } from "@/components/motion";
import { allNews } from "@/lib/news";
import { formatNewsDate } from "@/lib/format";
import { APPLICATIONS_OPEN, CYCLE } from "@/lib/applications";

const focusAreas = [
  {
    title: "Hardware",
    description:
      "Arduino, ESP32, Raspberry Pi and embedded systems, built and debugged on the bench.",
  },
  {
    title: "Connectivity",
    description: "MQTT, LoRa, Zigbee and Wi-Fi: getting devices to talk to each other reliably.",
  },
  {
    title: "Data and cloud",
    description:
      "Dashboards, APIs and the infrastructure that turns sensor readings into decisions.",
  },
  {
    title: "Real impact",
    description: "Smart campus and sustainability projects that run outside the lab.",
  },
];

// Newest first, the same order as the news page.
const latestNews = [...allNews].reverse().slice(0, 3);

export default function HomePage() {
  const [lead, second, third] = latestNews;

  return (
    <>
      {/* HERO: display type over a wide photo stage */}
      <section className="mx-auto max-w-[1280px] px-5 pt-10 md:px-10 md:pt-14">
        <h1 className="text-[clamp(44px,9.4vw,148px)] leading-[0.92] text-text">
          Students building connected systems
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-[clamp(19px,1.9vw,24px)] leading-[1.45] text-muted">
            The AUS IoT Club is a student community working on embedded hardware, software and
            intelligent automation.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">Join the club</ButtonLink>
            <ButtonLink href="/news" variant="ghost">
              Read the news
            </ButtonLink>
          </div>
        </div>

        <Image
          src="/media/gallery/iot-photo-3.jpg"
          alt="Club members working together at a table with laptops and electronics"
          width={4000}
          height={2252}
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="mt-10 aspect-[4/3] w-full object-cover md:mt-12 md:aspect-[16/7]"
        />
      </section>

      <div className="mt-24 md:mt-36">
        <EventCountdown />
      </div>

      {/* FOCUS AREAS */}
      <section className="mx-auto max-w-[1280px] px-5 pt-28 md:px-10 md:pt-44">
        <Reveal>
          <h2 className="text-[clamp(20px,2vw,26px)] font-semibold normal-case tracking-normal text-muted">
            What we work on
          </h2>
        </Reveal>
        <div className="mt-8">
          <FocusIndex areas={focusAreas} />
        </div>
      </section>

      {/* PHOTO PAIR */}
      <section
        aria-label="Photos from club events"
        className="mx-auto grid max-w-[1280px] gap-5 px-5 pt-28 md:grid-cols-[5fr_7fr] md:items-end md:px-10 md:pt-44"
      >
        <Reveal>
          <figure>
            <Image
              src="/media/gallery/iot-photo-1.jpeg"
              alt="A club robot in an AUS Engineers shirt, posing with a visitor at a campus event"
              width={1600}
              height={2000}
              sizes="(min-width: 768px) 42vw, 100vw"
              className="aspect-[4/5] w-full object-cover object-[center_30%]"
            />
            <figcaption className="mt-3 text-[14px] text-muted">
              The club&apos;s robot at a campus event.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.06}>
          <Image
            src="/media/gallery/iot-photo-8.jpg"
            alt="Two club members at an event stand, one holding a small device"
            width={1600}
            height={1066}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
          <Link
            href="/media"
            className="mt-5 inline-block text-[18px] font-semibold text-accent hover:underline"
          >
            More photos
          </Link>
        </Reveal>
      </section>

      {/* NEWS: an offset spread of posters */}
      <section className="mx-auto max-w-[1280px] px-5 pt-28 md:px-10 md:pt-44">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="text-[clamp(44px,7vw,104px)] leading-[0.92] text-text">Latest</h2>
          </Reveal>
          <Link href="/news" className="pb-2 text-[18px] font-semibold text-accent hover:underline">
            All news and events
          </Link>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-12 md:items-start">
          {[lead, second, third].map((item, index) => {
            if (!item) return null;
            const layout = [
              "md:col-span-6",
              "md:col-span-3 md:mt-24",
              "md:col-span-3 md:mt-48",
            ][index];
            return (
              <Reveal key={item.id} delay={index * 0.06} className={layout}>
                <Link href={`/news/${item.id}`} className="group block">
                  <Image
                    src={item.image}
                    alt={item.title.trim()}
                    width={1200}
                    height={1500}
                    sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                    className="aspect-[4/5] w-full bg-surface object-contain transition-opacity duration-150 group-hover:opacity-90"
                  />
                  <p className="mt-4 text-[16px] text-muted">
                    {item.tag} · {formatNewsDate(item.date)}
                  </p>
                  <p
                    className={`mt-1 font-display font-extrabold uppercase leading-[1] text-text group-hover:text-accent ${
                      index === 0 ? "text-[clamp(28px,3.4vw,48px)]" : "text-[clamp(22px,2.2vw,30px)]"
                    }`}
                  >
                    {item.title.trim()}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* JOIN: a typographic call to action */}
      <section className="mx-auto max-w-[1280px] px-5 pt-32 md:px-10 md:pt-52">
        <Link href="/contact" className="group block">
          <span className="block font-display text-[clamp(64px,17vw,260px)] font-extrabold uppercase leading-[0.85] text-text transition-colors duration-150 group-hover:text-accent">
            Join us
          </span>
        </Link>
        <p className="mt-8 max-w-xl text-[19px] leading-[1.5] text-muted">
          {APPLICATIONS_OPEN
            ? `Applications for the ${CYCLE} cycle are open.`
            : `Applications for the ${CYCLE} cycle are closed.`}{" "}
          Questions about projects or workshops:{" "}
          <a href="mailto:iotclub@aus.edu" className="text-accent hover:underline">
            iotclub@aus.edu
          </a>
        </p>
      </section>
    </>
  );
}
