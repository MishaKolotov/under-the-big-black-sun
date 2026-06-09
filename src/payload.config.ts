import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

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
  collections: [], // schema subagent replaces with imported collection configs
  globals: [], // schema subagent adds Settings global
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
    }),
  ],
})
