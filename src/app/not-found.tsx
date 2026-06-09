import Image from 'next/image'
import Link from 'next/link'
import { zineFonts } from '@/app/(frontend)/fonts'
import { PaperBg } from '@/components/zine/PaperBg'
import { RansomHeading } from '@/components/zine/RansomHeading'
import '@/styles/tokens.css'
import '@/styles/zine.css'
import '@/styles/layout.css'

/**
 * Root-level 404. This renders OUTSIDE the [locale] segment, so there's no
 * NextIntlClientProvider and no locale param available — we own <html>/<body>
 * here and use bilingual (EN / PL) copy rather than next-intl lookups.
 */
export default function NotFound() {
  return (
    <html lang="en" className={zineFonts}>
      <body>
        <PaperBg as="div" withGrain className="not-found">
          <RansomHeading text="404" level={1} className="not-found__code" />
          <Image
            className="not-found__art zine-halftone-img"
            src="/assets/404-tiger.png"
            alt="A scratchy hand-drawn tiger"
            width={480}
            height={480}
            priority
          />
          <h2 className="not-found__title zine-display">
            Page not found / Nie znaleziono strony
          </h2>
          <p className="not-found__message zine-body">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
            <br />
            Strona, której szukasz, nie istnieje lub została przeniesiona.
          </p>
          <p className="not-found__links zine-stamp">
            <Link href="/en">Back to home</Link>
            {' · '}
            <Link href="/pl">Wróć na stronę główną</Link>
          </p>
        </PaperBg>
      </body>
    </html>
  )
}
