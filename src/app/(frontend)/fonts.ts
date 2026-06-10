/**
 * "One pass" font stack — Direction A (approved 2026-06-10).
 * White sheet, one ink. Two faces only:
 *
 *  --font-display : Playfair Display (OFL 1.1) — italic serif display, the press voice
 *  --font-body    : Spline Sans Mono (OFL 1.1) — legible mono body copy (WCAG-friendly)
 *
 * Both self-hosted at build time via next/font/google; latin-ext covers
 * Polish diacritics (ł, ż, ó, …). Spread `siteFonts` onto <html>.
 */
import { Playfair_Display, Spline_Sans_Mono } from 'next/font/google'

export const display = Playfair_Display({
  weight: ['500', '700'],
  style: ['italic', 'normal'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
})

export const body = Spline_Sans_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
})

/** Combined className exposing every --font-* variable. Put this on <html>/<body>. */
export const siteFonts = `${display.variable} ${body.variable}`
