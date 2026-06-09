import { getPayloadClient } from '@/lib/payloadClient'
import type { Locale } from '@/i18n/config'
import type { Media, Post } from '@/payload-types'

// Shared frontend DTO — mirrors PostCard from CONTRACTS.md / the /api/public/posts route.
export type PostCard = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  publishedDate: string
  coverImage: { url: string; alt: string; width: number; height: number } | null
}

export type Cursor = { date: string; id: string }

// Map a populated Media relation (or null/id) to the slim cover DTO.
const mapCover = (cover: Post['coverImage']): PostCard['coverImage'] => {
  const media = cover && typeof cover === 'object' ? (cover as Media) : null
  if (!media || !media.url) return null
  return {
    url: media.url,
    alt: media.alt ?? '',
    width: media.width ?? 0,
    height: media.height ?? 0,
  }
}

const toCard = (p: Post): PostCard => ({
  id: String(p.id),
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt ?? null,
  publishedDate: p.publishedDate ?? p.createdAt,
  coverImage: mapCover(p.coverImage),
})

/**
 * First page of published posts for the home list, locale-aware.
 * Order: publishedDate DESC, id DESC — identical to /api/public/posts so the
 * LoadMore cursor keeps walking the same sequence.
 */
export async function getHomePosts(
  locale: Locale,
  limit = 6,
): Promise<{ items: PostCard[]; nextCursor: Cursor | null }> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit,
    sort: '-publishedDate,-id',
    overrideAccess: false,
    where: { status: { equals: 'published' } },
  })

  const items = result.docs.map((p) => toCard(p as Post))
  const last = result.docs[result.docs.length - 1] as Post | undefined
  const nextCursor =
    result.docs.length === limit && last
      ? { date: last.publishedDate ?? last.createdAt, id: String(last.id) }
      : null

  return { items, nextCursor }
}

/** Full published post by slug + locale, or null if missing/draft. */
export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    locale,
    depth: 2, // populate coverImage + inline upload nodes inside richText
    limit: 1,
    overrideAccess: false,
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
  })

  const doc = result.docs[0] as Post | undefined
  return doc ?? null
}

/** Published slugs (slug is non-localized, so one query suffices). */
export async function getPublishedSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()
  // pagination: false (no limit) intentionally fetches ALL published slugs
  // for generateStaticParams + sitemap — must not truncate.
  const result = await payload.find({
    collection: 'posts',
    depth: 0,
    pagination: false,
    overrideAccess: false,
    where: { status: { equals: 'published' } },
  })
  return result.docs.map((p) => (p as Post).slug)
}
