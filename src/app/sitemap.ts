import type { MetadataRoute } from 'next'
import { getServerURL } from '@/payload.config'
import { locales } from '@/i18n/config'
import { getPublishedSlugs } from '@/lib/getPosts'

export const revalidate = 60

// Sitemap over home + about + published posts, for both locales.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerURL().replace(/\/$/, '')
  const slugs = await getPublishedSlugs()

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({ url: `${base}/${locale}`, changeFrequency: 'daily', priority: 1 })
    entries.push({ url: `${base}/${locale}/about`, changeFrequency: 'monthly', priority: 0.5 })
    for (const slug of slugs) {
      entries.push({
        url: `${base}/${locale}/posts/${slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  return entries
}
