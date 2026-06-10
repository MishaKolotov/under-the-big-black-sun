# Redesign Brief v2 — "Xerox Maximalism" — Under the Big Black Sun

**For:** a design agent (Cloud Design / Claude) producing a full visual + UX redesign.
**Project:** personal site + community hub for **Karol** — illustrator, drummer, DIY-punk,
Warsaw scene (Instagram `under_the_big_black_sun`).
**Date:** 2026-06-10. **Supersedes:** the v1 brief `2026-06-09-redesign-brief.md` (which produced
a design the client found too clean / "classic"). This is a **from-scratch visual language**,
derived directly from Karol's real flyers — not an evolution of the current palette.

This is a self-contained brief. You do not need prior context. Read it top to bottom, then deliver
the artifacts in §12. Where you must choose, serve **Karol's brand first**, then artwork showcase,
then reading, then community (priority order fixed in §3).

---

## 0. The one-line direction

**True xerox maximalism — the site as one of Karol's flyers.** His real artwork is not "clean zine
with tasteful collage accents." It is **dense, edge-to-edge, fully-inked black-on-newsprint chaos**,
and — crucially — most pieces are **single-ink riso/photocopy prints**: one loud spot color flooding
the whole sheet with black overprinted on top. The previous design was too restrained and too light;
this one floods the page.

The thesis is a deliberate **tension between two layers**:
- a **RAW art layer** that is loud, packed, hand-made, photocopied, slightly unhinged — turned up far
  past the current site;
- a **CLEAN product layer** underneath — disciplined grid, ruthless wayfinding, beautiful reading —
  so the chaos is entirely in the *texture and surface*, never in the *navigation or legibility*.

What this is NOT: a generic template, startup-minimal, corporate portfolio, a "distressed Bootstrap"
pastiche, or the light, airy, well-behaved zine the v1 design became. It should look like Karol
photocopied the website.

---

## 1. Ground truth — what Karol's artwork actually is

Distilled from **18 real flyers/zine pages** (`reference/*.jpg` in this repo — study them; they are
the source of truth). Observed traits:

- **Black ink on off-white / newsprint paper dominates.** Heavy **xerox halftone grain**, drippy /
  bleeding ink, rough photocopy edges, toner speckle, photostat blacks that clog and smear.
- **Density is the point.** Sheets are packed **edge-to-edge** — frames built from *repeated motifs*
  (rows of stars, skulls, crosses, little creatures running along the border), text crammed into every
  margin, motifs filling negative space. Very little empty paper. (See `100 LECIE LOKAL VEGAN BISTRO`,
  `AMANTES DEL FUTURO`, `THIS HELL IS A PARADISE`.)
- **Single-ink riso / photocopy prints.** This is the key trait the v1 brief missed: most pieces take
  **ONE** vivid color and flood the entire sheet (full background or the single print ink), with black
  line-art over it. The spot rotates piece-to-piece: **cobalt blue** (`OUST`, `CUMBIA & OAZA`,
  `BAD BREEDING`, `STEGNY WORLD TOUR 2`, blue screaming demon), **scarlet red** (`AMANTES DEL FUTURO`,
  `CHERRY CHEEKS`, red cumbia), **kelly green** (`SYLWESTER K-BAR`, `TROPICAL BASS BLAST`),
  **highlighter yellow** (radioactive yellow-on-black, the yellow trench-coat detective), occasionally
  **orange** (`AXE RASH / PRIMER REGIMEN` riso baby).
- **Multi-color confetti is the rare exception** — a few pieces (`MUSIC is my HOBBY`, the bowling
  flyer, `PISTA DE LOS AURINOS`) scatter red+yellow+blue+green dots/blobs. Use sparingly, never as the
  default.
