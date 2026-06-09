'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { locales } from '@/i18n/config'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav aria-label="Language" className="lang-switcher">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-current={l === locale}
          disabled={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </nav>
  )
}
