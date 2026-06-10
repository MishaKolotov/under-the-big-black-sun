# Redesign Brief — Under the Big Black Sun

**For:** a design agent (Cloud Design / Claude) producing a full visual + UX redesign.
**Project:** personal site + community hub for **Karol** — illustrator, drummer, DIY-punk,
Warsaw scene (Instagram `under_the_big_black_sun`).
**Date:** 2026-06-09.

This is a self-contained brief. You do not need prior context. Read it top to bottom, then
deliver the artifacts listed in §11. Where you must choose, choose the option that best serves
**Karol's brand first**, then artwork showcase, then reading, then community (priority order
fixed below).

---

## 0. The one-line direction

**Evolution, not reinvention: the existing photocopied-zine DNA, leveled up to a genuinely
excellent, modern UX/UI.** Keep the cut-and-paste punk soul; add the polish, motion, hierarchy,
and interaction design of a top-tier product. The site should feel hand-made and a little
unhinged on the surface, but be effortless to navigate and read underneath. Tension between a
**raw art layer** and a **clean reading/navigation layer** is the whole design thesis.

What this is NOT: a generic template, a startup-minimal site, a corporate portfolio, or a
"distressed Bootstrap" pastiche. And not a from-scratch new aesthetic either — the zine
language stays.

---

## 1. Who Karol is / what the artwork is (ground truth — design FROM this)

Photocopied DIY punk / hardcore **gig-flyer and zine art**. Observed traits:
- Black ink on **off-white / newsprint** paper dominates. Heavy **xerox halftone grain**,
  **drippy / bleeding ink**, rough photocopy edges, toner speckle.
- **Scratchy, wobbly, hand-drawn lines.** Crude-on-purpose, energetic, fast.
- **Hand-lettered ransom-note headlines**; repeated, stacked words running down the page
  (`XIU XIU XIU`, `CUMBIA / CUMBIA / CUMBIA`, `MIDDLEMAN / TRÄUME`). Taped-up collage feel.
- Mostly B/W; a few single-spot **riso** prints (electric blue, red); several lean on
  **highlighter yellow** (yellow trench-coat detective, "MUSIC is my HOBBY", yellow-on-black
  radioactive flyer). One piece uses tiny red+green+blue accents.
- **Recurring motifs:** screaming faces / monsters / demons, skulls & skeletons, candles,
  **stars**, hands, **checkerboard / grid**, smiley blobs, **crosses**, Warsaw landmarks
  (Palace of Culture), tigers / creatures, peace signs.
- Text is **Polish + English** mixed.

**Mood:** loud, scrappy, hand-made, anti-corporate, communal, slightly unhinged but warm.
Imperfect on purpose — nothing perfectly aligned; everything looks photocopied and taped up.

> Karol also writes "commissions open" / "2026 go commissions always open" on his work — he
> takes paid art jobs. The site must make that path discoverable (see §3 audience).

---

## 2. Audience & priorities (drives every trade-off)

**Primary audience:** the **local Warsaw DIY / punk / hardcore / rave scene** AND **potential
commission clients** (people who might hire Karol for artwork / flyers / collabs). So: stay raw
and insider-coded, but always leave a **clear, low-friction path to "see the work → get in
touch / commission."** Don't dumb it down for a general audience, but don't make a client feel
lost either.

**Design priority order (resolve conflicts in this order):**
1. **Karol's brand / identity** — the site should feel unmistakably *his*. A recognizable
   personal mark/logo/lettering, a consistent voice, a strong About, clear links out
   (Bandcamp / Instagram / label).
2. **Artwork showcase** — his illustrations and flyers shown large, with reverence, collage-y
   but legible. The art is the hero.
3. **Blog / reading** — long-form posts read beautifully (typography, inline images, embeds).
4. **Community hub** — gig/scene energy, comments + likes, a "bulletin-board" feeling.

---

## 3. Existing brand system to BUILD ON (do not discard — refine)

The current site already implements a zine system. Treat this as the **foundation to elevate**,
not replace. You may refine tokens, add new ones, and introduce new components — but keep the
core palette + type roles recognizable.

