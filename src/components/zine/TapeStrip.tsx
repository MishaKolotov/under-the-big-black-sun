import type { CSSProperties, ReactNode } from 'react'

export interface TapeStripProps {
  /** Optional label printed on the tape (handwritten-stamp font). */
  children?: ReactNode
  /** Extra classes. */
  className?: string
  /** Rotation in degrees (default -4). */
  rotate?: number
  /** Tape tint. */
  tone?: 'yellow' | 'paper' | 'black'
  /** Inline style escape hatch (e.g. absolute positioning over a corner). */
  style?: CSSProperties
}

/**
 * TapeStrip — a strip of translucent "tape" you can rotate and position to
 * pin things to the page. Presentational only.
 */
export function TapeStrip({
  children,
  className = '',
  rotate = -4,
  tone = 'yellow',
  style,
}: TapeStripProps) {
  const toneClass =
    tone === 'paper'
      ? 'zine-tape--paper'
      : tone === 'black'
        ? 'zine-tape--black'
        : ''

  const classes = ['zine-tape', toneClass, className].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      aria-hidden={children ? undefined : 'true'}
      style={{ ['--tape-rot' as string]: `${rotate}deg`, ...style }}
    >
      {children}
    </span>
  )
}

export default TapeStrip
