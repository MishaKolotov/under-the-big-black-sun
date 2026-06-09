# under-big-black-sun

Karol's zine blog — a bilingual (English / Polish) photocopier-aesthetic blog built with
**Next.js 15** (App Router) and **Payload CMS 3** on **Postgres**. Posts are authored in
Payload's Lexical rich-text editor, served as statically-generated locale-prefixed pages
(`/en`, `/pl`), with anonymous nickname comments and likes. Media lives on Vercel Blob;
the database is Neon Postgres; deploys run on Vercel.

---

## Prerequisites

- **Node.js** 20.9+ (see `engines` in `package.json`)
- **pnpm** 10 (`packageManager` pins `pnpm@10.33.2`)
- A **Neon Postgres** database (free tier is fine) — use the *pooled* connection string
- A **Vercel Blob** store (for image/media uploads)

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | What it is | Where to get it | Build-time? |
|---|---|---|---|
| `DATABASE_URL` | Neon Postgres connection string. Use the **pooled** string (host contains `-pooler`) for serverless. | Neon dashboard → project → Connection Details → "Pooled connection". | **Yes** |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token (`vercel_blob_rw_…`). Media uploads persist here, never on local disk. | Vercel → Storage → your Blob store → `.env.local` tab (auto-injected when the store is linked to the project). | **Yes** |
| `PAYLOAD_SECRET` | Secret used to sign Payload auth tokens/cookies. Generate with `openssl rand -hex 32`. Keep stable across deploys. | You generate it. | **Yes** |
| `NEXT_PUBLIC_SERVER_URL` | Public site URL. **Local dev only** — leave as `http://localhost:3000`. | — | No (prod derives it) |

> **Build-time requirement (important for Vercel):** `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`,
> and `PAYLOAD_SECRET` must be set in **both** the **Build** and **Runtime** environments on
> Vercel, not runtime only. `next build` queries Payload → Postgres
> (`generateStaticParams`, `sitemap.ts`, per-post OG metadata) and runs `payload migrate`,
> so Payload initializes — and hits the database and Blob — during the build. Missing any of
> these in the Build environment will fail the deploy.

In production/preview the public URL is derived automatically from Vercel's
`VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` (see `getServerURL()` in
`src/payload.config.ts`), so you do **not** set `NEXT_PUBLIC_SERVER_URL` on Vercel.

---

## Local development

```bash
pnpm install
cp .env.example .env        # then fill in DATABASE_URL, BLOB_READ_WRITE_TOKEN, PAYLOAD_SECRET
pnpm dev                    # starts Next.js on http://localhost:3000
```

In development, Payload **pushes** the schema to your database automatically
(Drizzle "push" mode — `push: true` is wired to `NODE_ENV === 'development'` in
`src/payload.config.ts`), so you do not need to run migrations locally for fast iteration.

**Create the first admin (Karol):** open <http://localhost:3000/admin>. On first run Payload
shows an onboarding screen to create the first admin user — set your email and password there.
**There are no seeded/hardcoded credentials.** After creating the admin you can log in and
start authoring.

Then visit the public site at <http://localhost:3000/en> or <http://localhost:3000/pl>.

### Seeding example content (optional)

```bash
pnpm seed
```

Creates one published example post (EN + PL) plus one approved comment. It is **idempotent**
(upserts by the slug `example-post`, so re-running does nothing new). Requires a valid
`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` in `.env`.

---

## Authoring guide (for Karol)

You don't need to touch code to publish. Everything happens in the admin at `/admin`.

1. **Log in** at `/admin` with the account you created during onboarding.
2. **New post:** Posts → "Create New".
   - Write the body in the **Lexical editor**. To add an image, **drag-and-drop or upload it
     inline** — it uploads to Vercel Blob automatically and is inserted for you. You never
     paste image URLs by hand.
   - Add **links** and **embeds** (YouTube / SoundCloud — see limitations) from the editor
     toolbar.
   - Fill in **title**, **slug**, **excerpt**, optional **cover image** and **tags**.
3. **Draft ↔ Published:** use the **status** toggle. Drafts are not shown on the public site;
   set status to *Published* (with a publish date) to make a post live.
4. **English / Polish:** switch the **locale tab** at the top of the editor to write each
   language. If the Polish version of a field is left empty it falls back to English.
5. **Comments moderation:** Globals → **Settings → "moderate comments"**.
   - **Off** (default): new comments are auto-approved and appear immediately.
   - **On**: new comments are held as *unapproved* and wait for you. Open **Comments**,
     toggle **approved** on the ones you want to show, or **delete** the rest.

Published posts auto-revalidate the public pages for both locales, so changes appear without
a redeploy.

