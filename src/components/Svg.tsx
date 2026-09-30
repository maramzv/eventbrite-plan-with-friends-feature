import type { CSSProperties } from 'react'
import type { SvgData } from '../data'

interface SvgProps {
  icon: SvgData | null | undefined
  className?: string
  style?: CSSProperties
  viewBox?: string
}

// Renders Eventbrite SVG markup that was sanitized at extraction time (shape elements only).
export function Svg({ icon, className, style, viewBox }: SvgProps) {
  if (!icon) return null
  return (
    <svg
      viewBox={icon.viewBox ?? viewBox ?? '0 0 24 24'}
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  )
}
