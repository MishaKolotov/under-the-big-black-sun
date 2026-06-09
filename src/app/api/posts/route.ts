import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payloadClient'
import { locales, defaultLocale, type Locale } from '@/i18n/config'
import type { Where } from 'payload'
import type { Media } from '@/payload-types'

type PostCard = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  publishedDate: string
  coverImage: { url: string; alt: string; width: number; height: number } | null
}

const isLocale = (v: string | null): v is Locale => locales.includes((v ?? '') as Locale)

// GET /api/posts?locale=&limit=&cursorDate=&cursorId=
// Order: publishedDate DESC, id DESC. Keyset/cursor pagination via a compound (date,id) clause.
export async function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams

    const locale: Locale = isLocale(sp.get('locale')) ? (sp.get('locale') as Locale) : defaultLocale

    const limitRaw = Number(sp.get('limit'))
    const limit = Number.isFinite(limitRaw) ? Math.min(24, Math.max(1, Math.trunc(limitRaw))) : 6

    const cursorDate = sp.get('cursorDate')
    const cursorId = sp.get('cursorId')

    // Published only. (overrideAccess:false would also enforce this, but we filter explicitly
    // so the keyset clauses compose cleanly.)
    const clauses: Where[] = [{ status: { equals: 'published' } }]

    // Keyset cursor: items strictly "after" the last seen (publishedDate,id) in DESC order, i.e.
    //   publishedDate < cursorDate  OR  (publishedDate == cursorDate AND id < cursorId)
    if (cursorDate && cursorId) {
      const cursorIdNum = Number(cursorId)
      // Reject garbage cursors with a clean 400 instead of letting NaN reach the query and 500.
      if (!Number.isFinite(cursorIdNum))
        return NextResponse.json({ error: 'invalid cursor' }, { status: 400 })
      clauses.push({
        or: [
          { publishedDate: { less_than: cursorDate } },
          {
            and: [
              { publishedDate: { equals: cursorDate } },
              { id: { less_than: cursorIdNum } },
            ],
          },
        ],
      })
    }

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      locale,
      depth: 1, // populate coverImage (media) one level deep
      limit,
      sort: '-publishedDate,-id',
      overrideAccess: false,
      where: { and: clauses },
    })

    const items: PostCard[] = result.docs.map((p) => {
      const cover = p.coverImage
      const media = cover && typeof cover === 'object' ? (cover as Media) : null
      const coverImage =
        media && media.url
          ? {
              url: media.url,
              alt: media.alt ?? '',
              width: media.width ?? 0,
              height: media.height ?? 0,
            }
          : null

      return {
        id: String(p.id),
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? null,
        publishedDate: p.publishedDate ?? p.createdAt,
        coverImage,
      }
    })

    const last = result.docs[result.docs.length - 1]
    const nextCursor =
      result.docs.length === limit && last
        ? { date: last.publishedDate ?? last.createdAt, id: String(last.id) }
        : null

    return NextResponse.json(
      { items, nextCursor },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    )
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
