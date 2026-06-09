import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payloadClient'
import { checkRateLimit, getIp } from '@/lib/rateLimit'
import { cleanComment, escapeHtml } from '@/lib/sanitize'
import { likeCount } from '@/lib/likeCount'

// Public comment endpoints. Note: the comments collection's create/read access is admin-only,
// so we go through the Local API with overrideAccess where appropriate (see below).

type CommentDTO = {
  id: string
  nickname: string
  body: string
  createdAt: string
  likeCount: number
}

// GET /api/comments?post=<id> -> { comments: CommentDTO[] }
export async function GET(req: Request) {
  try {
    const postParam = new URL(req.url).searchParams.get('post')
    if (!postParam) return NextResponse.json({ error: 'post required' }, { status: 400 })

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'comments',
      depth: 0,
      limit: 200,
      sort: 'createdAt',
      // Belt-and-suspenders: keep access control on (overrideAccess false applies the
      // approvedOrAdmin read rule for anon) AND explicitly filter approved=true.
      overrideAccess: false,
      where: {
        and: [{ post: { equals: postParam } }, { approved: { equals: true } }],
      },
    })

    const comments: CommentDTO[] = await Promise.all(
      result.docs.map(async (c) => ({
        id: String(c.id),
        nickname: escapeHtml(c.nickname),
        body: escapeHtml(c.body),
        createdAt: c.createdAt,
        likeCount: await likeCount(payload, c.id),
      })),
    )

    return NextResponse.json(
      { comments },
      { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' } },
    )
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// POST /api/comments -> 201 { comment: CommentDTO, pending: boolean }
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { post?: unknown; nickname?: unknown; body?: unknown; website?: unknown }
      | null
    if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 })

    // Honeypot: real users never fill `website`; bots do. Silently reject as a validation error.
    if (typeof body.website === 'string' && body.website.trim() !== '')
      return NextResponse.json({ error: 'spam' }, { status: 400 })

    const postId = typeof body.post === 'string' ? body.post : ''
    if (!postId) return NextResponse.json({ error: 'post required' }, { status: 400 })

    const nickname = typeof body.nickname === 'string' ? body.nickname : ''
    const rawBody = typeof body.body === 'string' ? body.body : ''
    const cleaned = cleanComment(nickname, rawBody)
    if (!cleaned.ok) return NextResponse.json({ error: cleaned.reason }, { status: 400 })

    const payload = await getPayloadClient()

    const ip = getIp(req)
    const allowed = await checkRateLimit(payload, ip, 'comment')
    if (!allowed) return NextResponse.json({ error: 'rate limited' }, { status: 429 })

    // Verify the post exists & is published (anon must never attach comments to drafts).
    const post = await payload
      .findByID({ collection: 'posts', id: postId, depth: 0, overrideAccess: false })
      .catch(() => null)
    if (!post) return NextResponse.json({ error: 'post not found' }, { status: 400 })

    const settings = await payload.findGlobal({ slug: 'settings' })
    const approved = !settings.moderateComments

    // Public create flows through here, so overrideAccess bypasses the admin-only collection rule.
    const created = await payload.create({
      collection: 'comments',
      overrideAccess: true,
      data: {
        post: Number(postId),
        nickname: cleaned.nickname,
        body: cleaned.body,
        approved,
      },
    })

    const dto: CommentDTO = {
      id: String(created.id),
      nickname: cleaned.nickname,
      body: cleaned.body,
      createdAt: created.createdAt,
      likeCount: 0,
    }

    return NextResponse.json({ comment: dto, pending: !approved }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
