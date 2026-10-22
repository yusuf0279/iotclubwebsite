# IoT Club website redesign, version 2: design contract

Run date: 2026-10-18. Project: AUS IoT Club (American University of Sharjah).
This replaces the first pass (`DESIGN-v1.md`, `RUN-v1.md`). Version 1 is the recent work this must not repeat.

## 1. What changed since version 1 and why

The web-design skill now requires: a visual hook in every route's hero (desktop and mobile), spring-physics motion with a reduced-motion state, at least three structurally different hero compositions, a header and footer designed from the product, no accidental overlap, and a favicon regenerated from the real mark. Version 1 failed several of these: five of seven public routes had text-only heroes, the header was the default logo/links/button shape, the same split hero and "heading + two-column list" skeleton repeated, and nothing used spring motion.

## 2. Product brief (unchanged facts)

- Who: AUS students, campus visitors at club events, faculty and partners.
- Tasks: understand what the club builds; find the next event; read recaps; meet the team; apply to join; browse photos.
- Facts only from the repo: mission copy, focus areas, news items and dates, team data, application state (closed, deadline 20 September 2026), social links.
- Removed and not coming back without verification: "32+ engineers", "40+ systems built", "12 partners", "03 hackathon wins", fake telemetry, generic article filler.

## 3. Research (what was inspected)

Lazyweb desktop search, 4 queries (cybersecurity landing, IoT platform, robotics, developer events), 24 results listed; 4 screenshots opened and viewed: Vectra, Corelight (events page), Particle (resources), Boston Dynamics (about/lab). Sample size is 4 of 24, so treat these as observations, not rules.

| Pattern | Seen in (of 4 viewed) | Reading |
| --- | --- | --- |
| Header: logo left, links, CTA button right | 4 of 4 | Sector default. Challenged: see section 6 |
| Hero with one large real photograph and a short headline | 2 of 4 (Vectra, Boston Dynamics) | Keep the photograph, drop the stock look: use the club's own photos |
| Text-only band hero | 1 of 4 (Particle) | Rejected by the skill |
| Events as a grid of bordered cards with category chips | 1 of 4 (Corelight) | Rejected: chips are badge-shaped. Events here become a ruler and a typographic index |
| Dark surface with green or teal accent | 2 of 4 (Corelight green, Vectra teal) | Dark teal/green accent is the sector norm, so the colour alone is not a differentiator |

Not done: live capture of more than these four, the cross-sector visual gallery pass, the flow library pass.

## 4. Identity evidence (palette inputs)

