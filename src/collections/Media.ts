import type { CollectionConfig } from 'payload'
import { isAdmin, anyone } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // storage via vercelBlobStorage plugin → persists on Blob, never local fs
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
