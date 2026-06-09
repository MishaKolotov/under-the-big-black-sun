# Under the Big Black Sun — Implementation Plan

> **For agentic workers:** This is an ORCHESTRATED multi-subagent build. The orchestrator
> dispatches each Task below to a specialized subagent (architect / schema / i18n / backend /
> frontend / design / devops) per the dependency phases. Each Task is a self-contained brief:
> exact files, exact code/config, and an acceptance check the orchestrator runs before moving on.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A photocopied-zine personal blog for Karol (illustrator/drummer/DIY punk) — Next.js 15
+ Payload 3 in one repo, Postgres (Neon) + Vercel Blob, EN/PL i18n, anonymous comments + likes,
ISR, deployed on Vercel.

**Architecture:** Single repo, Payload CMS mounted inside Next App Router. next-intl owns the
`/[locale]/` URL segment and maps to Payload's `locale` fetch param. Public reads are
ISR-cached; anonymous writes go through `/api` route handlers using the Payload Local API, gated
by a Postgres-backed per-IP rate limit + honeypot. Zine visual layer (CSS textures, halftone,
collage, freely-licensed punk fonts) driven by STYLE.md from analysis of Karol's real flyer art.

**Tech Stack:** Next.js 15, TypeScript, Payload CMS 3.x, `@payloadcms/db-postgres`,
`@payloadcms/storage-vercel-blob`, `@payloadcms/richtext-lexical`, next-intl, pnpm, Vercel.

**Source of truth:** `docs/superpowers/specs/2026-06-09-under-big-black-sun-design.md`. Every
subagent reads the spec + `CONTRACTS.md` before writing code. Where this plan and the spec
disagree, the spec wins — flag it to the orchestrator.

---

## Phase map (dependencies)

```
Phase 0  architect   → scaffold + version pins + Payload/Next/Blob/PG wiring + CONTRACTS.md  (BLOCKS all)
Phase 1  schema      → collections, Settings, localization, access control, hooks, seed       (needs 0)
         design ─┐    → analyze screenshots → STYLE.md → zine layer (tokens, fonts, textures)  (parallel, needs 0)
         i18n  ─┘    → next-intl, middleware, locale↔Payload map, switcher                     (parallel, needs 0)
Phase 2  backend     → /api comment+like+posts handlers, rate limit, sanitize, embed block     (needs 0,1)
         frontend    → pages, ISR, Lexical render, comments/likes UI, load-more, SEO           (needs 0,1,design,i18n)
Phase 3  devops      → .env.example, README, migration generation, serverless build verify     (needs all)
Phase 4  orchestrator→ crop illustrations, screenshot relocation, typecheck/build/lint/smoke    (final)
```

Orchestrator gates: a phase's subagents only start once the phase it depends on has landed AND
the orchestrator has eyeballed the deliverable. CONTRACTS.md (Task 1) is the hard first gate.

---

## Conventions all subagents follow

- Package manager: **pnpm** only. Node 20+.
- TypeScript strict. No `any` in exported signatures.
- Comment all non-obvious config (Blob adapter, PG adapter, embed block, next-intl↔Payload map,
  middleware exclusions, anonId/likes, PG rate limit, revalidation hook) — spec requires it.
- Never store uploads on local fs / in repo — Blob only.
- Subagents return a short report: files created/modified, commands run, output, any deviation.
- Do NOT touch the screenshots in repo root (`2026-06-09 11.*.jpg`) or the empty `check` file.

---

## Task 1 — [architect] Scaffold, pin versions, wire core, write CONTRACTS.md

**Subagent:** architect. **Phase 0. Blocks everything. Runs alone first.**

**Files:**
- Create: `package.json`, `pnpm-lock.yaml` (generated), `tsconfig.json`, `next.config.mjs`,
  `src/payload.config.ts`, `src/app/(payload)/admin/[[...segments]]/page.tsx` (+ Payload's
  generated admin route files), `src/app/(payload)/layout.tsx`, `.gitignore`, `.nvmrc`,
  `CONTRACTS.md`, `src/payload-types.ts` (generated).
- Modify: none (greenfield).

- [ ] **Step 1: Verify versions from npm (authoritative).** Do NOT trust memory.

```bash
npm view payload version
npm view payload dist-tags --json
npm view @payloadcms/db-postgres version
npm view @payloadcms/storage-vercel-blob version
npm view @payloadcms/richtext-lexical version
npm view @payloadcms/next version
npm view next version
npm view next-intl version
# Confirm the four @payloadcms/* packages share the SAME version as `payload` core.
# Confirm @payloadcms/next peerDependency on next satisfies Next 15.
npm view @payloadcms/next peerDependencies --json
```
Expected: a single Payload 3.x version (e.g. 3.x.y) shared across core + adapters; `@payloadcms/next`
peer-allows Next 15. **If core and an adapter diverge, pin all to the core version.** Record the
chosen exact versions in the subagent report.

- [ ] **Step 2: Scaffold via the official Payload+Next template, or assemble manually.** Prefer
  `pnpm create payload-app` with the blank/Postgres template if it produces Next 15 + App Router;
  otherwise assemble manually. Either way the result must be: Next 15 App Router, TS strict,
  Payload mounted under `src/app/(payload)/`, `src/payload.config.ts` present. Pin EXACT versions
  (no `^`) in `package.json` for `payload`, the four `@payloadcms/*`, `next`, `react`,
  `react-dom`, `next-intl`.