Measured from the club's own files:
- Club Fair poster neon: about `#50E8E8` (turquoise-cyan) on black, with a hairline grid and vertical display type.
- Logo: navy about `#103060` and azure about `#1090C0` on white.
- INSPIRE poster: red, black and white (a partner's art, not carried into the interface).

Version 1 used lime, which was invented rather than taken from the club. Version 2 takes the base from the logo's navy and the neon from the club's own poster.

## 5. Prior-work fingerprint and what version 2 avoids

| Dimension | Original site | Version 1 | Version 2 |
| --- | --- | --- | --- |
| Navigation | Fixed glass bar, centred links | Opaque top bar, logo left, links, CTA right | Left vertical spine on desktop; full-screen type menu on mobile |
| Hero | Centred, ring icon, grid | Headline left, tall photo right | Varies by route: type over a wide photo stage; event ruler; photo triptych; numeric; mirrored photo and text |
| Type | Space Mono | Schibsted Grotesk + IBM Plex Sans | Big Shoulders (condensed, uppercase) + Instrument Sans |
| Colour | Cyan on black | Lime on warm black | Turquoise on navy-black, ember for the event |
| Rhythm | Stats, four cards | Heading + two-column list, repeated | Poster-scale type, ruler, mosaic, index; no repeated section skeleton |
| Signature | Glow | Event timeline ticks | Event ruler (real dates, real posters) and a typographic focus-area index |
| Motion | Pulse | None | Springs on reveals, links and controls |

Version 2 differs from version 1 in at least five dimensions (navigation, hero, type, colour, rhythm, signature, motion).

## 6. Territory: "Poster grid"

The club's own Club Fair poster is the art direction: a black field, hairline grid, turquoise line art, very large condensed display type. The site reads like a wall of printed posters instead of a SaaS page. Photographs carry mood. Type and spacing carry personality, with deliberate scale jumps (display 160px against body 17px).

- Header: a vertical spine on the left (desktop) with the mark on top and page names set along the edge, as on the poster. It sits in the page's flow as a column, not a bar, and is opaque. On mobile, a slim bar with the mark and a menu button opens a full-screen list of page names in display type.
- Footer: a typographic wall: contact lines above the club name set at poster size.
- No status pills, badges or dots. No glow. No glass. No card-side stripes. No monospace.

## 7. Colour tokens (WCAG 2.x measured)

| Role | Token | Hex | Measured pairs |
| --- | --- | --- | --- |
| Page | `--bg` | `#070b12` | |
| Raised | `--surface` | `#0e141d` | |
| Raised 2 | `--surface-2` | `#141c28` | |
| Text | `--text` | `#e9f0f6` | on bg 17.1, on surface 16.1, on surface-2 14.9 |
| Secondary text | `--muted` | `#9fb0c0` | on bg 8.9, on surface 8.3, on surface-2 7.7 |
| Neon / action / link | `--accent` | `#4de6e0` | on bg 12.9, on surface 12.1, on surface-2 11.2 |
| Text on neon | `--on-accent` | `#041014` | on accent 12.6 |
| Event highlight | `--ember` | `#ff7a45` | on bg 7.6, on surface 7.2 |
| Text on ember | `--on-ember` | `#12070a` | on ember 7.7 |
| Error | `--danger` | `#ff8fa3` | on bg 9.1, on surface 8.5 |
| Control border | `--control` | `#6f8296` | on bg 5.0, on surface 4.7 (needs 3.0) |
| Divider (decorative) | `--divider` | `#1f2a38` | none required |

Ember is used only for the next event. Turquoise is used for actions, links and focus. Colour-vision simulation was not run; state is never carried by colour alone.

## 8. Type scale

Families: Big Shoulders (display and headings, uppercase) and Instrument Sans (body, UI). Monospace is not used.

| Role | Mobile to desktop | Notes |
| --- | --- | --- |
| Display XL (home) | 44px to 148px | 800 weight, line height 0.92 |
| Display L (page H1) | 56px to 160px | 800, 0.92 |
| H2 | 36px to 80px | 800, 0.95 |
| H3 | 24px to 32px | 700, 1.05 |
| Lead | 19px to 24px | Instrument Sans 400, 1.5 |
| Body | 17px to 18px | 400, 1.6 |
| Supporting | 15px | 400, 1.5 |
| Metadata | 13px | 500, tracking 0.04em, uppercase |

## 9. Layout

Container 1280px max, 20px gutter on mobile, 40px on desktop, 80px spine on desktop. 8px spacing base. Radius 0 (images, controls). Springs: stiffness 380, damping 36 for reveals and controls, 60ms stagger.

## 10. Route map and hero compositions

Every hero carries a real visual in the first viewport on desktop and mobile.

| Route | Hero composition | Signature element |
| --- | --- | --- |
| `/` | Full-width display type, with a wide photo stage directly below | Giant ember countdown band; typographic focus index |
| `/about` | Photo triptych (three tall photos) under the H1 | Event ticks along the club's history |
| `/news` | Event ruler: real posters strung along a dated line | The ruler itself |
| `/news/[id]` | Poster left, large type right | |
| `/media` | The photo mosaic is the hero | Shared-element viewer |
| `/team` | Numeric: the member count at poster size, beside a wide group photo | Executives large, other members compact |
| `/contact` | Mirrored: tall photo left, display type right | Application state as plain text |
| `/tasks`, `/files` | Sign-in screen gets a code-native line-art mark and the club grid | |

## 11. Assets

All first-party in the repo (club photos and posters), as listed in `DESIGN-v1.md`. No AI-generated images. The mark in the header and favicon is a code-native SVG redrawn from the club logo's structure (hub, five nodes, signal arcs) in the site's turquoise on the site's navy tile; the original logo files are untouched.

## 12. Motion

- Entrances and reveals: Motion springs (stiffness 380, damping 36), opacity and transform only, 60ms stagger.
- Links and buttons: spring press feedback (scale 0.97). Arrow glyphs shift 4px on hover.
- Reduced motion: no transforms and no stagger; content is shown immediately.

## 13. Delivery checks

`scripts/visual_gate.mjs` on every route (overlap, clipping, text size, broken images, missing alt, runtime errors, favicon). The gate also tries a light theme, which this dark-only site does not have, so that single check is expected to report "could not verify light theme". Plus viewed screenshots at 1440px and 390px, and favicon renders at 16px and 32px.
