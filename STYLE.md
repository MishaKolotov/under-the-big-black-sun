# STYLE.md — Under the Big Black Sun

The concrete visual brief for the site. It is derived from analysis of Karol's real
artwork (`under_the_big_black_sun`) — 18 Instagram screenshots in the repo root. The
frontend builds the entire site from this document + the files it references.

## What the artwork actually is (observed)
Photocopied DIY punk / hardcore **gig-flyer and zine art**. Across the screenshots:
black ink on off-white / newsprint paper dominates; heavy **xerox halftone grain**,
**drippy / bleeding ink**, rough photocopy edges and toner speckle; **scratchy,
wobbly hand-drawn lines**; **hand-lettered ransom-note headlines** with repeated,
stacked words (e.g. `XIU XIU XIU`, `CUMBIA / CUMBIA / CUMBIA`, `MIDDLEMAN / TRÄUME`
repeated down the page); taped-up collage feel. A handful of pieces are single-spot
**riso/photocopy prints** (electric blue, red) and several lean on **highlighter
yellow** (the yellow trench-coat "WARSAW dérive" detective, "MUSIC is my HOBBY", the
yellow-on-black radioactive flyer). One bowling-themed piece uses tiny **red + green +
blue** accents. Text is **Polish + English**.

Recurring motifs: screaming faces / monsters / demons, skulls & skeletons, candles,
**stars**, hands, **checkerboard / grid**, smiley blobs, **crosses**, Warsaw landmarks
(Palace of Culture), tigers / creatures, peace signs.

Mood: **loud, scrappy, hand-made, anti-corporate, communal, slightly unhinged but
warm.** Imperfect on purpose — nothing perfectly aligned, everything looks photocopied
and taped up. The web layer must feel cut-and-pasted, never templated.

## Palette (exact hexes)
| Role | Token | Hex |
|------|-------|-----|
| Primary ink (near-black, warm) | `--ink` | `#14110f` |
| Secondary ink | `--ink-soft` | `#2b2723` |
| Paper (off-white newsprint) | `--paper` | `#f4efe3` |
| Paper bright (cut-outs / cards) | `--paper-bright` | `#fbf8ef` |
| Paper dim (aged / shadow) | `--paper-dim` | `#e7e0cf` |
| **Spot: highlighter yellow** | `--highlighter` | `#ffe800` |
| Highlighter edge/shadow | `--highlighter-deep` | `#f2cf00` |
| Rare accent — red | `--accent-red` | `#e0301e` |
| Rare accent — green | `--accent-green` | `#1f8a3b` |

Black is the **primary ink**; paper is off-white. Red and green are **rare** accents —
never as equal stripes, never flag-like, never adjacent in equal weight.

## CONTRAST RULE (mandatory, verbatim)
> **Spot color: highlighter yellow.** CONTRAST RULE (MANDATORY): NEVER yellow text on
> white. Yellow is used ONLY as: (a) highlighter/marker fill BEHIND black text, (b)
> sticker/tape/stamp accents, (c) accent on BLACK backgrounds (yellow-on-black is
> encouraged). Black stays the primary ink. Paper is off-white/newsprint.

Body text must stay **WCAG AA** legible: ink `#14110f` on paper `#f4efe3` ≈ **15:1**
contrast (far above the 4.5:1 AA threshold). Yellow-on-black (`#ffe800` on `#14110f`)
≈ **13:1** — also safe, and the only sanctioned yellow-text context.

## Fonts (all FREELY licensed — confirmed)
Configured in `src/app/(frontend)/fonts.ts` via `next/font/google` (self-hosted at
build, no runtime Google requests). All include `latin-ext` where available for Polish
diacritics (ł, ż, ó, ę, ś…).

