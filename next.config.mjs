import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }] },
  experimental: { globalNotFound: true },
  // Payload's logger (pino → pino-pretty → thread-stream) imports Node-only modules like
  // `worker_threads`. Next must NOT bundle these, or the admin route 500s with
  // "Module not found: Can't resolve 'worker_threads'". Keep the whole pino chain external.
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  // The Vercel Blob CLIENT upload handler transitively pulls server-only payload internals
  // (logger → pino → worker_threads) into the admin's CLIENT bundle. serverExternalPackages
  // only covers the server bundle, so we also stub these Node core/transport modules in the
  // browser bundle. They are never actually called client-side.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {}
      // Root cause: @payloadcms/storage-vercel-blob's CLIENT upload handler imports `getFileKey`
      // from the plugin-cloud-storage `/utilities` BARREL, which also re-exports
      // `resolveSignedURLKey` — a server-only module that drags the full payload runtime (logger →
      // pino → worker_threads/node:assert) into the admin's browser bundle and 500s /admin.
      // The handler only needs the pure `getFileKey`, so in the CLIENT bundle we alias the barrel
      // directly to that one module — the poisonous server exports never get pulled in.
      // Resolve the barrel's real path, derive the pure getFileKey module next to it, and alias
      // BOTH the package specifier AND the resolved absolute path (pnpm resolves the import to the
      // hashed real path, so aliasing only the specifier can miss).
      const cloudStorageUtilsBarrel = require.resolve(
        '@payloadcms/plugin-cloud-storage/utilities',
      )
      const getFileKeyOnly = cloudStorageUtilsBarrel.replace(
        /exports[/\\]utilities\.js$/,
        'utilities/getFileKey.js',
      )
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@payloadcms/plugin-cloud-storage/utilities$': getFileKeyOnly,
        [cloudStorageUtilsBarrel]: getFileKeyOnly,
      }
      // Belt-and-suspenders: also stub the Node-only modules in the browser bundle.
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        worker_threads: false,
        'pino-pretty': false,
        'thread-stream': false,
        fs: false,
        os: false,
        path: false,
      }
    }
    return config
  },
}
export default withPayload(withNextIntl(nextConfig))