- [ ] **Step 3: Configure `src/payload.config.ts` core wiring.** Postgres adapter + Blob storage
  + Lexical + localization. Use this shape (comments are mandatory per spec):

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Server URL is derived per-environment, NOT hardcoded (preview vs prod differ).
// VERCEL_PROJECT_PRODUCTION_URL = stable prod domain; VERCEL_URL = per-deployment.
export const getServerURL = (): string => {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export default buildConfig({
  serverURL: getServerURL(),
  admin: { user: 'users' }, // Karol's single admin collection
  // Collections + globals are added by the schema subagent (Task 4). Leave an explicit
  // placeholder array import so the schema subagent only edits collection files, not this block.
  collections: [], // <-- schema subagent replaces with imported collection configs
  globals: [],     // <-- schema subagent adds Settings global
  // EN/PL localization. fallback:true => empty PL falls back to EN. next-intl owns the URL
  // segment; this `locale` is what the frontend passes to payload.find({ locale }).
  localization: {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor({}), // custom embed block added by backend subagent (Task 6)
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // dev pushes schema for fast iteration; prod uses committed migrations run at build time.
    // (Task 13 generates the migrations; this flag keeps cold serverless starts from racing.)
    push: process.env.NODE_ENV === 'development',
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: { media: true }, // Media uploads persist on Blob, never local fs
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
```

- [ ] **Step 4: `next.config.mjs` wraps Payload + next-intl.** Use `withPayload` and the
  `next-intl/plugin`. Add `images.remotePatterns` for the Blob hostname so `next/image` can load
  Blob URLs. No custom CSP (per spec §8). Leave a comment that the next-intl plugin points at the
  i18n request config the i18n subagent creates (`src/i18n/request.ts`).

```js
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Blob URLs are remote; allow next/image to optimize them.
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }] },
}

export default withPayload(withNextIntl(nextConfig))
```

- [ ] **Step 5: `git init` + first commit + `.gitignore`.** Repo is not yet a git repo.
  `.gitignore` must include `node_modules`, `.next`, `.env`, `.env*.local`, `/media` (any stray
  local upload dir), and — per spec — `/reference` (the screenshots get moved there later by the
  orchestrator). Do NOT move the screenshots now.

```bash
git init
git add -A && git commit -m "chore: scaffold Next 15 + Payload 3 (pinned), PG + Blob + Lexical wiring"
```

- [ ] **Step 6: Write `CONTRACTS.md` — the shared contract. THIS IS THE GATE.** It pins exact TS
  types, collection field names, and route signatures so backend/frontend/i18n don't drift.
  Content (write verbatim, this is the source of cross-subagent truth):

````markdown
# CONTRACTS.md — shared types & signatures (read before writing any code)

## Collection slugs (Payload)
`users`, `posts`, `media`, `comments`, `comment-likes`, `rate-limits`. Global: `settings`.

## Field names (exact)
- posts: title, slug, publishedDate, status('draft'|'published'), coverImage(rel→media),
  content(richText), excerpt, tags(text[]). slug is NON-localized; title/content/excerpt localized.
- media: alt, plus Payload upload fields (url, filename, mimeType, width, height, ...).
- comments: post(rel→posts), nickname, body, createdAt, approved(bool).
- comment-likes: comment(rel→comments), anonId(text).
- rate-limits: ip(text), action('comment'|'like'), createdAt(date).
- settings(global): moderateComments(bool).

## Locale type
`type Locale = 'en' | 'pl'` — single source in `src/i18n/config.ts`.

## API route shapes (Next route handlers under /api, NOT locale-prefixed)
### GET /api/posts?locale=&limit=&cursorDate=&cursorId=
Response: `{ items: PostCard[]; nextCursor: { date: string; id: string } | null }`
```ts
type PostCard = {
  id: string
  slug: string
  title: string          // resolved for requested locale
  excerpt: string | null
  publishedDate: string  // ISO
  coverImage: { url: string; alt: string; width: number; height: number } | null
}
```
Order: publishedDate DESC, id DESC. nextCursor = last item's (publishedDate,id) or null.

### GET /api/comments?post=<id>
Response: `{ comments: CommentDTO[] }`
```ts
type CommentDTO = {
  id: string
  nickname: string       // sanitized/escaped server-side
  body: string           // sanitized/escaped server-side
  createdAt: string       // ISO
  likeCount: number       // COUNT(*) of comment-likes, computed
}
```

### POST /api/comments
Body: `{ post: string; nickname: string; body: string; website?: string /* honeypot, must be empty */ }`
Response 201: `{ comment: CommentDTO; pending: boolean }` (pending=true when moderation on)
Errors: 400 (validation/honeypot/empty/links-only/too-long), 429 (rate limited).

### POST /api/likes
Body: `{ comment: string; anonId: string }`
Response 200: `{ liked: boolean; likeCount: number }`  (liked=current state after toggle)
Errors: 400 (bad input), 429 (rate limited).

## Limits
- comment body: 1..2000 chars; nickname: 1..60 chars.
- rate limit: comments ≤ 5 / 10 min / IP; likes ≤ 60 / 10 min / IP. (action-keyed)

## anonId
Client localStorage key `ubbs_anon_id`, UUID v4, generated on first visit. Sent in POST /api/likes.

## Revalidation
Posts afterChange/afterDelete hook calls revalidatePath for BOTH locales:
`/en`, `/pl`, `/en/posts/<slug>`, `/pl/posts/<slug>`.
````

- [ ] **Step 7: Commit CONTRACTS.md.**

```bash
git add CONTRACTS.md && git commit -m "docs: add CONTRACTS.md (shared types, field names, route signatures)"
```

**Acceptance check (orchestrator runs):**
```bash
pnpm install            # resolves, lockfile written
pnpm exec tsc --noEmit  # config typechecks (collections empty is fine)
ls CONTRACTS.md src/payload.config.ts next.config.mjs
git log --oneline       # two commits present
```
Expected: install clean, tsc clean, files present. Payload won't fully boot without DATABASE_URL
yet — that's fine; the typecheck is the gate. **Do not start Phase 1 until this passes.**

---

## Task 2 — [orchestrator] Provision env for local boot (between Phase 0 and 1)

**Owner:** orchestrator (needs real secrets / Neon DB; a subagent can't).

- [ ] **Step 1:** Confirm with the user whether a Neon `DATABASE_URL` and Vercel
  `BLOB_READ_WRITE_TOKEN` exist. If not, the schema/backend subagents still build (they write code,
  not run the live DB), but the orchestrator's smoke test (Task 14) needs them. Generate a local
  `PAYLOAD_SECRET` with `openssl rand -hex 32`. Write a local-only `.env` (gitignored). Do NOT
  commit secrets.

**Acceptance:** `.env` exists locally with the 4 vars, or the user has confirmed they'll supply
them before the smoke test. Build-phase code does not block on this.

---

## Task 3 — [design] Analyze screenshots → STYLE.md → zine design tokens (parallel, Phase 1)

**Subagent:** design. **Phase 1, parallel with schema + i18n. Needs Task 1 (scaffold).**

**Files:**
- Create: `STYLE.md`, `src/styles/tokens.css` (CSS custom properties), `src/styles/zine.css`
  (textures/grain/halftone/tape utilities), `src/app/(frontend)/fonts.ts` (next/font config),
  `public/textures/` (grain/halftone PNG/SVG generated or hand-built), and a short
  `src/components/zine/README.md` describing the collage components the frontend will consume.
- Do NOT create page components (that's frontend). Provide the *visual layer* + a few primitive
  components: `src/components/zine/Halftone.tsx`, `TapeStrip.tsx`, `Sticker.tsx`,
  `RansomHeading.tsx`, `PaperBg.tsx`. Keep them presentational (no data).

- [ ] **Step 1: Read every screenshot.** The 19 files are `2026-06-09 11.*.jpg` in repo root.
  Read them with the Read tool (they render visually). Catalogue: dominant palette per piece,
  line quality, recurring motifs, typography vibe, texture, mood. (The orchestrator's spec §1
  already summarizes this — confirm against the actual images, don't just copy.)

- [ ] **Step 2: Write `STYLE.md`** — concrete brief: exact hexes (B/W + the locked highlighter
  yellow, propose exact value ~`#ffe800`, plus the off-white paper tone and ink black), the
  contrast rule (spec §2: NEVER yellow text on white; yellow as highlighter fill behind black /
  sticker accents / on black bg; tiny red+green sparingly, never flag-like), the chosen
  FREELY-LICENSED fonts (Google Fonts / Fontshare — e.g. a raw condensed display for headings +
  a legible mono/typewriter or grotesque for body), texture approach, motif list, and component
  inventory. List font licenses.

