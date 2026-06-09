import type { Payload } from 'payload'

// Sliding-window per-IP throttle backed by the `rate-limits` Postgres table (NOT an in-memory
// Map — serverless functions are stateless/multi-instance, so a Map would not actually limit).
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const LIMITS = { comment: 5, like: 60 } as const

export type RateAction = keyof typeof LIMITS

// Real client IP from the proxy chain. Vercel sets x-forwarded-for (client is the first entry).
export const getIp = (req: Request): string =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

// Returns true if allowed (and records the hit); false if over the limit for this ip+action.
export const checkRateLimit = async (
  payload: Payload,
  ip: string,
  action: RateAction,
): Promise<boolean> => {
  const since = new Date(Date.now() - WINDOW_MS).toISOString()

  // Prune rows older than the window for this ip+action (keeps the table small), then count
  // what remains inside the window. overrideAccess defaults to true for Local API.
  await payload.delete({
    collection: 'rate-limits',
    where: {
      and: [
        { ip: { equals: ip } },
        { action: { equals: action } },
        { createdAt: { less_than: since } },
      ],
    },
  })

  const recent = await payload.count({
    collection: 'rate-limits',
    where: {
      and: [
        { ip: { equals: ip } },
        { action: { equals: action } },
        { createdAt: { greater_than_equal: since } },
      ],
    },
  })

  if (recent.totalDocs >= LIMITS[action]) return false

  await payload.create({ collection: 'rate-limits', data: { ip, action } })
  return true
}
