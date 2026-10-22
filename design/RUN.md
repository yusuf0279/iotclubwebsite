# Design run record, version 2

Project: `/mnt/bigvolume/webapp/iotclubwebsite-redesign` (Next.js 15, App Router, TypeScript).
Contract: `DESIGN.md`. Earlier pass: `DESIGN-v1.md`, `RUN-v1.md`, `shots-v1/`.

## Built

- Territory "Poster grid", taken from the club's own Club Fair poster: black field, hairline grid, turquoise line art, very large condensed type.
- Header: vertical spine on desktop (mark, page names set along the edge, a Join block); slim bar plus full-screen type menu on mobile. Footer: typographic.
- Type: Big Shoulders (display) and Instrument Sans (body) through `next/font`. No monospace.
- Palette: navy-black `#070b12`, turquoise `#4de6e0` for actions and focus, ember `#ff7a45` for the next event only. All text and control pairs measured (lowest text 7.7:1, control border 4.7:1).
- Heroes (each has a real visual in the first screen on desktop and mobile):
  - `/` display type over a wide photo
  - `/about` three-photo triptych
  - `/news` event ruler of real posters on a dated line
  - `/news/[id]` poster beside large type
  - `/media` photo mosaic
  - `/team` member count at poster size beside a photo
  - `/contact` mirrored: photo left, type right
  - `/tasks` the next real calendar events as large dates; sign-in screen gets the club mark on the grid
- Motion: Motion springs (stiffness 380, damping 36), 60 ms stagger, press feedback on buttons. Reduced motion is handled once, in `providers.tsx` (MotionConfig) plus a CSS rule, and a `<noscript>` rule shows content without JavaScript.
- Favicon: `public/favicon.ico` (16, 32, 48, 64), `public/icon.svg`, `public/apple-touch-icon.png`, drawn from the logo's structure in the site's colours. 16px and 32px renders reviewed (`shots/favicon-16-and-32px.png`).
- `/tasks` (committee calendar and tasks, ~3,000 lines): retheme through a class map, square corners, no shadows or blur, no text below 14px, chips wrap instead of truncating, month grid on desktop and an agenda list below 768px.

## Removed

- The refresh splash screen with its made-up percentage ("Connecting... 37%").
- Unverified stats, fake telemetry, dead "Register" button, broken brand-kit link, generic article filler (carried over from version 1).
- Light/system theme switching. The site is dark only; `ThemeProvider` is forced to dark.

## Verified

- `tsc --noEmit` passes. `next build` passes (placeholder Supabase values), run in an isolated copy.
- `scripts/visual_gate.mjs` on all 9 routes (`/`, `/about`, `/news`, `/news/6`, `/media`, `/team`, `/contact`, `/tasks`, `/files`) at 1440px and 390px, dark theme: 0 overlaps, 0 clipped text, 0 text below baseline, 0 broken images, 0 missing alt, no horizontal overflow, 0 runtime errors. `/favicon.ico` is a valid ICO and `<link rel=icon>` is present.
- Browser interaction checks (13 of 13 pass): fullscreen photo viewer opens above the spine, closes with the button and with Escape; news filter; skip link reachable by keyboard and on screen; hidden team shortcut still opens `/files` after 7 clicks; mobile menu opens and navigates; dark stays dark for a light-mode system; reduced motion leaves nothing hidden; reveals animate on scroll.
- Screenshots viewed: home (desktop and mobile), about, news (desktop and mobile), contact, tasks (desktop and mobile), team and media tops (desktop and mobile), article, mobile menu.

## Not verified or still open

- The gate also tries a light theme. This site has none, so every route reports "could not verify light theme". That is expected, not a defect.
- Colour-vision simulation was not run.
- The sector research covers 4 screenshots (Vectra, Corelight, Particle, Boston Dynamics) from one corpus search; no live-site capture and no cross-sector gallery pass.
- `/files` (the hidden page) keeps its own page content and styling. It passes the gate but was not redesigned.
- The `/tasks` admin and task-manager panels were restyled by the class map and not viewed individually after sign-in (there are no real credentials or Supabase data here).
- Supabase is not configured in this checkout, so data-backed behaviour was not exercised.
- Open data issues for the club: a calendar entry titled "Visit to ###" shows in the `/tasks` hero; committee passwords are stored in plain text in `src/lib/auth.ts`, which ships to every browser; the Club Fair news text and the About copy were written from repo data and need the club's check.
