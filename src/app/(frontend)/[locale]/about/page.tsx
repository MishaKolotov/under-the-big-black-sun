import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { RansomHeading } from '@/components/zine/RansomHeading'
import { Sticker } from '@/components/zine/Sticker'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('About')

  const links: { key: 'instagram' | 'bandcamp' | 'label'; href: string }[] = [
    { key: 'instagram', href: '#' },
    { key: 'bandcamp', href: '#' },
    { key: 'label', href: '#' },
  ]

  return (
    <div className="about">
      <RansomHeading text={t('title')} level={1} className="about__heading" />
      <p className="about__bio zine-body">{t('bioPlaceholder')}</p>

      <section className="about__links" aria-labelledby="about-links-heading">
        <h2 id="about-links-heading" className="zine-display">
          {t('linksTitle')}
        </h2>
        <ul className="about__link-list">
          {links.map((link) => (
            <li key={link.key}>
              <a href={link.href} className="about__link">
                <Sticker tone="yellow">{t(link.key)}</Sticker>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
