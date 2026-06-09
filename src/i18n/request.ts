import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, type Locale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the value matched by the middleware (may be undefined or invalid).
  const requested = await requestLocale
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
