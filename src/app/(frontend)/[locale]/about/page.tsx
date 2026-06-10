import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'

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
      <h1 className="about__heading">{t('title')}</h1>
      <p className="about__bio">{t('bioPlaceholder')}</p>

      <section className="about__links" aria-labelledby="about-links-heading">
        <h2 id="about-links-heading">{t('linksTitle')}</h2>
        <ul className="about__link-list">
          {links.map((link) => (
            <li key={link.key}>
              <a href={link.href} className="drip-chip">
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
