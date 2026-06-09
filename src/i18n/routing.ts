import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix so `/en` and `/pl` are explicit in the URL.
  localePrefix: 'always',
})

// Locale-aware navigation helpers, derived from the single routing config.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
