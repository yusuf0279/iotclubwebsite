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

      <header className="sticky top-0 z-40 border-b border-divider bg-bg">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 px-5 md:h-16 md:px-10">
          <Link href="/" className="flex items-center gap-3 text-accent" aria-label="IoT Club, home">
            <IotMark className="h-8 w-8" />
            <span className="font-display text-[20px] font-extrabold uppercase leading-none text-text">
              IoT Club
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block py-2 font-display text-[18px] font-bold uppercase leading-none tracking-[0.04em] transition-colors duration-150 ${
                        active
                          ? "text-accent underline decoration-2 underline-offset-[10px]"
                          : "text-muted hover:text-text"
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
            className="hidden bg-accent px-5 py-2.5 font-display text-[18px] font-extrabold uppercase leading-none tracking-[0.04em] text-on-accent transition-opacity duration-150 hover:opacity-90 lg:block"
          >
            Join
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-11 px-2 font-display text-[20px] font-bold uppercase text-text lg:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
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
                    className={`block font-display text-[52px] font-extrabold uppercase leading-[0.95] ${
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
