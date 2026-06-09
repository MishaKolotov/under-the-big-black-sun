import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // The matcher excludes paths that must NEVER be locale-prefixed or redirected:
  // - `admin`   : Payload's admin UI, mounted at `/admin` with no locale prefix.
  // - `api`     : Next route handlers under `/api` (locale passed via query, not path).
  // - `_next`   : Next.js internals (static assets, HMR, etc).
  // - `_vercel` : Vercel platform internals.
  // - `.*\\..*` : any path containing a file extension (e.g. favicon.ico, robots.txt).
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