- **Scratchy, wobbly, hand-drawn lines.** Crude-on-purpose, fast, energetic.
- **Hand-lettered headlines, many voices:** ransom cut-up (`MIDDLEMAN / TRÄUME` stacked down the page),
  blackletter/gothic (`TRÄUME`, `DE APOLOGI`), bouncy comic (`CEL RAY`, `CHERRY CHEEKS`), stencil,
  fat marker, dripping liquid letters. Repeated, stacked words running down the page
  (`XIU XIU XIU`, `CUMBIA / CUMBIA / CUMBIA`, `MIDDLEMAN ×8`).
- **Recurring motifs:** screaming faces / monsters / demons, skulls & skeletons, candles, **stars**,
  hands, **checkerboard / dot grids**, smiley blobs, **crosses**, peace signs, Warsaw landmarks (Palace
  of Culture), tigers / creatures, palms.
- **Bilingual:** Polish + English mixed freely.

**Mood:** loud, scrappy, hand-made, anti-corporate, communal, slightly unhinged but warm. Imperfect on
purpose — nothing aligned, everything photocopied and taped up. Karol writes "commissions open" /
"2026 go commissions always open" on his work — he takes paid jobs, so the site must make that path
discoverable (§3).

---

## 2. The leap from v1 (read this — it's why we're redoing it)

| Axis | v1 (too "classic") | v2 (this brief) |
|------|--------------------|-----------------|
| Surface | Mostly light paper, airy, generous whitespace | **Dense, edge-to-edge, flooded.** Whitespace is the exception, reserved for the reading layer. |
| Color | One fixed spot (yellow) used as accents | **Rotating riso spot per section/page**, used as full floods — a whole palette family, one ink at a time |
| Collage | Tasteful, sparse accents (a bit of tape, one sticker) | **Maximalist composition** — motif-built borders, crammed margins, layered scraps, heavy overprint |
| Ink | Crisp clean black | **Photostat black** — clogged, smeared, halftone-broken, bleeding |
| Feeling | "A tidy blog with punk styling" | "**A Karol flyer you can navigate**" |

The reading layer (blog post body, forms) stays **calm and legible** — that contrast is the design.
But Home, Gallery, About hero, 404, post covers, and the comments wall should be **loud**.

---

## 3. Audience & priorities (drives every trade-off)

**Primary audience:** the **Warsaw DIY / punk / hardcore / rave scene** AND **potential commission
clients**. Stay raw and insider-coded, but always leave a **clear, low-friction path** from
"see the work → get in touch / commission." Don't dumb it down; don't make a client feel lost.

**Design priority order (resolve conflicts in this order):**
1. **Karol's brand / identity** — unmistakably *his*. A recognizable hand-lettered mark, consistent
   voice, strong About, clear outbound links (Bandcamp / Instagram / label).
2. **Artwork showcase** — illustrations & flyers shown large, with reverence, dense but legible. The
   art is the hero.
3. **Blog / reading** — long-form posts read beautifully.
4. **Community hub** — gig/scene energy; comments + likes; a bulletin-board / flyer-wall feeling.

---

## 4. Palette — derived from Karol's work (the heart of v2)

A **constant black/newsprint base** plus a **rotating riso spot family**. Unlike v1's single fixed
yellow, the spot **changes per page or per major section**, mirroring how each of his flyers is printed
in one ink. **One spot ink per context** is the rule — never a rainbow on one screen (except the rare
deliberate "confetti" moment, §1).

**Constant base (always present):**
| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Primary ink (warm photostat black) | `--ink` | `#14110f` | clogs, smears, halftone-breaks |
| Secondary ink | `--ink-soft` | `#2b2723` | |
| Paper (off-white newsprint) | `--paper` | `#f4efe3` | the default light surface |
| Paper bright (cut-outs / cards) | `--paper-bright` | `#fbf8ef` | |
| Paper dim (aged / shadow) | `--paper-dim` | `#e7e0cf` | |

