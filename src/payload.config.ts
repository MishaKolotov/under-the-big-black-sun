import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { CommentLikes } from './collections/CommentLikes'
import { RateLimits } from './collections/RateLimits'
import { Settings } from './globals/Settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Server URL is derived per-environment, NOT hardcoded (preview vs prod differ).
export const getServerURL = (): string => {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export default buildConfig({
  serverURL: getServerURL(),
  admin: { user: 'users' },
  // Collections + globals are added by the schema subagent (Task 4). Leave these placeholder
  // arrays so the schema subagent only edits collection imports/arrays, not the rest of this file.
  collections: [Users, Posts, Media, Comments, CommentLikes, RateLimits],
  globals: [Settings],
  // EN/PL localization. fallback:true => empty PL falls back to EN. next-intl owns the URL
  // segment; this `locale` is what the frontend passes to payload.find({ locale }).
  localization: { locales: ['en', 'pl'], defaultLocale: 'en', fallback: true },
  editor: lexicalEditor({}), // custom embed block added by backend subagent later
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // dev pushes schema for fast iteration; prod uses committed migrations run at build time.
    push: process.env.NODE_ENV === 'development',
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: { media: true }, // Media uploads persist on Blob, never local fs
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      // Server-side uploads (the default). Browser-direct uploads (`clientUploads: true`) register
      // a CLIENT handler that transitively imports server-only payload internals (logger → pino →
      // worker_threads / node:assert) into the admin's browser bundle and 500s the admin. We never
      // need direct browser uploads for a small blog, so keep this off and route uploads through
      // the Payload server.
      clientUploads: false,
    }),
  ],
})
