/**
 * Zine font stack — all faces are free via Google Fonts (next/font/google).
 * Self-hosted at build time; no runtime requests to Google.
 *
 *  --font-display : Anton          (OFL 1.1) — ultra-condensed poster headlines
 *  --font-ransom  : Archivo Black  (OFL 1.1) — heavy grotesque for ransom-note mix
 *  --font-stamp   : Special Elite  (Apache 2.0) — distressed typewriter, tape/sticker text
 *  --font-body    : Spline Sans Mono (OFL 1.1) — legible mono body copy (WCAG-friendly)
 *
 * Spread the className of `zineFonts` onto <html> (or a top wrapper) to expose
 * the CSS variables, then reference them via tokens.css / zine.css.
 */
import { Anton, Archivo_Black, Special_Elite, Spline_Sans_Mono } from 'next/font/google'

export const display = Anton({
  weight: '400',
  subsets: ['latin', 'latin-ext'], // latin-ext covers Polish diacritics (ł, ż, ó, ...)
  display: 'swap',
  variable: '--font-display',
})

export const ransom = Archivo_Black({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-ransom',
})

export const stamp = Special_Elite({
  weight: '400',
  subsets: ['latin'], // Special Elite has no latin-ext; used for short Latin accents only
  display: 'swap',
  variable: '--font-stamp',
})

export const body = Spline_Sans_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
})

/** Combined className exposing every --font-* variable. Put this on <html>/<body>. */
export const zineFonts = `${display.variable} ${ransom.variable} ${stamp.variable} ${body.variable}`