---

## Database migrations (production workflow)

Development uses Drizzle **push** (automatic). **Production uses committed migration files**
that run at build time — `push` is disabled outside development.

The loop is:

1. With a real `DATABASE_URL` pointing at a (dev/staging) database, generate a migration for
   your schema change:
   ```bash
   pnpm migrate:create <descriptive-name>
   ```
   This writes SQL + TypeScript files into `src/migrations/`.
2. **Commit** the generated files in `src/migrations/` to git.
3. On deploy, the Vercel **build command runs `payload migrate`** (it is the first half of
   `pnpm build` → `payload migrate && next build`), applying any pending migrations against the
   production database before the site is built.

`src/migrations/` starts out with only a `.gitkeep` placeholder — the real files appear the
first time you run `pnpm migrate:create` against a database. `payload migrate` with no pending
migrations is a safe no-op, so an empty migrations directory will not break the build.

Convenience scripts:

| Script | Command |
|---|---|
| `pnpm migrate` | `payload migrate` — apply pending migrations |
| `pnpm migrate:create` | `payload migrate:create` — generate a new migration |
| `pnpm generate:types` | `payload generate:types` — regenerate `src/payload-types.ts` |

---

## Deploy to Vercel

1. **Connect the repo** in Vercel (Add New → Project → import this Git repository).
2. **Create / link a Neon Postgres database** and a **Vercel Blob store** for the project.
3. **Set environment variables** — add `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, and
   `PAYLOAD_SECRET` to **both** the **Build** and **Runtime** (Production, and Preview if used)
   environments. See the warning in [Environment variables](#environment-variables) — these
   are required at build time.
4. **Build command:** the default `pnpm build` is correct — it runs `payload migrate` (applies
   committed migrations) and then `next build`. No override needed.
5. **Deploy.** After the first deploy, open `https://<your-domain>/admin` and complete the
   first-admin onboarding to create Karol's account in production.
6. **Custom domain:** Vercel → Project → Settings → Domains → add your domain and follow the
   DNS instructions. The public URL used by Payload/Next is derived automatically from Vercel's
   environment, so no extra config is needed once the domain is set as the production domain.

---

## Internationalization (i18n)

- **next-intl** owns the locale URL segment (`localePrefix: 'always'`), so every public page is
  prefixed: `/en/...` and `/pl/...`.
- **`/admin` and `/api/...` are NOT locale-prefixed** — the Payload admin and the route handlers
  live outside the localized routing.
- The single source of locales is `src/i18n/config.ts` (`'en' | 'pl'`, default `en`, with EN
  fallback for empty PL fields).

---

## Known limitations / TODO

- **Bandcamp embeds.** YouTube and SoundCloud embeds work directly from a pasted URL.
  **Bandcamp does not expose an iframe `src` derivable from a page URL** (their real embed needs
  the album/track numeric id from their embed code/oEmbed). The embed block tags the provider as
  `bandcamp` and iframes the page URL directly, which renders blank on pages that refuse to be
  framed; in that case it falls back to a plain link. **TODO:** add a Bandcamp oEmbed lookup to
  resolve a proper player URL.
- **Anonymous like bypass is intentional.** Likes use a `localStorage` anon id
  (`ubbs_anon_id`), which is trivially bypassable (clear storage / new browser). This is a
  *polite* one-like-per-visitor barrier, **not fraud protection**. No login or fingerprinting is
  used by design.
- **GET endpoints are cache-controlled, not hard rate-limited.** The public read endpoints
  (`GET /api/posts`, `GET /api/comments`) rely on `Cache-Control` headers, not a per-IP read
  throttle. Write endpoints (`POST /api/comments`, `POST /api/likes`) *are* rate-limited per IP
  (comments ≤ 5 / 10 min, likes ≤ 60 / 10 min).
- **No custom Content-Security-Policy.** There is intentionally no custom CSP so third-party
  embeds (YouTube / Bandcamp / SoundCloud) render freely. If a CSP is added later, its
  `frame-src` must allowlist `youtube.com`, `bandcamp.com`, and `soundcloud.com` (and their
  player subdomains) or embeds will break.

---

## Scripts reference

| Script | Purpose |
|---|---|
| `pnpm dev` | Run the dev server (Next.js). |
| `pnpm build` | `payload migrate && next build` — apply migrations, then build. |
| `pnpm start` | Run the production server. |
| `pnpm lint` | Run ESLint (flat config, `eslint .`). |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm generate:types` | Regenerate Payload TypeScript types. |
| `pnpm migrate` / `pnpm migrate:create` | Apply / create database migrations. |
| `pnpm seed` | Seed one example EN+PL post and a comment (idempotent). |