**Riso spot family (one flood per section/page — pick & document hexes against the references):**
| Spot | Token | Flood hex | On-black hex (lighter, for yellow/neon) | Seen in |
|------|-------|-----------|------------------------------------------|---------|
| Cobalt blue | `--riso-blue` | `#2541c9` | `#5b78ff` | OUST, CUMBIA & OAZA, BAD BREEDING, STEGNY tour |
| Scarlet red | `--riso-red` | `#e23b2e` | `#ff6a5e` | AMANTES DEL FUTURO, CHERRY CHEEKS |
| Kelly green | `--riso-green` | `#149a52` | `#3ed27e` | SYLWESTER K-BAR, TROPICAL BASS BLAST |
| Highlighter yellow | `--riso-yellow` | `#ffe800` | `#ffe800` | radioactive flyer, MUSIC is my HOBBY |
| Riso orange | `--riso-orange` | `#f4622e` | `#ff8a52` | AXE RASH / PRIMER REGIMEN |

> These hexes are a strong starting point matched to the scans; you may tune them ±, but keep them
> **saturated, slightly impure riso inks** (not pure web primaries), and **state final values**.

**CONTRAST RULE (mandatory, non-negotiable) — applies to every spot:**
- **Black is always the readable ink.** Body text and any small/long text is **black-on-paper** or
  **black-on-spot-flood** (the spot floods are mid-to-deep enough that black sits on them at AA — verify
  each: black on `--riso-blue/red/green/orange` must clear **4.5:1**; if a flood is too light for body
  text, use it only behind headlines/art, not under paragraphs).
- **Yellow is special:** NEVER yellow text or yellow body fills on white/paper. Yellow is allowed ONLY
  as (a) highlighter/marker fill *behind* black text, (b) sticker/tape/stamp accents, (c) **yellow-on-
  black** (encouraged — `#ffe800` on `#14110f` ≈ 13:1).
- For each riso flood, **black overprint is the default content treatment**; reverse (paper-knockout
  text) is allowed for large display only, never body.
- Confetti multi-color is decorative only — never carries text meaning or wayfinding.
- Body text and interactive contrast must hold **WCAG AA**. Punk ≠ broken contrast.

