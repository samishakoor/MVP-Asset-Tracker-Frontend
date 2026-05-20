/**
 * Elevated surface card with Material Design-style shadow.
 */
function MaterialCard({ children, className }) {
  const baseClass = 'rounded bg-white shadow-md'
  const mergedClass = className ? `${baseClass} ${className}` : baseClass
  return <div className={mergedClass}>{children}</div>
}

export default MaterialCard