- [ ] **Step 3: Implement `tokens.css`** — CSS custom properties for the palette, spacing, the
  rotation/imperfection variables, and font-family vars. Single source the frontend imports.

- [ ] **Step 4: Implement `fonts.ts`** using `next/font/google` (and self-hosted Fontshare via
  `next/font/local` if used — download into `src/app/(frontend)/fonts/`). Export font CSS vars.

- [ ] **Step 5: Implement `zine.css` + texture assets + the 5 primitive components.** Grain/
  halftone overlay usable site-wide; tape/sticker/ransom-heading/paper primitives. Mobile-first,
  responsive, accessible (real contrast for text, `prefers-reduced-motion` respected for any
  animated grain). Components take `className`/`children`, no data fetching.

- [ ] **Step 6: Commit.**
```bash
git add STYLE.md src/styles src/components/zine "src/app/(frontend)/fonts.ts" public/textures
git commit -m "feat(design): STYLE.md + zine visual layer (tokens, fonts, textures, primitives)"
```

**Acceptance check (orchestrator):** STYLE.md exists with exact hexes + named licensed fonts +
contrast rule restated. `pnpm exec tsc --noEmit` clean. Orchestrator eyeballs primitives render
(verified later in Task 14 smoke). Fonts are confirmed freely-licensed (check each license line).

---

## Task 4 — [schema] Collections, Settings, localization, access control, cascade hooks (Phase 1)

**Subagent:** schema. **Phase 1. Needs Task 1. Edits `payload.config.ts` collections/globals
arrays ONLY (architect owns the rest of that file — coordinate: schema replaces the two
placeholder arrays and adds imports, nothing else).**

**Files:**
- Create: `src/collections/Users.ts`, `Posts.ts`, `Media.ts`, `Comments.ts`, `CommentLikes.ts`,
  `RateLimits.ts`, `src/globals/Settings.ts`, `src/access/index.ts` (shared access fns),
  `src/fields/slug.ts` (slug field + hook), `src/hooks/cascadeDelete.ts`,
  `src/hooks/revalidate.ts` (the afterChange/afterDelete revalidation — backend/frontend import
  the path list; implement the path-building helper here).
- Modify: `src/payload.config.ts` (collections + globals arrays + imports only).

- [ ] **Step 1: `src/access/index.ts`** — reusable access control fns matching spec §5.

```ts
import type { Access } from 'payload'
const isAdmin: Access = ({ req }) => Boolean(req.user) // logged-in = Karol
// Public reads published posts only; drafts never exposed to anon.
const publishedOrAdmin: Access = ({ req }) =>
  req.user ? true : { status: { equals: 'published' } }
// Approved comments only for anon.
const approvedOrAdmin: Access = ({ req }) =>
  req.user ? true : { approved: { equals: true } }
const anyone: Access = () => true
const noPublicCreate: Access = ({ req }) => Boolean(req.user)
export { isAdmin, publishedOrAdmin, approvedOrAdmin, anyone, noPublicCreate }
```

