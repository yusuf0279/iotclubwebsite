"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IotMark from "@/components/mark";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/media", label: "Media" },
  { href: "/team", label: "Team" },
  { href: "/tasks", label: "Tasks" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu on navigation, and on Escape. Lock page scroll while it is open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#content"
        className="absolute left-4 top-[-120px] z-[60] bg-accent px-4 py-2 text-on-accent focus:top-4"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-divider bg-bg lg:fixed lg:inset-y-0 lg:left-0 lg:w-[80px] lg:border-b-0 lg:border-r">
        {/* Mobile bar */}
        <div className="flex h-14 items-center justify-between px-5 lg:hidden">
          <Link href="/" className="flex items-center gap-3 text-accent" aria-label="IoT Club, home">
            <IotMark className="h-8 w-8" />
            <span className="font-display text-[22px] font-extrabold uppercase leading-none text-text">
              IoT Club
            </span>
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-11 px-2 font-display text-[20px] font-bold uppercase text-text"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Desktop spine */}
        <div className="hidden h-full flex-col items-center justify-between py-6 lg:flex">
          <Link href="/" aria-label="IoT Club, home" className="text-accent">
            <IotMark className="h-10 w-10" />
          </Link>

          <nav aria-label="Main">
            <ul className="flex flex-col items-center gap-7">
              {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      className={`block font-display text-[22px] font-bold uppercase leading-none tracking-[0.02em] transition-colors duration-150 ${
                        active ? "text-accent" : "text-muted hover:text-text"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/contact"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            className="bg-accent px-3 py-4 font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.02em] text-on-accent transition-opacity duration-150 hover:opacity-90"
          >
            Join
          </Link>
        </div>
      </header>

      {menuOpen && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="fixed inset-0 z-50 flex flex-col bg-bg px-5 pb-8 pt-4 lg:hidden"
        >
          <div className="flex h-10 justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="h-11 px-2 font-display text-[20px] font-bold uppercase text-text"
            >
              Close
            </button>
          </div>
          <ul className="mt-6 flex flex-1 flex-col justify-between">
            {[...links, { href: "/contact", label: "Join" }].map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block font-display text-[64px] font-extrabold uppercase leading-[0.95] ${
                      active ? "text-accent" : "text-text"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
