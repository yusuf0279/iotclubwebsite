# IoT Club website redesign: design contract

Run date: 2026-10-18. Project: AUS IoT Club (American University of Sharjah).
Source site: `/mnt/bigvolume/webapp/iotclubwebsite` (unchanged). This directory is the redesign.

## 1. Product brief

- Who: AUS students (prospective and current members), campus visitors at club fairs, faculty and partners.
- Tasks: understand what the club builds; find the next event; read recaps; see members and committees; apply to join; browse photos.
- Promise (from the club's own copy): connected systems, embedded hardware, software, and intelligent automation, built by students.
- Constraints: keep the dark neon cybersecurity mood the club asked for. Keep every existing route and its function. Only publish claims the repo supports.
- Weak points in the current site, found in the audit:
  - Unverified proof: "32+ engineers", "40+ systems built", "12 partners", "03 hackathon wins".
  - Fake live telemetry on the hero: "SYSTEM ONLINE", "42 ACTIVE DEVICES", "MQTT / LoRa / WiFi".
  - `/about` is a placeholder ("About Us WIP").
  - Footer mailto points to `ausracing@aus.edu`, while the footer shows `iotclub@aus.edu`.
  - `/media` links to `/assets/media-kit.zip`, which does not exist.
  - The hero, cards, and buttons use glow, a blurred glass nav, a cyan ring icon, and Space Mono throughout.

## 2. Research and its limits

- Done: audit of the current site's code, routes, copy, and assets (contact sheet of all 15 club photos and posters).
- Done: palette measurement with WCAG relative luminance (script output in section 5).
- Not done: live sector competitor capture and the Lazyweb corpus search. I did not run them in this session, so the sector pattern map and the visual-reference board are missing. The decisions below rest on the club's own material and the brief, not on a competitor survey.

## 3. Prior-work fingerprint (what this must not repeat)

Current site (`iotclubwebsite`): fixed glass navbar with blur; centered hero with a faint cyan grid and a glowing ring icon; Space Mono display; cyan glow CTA; four-card pillar grid; fake stats strip; uniform dark cards with cyan borders.

Redesign fingerprint:

| Dimension | Current site | Redesign |
| --- | --- | --- |
| Navigation | Fixed, blurred, centered links | Opaque, text-only, wordmark left, sits in the page flow |
| Hero | Centered, decorative ring, grid overlay | Split: headline and next-event line left, tall first-party photo right, no decoration |
| Type | Space Mono for display and labels | Grotesk display and body. Mono is not used |
| Color | Cyan on near-black | Lime phosphor on warm-neutral black |
| Rhythm | Stats strip, then four equal cards | Editorial sections: photo band, timeline of events, focus areas as a list |
| Signature | Glow on hover and buttons | Event timeline with a ruler, dated and chronological |
| Cards | Equal bordered cards | No cards for content. Images and text carry hierarchy |

## 4. Territory

Selected: **"Field recorder"**. A quiet, dark editorial site, where the club's real photos and posters carry the mood and the neon is limited to actions, the current event, and focus states. The site reads like a lab logbook: dated, specific, and photo-led.

Rejected: (a) full-bleed neon hero with grid and glow, which is the current site's pattern; (b) a card dashboard with live stats, which would need fake data.

## 5. Palette

Measured with WCAG 2.x relative luminance (`design/palette-candidates.png` shows swatches and sample text).

| Candidate | Result |
| --- | --- |
| A. Lime phosphor (selected) | All text, action, and link pairs pass 4.5:1 (lowest: danger on bg 8.5:1, muted on bg 8.4:1) |
| B. Amber signal | Passes, but amber reads as a warning colour and conflicts with the error role |
| C. Ice terminal | Passes, but it is the current site's cyan family |

Selected tokens:

| Role | Token | Hex | Pairing and measured ratio |
| --- | --- | --- | --- |
| Page background | `--bg` | `#0b0d0c` | base |
| Raised surface | `--surface` | `#151a16` | base |
| Primary text | `--text` | `#e8efe6` | on bg 16.6:1, on surface 15.0:1 |
| Secondary text | `--muted` | `#a3ada5` | on bg 8.4:1, on surface 7.6:1 |
| Action and link | `--accent` | `#c6f35a` | on bg 15.2:1, on surface 13.7:1 |
| Text on action | `--on-accent` | `#0b0d0c` | on accent 15.2:1 |
| Error | `--danger` | `#ff8a7a` | on bg 8.5:1 |
| Hairline divider (decorative) | `--divider` | `#26302a` | decorative, no contrast requirement |
| Form-control boundary | `--control` | `#76847a` | on bg 5.0:1, on surface 4.5:1 (passes the 3:1 non-text rule) |
| Focus ring | `--accent` | `#c6f35a` | on bg 15.2:1 |

Rules: lime is used for primary actions, the current event label, and focus. Error uses the danger token with a text message, never colour alone. No status pills, badges, or dots.

## 6. Type scale

Families: **Schibsted Grotesk** (display, headings, UI) and **IBM Plex Sans** (body, metadata). No monospace, except literal values if one appears.

| Role | Size (mobile to desktop) | Weight | Line height |
| --- | --- | --- | --- |
| Display | 44px to 92px | 700 | 0.98 |
| H1 page | 40px to 64px | 700 | 1.02 |
| H2 section | 28px to 44px | 650 | 1.1 |
| H3 item | 20px to 24px | 600 | 1.25 |
| Body | 16px to 18px | 400 | 1.6 |
| Supporting | 14px to 15px | 400 | 1.5 |
| Metadata | 12px (dates, captions, labels only) | 500, uppercase tracking 0.04em | 1.4 |

Minimum body 16px. Metadata at 12px only for short labels.

## 7. Layout

- Container: 1200px max, 16px side gutter on mobile, 32px on desktop.
- Spacing: 8px base (4, 8, 12, 16, 24, 32, 48, 72, 112).
- Radius: 2px for images and controls. The site avoids rounded-card softness.
- Navigation: 64px tall, opaque background, becomes a menu panel under 900px.

## 8. Route map (same routes as the current site)

| Route | Task it serves | Primary action |
| --- | --- | --- |
| `/` | Understand the club and find the next event | Join the club, see the next event |
| `/about` | Learn what the club builds and how it runs (real content, replacing the WIP page) | Join |
| `/news` | Read recaps and upcoming events, newest first | Open an item |
| `/news/[id]` | Read one event | Back to news |
| `/media` | Browse club photos | Open photo fullscreen |
| `/team` | Find committee members | View committee |
| `/contact` | Apply or contact the club (applications state comes from `APPLICATIONS_OPEN`) | Apply, or email |
| `/tasks` | Committee task portal (existing logic kept; visual restyle limited to shared tokens) | Sign in |
| `/files` | Existing easter-egg page (logic kept) | none |

## 9. Asset inventory

All assets are the club's own files in this repo. No external sources, so no licence records are required beyond ownership by the club. Confirm this with the club if photos include people who have not agreed to be shown.

| File | Use | Crop | Alt text |
| --- | --- | --- | --- |
| `public/media/gallery/iot-photo-1.jpeg` | Home hero (tall, right column) | `object-position: center 30%` | A club member's robot wearing an AUS Engineers shirt, posing with a visitor |
| `public/media/gallery/iot-photo-3.jpg` | Home photo band | wide | Club members working at a table with laptops |
| `public/news/club-fair-poster.png` | Club Fair news thumbnail and feature | contain on feature, cover on list | Club Fair poster: Enter the Grid, systems active on 15 September |
| `public/news/inspire-hackathon-poster.jpeg` | INSPIRE hackathon news thumbnail | contain | INSPIRE 26 Engineering the Invisible poster |
| `public/media/gallery/*` (8 IoT photos plus 5 event photos) | `/media` gallery | cover in the expanding gallery | Per-photo title from `src/lib/media.ts` |
| `public/news/*_poster.webp`, `iot_banner.webp` | Older news thumbnails | cover | Per-item title |

No AI-generated images. Hand-made SVG marks only.

## 10. Motion

- Gallery opens a photo with a shared-element transition from the thumbnail (existing component, kept). Under `prefers-reduced-motion`, it fades instead.
- Navigation and buttons use a 150ms colour transition. No glow, lift, or rotation.
- The countdown updates once per second and shows static digits under reduced motion.

## 11. Favicon and metadata

- Favicon: rebuilt from the club's logo mark (`public/news/iot_logo.webp`) as `public/favicon.ico` (multi-size ICO), plus `app/icon.png`. `/favicon.ico` must return a valid ICO.
- Each route sets its own title and description. Open Graph image: a club photo.
- Copyright: "© 2026 AUS IoT Club". The year is taken from the build date.

## 12. Checks before delivery

Each item is verified at 1440px and 390px in a real browser (Playwright, Chromium):

- every route direct-loads and navigation works;
- no status bubbles, pills, badges, or dots;
- no clipped text or horizontal page overflow at 390px;
- every image has alt text and no image is broken;
- body text is at least 16px, supporting text at least 14px;
- console has no runtime errors on the public routes;
- the fake stats, fake telemetry, and missing brand-kit link are removed.
