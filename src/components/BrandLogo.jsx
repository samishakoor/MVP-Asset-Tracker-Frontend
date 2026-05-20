import { Link } from 'react-router-dom'
import AssetTrackLogoIcon from './AssetTrackLogoIcon.jsx'

const SIZE_STYLES = {
  sm: {
    wrapper: 'gap-2',
    icon: 'h-6 w-6 shrink-0 sm:h-7 sm:w-7',
    text: 'text-base font-bold sm:text-lg',
  },
  md: {
    wrapper: 'gap-2 sm:gap-2.5',
    icon: 'h-7 w-7 shrink-0 sm:h-8 sm:w-8',
    text: 'text-lg font-bold sm:text-xl',
  },
  lg: {
    wrapper: 'gap-2.5',
    icon: 'h-8 w-8 shrink-0',
    text: 'text-xl font-bold',
  },
}

const VARIANT_STYLES = {
  emerald: 'text-emerald-600',
  slate: 'text-slate-900',
}

/**
 * AssetTrack brand lockup: SVG logo mark plus wordmark.
 * Use in headers and sidebars; supports Link wrapper, size presets, and color variants.
 */
function BrandLogo({ to, variant, size, className, onClick }) {
  const resolvedVariant = variant === undefined ? 'emerald' : variant
  const resolvedSize = size === undefined ? 'md' : size
  const sizeStyle = SIZE_STYLES[resolvedSize]
  const variantClass = VARIANT_STYLES[resolvedVariant]

  const content = (
    <>
      <AssetTrackLogoIcon className={sizeStyle.icon} />
      <span className={sizeStyle.text}>AssetTrack</span>
    </>
  )

  const wrapperClass = `inline-flex min-w-0 items-center ${sizeStyle.wrapper} ${variantClass} ${className ?? ''}`

  if (to !== undefined && to !== '') {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`${wrapperClass} transition-opacity hover:opacity-90`}
      >
        {content}
      </Link>
    )
  }

  return <div className={wrapperClass}>{content}</div>
}

export default BrandLogo
