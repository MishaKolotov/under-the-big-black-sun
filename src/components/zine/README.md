# `src/components/zine` — presentational primitives

DIY-punk / xerox-zine visual primitives. **No data fetching, no business logic.**
They consume the global CSS (`src/styles/tokens.css` + `src/styles/zine.css`) and the
font variables from `src/app/(frontend)/fonts.ts`. Import both stylesheets once in the
frontend layout, and put `zineFonts` (from `fonts.ts`) on `<html>`/`<body>`.

```tsx
import { zineFonts } from '@/app/(frontend)/fonts'
import '@/styles/tokens.css'
import '@/styles/zine.css'
import { PaperBg, RansomHeading, TapeStrip, Sticker, Halftone } from '@/components/zine'
// (no barrel file shipped — import each from its own module, see below)
```

> There is **no `index.ts` barrel**. Import each primitive directly, e.g.
> `import { PaperBg } from '@/components/zine/PaperBg'`. Each module also has a
> default export.

## Primitives

### `<PaperBg>`
The newsprint paper surface (or inverted black panel). Wrap a page/section in it.
- `withGrain` — also renders the fixed site-wide toner-grain overlay. **Render once**
  (root layout), not per section.
- `invert` — black panel surface; this is where yellow-on-black accents belong.
- `as` — `'div' | 'main' | 'section' | 'article'` (default `div`).
```tsx
<PaperBg as="main" withGrain>…page…</PaperBg>
<PaperBg invert>…black hero with yellow accents…</PaperBg>
```

### `<RansomHeading>`
Hand-cut ransom-note headline. Cycles alternating rotation / fill / font per word
(or letter). Full text stays as the heading's accessible name (`aria-label`).
- `text` (required), `level` (1–4, default 2), `split` (`'word'` | `'letter'`).
```tsx
<RansomHeading text="UNDER THE BIG BLACK SUN" level={1} />
<RansomHeading text="ZINE" split="letter" level={2} />
```

### `<TapeStrip>`
A strip of translucent "tape" to pin things to the page.
- `rotate` (deg, default -4), `tone` (`'yellow' | 'paper' | 'black'`), `style` for
  absolute positioning, optional `children` label.
```tsx
<TapeStrip rotate={6} style={{ position: 'absolute', top: -10, left: 20 }} />
<TapeStrip tone="black">07.06 · 20:00</TapeStrip>
```

### `<Sticker>`
A rotated, hard-bordered label / stamp (badges, dates, prices, call-outs).
- `children` (required), `rotate` (default -3), `tone` (`'paper' | 'yellow' | 'black'`),
  `circle` (round sticker).
```tsx
<Sticker tone="yellow" rotate={4}>NEW</Sticker>
<Sticker circle tone="black">24 MAJA</Sticker>
```

### `<Halftone>`
Wraps an image/box and lays a dot-screen wash over it; optionally pushes the child
image to high-contrast grayscale xerox.
- `filterImage` (default true), `intensity` (0–1 overlay opacity override).
```tsx
<Halftone>
  <img src={cover.url} alt={cover.alt} width={cover.width} height={cover.height} />
</Halftone>
```

## Handy utility classes (from `zine.css`)
- `.zine-marker` — highlighter swipe **behind black text** (wrap a `<span>`). Never
  produces yellow text (honors the contrast rule).
- `.zine-border`, `.zine-border-bold`, `.zine-shadow`, `.zine-shadow-sm` — inked edges
  + hard (blur-free) xerox drop shadows.
- `.zine-display`, `.zine-body`, `.zine-stamp` — type presets.
- `.zine-tilt-l/-r`, `.zine-tilt-lg-l/-r` — shared wobble budget.

## Contrast rule (do not break)
Yellow (`--highlighter`) is ONLY: (a) marker fill **behind** black text, (b) sticker/
tape/stamp accents, (c) accent **on black backgrounds**. **Never yellow text on white.**
Black is the primary ink; paper is off-white. Body text must stay WCAG AA legible.