| Var | Font | License | Source | Role / why |
|-----|------|---------|--------|------------|
| `--font-display` | **Anton** | OFL 1.1 | Google Fonts | Ultra-condensed heavy poster face — the punk gig-flyer headline energy. |
| `--font-ransom` | **Archivo Black** | OFL 1.1 | Google Fonts | Fat grotesque for the cut-up ransom-note mix (alternates with Anton per word). |
| `--font-stamp` | **Special Elite** | Apache 2.0 | Google Fonts | Distressed typewriter — tape labels, stickers, stamps, captions, dates. |
| `--font-body` | **Spline Sans Mono** | OFL 1.1 | Google Fonts | Legible monospace body copy — typewriter/xerox vibe while staying WCAG-readable. |

All four are confirmed available on Google Fonts under the licenses above (OFL 1.1 /
Apache 2.0 are free for commercial + embedding use).

## Type scale
Fluid clamps in `tokens.css`: `--fs-display` … `--fs-small`. Headlines uppercase,
tight leading (`--lh-tight` 0.95). Body uses `--lh-body` 1.6 and a `--measure` of 68ch
for readability. Mobile-first; everything scales up via `clamp()`.

## Texture approach
Lightweight hand-written SVGs in `public/textures/`, applied at low opacity via tokens
so intensity is tunable globally:
- **`grain.svg`** — `feTurbulence` fractal noise thresholded to toner speckle. Used as
  the **fixed site-wide grain overlay** (`.zine-grain`, `multiply`, `--grain-opacity`).
- **`halftone.svg`** — tiny tiling dot screen. Used by `<Halftone>` over images/boxes
  (`.zine-halftone-overlay`, `--halftone-opacity`); images also get a high-contrast
  grayscale xerox filter (`.zine-halftone-img`).
- **`paper.svg`** — `feTurbulence` fiber/blotch mottling for the newsprint surface
  (`.zine-paper::before`, `multiply`, `--paper-tex-opacity`).

All overlays are `pointer-events:none` and sit behind/above content without blocking
selection. **`prefers-reduced-motion`** is respected — the grain is static, and any
animated grain a consumer adds is disabled under reduced-motion.

Imperfection is parameterized: `--tilt-xs/sm/md/lg`, `--jitter`. Hard, blur-free drop
shadows (`--shadow-hard`) reproduce the photocopy offset look.

## Motif inventory (for illustration / iconography sourcing)
Screaming faces, monsters, demons; skulls & skeletons; candles; stars; hands;
checkerboard & grids; smiley blobs; crosses; Warsaw landmarks (Palace of Culture);
tigers/creatures; peace signs. Use as spot decorations, dividers, section marks,
sticker art — sparingly, always black-ink line-art on paper.

## Component inventory (`src/components/zine/`)
Presentational primitives — no data, no logic. See `src/components/zine/README.md`.
- **`PaperBg`** — newsprint surface / inverted black panel; optional site-wide grain.
- **`RansomHeading`** — cut-up ransom-note headline (alternating rotation/fill/font);
  accessible `aria-label` carries the real text.
- **`TapeStrip`** — rotatable/positionable strip of translucent tape (yellow/paper/black).
- **`Sticker`** — rotated hard-bordered label/stamp (paper/yellow/black, optional circle).
- **`Halftone`** — wraps an image/box with halftone wash + xerox grayscale filter.

Supporting utilities in `zine.css`: `.zine-marker` (highlighter behind black text),
`.zine-border(-bold)`, `.zine-shadow(-sm)`, `.zine-display/-body/-stamp`, `.zine-tilt-*`.

## Files
- `STYLE.md` — this brief.
- `src/styles/tokens.css` — palette / type / spacing / imperfection / texture vars (single source).
- `src/styles/zine.css` — texture, grain, halftone, tape, sticker, ransom + type utilities.
- `src/app/(frontend)/fonts.ts` — `next/font` config, exports `--font-*` vars + `zineFonts`.
- `public/textures/{grain,halftone,paper}.svg` — texture assets.
- `src/components/zine/*` — the 5 primitives + `README.md`.

Frontend: import `tokens.css` then `zine.css` once in the layout, put `zineFonts` on
`<html>`/`<body>`, render one `<PaperBg withGrain>` near the root.