**How the rotation works (specify this clearly):** define a small set of section "presses" — e.g.
Home = press of one spot (your pick, recommend cobalt or red as the brand's loudest), Gallery filters
can re-ink per category, each blog post can carry a spot derived from its cover, About = its own press,
404 = its own. The spot is exposed as a single token (`--spot`) the page sets once, so every component
re-inks automatically. Document the mapping and the default.

---

## 5. Typography — many hand-letterings, one disciplined body

Karol's headlines are not one face — they're **ransom, blackletter, bouncy-comic, stencil, dripping**.
Build a **display kit of 3–4 voices** that can be mixed per headline, plus ONE rock-solid body.

All fonts MUST be **freely licensed** (Google Fonts / Fontshare, OFL/Apache), support **Polish
diacritics** (ł ż ó ę ś ć ń ź ą), be self-hostable, and you must **state each license**.

Suggested roles (swap any if you find a freer/better match — justify + state license):
- **Display / poster (condensed heavy):** Anton — ultra-condensed gig-flyer headline. *(OFL)*
- **Ransom / fat grotesque:** Archivo Black — alternates per word with the display face. *(OFL)*
- **Blackletter / gothic accent:** a free gothic (e.g. UnifrakturCook or Pirata One) for the
  `TRÄUME`/`DE APOLOGI` voice — used sparingly for one or two marks. *(OFL — verify diacritics; many
  blackletter faces lack Polish glyphs, so confirm or restrict to non-diacritic words.)*
- **Marker / bouncy hand (optional 4th):** a free hand/marker face for `CEL RAY`/`CHERRY CHEEKS`
  energy. *(OFL/Apache)*
- **Stamp / labels / captions / dates:** Special Elite — distressed typewriter. *(Apache)*
- **Body (the calm anchor):** Spline Sans Mono — legible monospace, xerox/typewriter vibe, WCAG-
  readable. This carries all long reading. *(OFL)*

**Type system:** headlines uppercase, tight leading (~0.95), free to rotate/jitter/mix faces per word.
Body uses ~1.6 line-height and a comfortable **measure (~66–70ch)** for the reading layer. Fluid
`clamp()` scale, mobile-first. The display kit is loud; the body is unwavering — that's the tension.

---

## 6. Texture & "photocopy physics" (turn it up from v1)

Lightweight, performant **SVG** textures, tunable via opacity tokens, but **noticeably heavier** than
v1 — this site should look run through a copier 3 times:
- **Grain / toner speckle** — site-wide fixed overlay (`multiply`), denser than v1.
- **Halftone dot-screen** — over images and spot floods; images also get a high-contrast grayscale/
  duotone xerox filter (black + current `--spot`). Floods themselves carry visible halftone.
- **Paper fiber/blotch** — newsprint mottling on light surfaces.
- **Photostat black** — a treatment for large black areas that makes them clog, smear, and break up at
  edges (not flat `#000`).
- **Misregistration** — a tiny, deliberate offset between the spot layer and the black layer (riso
  trap), as a signature device. Keep within ~1–3px; respect reduced-motion (static).
- **Edge roughness** — torn/photocopied edges on cards, cut-outs, and flood blocks.

Imperfection is **parameterized** (`--tilt-xs/sm/md/lg`, `--jitter`, `--misreg`) so it's controllable
and never random-breaks layout. Hard, blur-free drop shadows (`--shadow-hard`) reproduce the photocopy
offset. All overlays `pointer-events:none`; never block selection. **`prefers-reduced-motion`** →
static, calm fallback for everything animated.

---

## 7. Composition — density with a disciplined grid

This is where v2 lives or dies. **Look packed and cut-and-pasted; behave like a rigorous grid.**
- **Motif-built borders & frames:** repeated stars / skulls / crosses / running creatures forming the
  edges of sections and cards (à la VEGAN BISTRO). A small library of tileable motif-strips.
- **Crammed margins:** small stamped text, dates, catalog numbers, "commissions open" stickers filling
  what would be empty gutters — but on a system, never literally overlapping content.
- **Layered scraps:** rotated cut-outs, taped photos, overprinted halftone images, ransom headlines.
- **Stacked-repeat headlines** as a signature (`CUMBIA / CUMBIA / CUMBIA` running down a column).
- **Underlying grid stays disciplined** so it never breaks on long Polish strings or real CMS content.
- **Density gradient:** loudest on Home / Gallery / 404 / post covers; **calmest** on post body and
  forms (generous measure, near-clean paper) — the reading island inside the noise.

---

## 8. Pages & screens to design (bilingual EN/PL)

Bilingual (EN + PL), locale-prefixed routes (`/en`, `/pl`), with an always-visible **language
switcher**. Design every screen for **both** the long-Polish-word case and EN.

1. **Home / landing** — the brand flyer. Hero that screams "Karol / Under the Big Black Sun" in mixed
   hand-lettering, flooded in the brand spot, packed edge-to-edge. Show: the identity mark, a taste of
   the artwork, latest posts as dense collage cards (cover + ransom title + stamped date + excerpt),
   and obvious routes to Art / Blog / About / Contact. Latest posts get a **"load more"** (not
   pagination, not infinite scroll). Most important screen for the brand-first priority.
2. **Artwork / gallery** *(NEW — propose it; current site has none)* — the showcase. Illustrations &
   flyers shown **large**, browsable, collage-laid-out but legible. Filterable by type/tag (filters can
   re-ink the spot per category), lightbox/detail view, "commission this vibe / get in touch" CTA woven
   in. Art is the hero here — let pieces breathe larger than the surrounding chaos.
3. **Blog index** — merged with Home or separate (your call, justify). Newest-first, collage cards.
4. **Post / article** — full long-form read: mixed hand-lettered title, cover (halftone/duotone in the
   post's spot), **calm readable body** with inline images, links, and **embeds** (YouTube / SoundCloud
   / Bandcamp). Below: the **comments** experience (§9). The reading island — framed in the zine layer,
   but the text itself is a pleasure to read end-to-end.
5. **About** — Karol's story/voice, portrait or self-illustration, **outbound links** (Instagram,
   Bandcamp, label, contact/commission). Carries much of the "brand" + "client path" weight. Make
   "commissions open / get in touch" prominent and on-brand.
