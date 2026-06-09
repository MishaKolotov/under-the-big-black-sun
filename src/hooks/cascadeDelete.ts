import type { CollectionAfterDeleteHook } from 'payload'

// Deleting a comment → drop its likes in ONE where-delete (no N+1).
export const cascadeDeleteCommentLikes: CollectionAfterDeleteHook = async ({ req, id }) => {
  await req.payload.delete({
    collection: 'comment-likes',
    where: { comment: { equals: id } },
  })
}

// Deleting a post → drop its comments' likes, then the comments (bulk, not per-row).
export const cascadeDeletePostComments: CollectionAfterDeleteHook = async ({ req, id }) => {
  const comments = await req.payload.find({
    collection: 'comments',
    where: { post: { equals: id } },
    limit: 0,
    depth: 0,
  })
  const ids = comments.docs.map((c) => c.id)
  if (ids.length) {
    await req.payload.delete({ collection: 'comment-likes', where: { comment: { in: ids } } })
    await req.payload.delete({ collection: 'comments', where: { post: { equals: id } } })
  }
}
