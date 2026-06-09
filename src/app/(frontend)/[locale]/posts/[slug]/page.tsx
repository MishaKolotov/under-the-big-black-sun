import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, getFormatter, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { getPostBySlug, getPublishedSlugs } from '@/lib/getPosts'
import type { Media } from '@/payload-types'
import LexicalContent, { type LexicalContentData } from '@/components/LexicalContent'
import Comments from '@/components/Comments'
import { RansomHeading } from '@/components/zine/RansomHeading'

export const revalidate = 60

const OG_FALLBACK = '/assets/og-default.png'

// Cross product of locales × PUBLISHED slugs (slug is non-localized → one slug query).
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

const coverOf = (post: { coverImage?: (number | null) | Media }): Media | null => {
  const c = post.coverImage
  return c && typeof c === 'object' ? (c as Media) : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) return {}

  const post = await getPostBySlug(locale as Locale, slug)
  if (!post) return {}

  const cover = coverOf(post)
  const ogImage = cover?.url ?? OG_FALLBACK
  const description = post.excerpt ?? undefined

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/${locale}/posts/${slug}`,
      languages: {
        en: `/en/posts/${slug}`,
        pl: `/pl/posts/${slug}`,
        'x-default': `/en/posts/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      locale,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const post = await getPostBySlug(locale as Locale, slug)
  if (!post) notFound()

  const t = await getTranslations('Post')
  const format = await getFormatter()
  const cover = coverOf(post)

  const publishedISO = post.publishedDate ?? post.createdAt

  return (
    <article className="post">
      <header className="post__header">
        <RansomHeading text={post.title} level={1} className="post__title" />
        <p className="post__date zine-stamp">
          {t('publishedOn', {
            date: format.dateTime(new Date(publishedISO), { dateStyle: 'long' }),
          })}
        </p>
      </header>

      {cover?.url ? (
        <Image
          className="post__cover zine-halftone-img"
          src={cover.url}
          alt={cover.alt ?? ''}
          width={cover.width ?? 1200}
          height={cover.height ?? 800}
          sizes="(max-width: 720px) 100vw, 720px"
          style={{ width: '100%', height: 'auto' }}
          priority
        />
      ) : null}

      {post.content ? (
        <LexicalContent data={post.content as LexicalContentData} />
      ) : null}

      {/* Client-only — comments are NEVER baked into the static HTML. */}
      <Comments postId={String(post.id)} />
    </article>
  )
}
