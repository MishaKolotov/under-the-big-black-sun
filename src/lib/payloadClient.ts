import { getPayload } from 'payload'
import config from '@/payload.config'

// Memoized Local API client for route handlers. getPayload is expensive (DB pool + config
// init), so we cache the first instance for the lifetime of the serverless/worker process.
// We cache the PROMISE (not the resolved value) so concurrent cold-start callers all await the
// same in-flight init instead of each kicking off their own getPayload (double-init race).
let cached: ReturnType<typeof getPayload> | null = null

export const getPayloadClient = () => (cached ??= getPayload({ config }))
