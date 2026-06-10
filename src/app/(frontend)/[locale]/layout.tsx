import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { siteFonts } from '@/app/(frontend)/fonts'
import { locales, type Locale } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import '@/styles/tokens.css'
import '@/styles/layout.css'

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
    <html lang={locale} className={siteFonts}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="site-shell">
          <header className="site-header">
            <Link href="/" className="site-header__title">
              {t('siteTitle')}
            </Link>
            <nav className="site-nav" aria-label={t('home')}>
              <Link href="/">{t('home')}</Link>
              <Link href="/about">{t('about')}</Link>
              <LanguageSwitcher />
            </nav>
          </header>

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <p>{t('siteTitle')}</p>
            <p>{t('footerTagline')} · {new Date().getFullYear()}</p>
          </footer>
        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
