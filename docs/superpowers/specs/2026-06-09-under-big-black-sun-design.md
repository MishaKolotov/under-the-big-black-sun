# Under the Big Black Sun — Design Spec

**Date:** 2026-06-09
**Project:** Personal blog/zine site for Karol — illustrator, drummer, DIY punk (Warsaw scene).
**Domain handle:** `under_the_big_black_sun` (Instagram).

This spec records the confirmed visual analysis, locks the open design decisions, and
restates the architecture + shared contracts so parallel subagents don't drift. The
incoming task prompt is itself a near-complete spec; this document is the source of truth
where it adds detail or resolves ambiguity.

---

## 1. Style analysis (Step 0 — confirmed, NOT guessed)

Source: 19 Instagram screenshots (591×1280 JPEG) in repo root. They show grid views
(~70+ works) plus individual full-res pieces. Material is **sufficient** — no more examples
needed. Screenshots are DESIGN reference only, never blog content.

**Medium:** DIY punk/hardcore gig flyers, gig posters, zine art. Photocopied / xerox /
risograph aesthetic: visible halftone grain, drippy bleeding ink, rough photocopy edges,
toner speckle, taped-up collage feel.

**Palette:** Overwhelmingly **black ink on off-white / newsprint paper**. Single harsh spot
color per piece (never full CMYK): seen across his work in electric/riso blue, riso red,
acid green, highlighter yellow. **Live site spot color = highlighter yellow** (the "WARSAW
derive" yellow) — warm, sunny, smiley/chill but still punk.

**Line quality:** Hand-drawn, scratchy, wobbly, fast, energetic. Crude-on-purpose. Drippy
ink, dense crosshatch + stipple. Imperfect by design.

**Typography vibe:** Hand-lettered ransom-note headlines; dripping/spiky display lettering;
stamped/stenciled text; repeated stacked words (TURBO SONIDERO ×3, MIDDLEMAN ×8, CUMBIA ×3).
Body/info text in typewriter/condensed type. Polish + English mixed (Warsaw scene).

**Recurring motifs:** Screaming faces/monsters, skeletons, demons, candles, stars, hands,
grids/checkerboard, smiley blobs, Warsaw landmarks (Palace of Culture), tigers/creatures.

**Mood:** Raw, fast, communal, scene-flyer energy. Cut-and-paste collage, slight rotations,
overlap, tape/sticker elements, imperfection.

---

## 2. Locked design decisions

1. **Spot color: highlighter yellow** (`~#ffe800`, exact hex finalized in STYLE.md).
   **Contrast rule (mandatory):** NEVER yellow text on white. Yellow is used as:
   - highlighter/marker fills *behind* black text,
   - sticker/tape/stamp accents,
   - accent on **black** backgrounds (yellow-on-black is allowed and encouraged).
   Black stays the primary ink. Yellow is the warm pop.
   **Sparingly:** tiny red + green accents from Karol's own palette as *rare* accents only —
   never equal stripes, never flag-like.

2. **Screenshots → crop clean art.** Crop IG chrome (status bar, likes/comments UI, Cyrillic
   IG text) out of 1–2 standout pieces and ship as baked static assets in `public/assets/`.
   Best 404 candidate: "LOST IN HELL FOREVER" screaming-tiger (file `2026-06-09 11.29.34.jpg`).
   Alternates: "STEGNY" smiley blob, "THESE BOOTS ARE GONNA WALK ALL OVER YOU."
   All other live "art" = CSS/SVG zine layer + Karol's own uploads via /admin.
   **Cropping is the ORCHESTRATOR's job, not a subagent's** — a text subagent can't reliably
   pixel-crop. I crop with ImageMagick (`magick input.jpg -crop WxH+X+Y +repage out.png`),
   eyeballing the bounds from the actual image (IG chrome sits at fixed top/bottom bands on a
   591×1280 capture), then I verify the crop by Reading the output before it ships. The design
   subagent treats the cropped PNG as a given input, not something it produces.

3. **Workflow:** spec → plan → orchestrate subagents → final verification pass.

---

## 3. Architecture (single repo)

Next.js 15 (App Router, TS) with **Payload CMS v3 mounted inside Next**. Postgres via Neon
(`@payloadcms/db-postgres`). Uploads → Vercel Blob (`@payloadcms/storage-vercel-blob`) — never
local fs / repo. UI i18n via `next-intl`. Payload Lexical rich text. Deploy: Vercel.

**Version pinning:** latest stable Payload 3.x core + matching `db-postgres`,
`storage-vercel-blob`, `richtext-lexical` from the *same* release. Confirm Next 15 ↔ Payload
3.x compat before install. **Verify via `npm view <pkg> versions --json` / `npm view <pkg>
peerDependencies`** — the authoritative source. context7 may be used as a secondary docs
reference, but do NOT depend on it (it's an MCP server that may not be connected); npm is the
fallback and the source of truth for exact versions.

### Routing ownership (resolved)
- `next-intl` OWNS the URL locale segment. Public routes under `/[locale]/`, locale ∈ {en, pl}.
- URL locale → Payload `locale` param on fetch. next-intl = source of truth for language;
  Payload stores localized content.
- Payload localization: locales `en` + `pl`, defaultLocale `en`, **`fallback: true`** (PL
  falls back to EN when empty).
- **next-intl middleware matcher MUST exclude `/admin` and `/api`.** Never locale-prefix or
  redirect them. `/admin` must load with NO locale prefix.

### Rendering
- Home `/[locale]`: first page via ISR; "Load more" fetches subsequent pages CLIENT-side from
  an `/api` route using cursor pagination (see §7a for cursor shape — NOT bare `publishedDate`).
- Post `/[locale]/posts/[slug]`: ISR. `generateStaticParams` over PUBLISHED posts only,
  emitting params for **every locale** (en + pl) — `generateStaticParams` returns the cross
  product of `{ locale } × { slug }`.
  Revalidation: on-demand via Payload `afterChange` hook PLUS time-based fallback
  `revalidate = 60`. Comments fetched CLIENT-side, never baked into the static page.
  **Revalidation MUST cover both locales.** On publish/update the hook calls
  `revalidatePath('/en/posts/<slug>')`, `revalidatePath('/pl/posts/<slug>')`,
  `revalidatePath('/en')`, `revalidatePath('/pl')` (and `/` if a non-prefixed root exists).
  Revalidating only one locale leaves the other language stuck on stale cache. On delete, the
  same paths are revalidated so the dropped post disappears from both home pages.

---

## 4. Data model (Payload collections + global)

- **Users** — single admin (Karol), Payload auth, no public sign-up. First admin via Payload
  first-run onboarding at `/admin` (documented in README, no hardcoded creds).
- **Posts** — `title` (localized), `slug` (single shared NON-localized, required, editable),
  `publishedDate`, `status` (draft/published), `coverImage` (upload→Media), `content` (Lexical,
  localized EN/PL), `excerpt` (localized, optional), `tags` (text hasMany, optional).
  **Slug generation (resolved):** the `slug` `beforeValidate`/`beforeChange` hook slugifies the
  EN title when slug is empty. To guarantee a slug always exists regardless of authoring order:
  fall back to the PL title, then to a short random suffix (e.g. `post-<8charnanoid>`), if EN is
  empty. `slug` stays `required` and is validated for URL-safe uniqueness. **EN title is NOT
  forced required** (Karol may draft in PL first); the fallback chain guarantees a slug anyway.
  Slug is unique across all posts.
- **Media** — uploads → Vercel Blob, `alt` text. Inline images in Lexical use Payload upload
  feature pointing at Media (→ Blob), never manual URLs.
- **Comments** — NO accounts. `post` (relation), `nickname` (text, required, NOT unique),
  `body` (text), `createdAt`, `approved` (bool). No denormalized like count.
- **CommentLikes** — one row per (`comment`, `anonId`). `anonId` = persistent localStorage UUID
  generated first visit, no login. Idempotent per anonId per comment; second tap = unlike
  (delete row). Count = `COUNT(*)` always, never a stored counter (avoids serverless races).
- **RateLimits** — request timestamps keyed by IP (+ action) for the Postgres-backed throttle.
  Prune old rows.
- **Settings** (global) — `moderateComments` boolean, default `false`. false → new comments
  `approved=true` immediately. true → `approved=false` until Karol approves.

**Cascade / orphan cleanup (resolved):**
- Deleting a **Comment** → `payload.delete(CommentLikes, { where: { comment: { equals: id } } })`
  — one bulk `where` delete, not a per-row loop. Moderation "delete" goes through this path.
- Deleting a **Post** → bulk-delete CommentLikes for that post's comments, then bulk-delete the
  Comments — i.e. collect comment ids and delete CommentLikes with `comment in [...ids]` in one
  call, then delete Comments with `post == id` in one call. **Avoid the N+1** of relying on the
  per-Comment hook firing once per comment (volumes are tiny here, but the bulk path is the
  spec'd one). The per-Comment hook still exists for the single-delete case.
- Implement via Payload collection hooks (DB-agnostic, works through the Local API) rather than
  raw Postgres `ON DELETE CASCADE`, so admin deletes and seed teardown both stay consistent.

---

## 5. Access control (explicit)

- **Public READ:** published Posts only, Media, approved Comments, like counts. Drafts NEVER
  exposed publicly.
- **Public CREATE:** Comments (via route handler, rate-limit + honeypot constrained) and
  CommentLikes (via route handler). Nothing else public-writable.
- **Admin only:** create/update/delete Posts/Media/Users/Settings, comment moderation.

---

## 6. Anti-abuse (anonymous comments)

- Rate-limit comment POSTs **per IP** via the RateLimits table (store timestamps, reject over
  threshold in a window). NO in-memory Map (ephemeral serverless).
- Honeypot hidden field + max body length + reject empty / links-only.
- Sanitize & escape ALL comment + nickname output. No XSS, no raw HTML of user input.
- **POST `/api/likes`** also rate-limited per IP (action `like`) via the same RateLimits table
  — a looser threshold than comments, but present (otherwise like-toggling is a free write loop).
- **GET endpoints (`/api/comments`, `/api/posts`)** get **`Cache-Control` headers only** — no
  per-IP DB read-throttle. A `read` action in RateLimits would write a row on every public GET,
  and client comment-polling bypasses the CDN straight into a write-on-read; not worth it for a
  friend's blog. CDN/ISR absorbs repeats via Cache-Control; that's the cap. Not DoS-proof —
  proportionate, noted as such in README. (Write endpoints — comments + likes — keep their
  real per-IP RateLimits throttle.)
- **Known limitation (acknowledge, don't solve):** localStorage anonId likes are trivially
  bypassable. Intentional polite barrier, not fraud protection. Note in README. Do NOT add
  login or fingerprinting.

---

## 7. Endpoints (Next route handlers under `/api`, call Payload Local API)

- **POST `/api/comments`** — validate honeypot + length, check rate limit, set `approved` per
  `Settings.moderateComments`, create comment.
- **GET `/api/comments?post=<id>&...`** — list approved comments for a post (client-fetched).
- **POST `/api/likes`** — toggle (create/delete) CommentLikes row for (comment, anonId). Return
  current `COUNT(*)`. Rate-limited (action `like`).
- **GET `/api/posts?...`** — cursor pagination for "Load more" (see §7a).

### 7a. Cursor pagination shape (resolved — tie-breaker required)

`publishedDate` alone is NOT a safe cursor: two posts can share a `publishedDate`, so a
bare-date cursor skips or duplicates rows at the boundary. The cursor is the **compound
key `(publishedDate, id)`**, ordered `publishedDate DESC, id DESC`.

- Request: `GET /api/posts?locale=<en|pl>&limit=N&cursorDate=<ISO>&cursorId=<id>`
  (first page omits `cursorDate`/`cursorId`).
- Query: published only, `WHERE (publishedDate, id) < (cursorDate, cursorId)` expressed as
  Payload `where` (`OR`: `publishedDate < cursorDate` **OR** (`publishedDate == cursorDate`
  **AND** `id < cursorId`)), `sort: '-publishedDate,-id'`, `limit: N`.
- Response: `{ items: PostCard[], nextCursor: { date, id } | null }`. `nextCursor` is the last
  item's `(publishedDate, id)`; `null` when fewer than `limit` rows returned.
- The `id` tie-breaker only needs to be **deterministic and stable**, not chronological. With
  serial-int ids `id <` reflects insert order; with UUID ids the lexicographic order within one
  identical `publishedDate` is arbitrary-but-stable — visually fine, no skip/dupe. Either id type
  works; do NOT add a third sort key to "fix" UUID ordering.

**CONTRACTS.md is written FIRST (by architect), before backend/frontend build.** It pins the
exact TS types (`PostCard`, comment/like request+response bodies, the `nextCursor` shape above),
collection field names, and route signatures. Dependents read CONTRACTS.md — they do not invent
shapes. This is the one true cross-cutting blocker, so it is gated as the first deliverable.

---

## 8. Embeds

Custom Lexical block storing `{ url, provider }` for YouTube / Bandcamp / SoundCloud, rendered
as responsive iframe. If full custom block proves too heavy, fall back to YouTube-only via
oEmbed and note the limitation in README + TODO — do NOT silently downgrade to plain links.

**CSP coupling:** if a Content-Security-Policy is set in `next.config`/headers (the SEO/robots
care suggests prod hygiene), iframes break silently unless `frame-src` allowlists the embed
hosts: `youtube.com`/`youtube-nocom.com`, `bandcamp.com`, `soundcloud.com`/`w.soundcloud.com`.
Decision: keep it simple — **no custom CSP for v1** (so embeds just work); if one is added
later, that allowlist is mandatory. Whoever adds CSP owns updating `frame-src`.

---

## 9. Pages

1. **Home `/[locale]`** — published posts newest first (cover + title + date + excerpt,
   clickable). ISR first page + client "Load more". Visible language switcher.
2. **Post `/[locale]/posts/[slug]`** — full Lexical render (responsive images, working links,
   working embeds). Below: comment list + leave-a-comment box (nickname + body, no signup).
   Each comment: like button + live count, tap toggles like for this visitor (anonId).
3. **About `/[locale]/about`** — bio + links (Instagram, Bandcamp, label…) placeholders.
4. **404** — uses cropped Karol illustration (the "LOST IN HELL FOREVER" tiger).

**SEO / social (in scope, minimal):** per-post OpenGraph + Twitter cards via Next
`generateMetadata` — `og:image` = post `coverImage` (Blob URL), falling back to a static
cropped-illustration OG asset for pages without a cover. `robots.txt` and a `sitemap.ts` over
published posts × locales. Locale `hreflang` alternates on posts. Cheap, and it makes the zine
look intentional when reposted. Not more than this — no analytics, no schema.org bloat.

---

## 10. Zine design layer (driven by STYLE.md)

Photocopied zine / cut-and-paste collage: high contrast, grain/halftone, xerox roughness,
tape/sticker elements, ransom-note energy, slight rotations, overlap, imperfection. Sitewide
texture/noise overlay; grain/halftone on images. Mostly B/W + highlighter-yellow spot
(per §2 rules). FREELY-LICENSED fonts only (Google Fonts / Fontshare) — raw condensed display
for headings (punk-flyer) + legible body; listed in STYLE.md. No system-default look.
Readable, responsive, mobile-first. Punk aesthetic ≠ broken UX.

---

## 11. Env & deployment

- Env: `DATABASE_URL` (Neon), `BLOB_READ_WRITE_TOKEN`, `PAYLOAD_SECRET`, server URL.
- Server URL: derive from `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` at runtime, localhost
  fallback for dev. Do NOT hardcode one `NEXT_PUBLIC_SERVER_URL` (preview vs prod differ).
- **`DATABASE_URL` must be available at BUILD time, not just runtime.** `generateStaticParams`,
  `sitemap.ts`, and per-post OG metadata all query Payload→Postgres during `next build`. Neon is
  reachable at build, but the env var must be set in Vercel's **Build** environment (not only
  Runtime). README + `.env.example` call this out. `BLOB_READ_WRITE_TOKEN` + `PAYLOAD_SECRET`
  likewise needed at build (Payload init runs during build).
- `.env.example` with all of the above.
- `pnpm seed` — inserts one example post (EN+PL) + one approved comment. Idempotent if possible.
- README: env, local dev, first-run admin creation, seed, Vercel deploy, custom domain, embed
  limitation/TODO.
- Verify Vercel serverless build: migrations + Payload init correct for serverless runtime.

**Migration mode (resolved):** dev uses Payload/Drizzle **push** (`payload` dev auto-pushes
schema) for fast local iteration. Production uses **generated, committed migrations**
(`payload migrate:create`), run at **build/deploy time** (`payload migrate` in the Vercel build
step or a predeploy script) — NOT at request runtime. Disable dev push in prod
(`db: postgresAdapter({ ..., push: false })` outside development). README documents the
generate-commit-migrate loop. This keeps serverless cold starts from racing on schema changes.

---

## 12. Orchestration

Orchestrator (me) + subagents:
- **architect** (FIRST, others wait) — scaffold Next 15 + Payload 3 single repo, pin versions,
  wire db-postgres + storage-vercel-blob. Owns package.json + core config.
- **schema** — collections, Settings global, localization config, access control, seed.
- **i18n** — next-intl, `/[locale]/` routing, middleware exclusions, locale↔Payload mapping,
  switcher. (Can start early, parallel.)
- **backend** — comment/like route handlers, Postgres rate-limit, honeypot/spam guard,
  sanitization, custom Lexical embed block + renderer.
- **frontend** — pages, ISR, client comments+likes UI, load-more, Lexical render.
- **design** — analyze screenshots → STYLE.md → zine visual layer consumed by frontend.
  (Can start early, parallel.)
- **devops** — `.env.example`, README, verify serverless build + migrations.

Rules: architect + schema land before dependents build. design + i18n start early in parallel.
**CONTRACTS.md written FIRST** (TS types, field names, API route signatures) — all subagents
read it. No two subagents edit the same file blindly. Final pass: typecheck, build, lint, smoke.

**Screenshot handling:** do NOT delete/move/rename screenshots during scaffolding. After design
subagent analyzes them + writes STYLE.md, move them into `/reference`, add `/reference` to
`.gitignore`; if tracked by git, `git rm --cached`. Any illustration used live is copied
separately into `public/assets/`.
