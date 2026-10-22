import Image from "next/image";
import { ButtonLink, Reveal } from "@/components/motion";
import { APPLICATIONS_OPEN, APPLICATION_URL, CYCLE, DEADLINE } from "@/lib/applications";

export const metadata = {
  title: "Join",
  description: `How to join the AUS IoT Club: ${CYCLE} recruitment status, what members get, and how to get in touch.`,
};

const reasons = [
  {
    title: "Hands-on hardware",
    desc: "Build real systems using microcontrollers, sensors, robotics and embedded devices.",
  },
  {
    title: "Project teams",
    desc: "Gain practical experience through workshops, team projects and technical challenges.",
  },
  {
    title: "Industry exposure",
    desc: "Connect with engineers, alumni and technology companies.",
  },
  {
    title: "Leadership",
    desc: "Lead workshops, events and technical initiatives.",
  },
];

export default function JoinPage() {
  return (
    <>
      {/* HERO: photo left, type right */}
      <section className="mx-auto grid max-w-[1280px] gap-8 px-5 pt-10 md:grid-cols-[5fr_7fr] md:items-end md:gap-14 md:px-10 md:pt-14">
        <Image
          src="/media/gallery/iot-photo-5.jpeg"
          alt="A club member pointing up at the Internet of Things sign above the club's booth"
          width={902}
          height={1600}
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="aspect-[4/3] w-full object-cover object-[center_28%] md:aspect-[4/5]"
        />

        <div>
          <h1 className="text-[clamp(64px,10.5vw,168px)] leading-[0.9] text-text">Join the club</h1>
          <p className="mt-8 max-w-xl text-[clamp(19px,1.9vw,24px)] leading-[1.45] text-muted">
            A community of students building devices, autonomous systems and connected technology
            that solves real problems.
          </p>

          <div className="mt-10">
            <p className="font-display text-[clamp(32px,3.6vw,52px)] font-extrabold uppercase leading-[0.95] text-text">
              {APPLICATIONS_OPEN ? "Applications are open" : "Applications are closed"}
            </p>
            <p className="mt-3 text-[17px] text-muted">
              {CYCLE} recruitment cycle. Deadline: {DEADLINE}.
            </p>

            <div className="mt-6">
              {APPLICATIONS_OPEN ? (
                <ButtonLink href={APPLICATION_URL} external>
                  Apply now (opens a form)
                </ButtonLink>
              ) : (
                <ButtonLink href="mailto:iotclub@aus.edu" variant="ghost">
                  Email the club
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section aria-labelledby="why-join" className="mx-auto max-w-[1280px] px-5 pt-28 md:px-10 md:pt-44">
        <h2 id="why-join" className="text-[clamp(20px,2vw,26px)] font-semibold normal-case tracking-normal text-muted">
          Why join
        </h2>
        <dl className="mt-8 grid gap-x-16 gap-y-14 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={(index % 2) * 0.06}>
              <dt className="font-display text-[clamp(44px,6vw,88px)] font-extrabold uppercase leading-[0.92] text-text">
                {reason.title}
              </dt>
              <dd className="mt-4 max-w-md text-[19px] leading-[1.55] text-muted">{reason.desc}</dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
