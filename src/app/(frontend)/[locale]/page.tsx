import { notFound } from 'next/navigation'
import { getTranslations, getFormatter, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { getHomePosts } from '@/lib/getPosts'
import PostCardItem from '@/components/PostCardItem'
import LoadMore from '@/components/LoadMore'
import { RansomHeading } from '@/components/zine/RansomHeading'

export const revalidate = 60

const PAGE_SIZE = 6

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('Home')
  const format = await getFormatter()
  const { items, nextCursor } = await getHomePosts(locale as Locale, PAGE_SIZE)

  const formatDate = (iso: string) => format.dateTime(new Date(iso), { dateStyle: 'long' })

  return (
    <div className="home">
      <RansomHeading text={t('latestPosts')} level={2} className="home__heading" />

      {items.length === 0 ? (
        <p className="home__empty zine-body">{t('noPosts')}</p>
      ) : (
        <>
          <div className="post-grid">
            {items.map((post) => (
              <PostCardItem
                key={post.id}
                post={post}
                formattedDate={formatDate(post.publishedDate)}
              />
            ))}
          </div>
          <LoadMore initialCursor={nextCursor} limit={PAGE_SIZE} />
        </>
      )}
    </div>
  )
}
