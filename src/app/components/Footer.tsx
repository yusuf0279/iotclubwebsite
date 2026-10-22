import Link from "next/link";

const socials = [
  { label: "Instagram", href: "https://instagram.com/aus_iot" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/aus-iot" },
  { label: "GitHub", href: "https://github.com/IotClubAUS" },
];

const pages = [
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/media", label: "Media" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Join" },
];

export default function Footer() {
  return (
    <footer className="mt-40 bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <p className="max-w-sm text-[19px] leading-[1.5] text-text">
            A student community building connected devices, one sensor at a time.
          </p>

          <nav aria-label="Footer">
            <h2 className="font-body text-[13px] font-medium normal-case tracking-[0.06em] text-muted">Pages</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-[17px] text-text hover:text-accent">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-body text-[13px] font-medium normal-case tracking-[0.06em] text-muted">Reach us</h2>
            <ul className="mt-4 flex flex-col gap-2 text-[17px]">
              <li>
                <a href="mailto:iotclub@aus.edu" className="text-text hover:text-accent">
                  iotclub@aus.edu
                </a>
              </li>
              {socials.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:text-accent"
                  >
                    {item.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[16px] text-muted">American University of Sharjah, UAE</p>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none font-display text-[clamp(72px,19vw,288px)] font-extrabold uppercase leading-[0.82] text-surface-2"
        >
          IoT Club
        </p>
      </div>

      <div className="border-t border-divider">
        <p className="mx-auto max-w-[1280px] px-5 py-5 text-[16px] text-muted md:px-10">
          © 2026 AUS IoT Club
        </p>
      </div>
    </footer>
  );
}
