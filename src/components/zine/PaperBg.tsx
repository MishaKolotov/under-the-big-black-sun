import type { ReactNode } from 'react'

export interface PaperBgProps {
  /** Content rendered on top of the paper surface. */
  children?: ReactNode
  /** Extra classes for the wrapper. */
  className?: string
  /**
   * When true, also renders the fixed site-wide toner-grain overlay.
   * Render this ONCE (e.g. on the root layout wrapper), not per-section.
   */
  withGrain?: boolean
  /** Use the inverted black panel surface instead of newsprint. */
  invert?: boolean
  /** Semantic element to render as. Defaults to a div. */
  as?: 'div' | 'main' | 'section' | 'article'
}

/**
 * PaperBg — the newsprint paper surface (or inverted black panel) with subtle
 * fiber texture. Purely presentational; no data, no state.
 */
export function PaperBg({
  children,
  className = '',
  withGrain = false,
  invert = false,
  as: Tag = 'div',
}: PaperBgProps) {
  const classes = [
    'zine-paper',
    invert ? 'zine-ink-panel' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes}>
      {children}
      {withGrain ? <div className="zine-grain" aria-hidden="true" /> : null}
    </Tag>
  )
}

export default PaperBg
