import type { CSSProperties, ReactNode } from 'react'

export interface StickerProps {
  /** Sticker label / content. */
  children: ReactNode
  /** Extra classes. */
  className?: string
  /** Rotation in degrees (default -3). */
  rotate?: number
  /** Sticker color treatment. */
  tone?: 'paper' | 'yellow' | 'black'
  /** Round sticker instead of rectangular. */
  circle?: boolean
  /** Inline style escape hatch. */
  style?: CSSProperties
}

/**
 * Sticker — a rotated, hard-bordered label/stamp. Use for badges, dates,
 * "NEW", price tags, call-outs. Presentational only.
 */
export function Sticker({
  children,
  className = '',
  rotate = -3,
  tone = 'paper',
  circle = false,
  style,
}: StickerProps) {
  const toneClass =
    tone === 'yellow'
      ? 'zine-sticker--yellow'
      : tone === 'black'
        ? 'zine-sticker--black'
        : ''

  const classes = [
    'zine-sticker',
    toneClass,
    circle ? 'zine-sticker--circle' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classes}
      style={{ ['--sticker-rot' as string]: `${rotate}deg`, ...style }}
    >
      {children}
    </span>
  )
}

export default Sticker
