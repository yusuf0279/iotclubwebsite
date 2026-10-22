# Design run record

Project: `/mnt/bigvolume/webapp/iotclubwebsite-redesign` (Next.js 15, App Router, TypeScript).
Contract: `design/DESIGN.md`. Palette evidence: `design/palette-candidates.png`.

## Built

- Routes: `/`, `/about` (real content, replaces the WIP page), `/news`, `/news/[id]`, `/media`, `/team`, `/contact`, `/tasks`, `/files`.
- Shell: opaque sticky header (no blur), text-first navigation with a mobile menu, a flat footer. Footer email now matches the displayed address.
- Metadata: per-route titles, OG and Twitter image (`public/og-image.jpg`, 1200x630), favicon (`public/favicon.ico`, valid ICO, 16/32/48, served 200), `src/app/icon.png`.
- Fonts: Schibsted Grotesk (display) and IBM Plex Sans (body) through `next/font`.
- Removed from the old site: unverified stats ("32+ engineers", "40+ systems built", "12 partners", "03 hackathon wins"), fake live telemetry ("SYSTEM ONLINE", "42 ACTIVE DEVICES"), the dead "Register" button, the broken `/assets/media-kit.zip` link, the generic news filler paragraph, the emoji status labels.

## Verified

- `tsc --noEmit`: passes.
- `next build`: passes for all 12 routes (run with placeholder `NEXT_PUBLIC_SUPABASE_*` values, which the old repo also needs).
- Served the production build and captured every route at 1440px and 390px with Playwright, then viewed the home, about, news, team (desktop), and home (mobile) captures.
- HTTP 200 on every route and on `/favicon.ico` and `/og-image.jpg`.
- No horizontal page overflow at either width on any route.
- Console errors on `/tasks` and `/files` come from the placeholder Supabase URL and the sandbox having no network. They are not design issues.

## Not verified or not done

- No live competitor research and no Lazyweb corpus search. The decisions rest on the club's own material and the brief. The sector pattern map is missing.
- `/media`, `/contact` and the mobile captures of news and team were captured but not individually viewed.
- The shared gallery's fullscreen view, its close button and the portal above the navbar were not clicked through in this run.
- `/tasks` (about 3,000 lines of committee logic) and `/files` still use their own internal colours. They inherit the new shell and tokens but were not redesigned.
- The club logo is blue and sits beside a lime accent. Recolouring or replacing the logo is the club's call.
- Team member photos are mostly the existing default silhouettes from `src/lib/team.ts`.
- The Supabase environment variables are not in this checkout, so the live `/tasks` and `/files` pages were not exercised with real data.
- The Club Fair description and the About copy are written from the repo's data. Check them with the club before launch.
- The directory is not a git repository. Nothing is committed.
