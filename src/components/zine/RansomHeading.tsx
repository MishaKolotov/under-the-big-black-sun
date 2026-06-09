import type { CSSProperties } from 'react'

export interface RansomHeadingProps {
  /** The heading text. Rendered as accessible text; styling is per-word/letter. */
  text: string
  /** Heading level (default 2). */
  level?: 1 | 2 | 3 | 4
  /** Split granularity: cut up per word (default) or per letter (chaotic). */
  split?: 'word' | 'letter'
  /** Extra classes. */
  className?: string
  /** Inline style escape hatch. */
  style?: CSSProperties
}

const BIT_VARIANTS = [
  'zine-ransom__bit--a',
  'zine-ransom__bit--b',
  'zine-ransom__bit--c',
  'zine-ransom__bit--d',
] as const

/**
 * RansomHeading — hand-cut ransom-note headline. Each word (or letter) gets an
 * alternating rotation / fill / font treatment for that cut-and-pasted feel.
 * The full text stays in the DOM as the heading's accessible name.
 * Presentational only.
 */
export function RansomHeading({
  text,
  level = 2,
  split = 'word',
  className = '',
  style,
}: RansomHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
  const classes = ['zine-ransom', className].filter(Boolean).join(' ')

  // Split into renderable bits but keep spaces meaningful for word mode.
  const bits =
    split === 'letter'
      ? Array.from(text)
      : text.split(/(\s+)/) // keep whitespace tokens

  let visibleIndex = 0

  return (
    <Tag className={classes} style={style} aria-label={text}>
      {bits.map((bit, i) => {
        // Preserve whitespace literally; don't decorate it.
        if (/^\s+$/.test(bit)) {
          return (
            <span key={i} aria-hidden="true">
              {' '}
            </span>
          )
        }
        const variant = BIT_VARIANTS[visibleIndex % BIT_VARIANTS.length]
        visibleIndex += 1
        return (
          <span
            key={i}
            className={`zine-ransom__bit ${variant}`}
            aria-hidden="true"
          >
            {bit}
          </span>
        )
      })}
    </Tag>
  )
}

export default RansomHeading
