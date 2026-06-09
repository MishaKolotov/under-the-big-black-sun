import type { Payload } from 'payload'

// COUNT(*) of comment-likes rows for a single comment. likeCount is derived (no counter column).
export const likeCount = async (payload: Payload, commentId: number): Promise<number> =>
  (
    await payload.count({
      collection: 'comment-likes',
      where: { comment: { equals: commentId } },
    })
  ).totalDocs
