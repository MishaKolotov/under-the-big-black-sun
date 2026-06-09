import { getPayload } from 'payload'
import config from '@/payload.config'

// Memoized Local API client for route handlers. getPayload is expensive (DB pool + config
// init), so we cache the first instance for the lifetime of the serverless/worker process.
let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export const getPayloadClient = async () => (cached ??= await getPayload({ config }))
