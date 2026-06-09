import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

// ip + action + timestamps; touched only via Local API.
export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'ip', type: 'text', required: true, index: true },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'comment', value: 'comment' },
        { label: 'like', value: 'like' },
      ],
    },
  ],
  timestamps: true, // provides createdAt for the rolling-window check
}
