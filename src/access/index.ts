import type { Access } from 'payload'

// logged-in = Karol (the single admin)
export const isAdmin: Access = ({ req }) => Boolean(req.user)

// Public reads PUBLISHED posts only; drafts never exposed to anon.
export const publishedOrAdmin: Access = ({ req }) =>
  req.user ? true : { status: { equals: 'published' } }

// Anon sees APPROVED comments only.
export const approvedOrAdmin: Access = ({ req }) =>
  req.user ? true : { approved: { equals: true } }

export const anyone: Access = () => true
