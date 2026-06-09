import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { zineFonts } from '@/app/(frontend)/fonts'
import { locales, type Locale } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { PaperBg } from '@/components/zine/PaperBg'
import { RansomHeading } from '@/components/zine/RansomHeading'
import '@/styles/tokens.css'
import '@/styles/zine.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  // Enable static rendering for this request tree.
  setRequestLocale(locale)

  const messages = await getMessages()
  const t = await getTranslations('Nav')

  return (
    <html lang={locale} className={zineFonts}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PaperBg as="div" withGrain className="site-shell">
            <header className="site-header">
              <Link href="/" className="site-header__title">
                <RansomHeading text={t('siteTitle')} level={1} />
              </Link>
              <nav className="site-nav" aria-label={t('home')}>
                <Link href="/">{t('home')}</Link>
                <Link href="/about">{t('about')}</Link>
                <LanguageSwitcher />
              </nav>
            </header>

            <main className="site-main">{children}</main>

            <footer className="site-footer zine-stamp">
              <p>{t('siteTitle')}</p>
            </footer>
          </PaperBg>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
