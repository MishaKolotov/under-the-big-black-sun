import type { ReactNode } from 'react'

export interface HalftoneProps {
  /** The box/image to give a xerox halftone treatment. */
  children?: ReactNode
  /** Extra classes for the wrapper. */
  className?: string
  /**
   * Apply the high-contrast grayscale "1-bit xerox" filter to descendants
   * (intended for an <img>). Defaults to true.
   */
  filterImage?: boolean
  /** Overlay opacity override (0–1). Falls back to the --halftone-opacity token. */
  intensity?: number
}

/**
 * Halftone — wraps an image or block and lays a dot-screen halftone wash over
 * it, optionally pushing the child image to a high-contrast grayscale xerox.
 * Presentational only.
 */
export function Halftone({
  children,
  className = '',
  filterImage = true,
  intensity,
}: HalftoneProps) {
  const wrapperClasses = [
    'zine-halftone',
    filterImage ? 'zine-halftone-img' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const overlayStyle =
    intensity === undefined ? undefined : { opacity: intensity }

  return (
    <span
      className={wrapperClasses}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      <span
        className="zine-halftone-overlay"
        style={overlayStyle}
        aria-hidden="true"
      />
    </span>
  )
}

export default Halftone