- [ ] **Step 2: `src/fields/slug.ts`** — slug field with the EN→PL→nanoid fallback (spec §4).

```ts
import type { Field } from 'payload'
import { customAlphabet } from 'nanoid' // add nanoid to deps
const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80)

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Auto from EN title; editable. Shared by both languages.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return slugify(value)
        // data.title may be localized object or string depending on context.
        const en = typeof data?.title === 'object' ? data?.title?.en : data?.title
        const pl = typeof data?.title === 'object' ? data?.title?.pl : undefined
        const base = en || pl
        return base ? slugify(base) : `post-${nano()}`
      },
    ],
  },
}
```

- [ ] **Step 3: `src/collections/Users.ts`** — auth-enabled, admin-only, no public signup.

```ts
import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Payload auth; first user created via /admin onboarding (no hardcoded creds)
  admin: { useAsTitle: 'email' },
  access: { read: ({ req }) => Boolean(req.user), create: ({ req }) => Boolean(req.user),
            update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  fields: [], // email/password provided by auth
}
```

- [ ] **Step 4: `src/collections/Media.ts`** — upload→Blob, alt text, public read.

```ts
import type { CollectionConfig } from 'payload'
import { isAdmin, anyone } from '../access'
export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // storage handled by vercelBlobStorage plugin → persists on Blob, never local fs
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
```

- [ ] **Step 5: `src/collections/Posts.ts`** — localized fields, slug, status, cover, revalidate
  hooks. Lexical `content` localized. coverImage rel→media. Tags text hasMany.

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdmin, publishedOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { revalidatePost } from '../hooks/revalidate'
import { cascadeDeletePostComments } from '../hooks/cascadeDelete'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedDate'] },
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { afterChange: [revalidatePost], afterDelete: [revalidatePost, cascadeDeletePostComments] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField,
    { name: 'status', type: 'select', required: true, defaultValue: 'draft',
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
      admin: { position: 'sidebar' } },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true,
      editor: lexicalEditor({}) /* backend Task 6 swaps in the embed-block-enabled editor */ },
    { name: 'tags', type: 'text', hasMany: true },
  ],
}
```

- [ ] **Step 6: `src/collections/Comments.ts`** — public approved-read, no public field-write
  except via route handler (create allowed but constrained; the route handler uses Local API
  with `overrideAccess`, so set create to admin-only here and let the handler bypass — documented).

```ts
import type { CollectionConfig } from 'payload'
import { isAdmin, approvedOrAdmin } from '../access'
import { cascadeDeleteCommentLikes } from '../hooks/cascadeDelete'
export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: { useAsTitle: 'nickname', defaultColumns: ['nickname', 'post', 'approved', 'createdAt'] },
  // Public CREATE happens ONLY through /api/comments (Local API, overrideAccess). Direct REST
  // create is admin-only. Read = approved-only for anon (moderation-safe).
  access: { read: approvedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { afterDelete: [cascadeDeleteCommentLikes] },
  fields: [
    { name: 'post', type: 'relationship', relationTo: 'posts', required: true, index: true },
    { name: 'nickname', type: 'text', required: true, maxLength: 60 },
    { name: 'body', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'approved', type: 'checkbox', defaultValue: false, index: true },
    // createdAt is provided by Payload timestamps; enable below.
  ],
  timestamps: true,
}
```

- [ ] **Step 7: `src/collections/CommentLikes.ts`** — one row per (comment, anonId), no counter.

```ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
export const CommentLikes: CollectionConfig = {
  slug: 'comment-likes',
  // Toggled ONLY via /api/likes (Local API). No public REST create. Count is always COUNT(*).
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  indexes: [{ fields: ['comment', 'anonId'], unique: true }], // idempotency: one like per anon per comment
  fields: [
    { name: 'comment', type: 'relationship', relationTo: 'comments', required: true, index: true },
    { name: 'anonId', type: 'text', required: true, index: true },
  ],
}
```

- [ ] **Step 8: `src/collections/RateLimits.ts`** — IP + action + timestamp, pruned by handler.

```ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin }, // touched only via Local API
  fields: [
    { name: 'ip', type: 'text', required: true, index: true },
    { name: 'action', type: 'select', required: true,
      options: [{ label: 'comment', value: 'comment' }, { label: 'like', value: 'like' }] },
  ],
  timestamps: true, // createdAt used for the sliding window
}
```

- [ ] **Step 9: `src/globals/Settings.ts`** — moderateComments toggle.

```ts
import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access'
export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: anyone, update: isAdmin },
  fields: [{ name: 'moderateComments', type: 'checkbox', defaultValue: false,
    admin: { description: 'On = new comments wait for approval. Off = auto-approved.' } }],
}
```

- [ ] **Step 10: `src/hooks/revalidate.ts`** — both-locale revalidation (spec §3).

```ts
import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'
// Revalidate BOTH locales' home + post page, so neither language serves stale cache.
export const revalidatePaths = (slug: string) => {
  for (const l of ['en', 'pl']) {
    revalidatePath(`/${l}`)
    revalidatePath(`/${l}/posts/${slug}`)
  }
}
export const revalidatePost: CollectionAfterChangeHook = ({ doc }) => {
  if (doc?.slug) revalidatePaths(doc.slug)
  return doc
}
```

- [ ] **Step 11: `src/hooks/cascadeDelete.ts`** — bulk where-delete (spec §4, no N+1).

```ts
import type { CollectionAfterDeleteHook } from 'payload'
// Deleting a comment → drop its likes in ONE where-delete.
export const cascadeDeleteCommentLikes: CollectionAfterDeleteHook = async ({ req, id }) => {
  await req.payload.delete({ collection: 'comment-likes', where: { comment: { equals: id } } })
}
// Deleting a post → drop its comments' likes, then the comments (bulk, not per-row).
export const cascadeDeletePostComments: CollectionAfterDeleteHook = async ({ req, id }) => {
  const comments = await req.payload.find({ collection: 'comments', where: { post: { equals: id } },
    limit: 0, depth: 0 })
  const ids = comments.docs.map((c) => c.id)
  if (ids.length) {
    await req.payload.delete({ collection: 'comment-likes', where: { comment: { in: ids } } })
    await req.payload.delete({ collection: 'comments', where: { post: { equals: id } } })
  }
}
```

- [ ] **Step 12: Wire into `payload.config.ts`** — replace the two placeholder arrays + imports
  ONLY:

```ts
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { CommentLikes } from './collections/CommentLikes'
import { RateLimits } from './collections/RateLimits'
import { Settings } from './globals/Settings'
// ...
  collections: [Users, Posts, Media, Comments, CommentLikes, RateLimits],
  globals: [Settings],
