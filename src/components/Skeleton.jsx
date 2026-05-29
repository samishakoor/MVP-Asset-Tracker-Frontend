/**
 * Base pulsing placeholder block for skeleton loading states.
 * Compose with Tailwind width/height classes on className.
 */
function Skeleton({ className }) {
  const baseClass = 'animate-pulse rounded-md bg-slate-200'
  const combinedClass = className ? `${baseClass} ${className}` : baseClass

  return <div className={combinedClass} aria-hidden="true" />
}

export default Skeleton