**Palette (exact hexes — keep these as the base; you may add tints/role-tokens):**
| Role | Token | Hex |
|------|-------|-----|
| Primary ink (warm near-black) | `--ink` | `#14110f` |
| Secondary ink | `--ink-soft` | `#2b2723` |
| Paper (off-white newsprint) | `--paper` | `#f4efe3` |
| Paper bright (cut-outs/cards) | `--paper-bright` | `#fbf8ef` |
| Paper dim (aged/shadow) | `--paper-dim` | `#e7e0cf` |
| **Spot: highlighter yellow** | `--highlighter` | `#ffe800` |
| Highlighter edge/shadow | `--highlighter-deep` | `#f2cf00` |
| Rare accent — red | `--accent-red` | `#e0301e` |
| Rare accent — green | `--accent-green` | `#1f8a3b` |

**CONTRAST RULE (mandatory, non-negotiable):** NEVER yellow text on white/paper. Yellow is used
ONLY as (a) highlighter/marker fill *behind* black text, (b) sticker/tape/stamp accents, (c)
accent/text on **black** backgrounds (yellow-on-black is encouraged). Black is the primary ink;
paper is off-white. Red & green are **rare** accents — never equal stripes, never flag-like,
never adjacent in equal weight. Body text must stay **WCAG AA** (ink-on-paper ≈15:1; yellow-on-
black ≈13:1).

**Type roles (freely-licensed; keep these roles, may propose swaps if clearly better & free):**
- **Display / headline:** Anton (ultra-condensed heavy poster) — punk gig-flyer energy.
- **Ransom mix:** Archivo Black (fat grotesque, alternates per word with the display face).
- **Stamp / labels / captions / dates:** Special Elite (distressed typewriter).
- **Body:** Spline Sans Mono (legible monospace, xerox vibe, WCAG-readable).
> If you propose a font change, it MUST be freely licensed (Google Fonts / Fontshare, OFL/
> Apache), support Polish diacritics (ł ż ó ę ś ć ń ź ą), and you must state the license.

**Texture system (keep, refine intensity):** site-wide fixed **grain** overlay (toner speckle),
**halftone** dot-screen + grayscale xerox filter on images, tunable via opacity tokens. Plus
collage primitives already exist: paper background, tape strips, stickers, ransom headings,
halftone wrapper. Elevate these — make them feel more intentional and varied, not repetitive.

---

## 4. The redesign mandate — "zine meets excellent UX"

Concretely, the redesign must deliver on BOTH halves of the thesis:

**Keep / amplify the RAW art layer:**
- Cut-and-paste collage composition: deliberate slight rotations, overlaps, torn/taped edges,
  layered scraps, ransom-note headline mixing. It must look assembled by a human, not a grid
  system — but the *underlying* grid should be disciplined so it never breaks on real content.
- Texture, grain, halftone, ink-bleed, photocopy roughness. Stamps, tape, stickers, marker
  highlights, hand-drawn arrows/circles/scribbles as UI accents (e.g. a scribble-circle around
  an active nav item, a marker swipe behind a section title).
- Karol's motifs (stars, checkerboard, crosses, screaming faces, hands) as recurring decorative
  furniture — but used with restraint and rhythm, not wallpapered everywhere.

**Add the CLEAN product layer (this is what "leveled up" means):**
- **Clear information hierarchy & navigation** — a visitor always knows where they are, how to
  get to the art, the blog, about, and "contact / commission." Sticky-or-obvious nav. The chaos
  is in the *texture*, never in the *wayfinding*.
- **Reading comfort** — generous measure, strong type scale, real vertical rhythm. The blog post
  page must be a pleasure to read end-to-end.
- **Considered interaction & motion** — purposeful micro-interactions: hover/focus states that
  feel tactile (paper lift, tape peel, stamp press, marker draw-on), page/section transitions
  with personality, a satisfying like-button animation, smooth "load more." Motion should feel
  like physical paper/print, not slick SaaS easing. **Respect `prefers-reduced-motion`** — ship
  a calm, static fallback for every animation.
- **Accessibility & responsiveness** — mobile-first (the scene is on phones), WCAG AA contrast,
  full keyboard nav, visible focus states, alt text, semantic structure. Punk ≠ broken UX.
- **States** — design empty, loading, error, and success states with the same care and
  personality as the happy path (e.g. an empty comments thread as a hand-stamped "be the first").