```

- [ ] **Step 13: Regenerate types + typecheck.**
```bash
pnpm exec payload generate:types   # updates src/payload-types.ts
pnpm exec tsc --noEmit
```
Expected: types regenerate, tsc clean.

- [ ] **Step 14: Seed script `src/seed/index.ts` + `pnpm seed`.** Idempotent: one published post
  (EN+PL title/content/excerpt) + one approved comment. Upsert by slug `example-post`.

```ts
import { getPayload } from 'payload'
import config from '../payload.config'
const run = async () => {
  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'posts', where: { slug: { equals: 'example-post' } }, limit: 1 })
  let post = existing.docs[0]
  if (!post) {
    post = await payload.create({ collection: 'posts', locale: 'en', data: {
      title: 'First Transmission', slug: 'example-post', status: 'published',
      publishedDate: new Date().toISOString(),
      excerpt: 'A test post from the photocopier.',
      content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Hello from the zine.' }] }] } } as any,
    } })
    await payload.update({ collection: 'posts', id: post.id, locale: 'pl', data: {
      title: 'Pierwsza transmisja', excerpt: 'Testowy wpis z ksero.',
      content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Witaj z zinu.' }] }] } } as any,
    } })
    await payload.create({ collection: 'comments', data: {
      post: post.id, nickname: 'xerox_kid', body: 'first!', approved: true } })
  }
  console.log('Seed complete:', post.slug)
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
```
Add to `package.json` scripts: `"seed": "tsx src/seed/index.ts"` (add `tsx` dev dep). Comment in
README that seed needs DATABASE_URL + BLOB token.

- [ ] **Step 15: Commit.**
```bash
git add src/collections src/globals src/access src/fields src/hooks src/seed src/payload.config.ts src/payload-types.ts package.json
git commit -m "feat(schema): collections, Settings, localization, access, cascade hooks, seed"
```

**Acceptance check (orchestrator):** `pnpm exec tsc --noEmit` clean; field names match
CONTRACTS.md exactly (grep them); `payload-types.ts` regenerated. If a Neon DB is available,
`pnpm seed` runs idempotently (run twice → "Seed complete" both times, no dup).

---

## Task 5 — [i18n] next-intl routing, middleware exclusions, locale↔Payload map, switcher (Phase 1)

**Subagent:** i18n. **Phase 1, parallel with schema + design. Needs Task 1.**

**Files:**
- Create: `src/i18n/config.ts` (Locale type + locales), `src/i18n/request.ts` (next-intl request
  config), `src/i18n/routing.ts` (next-intl routing), `src/middleware.ts`, `messages/en.json`,
  `messages/pl.json`, `src/components/LanguageSwitcher.tsx`.

- [ ] **Step 1: `src/i18n/config.ts`** — single source for the Locale type (CONTRACTS.md).
```ts
export const locales = ['en', 'pl'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
```

- [ ] **Step 2: `src/i18n/routing.ts`** + `src/i18n/request.ts` per next-intl App Router setup,
  loading `messages/<locale>.json`. (Verify current next-intl API via `npm view next-intl version`
  and its docs — the `defineRouting`/`getRequestConfig` shape.)

- [ ] **Step 3: `src/middleware.ts` — MUST exclude /admin and /api.** This is the spec's hard
  rule: never locale-prefix or redirect Payload admin or API routes.
```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
export default createMiddleware(routing)
export const config = {
  // Exclude /admin (Payload), /api (route handlers), Next internals, and static/asset files.
  // /admin MUST load with no locale prefix; /api must not be redirected.
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: `messages/en.json` + `messages/pl.json`** — UI strings (nav, "Load more",
  comment form labels, like, 404 copy, about placeholders). Provide real strings, not stubs.

- [ ] **Step 5: `LanguageSwitcher.tsx`** — visible client switcher using next-intl's
  `usePathname`/`useRouter` to swap the locale segment while preserving the rest of the path.

- [ ] **Step 6: Typecheck + commit.**
```bash
pnpm exec tsc --noEmit
git add src/i18n src/middleware.ts messages src/components/LanguageSwitcher.tsx
git commit -m "feat(i18n): next-intl routing, middleware (excludes /admin+/api), switcher"
```

**Acceptance check (orchestrator):** tsc clean. Grep `src/middleware.ts` matcher excludes
`admin` and `api`. Verified live in Task 14 (admin loads at `/admin` with no locale prefix).

---

## Task 6 — [backend] /api handlers, rate limit, sanitize, honeypot, embed block + renderer (Phase 2)

**Subagent:** backend. **Phase 2. Needs Tasks 1 + 4 (collections) + CONTRACTS.md.**

**Files:**
- Create: `src/lib/payloadClient.ts` (cached `getPayload`), `src/lib/rateLimit.ts`,
  `src/lib/sanitize.ts`, `src/lib/likeCount.ts`,
  `src/app/api/comments/route.ts`, `src/app/api/likes/route.ts`, `src/app/api/posts/route.ts`,
  `src/blocks/embed/EmbedBlock.ts` (Lexical block config), `src/blocks/embed/EmbedRenderer.tsx`
  (frontend renderer — frontend imports it), `src/blocks/embed/provider.ts` (url→provider+id).
- Modify: `src/collections/Posts.ts` content field editor → enable the embed block (coordinate
  with schema: backend owns the editor feature wiring on the content field).

- [ ] **Step 1: `src/lib/payloadClient.ts`** — memoized Payload instance for route handlers.
```ts
import { getPayload } from 'payload'
import config from '../payload.config'
let cached: Awaited<ReturnType<typeof getPayload>> | null = null
export const getPayloadClient = async () => (cached ??= await getPayload({ config }))
```

- [ ] **Step 2: `src/lib/rateLimit.ts`** — Postgres-backed sliding window (spec §6, no in-mem Map).
```ts
import type { Payload } from 'payload'
const WINDOW_MS = 10 * 60 * 1000
const LIMITS = { comment: 5, like: 60 } as const
export const getIp = (req: Request) =>
  (req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()) || 'unknown'
export const checkRateLimit = async (payload: Payload, ip: string, action: 'comment' | 'like') => {
  const since = new Date(Date.now() - WINDOW_MS).toISOString()
  // prune old rows for this ip+action (keeps table small), then count recent
  await payload.delete({ collection: 'rate-limits',
    where: { and: [{ ip: { equals: ip } }, { action: { equals: action } }, { createdAt: { less_than: since } }] } })
  const recent = await payload.count({ collection: 'rate-limits',
    where: { and: [{ ip: { equals: ip } }, { action: { equals: action } }, { createdAt: { greater_than_equal: since } }] } })
  if (recent.totalDocs >= LIMITS[action]) return false
  await payload.create({ collection: 'rate-limits', data: { ip, action } })
  return true
}
```

- [ ] **Step 3: `src/lib/sanitize.ts`** — escape user text; reject empty/links-only/too-long.
```ts
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const linkRatio = (s: string) => {
  const urls = (s.match(/https?:\/\/\S+/gi) || []).join('').length
  return s.length ? urls / s.length : 0
}
export const cleanComment = (nickname: string, body: string) => {
  const n = (nickname || '').trim(), b = (body || '').trim()
  if (!n || !b) return { ok: false as const, reason: 'empty' }
  if (n.length > 60 || b.length > 2000) return { ok: false as const, reason: 'too-long' }
  if (linkRatio(b) > 0.5) return { ok: false as const, reason: 'links-only' }
  return { ok: true as const, nickname: escapeHtml(n), body: escapeHtml(b) }
}
export { escapeHtml }
```

- [ ] **Step 4: `src/lib/likeCount.ts`** — COUNT(*) for a comment.
```ts
import type { Payload } from 'payload'
export const likeCount = async (payload: Payload, commentId: string) =>
  (await payload.count({ collection: 'comment-likes', where: { comment: { equals: commentId } } })).totalDocs
```

- [ ] **Step 5: `POST/GET /api/comments/route.ts`** — honeypot + rate limit + moderation + escape.
  GET returns approved comments + likeCount per CONTRACTS.md. Set `Cache-Control` on GET. Use
  `overrideAccess: true` for the create (constrained by handler), `overrideAccess: false` /
  default for the public GET so access control applies.

- [ ] **Step 6: `POST /api/likes/route.ts`** — toggle row for (comment, anonId), rate-limit
  action `like`, return `{ liked, likeCount }` per CONTRACTS.md.

- [ ] **Step 7: `GET /api/posts/route.ts`** — compound-cursor pagination (spec §7a). published
  only, `sort: '-publishedDate,-id'`, the OR where-clause, map to `PostCard`, return `nextCursor`.

- [ ] **Step 8: Embed block.** `provider.ts` parses a URL → `{ provider: 'youtube'|'bandcamp'|
  'soundcloud', embedUrl }`. `EmbedBlock.ts` is a Lexical block with fields `{ url, provider }`.
  Wire it into the Posts `content` lexical editor via `BlocksFeature`. `EmbedRenderer.tsx`
  renders a responsive iframe. **If the custom block proves too heavy, fall back to YouTube-only
  via oEmbed and note the limitation in README + a TODO** (spec §8) — do NOT silently downgrade
  to plain links; report which path was taken to the orchestrator.

- [ ] **Step 9: Typecheck + commit.**
```bash
pnpm exec tsc --noEmit
git add src/lib src/app/api src/blocks src/collections/Posts.ts
git commit -m "feat(backend): comment/like/posts handlers, PG rate limit, sanitize, embed block"
```

**Acceptance check (orchestrator):** tsc clean; route signatures match CONTRACTS.md exactly;
rate limit uses RateLimits table (no in-memory Map — grep for `new Map`); sanitize escapes output.
Functional verification in Task 14.

---

## Task 7 — [frontend] Pages, ISR, Lexical render, comments/likes UI, load-more, SEO (Phase 2)

**Subagent:** frontend. **Phase 2. Needs Tasks 1, 4, 5 (i18n), 3 (design), 6 (renderer + API).**

**Files:**
- Create: `src/app/(frontend)/layout.tsx` (locale layout, fonts, zine bg/grain, switcher in nav),
  `src/app/(frontend)/[locale]/page.tsx` (home, ISR), `src/app/(frontend)/[locale]/posts/[slug]/page.tsx`
  (post, ISR + generateStaticParams + generateMetadata), `src/app/(frontend)/[locale]/about/page.tsx`,
  `src/app/(frontend)/not-found.tsx` (404 with cropped tiger), `src/app/sitemap.ts`,
  `src/app/robots.ts`, `src/components/PostCardItem.tsx`, `src/components/LoadMore.tsx` (client),
  `src/components/Comments.tsx` (client: list + form + likes), `src/components/LexicalContent.tsx`
  (server render of Payload Lexical → React, using EmbedRenderer for embed blocks),
  `src/lib/anonId.ts` (client localStorage UUID), `src/lib/getPosts.ts` (server-side first-page +
  single-post fetch via Payload, locale-aware).
- Use design primitives from `src/components/zine/*` and tokens/zine CSS. Do NOT redefine styles.

- [ ] **Step 1: `src/lib/anonId.ts`** — localStorage `ubbs_anon_id` UUID v4, generated first
  visit (CONTRACTS.md). Client-only (`'use client'` consumers).
```ts
export const getAnonId = (): string => {
  const k = 'ubbs_anon_id'
  let v = localStorage.getItem(k)
  if (!v) { v = crypto.randomUUID(); localStorage.setItem(k, v) }
  return v
}
```

- [ ] **Step 2: `src/lib/getPosts.ts`** — server fetch helpers (home first page; single post by
  slug) via Payload, passing the URL locale as Payload `locale`. Published only. Map to PostCard
  for the home list. Return `null` for missing/unpublished post (→ notFound()).

- [ ] **Step 3: Home `[locale]/page.tsx`** — ISR (`export const revalidate = 60`). Render first
  page of PostCards (cover + title + date + excerpt, clickable to `/[locale]/posts/[slug]`), the
  LanguageSwitcher, and `<LoadMore>` seeded with the first `nextCursor`. Zine layout.

- [ ] **Step 4: `LoadMore.tsx` (client)** — button fetches `/api/posts?locale=&cursorDate=&cursorId=`,
  appends items, hides when `nextCursor` is null. Not infinite scroll, not numbered pages.

- [ ] **Step 5: Post `[locale]/posts/[slug]/page.tsx`** — ISR + `revalidate = 60`.
  `generateStaticParams` returns locale × published-slug cross product (spec §3). `generateMetadata`
  builds OG/Twitter with coverImage URL (fallback static OG asset) + hreflang alternates.
  Renders `<LexicalContent>` then `<Comments postId=... />` (client). Comments NOT baked into
  static HTML — fetched client-side.

- [ ] **Step 6: `LexicalContent.tsx`** — render Payload Lexical JSON to React (paragraphs,
  headings, lists, quotes, links, inline upload images → next/image with Blob URL, code blocks,
  dividers, and the custom embed block via `EmbedRenderer`). Use the official
  `@payloadcms/richtext-lexical/react` converter if available; verify via npm.

- [ ] **Step 7: `Comments.tsx` (client)** — fetch `/api/comments?post=`, render escaped
  nickname/body + per-comment like button with live count; tap toggles like via `/api/likes`
  with `getAnonId()`; optimistic count update. Comment form: nickname + body + hidden honeypot
  `website` field; POST `/api/comments`; show "awaiting moderation" when `pending`. All UI strings
  from next-intl.

- [ ] **Step 8: About + 404.** About: bio + placeholder links (Instagram, Bandcamp, label).
  404 (`not-found.tsx`): cropped Karol illustration from `public/assets/` (orchestrator crops in
  Task 12 — reference `/assets/404-tiger.png`; if absent at build, use a zine CSS fallback so
  build never breaks).

- [ ] **Step 9: `sitemap.ts` + `robots.ts`** — sitemap over published posts × locales; robots
  allows all, points at sitemap. Query Payload at build (needs DATABASE_URL at build, spec §11).

- [ ] **Step 10: Typecheck + commit.**
```bash
pnpm exec tsc --noEmit
git add "src/app/(frontend)" src/app/sitemap.ts src/app/robots.ts src/components src/lib/anonId.ts src/lib/getPosts.ts
git commit -m "feat(frontend): pages, ISR, Lexical render, comments+likes UI, load-more, SEO"
```

**Acceptance check (orchestrator):** tsc clean; home/post/about/404 components exist; comments
fetched client-side (not in server component); `generateStaticParams` emits both locales;
load-more uses cursor (not page numbers). Live verification in Task 14.

---

## Task 8 — [devops] .env.example, README, migrations, serverless build verify (Phase 3)

**Subagent:** devops. **Phase 3. Needs all prior tasks.**

**Files:**
- Create: `.env.example`, `README.md`, `src/migrations/*` (generated), update `package.json`
  scripts (`build` runs `payload migrate` then `next build`; add `migrate`, `generate:types`).

- [ ] **Step 1: `.env.example`** — `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `PAYLOAD_SECRET`,
  optional `NEXT_PUBLIC_SERVER_URL` (dev fallback), with comments incl. the build-time-env note
  (spec §11: these must be in Vercel **Build** env, not just Runtime).

- [ ] **Step 2: Generate migrations** (prod path, spec §11). With a DATABASE_URL available:
```bash
pnpm exec payload migrate:create initial
```
Commit `src/migrations/`. Set `package.json` `"build": "payload migrate && next build"` so prod
runs committed migrations at build time (not runtime). Confirm `push:false` outside dev (already
set in payload.config Task 1).

- [ ] **Step 3: `README.md`** — env table, local dev (`pnpm dev`), first-run admin creation at
  `/admin` (no hardcoded creds — Karol sets email/password on first visit), `pnpm seed`, Vercel
  deploy (set env in Build + Runtime), custom domain, the embed limitation/TODO if backend fell
  back to YouTube-only, and the known like-bypass limitation (spec: anonId likes are a polite
  barrier, not fraud protection — do NOT add login/fingerprinting).

- [ ] **Step 4: Commit.**
```bash
git add .env.example README.md src/migrations package.json
git commit -m "docs(devops): env example, README, prod migrations, build wiring"
```

**Acceptance check (orchestrator):** `.env.example` has all 4 vars + build-time note; README
covers first-run admin + seed + deploy + both limitations; `build` script runs migrate then build.

---

## Task 9–11 reserved (kept for parity with phase map; no-op — phases 1/2 cover the work).

---

## Task 12 — [orchestrator] Crop illustrations for live UI

**Owner:** orchestrator (spec §2: cropping is NOT a subagent job).

- [ ] **Step 1:** Crop the "LOST IN HELL FOREVER" tiger from `2026-06-09 11.29.34.jpg` (full-bleed
  single piece) — remove the IG top status/nav band and any bottom chrome. The single-piece shots
  have the artwork roughly centered between a top band (~0–135px) and bottom (~+ likes UI).
```bash
# Inspect, then crop to the artwork bounds (adjust X/Y/W/H after Reading the source):
magick "2026-06-09 11.29.34.jpg" -crop 591x900+0+150 +repage public/assets/404-tiger.png
```
- [ ] **Step 2:** Read `public/assets/404-tiger.png` to verify no IG chrome remains; re-crop if
  needed. Optionally crop a second piece for the static OG fallback (`public/assets/og-default.png`).
- [ ] **Step 3:** Commit cropped assets only (NOT the source screenshots).
```bash
git add public/assets && git commit -m "assets: cropped Karol illustration for 404 + OG fallback"
```

**Acceptance:** cropped PNGs contain only artwork (verified by Read), live under `public/assets/`.

---

## Task 13 — [orchestrator] Relocate screenshots to /reference

**Owner:** orchestrator. **Only after design (Task 3) has analyzed them + written STYLE.md.**

- [ ] **Step 1:** Confirm STYLE.md exists and references the screenshots. Then move them.
```bash
mkdir -p reference
git mv 2026-06-09\ 11.*.jpg reference/ 2>/dev/null || mv 2026-06-09\ 11.*.jpg reference/
# /reference already in .gitignore (Task 1). If any screenshot was tracked, untrack it:
git rm --cached reference/* 2>/dev/null || true
mv check reference/ 2>/dev/null || true
```
- [ ] **Step 2:** Verify repo root no longer ships screenshots; `git status` shows them ignored.
```bash
git add -A && git commit -m "chore: move IG reference screenshots to /reference (gitignored)"
```

**Acceptance:** root clean of `2026-06-09 *.jpg`; `/reference` gitignored; cropped live assets
remain in `public/assets/`.

---

## Task 14 — [orchestrator] Final verification pass

**Owner:** orchestrator. **After all tasks.**

- [ ] **Step 1: Typecheck.** `pnpm exec tsc --noEmit` → clean.
- [ ] **Step 2: Lint.** `pnpm lint` (Next's eslint) → clean (fix or report).
- [ ] **Step 3: Build.** With `.env` (real Neon + Blob) present:
  `pnpm build` → succeeds (runs `payload migrate` then `next build`; generateStaticParams +
  sitemap query Payload at build — confirms build-time env works).
- [ ] **Step 4: Smoke test (local).** `pnpm dev`, then:
  - `/admin` loads with NO locale prefix (i18n middleware exclusion works).
  - Create the first admin via onboarding; create + publish a post in EN + PL with an inline
    image (uploads to Blob) and an embed.
  - `/en` and `/pl` render the post; switcher swaps locale preserving path.
  - Open the post: Lexical renders (image from Blob, working link, embed iframe).
  - Post a comment (honeypot empty) → appears (or pending if moderation on). Submit with honeypot
    filled → rejected. Spam past rate limit → 429.
  - Like a comment → count increments; tap again → decrements (toggle); reload → persists (anonId).
  - 404 page shows the cropped tiger.
  - `pnpm seed` twice → idempotent.
- [ ] **Step 5: Report** results to user with any deviations (e.g. embed fell back to YouTube-only).

**Acceptance:** typecheck + lint + build clean; smoke checklist passes; deviations reported.

---

## Self-review (done by orchestrator before dispatch)

- **Spec coverage:** §1 style→Task3; §2 spot/crop→Task3+12; §3 arch/routing/ISR/revalidate→
  Task1+4(revalidate)+5(middleware)+7(ISR/params); §4 data model+slug+cascade→Task4; §5 access→
  Task4; §6 anti-abuse→Task6; §7/§7a endpoints+cursor→Task6; §8 embeds+CSP→Task6; §9 pages+SEO→
  Task7; §10 zine→Task3; §11 env/migrations/build-time→Task1+8; §12 orchestration+screenshots→
  Task1+12+13. No gap found.
- **Placeholder scan:** code blocks are concrete; remaining judgement calls (exact crop bounds,
  next-intl/lexical-react exact API) are explicitly flagged to verify via npm/Read, not hand-waved.
- **Type consistency:** field names + route shapes all trace to CONTRACTS.md (Task1). Locale type
  single-sourced in `src/i18n/config.ts`. revalidatePaths/cascade fn names consistent across tasks.
