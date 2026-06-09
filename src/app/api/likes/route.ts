import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payloadClient'
import { checkRateLimit, getIp } from '@/lib/rateLimit'
import { likeCount } from '@/lib/likeCount'

// POST /api/likes -> 200 { liked: boolean, likeCount: number }
// Toggle: one row per (comment, anonId). Create if absent (liked=true), delete if present
// (liked=false). The collection has a unique compound index on (comment, anonId).
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { comment?: unknown; anonId?: unknown }
      | null
    if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 })

    const commentId = typeof body.comment === 'string' ? body.comment : ''
    const anonId = typeof body.anonId === 'string' ? body.anonId.trim() : ''
    if (!commentId || !anonId)
      return NextResponse.json({ error: 'comment and anonId required' }, { status: 400 })

    const payload = await getPayloadClient()

    const allowed = await checkRateLimit(payload, getIp(req), 'like')
    if (!allowed) return NextResponse.json({ error: 'rate limited' }, { status: 429 })

    // Look for an existing like row. comment-likes access is admin-only, so overrideAccess:true.
    const existing = await payload.find({
      collection: 'comment-likes',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [{ comment: { equals: commentId } }, { anonId: { equals: anonId } }],
      },
    })

    let liked: boolean
    if (existing.docs.length > 0) {
      await payload.delete({
        collection: 'comment-likes',
        id: existing.docs[0].id,
        overrideAccess: true,
      })
      liked = false
    } else {
      try {
        await payload.create({
          collection: 'comment-likes',
          overrideAccess: true,
          data: { comment: Number(commentId), anonId },
        })
      } catch {
        // Unique-index race: a concurrent double-tap already inserted the (comment, anonId) row,
        // tripping the unique constraint. Treat as "already liked" and return the current state
        // instead of surfacing a 500.
        return NextResponse.json({
          liked: true,
          likeCount: await likeCount(payload, Number(commentId)),
        })
      }
      liked = true
    }

    return NextResponse.json({ liked, likeCount: await likeCount(payload, Number(commentId)) })
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
