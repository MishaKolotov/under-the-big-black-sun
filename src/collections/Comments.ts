import type { CollectionConfig } from 'payload'
import { isAdmin, approvedOrAdmin } from '../access'
import { cascadeDeleteCommentLikes } from '../hooks/cascadeDelete'

// Public CREATE happens ONLY through /api/public/comments (Local API w/ overrideAccess), so direct
// REST create is admin-only here; anon read = approved only.
export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'nickname',
    defaultColumns: ['nickname', 'post', 'approved', 'createdAt'],
  },
  access: { read: approvedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { afterDelete: [cascadeDeleteCommentLikes] },
  fields: [
    { name: 'post', type: 'relationship', relationTo: 'posts', required: true, index: true },
    { name: 'nickname', type: 'text', required: true, maxLength: 60 },
    { name: 'body', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'approved', type: 'checkbox', defaultValue: false, index: true },
  ],
  timestamps: true, // provides createdAt
}
