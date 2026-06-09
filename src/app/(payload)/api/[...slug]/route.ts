/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

// Payload's built-in REST API. Lives under /api/* in the (payload) route group.
// NOTE: app-specific public route handlers from CONTRACTS.md live under /api/public/*
// (/api/public/posts, /api/public/comments, /api/public/likes) so they never collide
// with this catch-all Payload REST mount on the collection-name paths (/api/posts, etc.).
export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
