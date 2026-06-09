import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdmin, publishedOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { revalidatePost, revalidatePostDelete } from '../hooks/revalidate'
import { cascadeDeletePostComments } from '../hooks/cascadeDelete'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedDate'] },
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    afterChange: [revalidatePost],
    // revalidatePostDelete uses the AfterDelete signature; cascade drops comments + their likes.
    afterDelete: [revalidatePostDelete, cascadeDeletePostComments],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField, // non-localized, shared across locales
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', localized: true },
    // backend subagent later replaces this editor with the embed-block-enabled one
    { name: 'content', type: 'richText', localized: true, editor: lexicalEditor({}) },
    { name: 'tags', type: 'text', hasMany: true },
  ],
}
