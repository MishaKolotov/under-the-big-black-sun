import type { MetadataRoute } from 'next'
import { getServerURL } from '@/payload.config'

export default function robots(): MetadataRoute.Robots {
  const base = getServerURL().replace(/\/$/, '')
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
