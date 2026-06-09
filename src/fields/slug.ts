import type { Field, FieldHook } from 'payload'
import { customAlphabet } from 'nanoid'

// 8-char lowercase-alphanumeric id for the fallback slug when no title exists yet.
const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)

// EN→PL→nanoid fallback. `data.title` is localized, so during admin edits it may arrive
// either as a plain string (single-locale write) or as a `{ en, pl }` object.
const beforeValidate: FieldHook = ({ value, data }) => {
  if (value) return slugify(value as string)
  const title = data?.title
  const en = typeof title === 'object' && title ? (title as { en?: string }).en : title
  const pl = typeof title === 'object' && title ? (title as { pl?: string }).pl : undefined
  const base = en || pl
  return base ? slugify(base as string) : `post-${nano()}`
}

// slug is non-localized, required, unique, indexed, and lives in the sidebar.
export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Auto from EN title; editable. Shared by both languages.',
  },
  hooks: {
    beforeValidate: [beforeValidate],
  },
}