6. **Contact / commission path** — need not be a separate page, but the *path* must be designed and
   obvious from Home, Art, and About (e.g. a persistent "commissions open" stamp/sticker linking to
   email / IG / form).
7. **404** — keep an illustration-driven, on-brand 404 (current uses a screaming tiger,
   "LOST IN HELL FOREVER"). Design it as a full flooded flyer.
8. **Admin (context only — do NOT redesign):** content is authored in Payload CMS at `/admin`; that UI
   is Payload's own and out of scope. You design the **public** site only.

---

## 9. Community hub (comments + likes — already built; redesign the UX)

- **Anonymous** comments and likes — **no accounts, no login.** A commenter picks a nickname and writes;
  likes are one-per-visitor via a stored anonymous id. Lean into the **bulletin-board / taped-flyer-
  wall** metaphor — a wall people scribble on, not a moderated forum.
- Each comment: nickname + body + date + a **like button with a live count** that toggles on tap. Make
  the like delightful and tactile — stamp press / marker tick / ink-splat.
- A **leave-a-comment** form (nickname + body) with friendly, on-brand validation / empty / rate-limited
  states (there's spam rate-limiting + a hidden honeypot — write copy for "slow down").
- Comments may be **moderated** (held until approved) per a setting — design the "awaiting moderation"
  acknowledgement (e.g. a hand-stamped "PENDING / w kolejce").
- Empty thread → a hand-stamped "be the first / bądź pierwszy" invitation.

---

## 10. Brand identity (priority #1 — give this real attention)

- **Wordmark / logo / lettering** for "Under the Big Black Sun" (and/or "Karol") in his hand-lettered
  ransom/flyer spirit. Reusable across header, footer, OG image, favicon, stamp. Propose a **primary
  lockup + a compact mark**.
- A **sticker / stamp kit** that recurs as brand furniture: "commissions open", "Warszawa", a star, a
  smiley blob, a riso registration target. These double as UI accents and brand signal.
- A **motif library** (stars, skulls, crosses, hands, candles, creatures) as line-art for borders,
  dividers, section marks — the building blocks of the dense frames in §7.
- A consistent **voice** in microcopy: scrappy, warm, direct, a little unhinged, bilingual-aware.
  Provide example microcopy (nav labels, buttons, empty states, 404, comment prompts) in EN with a PL
  note.
- **OG / social card** template — shared posts look intentional and on-brand (art + ransom title in the
  post's spot). The site is meant to be reposted in the scene.

---

## 11. Hard constraints (real, not suggestions)

- **Tech reality:** **Next.js 15 (App Router) + Payload CMS 3**, React, **CSS custom properties + plain
  CSS/SCSS**, design-token-driven. No Tailwind currently (you may recommend an approach). Deliver design
  as **token values, component specs, and CSS-friendly direction** an engineer can implement in this
  stack — not just flat mockups.
- **Fonts freely licensed**, Polish-diacritic capable, self-hostable; state licenses for anything new.
- **CONTRAST RULE (§4) is mandatory. WCAG AA** for body text and interactive contrast — including black
  text on every riso flood (verify each ratio).
- **`prefers-reduced-motion`** fallback for all motion (incl. misregistration / animated grain).
- **Bilingual:** every component must survive long Polish strings *and* EN; language switcher always
  visible.
- **Performance:** textures/grain/halftone are lightweight SVG; large artwork responsive + lazy-loaded;
  motion must not jank on mobile (the scene is on phones — mobile-first).
- **Accessibility:** full keyboard nav, visible focus states (on-brand — e.g. a marker scribble-circle),
  alt text, semantic structure.
- The current build already ships these primitives you can rename/replace but should map onto:
  `PaperBg`, `RansomHeading`, `TapeStrip`, `Sticker`, `Halftone`. v2 will likely need new ones
  (RisoFlood, MotifBorder, PhotostatBlock, SpotProvider). Call out new vs. refined.
- Karol's real pieces are **content** (shown via CMS), not decoration. The *design system* (textures,
  motifs, lettering, riso floods) is what you author. (One cropped illustration already drives the 404
  — that pattern is fine.)

---

## 12. Deliverables (what to hand back)

1. **Design direction / moodboard** — articulate the "xerox maximalism × single-ink riso × excellent
   UX" thesis, referencing specific `reference/*.jpg` pieces and the rationale.
2. **Brand identity** — wordmark/logo lockups + compact mark, sticker/stamp kit, **motif library**,
   favicon/OG template, voice & example microcopy (EN + PL note).
3. **Design system / tokens** — the constant base + **riso spot family with final hexes and the
   rotation/`--spot` mechanism**, type scale + the multi-voice display kit + body, spacing, radii,
   texture/halftone/photostat/misregistration spec, motion principles ("paper/print" feel), elevation
   ("tape-lift" / hard-shadow) model. Express as CSS-custom-property values.
4. **Component specs** — header/nav (+ scribble-circle active state), language switcher, RisoFlood
   section, MotifBorder, collage post-card, gallery item + detail/lightbox, mixed-voice ransom heading,
   tape/sticker/stamp, buttons (incl. the tactile like button), comment item + comment form, embed
   players, "load more", footer. Each with states (default / hover / focus / active / disabled /
   loading / empty / error) and reduced-motion fallback.
5. **Key screen designs** (desktop + mobile): Home, Artwork/gallery, Post/article (with comments),
   About (with commission path), 404 — each showing its **riso spot**, the bilingual case, and a
   long-content case. Show at least **two different section spots** so the rotation reads.
6. **Interaction / motion notes** — signature micro-interactions and transitions (paper lift, tape
   peel, stamp press, marker draw-on, riso misregistration shimmer), all with reduced-motion fallbacks.
7. **Implementation notes** — how this maps onto Next 15 + Payload + CSS-token stack; new components vs.
   refinements of existing primitives (`PaperBg`, `RansomHeading`, `TapeStrip`, `Sticker`, `Halftone`);
   how `--spot` is set per page/section; how floods stay AA.

Deliver in a form a developer can implement directly: concrete tokens, measurable specs, clear component
behavior — not only static visuals.

---

## 13. Anti-goals (do NOT do)

- Don't make it light, airy, and well-behaved like the v1 design — **this is the explicit thing we're
  fixing.** Floods and density are mandatory on the loud screens.
- Don't go corporate / startup-minimal / "clean SaaS."
- Don't make it a literal unreadable scanned-paper skeuomorph — the chaos is *surface*; content stays
  crisp and accessible.
- Don't let texture/collage break wayfinding or readability. Chaos in texture, never in navigation.
- Don't use yellow as text on light backgrounds (§4). Don't put body text on a too-light flood.
- Don't paint every screen in all five spots at once — **one spot per context** (confetti is the rare
  exception).
- Don't introduce non-free fonts or fonts without Polish diacritics.
- Don't redesign the Payload admin (out of scope).
- Don't lose Karol's recognizable hand-made identity in pursuit of polish.

---

## Appendix — current state (context for the designer)

- Live site (current "zine v1"): a working Next 15 + Payload 3 blog — Home, Post, About, 404, bilingual
  EN/PL, anonymous comments + likes, ISR, deployed on Vercel. **The data model, pages, and features
  already exist and work.** This redesign replaces the **visual layer only**.
- Reference: **`reference/*.jpg`** in this repo — 18 real screenshots of Karol's flyers, the ground
  truth for §1 and §4. (Do not scrape Instagram — IG blocks it; the scans are the source.)
- v1 brief (`docs/superpowers/specs/2026-06-09-redesign-brief.md`) and the original design doc
  (`2026-06-09-under-big-black-sun-design.md`) exist for history — **do not follow their palette/
  restraint; this brief intentionally departs from them.**