---

## 5. Pages & screens to design (bilingual EN/PL)

The site is bilingual (English + Polish), routes are locale-prefixed (`/en`, `/pl`), with a
visible **language switcher**. Design every screen for BOTH the long-Polish-word case and EN.

1. **Home / landing** — the brand statement. Hero that screams "Karol / Under the Big Black
   Sun." Show: a strong identity mark/lettering, a taste of the artwork, the latest posts, and
   obvious routes to Art / Blog / About / Contact. This is the most important screen for the
   brand-first priority. Latest posts shown as collage-y cards (cover + title + date + excerpt),
   with a **"load more"** (not pagination, not infinite scroll).
2. **Artwork / gallery** *(NEW — propose this; the current site has no dedicated gallery)* — the
   showcase. Karol's illustrations & flyers, large, browsable, collage-laid-out but legible.
   Consider: filterable by type/tag, lightbox/detail view, "commission this vibe / get in touch"
   CTA woven in. Art is the hero here.
3. **Blog index** — could be merged with Home or separate; your call. Newest-first, collage cards.
4. **Post / article** — full long-form read: ransom-note title, cover, body with inline images
   (halftone-treated), links, and **embeds** (YouTube / SoundCloud / Bandcamp players). Below:
   the **comments** experience (see §6). Reading-first, but framed in the zine layer.
5. **About** — Karol's story/voice, portrait or self-illustration, and **outbound links**
   (Instagram, Bandcamp, label, contact/commission). This carries a lot of the "brand" + "client
   path" weight. Make "commissions open / get in touch" prominent and on-brand.
6. **Contact / commission path** — doesn't have to be a separate page, but the *path* must be
   designed and obvious from Home, Art, and About (e.g. a persistent "commissions open" stamp/
   sticker that links to email/IG/form).
7. **404** — already uses one of Karol's illustrations (a screaming tiger, "LOST IN HELL
   FOREVER"). Keep an illustration-driven, on-brand 404. Design it.
8. **Admin note (context only, do NOT redesign):** content is authored in Payload CMS admin at
   `/admin` — that UI is Payload's own and out of scope. You design the **public** site only.

---

## 6. Community hub details (comments + likes — already built, redesign the UX)

- **Anonymous** comments and likes — **no accounts, no login.** A commenter picks a nickname and
  writes; likes are one-per-visitor via a stored anonymous id. This "polite, low-friction,
  scene-bulletin-board" nature should be felt in the design — it's a wall people scribble on, not
  a moderated forum.
- Each comment: nickname + body + date + a **like button with a live count** that toggles on tap.
  Design the like interaction to be delightful and tactile (stamp/marker/ink-splat feel).
