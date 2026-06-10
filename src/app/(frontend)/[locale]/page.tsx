import { notFound } from 'next/navigation'
import { getTranslations, getFormatter, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { getHomePosts } from '@/lib/getPosts'
import PostCardItem from '@/components/PostCardItem'
import LoadMore from '@/components/LoadMore'

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
  const tNav = await getTranslations('Nav')
  const format = await getFormatter()
  const { items, nextCursor } = await getHomePosts(locale as Locale, PAGE_SIZE)

  const formatDate = (iso: string) =>
    format.dateTime(new Date(iso), { day: '2-digit', month: '2-digit' })

  const title = tNav('siteTitle')

  return (
    <div className="home">
      <header className="home__hero">
        <h1 className="home__stack">
          <span>{title}</span>
          <span aria-hidden="true">{title}</span>
          <span aria-hidden="true">{title}</span>
        </h1>
        <div className="home__side" aria-hidden="true">
          <span>{t('sideA')}</span>
          <span>{t('sideB')}</span>
        </div>
      </header>

      <p className="home__meta">
        <span>
          <b>Karol</b> — {t('metaRole')}
        </span>
        <span>{t('metaOneInk')}</span>
      </p>

      {items.length === 0 ? (
        <p className="home__empty">{t('noPosts')}</p>
      ) : (
        <>
          <ol className="post-list">
            {items.map((post, i) => (
              <PostCardItem
                key={post.id}
                post={post}
                index={i + 1}
                formattedDate={formatDate(post.publishedDate)}
              />
            ))}
          </ol>
          <LoadMore initialCursor={nextCursor} limit={PAGE_SIZE} startIndex={items.length} />
        </>
      )}
    </div>
  )
}
