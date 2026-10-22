"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Github, Linkedin } from "lucide-react";
import { Reveal } from "@/components/motion";
import { team, advisors, roles } from "@/lib/team";

type Member = (typeof team)[number];

const filters = ["All", ...roles];

// Member 6 is a hidden entry point. Seven clicks on that photo opens the files page.
const SECRET_MEMBER_ID = 6;
const SECRET_CLICK_COUNT = 7;

const inGroup = (member: Member, role: string) => member.category.includes(role);

function Links({ member }: { member: Member }) {
  if (!member.github && !member.linkedin) return null;
  return (
    <div className="mt-4 flex gap-5">
      {member.github && (
        <a
          href={member.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on GitHub (opens in a new tab)`}
          className="text-muted transition-colors duration-150 hover:text-accent"
        >
          <Github size={22} aria-hidden="true" />
        </a>
      )}
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
          className="text-muted transition-colors duration-150 hover:text-accent"
        >
          <Linkedin size={22} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export default function TeamPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("All");
  const [, setSecretClicks] = useState(0);

  const handleSecretClick = (memberId: number) => {
    if (memberId !== SECRET_MEMBER_ID) return;
    setSecretClicks((prev) => {
      const clicks = prev + 1;
      if (clicks === SECRET_CLICK_COUNT) {
        router.push("/files");
        return 0;
      }
      return clicks;
    });
  };

  // Each member appears once. Anyone in the executive group is listed there first.
  const executives = team.filter((member) => inGroup(member, "Executives"));
  const others = roles
    .filter((role) => role !== "Executives")
    .map((role) => ({
      role,
      members: team.filter((member) => !inGroup(member, "Executives") && inGroup(member, role)),
    }))
    .filter((group) => group.members.length > 0);

  const showExecutives = activeRole === "All" || activeRole === "Executives";
  const visibleOthers = others.filter((group) => activeRole === "All" || group.role === activeRole);
  // A filtered committee also lists its executive coordinators, who are shown under Executives.
  const filteredExecutives =
    activeRole === "All" || activeRole === "Executives"
      ? executives
      : executives.filter((member) => inGroup(member, activeRole));

  return (
    <>
      {/* HERO: the member count at poster size beside a photo */}
      <section className="mx-auto grid max-w-[1280px] gap-8 px-5 pt-10 md:grid-cols-[7fr_5fr] md:items-end md:gap-12 md:px-10 md:pt-14">
        <div>
          <h1 className="text-[clamp(56px,9vw,136px)] leading-[0.9] text-text">Team</h1>
          <p
            aria-label={`${team.length} members`}
            className="mt-6 font-display text-[clamp(140px,28vw,400px)] font-extrabold leading-[0.85] text-accent md:mt-8"
          >
            {team.length}
          </p>
          <p className="mt-5 max-w-md text-[19px] leading-[1.5] text-muted">
            Members across the club&apos;s groups, from hardware to outreach.
          </p>
        </div>
        <Image
          src="/media/gallery/iot-photo-6.jpeg"
          alt="Two club members at an event stand with an inflatable capybara costume"
          width={1080}
          height={1413}
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="aspect-[4/3] w-full object-cover object-[center_35%] md:aspect-[4/5]"
        />
      </section>

      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div
          role="group"
          aria-label="Filter by group"
          className="mt-16 flex gap-6 overflow-x-auto pb-1 md:mt-24"
        >
          {filters.map((role) => {
            const active = activeRole === role;
            return (
              <button
                key={role}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveRole(role)}
                className={`shrink-0 py-2 text-[18px] font-medium transition-colors duration-150 ${
                  active ? "text-accent underline decoration-2 underline-offset-8" : "text-muted hover:text-text"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>

        {/* EXECUTIVES: large portraits with bios */}
        {(showExecutives || filteredExecutives.length > 0) && filteredExecutives.length > 0 && (
          <section aria-labelledby="executives" className="mt-12">
            <h2 id="executives" className="text-[clamp(44px,7vw,104px)] leading-[0.92] text-text">
              {showExecutives ? "Executives" : `${activeRole} coordinators`}
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 md:gap-x-8">
              {filteredExecutives.map((member, index) => (
                <li key={member.id}>
                  <Reveal delay={(index % 3) * 0.06} y={24}>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => handleSecretClick(member.id)}
                      className="block w-full cursor-default"
                    >
                      <Image
                        src={member.img}
                        alt=""
                        width={700}
                        height={875}
                        sizes="(min-width: 768px) 380px, 50vw"
                        className="aspect-[4/5] w-full bg-surface object-cover"
                      />
                    </button>
                    <h3 className="mt-4 text-[clamp(24px,2.6vw,34px)] leading-[1] text-text">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-[16px] font-medium text-accent">{member.role}</p>
                    <p className="mt-3 hidden text-[16px] leading-[1.55] text-muted md:block">
                      {member.bio}
                    </p>
                    <Links member={member} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* COMMITTEES: compact listings */}
        {visibleOthers.map((group) => (
          <section key={group.role} aria-labelledby={`group-${group.role}`} className="mt-24 md:mt-32">
            <h2 id={`group-${group.role}`} className="text-[clamp(44px,7vw,104px)] leading-[0.92] text-text">
              {group.role}
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {group.members.map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => handleSecretClick(member.id)}
                    className="block w-full cursor-default"
                  >
                    <Image
                      src={member.img}
                      alt=""
                      width={400}
                      height={500}
                      sizes="(min-width: 768px) 280px, 50vw"
                      className="aspect-[4/5] w-full bg-surface object-cover"
                    />
                  </button>
                  <h3 className="mt-3 text-[22px] leading-[1.05] text-text">{member.name}</h3>
                  <p className="mt-1 text-[16px] font-medium text-accent">{member.role}</p>
                  <p className="mt-1 text-[16px] text-muted">{member.skills.join(" · ")}</p>
                  <Links member={member} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* ADVISOR */}
        {advisors.length > 0 && activeRole === "All" && (
          <section aria-labelledby="advisors" className="mt-28 md:mt-40">
            <h2 id="advisors" className="text-[clamp(44px,7vw,104px)] leading-[0.92] text-text">
              Faculty advisor
            </h2>
            <ul className="mt-8 flex flex-col gap-8">
              {advisors.map((advisor) => (
                <li key={advisor.id} className="flex max-w-xl items-start gap-6">
                  {advisor.img.trim() && (
                    <Image
                      src={advisor.img}
                      alt={advisor.name}
                      width={160}
                      height={160}
                      sizes="96px"
                      className="h-24 w-24 shrink-0 bg-surface object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-[28px] leading-[1] text-text">{advisor.name}</h3>
                    <p className="mt-1 text-[16px] font-medium text-accent">{advisor.role}</p>
                    <p className="mt-1 text-[16px] text-muted">{advisor.dept}</p>
                    {advisor.note && <p className="mt-1 text-[16px] text-muted">{advisor.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
