import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

// One row per (comment, anonId); unique compound index for idempotency; no counter.
// Toggled only via /api/likes.
export const CommentLikes: CollectionConfig = {
  slug: 'comment-likes',
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  indexes: [{ fields: ['comment', 'anonId'], unique: true }],
  fields: [
    { name: 'comment', type: 'relationship', relationTo: 'comments', required: true, index: true },
    { name: 'anonId', type: 'text', required: true, index: true },
  ],
}