- A **leave-a-comment** form (nickname + body) with friendly, on-brand validation/empty/rate-
  limited states (there's spam rate-limiting + a hidden honeypot — design copy for "slow down").
- Comments may be **moderated** (held until approved) depending on a setting — design the
  "awaiting moderation" acknowledgement.
- Lean into the **bulletin-board / taped-flyer-wall** metaphor for the comments section if it fits.

---

## 7. Brand identity work (priority #1 — give this real attention)

- **Wordmark / logo / lettering** for "Under the Big Black Sun" (and/or "Karol") in Karol's
  hand-lettered ransom/flyer spirit. It should be reusable: header, footer, OG image, favicon,
  stamp. Propose a primary lockup + a compact mark.
- A small **sticker/stamp kit** that recurs as brand furniture (e.g. "commissions open",
  "Warsaw", a star, a smiley blob) — these double as UI accents and brand signal.
- A consistent **voice** in microcopy: scrappy, warm, direct, a little unhinged, bilingual-aware.
  Provide example microcopy (nav labels, buttons, empty states, 404, comment prompts).
- **OG / social card** template — when a post is shared, it should look intentional and on-brand
  (the art + ransom title). The site is meant to be reposted in the scene.

---

## 8. Hard constraints (must respect — these are real, not suggestions)

- **Tech reality:** the site is **Next.js 15 (App Router) + Payload CMS 3**, React, CSS (CSS
  custom properties + plain CSS/SCSS; design-token-driven). No Tailwind currently, but you may
  recommend an approach. Deliver design as something an engineer can implement in this stack —
  i.e. token values, component specs, and CSS-friendly direction, not just flat mockups.
- **Fonts must be freely licensed** (Google Fonts / Fontshare, OFL/Apache), Polish-diacritic
  capable, self-hostable. State licenses for anything new.
- **CONTRAST RULE** (§3) is mandatory. **WCAG AA** for body text and interactive contrast.
- **`prefers-reduced-motion`** fallback for all motion.
- **Bilingual:** every component must survive long Polish strings and EN; the language switcher
  is always visible.
- **Performance:** textures/grain are lightweight SVG; large artwork must be responsive and
  lazy-loaded; motion must not jank on mobile.
- **No real artwork shipped as decoration without intent** — Karol's pieces are content shown via
  the CMS; the *design system* (textures, collage furniture, lettering) is what you author. (One
  cropped illustration is already used for 404 — that pattern is fine.)
- Keep the **existing palette + type roles recognizable** (evolution, not reinvention).

---

## 9. Deliberately open (your design judgment — decide and justify briefly)

- Whether Home and Blog index are one screen or two.
- Whether there's a dark (yellow-on-black) "night" treatment for some sections vs all-paper.
- Exact gallery layout (masonry collage vs editorial grid vs scattered board).
- How heavy the collage/rotation chaos should be per screen (likely: louder on Home/Art, calmer
  on Post-reading and forms).
- Navigation pattern (top bar vs side vs hamburger-on-mobile) — pick the most usable on phones.
- Whether to introduce a second spot color from Karol's riso palette (blue/red) for a specific
  section, within the contrast rule.

---

## 10. Anti-goals (do NOT do)

- Don't go corporate / startup-minimal / "clean SaaS."
- Don't make it a literal scanned-paper skeuomorph that's unreadable — the chaos is styling, the
  content stays crisp and accessible.
- Don't let the texture/collage break wayfinding or readability.
- Don't use yellow as text on light backgrounds (contrast rule).
- Don't introduce non-free fonts or fonts without Polish diacritics.
- Don't redesign the Payload admin (out of scope).
- Don't lose Karol's recognizable hand-made identity in pursuit of "polish."

---

## 11. Deliverables (what to hand back)

1. **Design direction / moodboard** — articulate the "zine × excellent UX" thesis with
   references and rationale.
2. **Brand identity** — wordmark/logo lockups + compact mark, sticker/stamp kit, favicon/OG
   template, voice & example microcopy (EN + a note on PL).
3. **Design system / tokens** — refined palette (with any added role-tokens), type scale +
   roles, spacing, radii, texture/grain spec, motion principles (durations/easing/“paper”
   feel), elevation/“tape-lift” model. Express as values an engineer can drop into CSS custom
   properties.
4. **Component specs** — header/nav, language switcher, collage post-card, gallery item +
   detail/lightbox, ransom heading, tape/sticker/stamp, buttons (incl. the tactile like button),
   comment item + comment form, embed players, pagination "load more", footer. Each with states
   (default/hover/focus/active/disabled/loading/empty/error) and reduced-motion fallback.
5. **Key screen designs** (desktop + mobile): Home, Artwork/gallery, Post/article (with comments),
   About (with commission path), 404. Show the bilingual + long-content cases.
6. **Interaction / motion notes** — describe the signature micro-interactions and transitions.
7. **Implementation notes** — how this maps onto Next 15 + Payload + CSS-token stack; call out
   anything that needs new components vs. refinements of existing ones (existing primitives:
   PaperBg, TapeStrip, Sticker, RansomHeading, Halftone).

Deliver in a form a developer can implement directly: concrete tokens, measurable specs, and
clear component behavior — not only static visuals.

---

## Appendix — current state (context for the designer)
- Live site (current zine v1): a working Next 15 + Payload 3 blog with Home, Post, About, 404,
  bilingual EN/PL, anonymous comments + likes, ISR, deployed on Vercel.
- Reference: Karol's Instagram `under_the_big_black_sun` (do not scrape — IG blocks it; the
  artwork description in §1 is the ground truth distilled from his real flyers).
- The redesign replaces the *visual layer*; the data model, pages, and features above already
  exist and work.
