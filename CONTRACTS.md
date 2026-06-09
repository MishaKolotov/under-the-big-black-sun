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
### GET /api/public/posts?locale=&limit=&cursorDate=&cursorId=
Response: `{ items: PostCard[]; nextCursor: { date: string; id: string } | null }`
```ts
type PostCard = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  publishedDate: string
  coverImage: { url: string; alt: string; width: number; height: number } | null
}
```
Order: publishedDate DESC, id DESC. nextCursor = last item's (publishedDate,id) or null.

### GET /api/public/comments?post=<id>
Response: `{ comments: CommentDTO[] }`
```ts
type CommentDTO = {
  id: string
  nickname: string
  body: string
  createdAt: string
  likeCount: number
}
```

### POST /api/public/comments
Body: `{ post: string; nickname: string; body: string; website?: string /* honeypot, must be empty */ }`
Response 201: `{ comment: CommentDTO; pending: boolean }`
Errors: 400 (validation/honeypot/empty/links-only/too-long), 429 (rate limited).

### POST /api/public/likes
Body: `{ comment: string; anonId: string }`
Response 200: `{ liked: boolean; likeCount: number }`
Errors: 400 (bad input), 429 (rate limited).

## Limits
- comment body: 1..2000 chars; nickname: 1..60 chars.
- rate limit: comments ≤ 5 / 10 min / IP; likes ≤ 60 / 10 min / IP. (action-keyed)

## anonId
Client localStorage key `ubbs_anon_id`, UUID v4, generated on first visit. Sent in POST /api/public/likes.

## Revalidation
Posts afterChange/afterDelete hook calls revalidatePath for BOTH locales:
`/en`, `/pl`, `/en/posts/<slug>`, `/pl/posts/<slug>`.
