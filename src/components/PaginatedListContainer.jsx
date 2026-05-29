/**
 * Adaptive-height wrapper for paginated card/list feeds.
 * Partial pages shrink to content; full pages fill remaining viewport height on mobile.
 * Do not use for desktop tables — let tables keep their natural row height.
 */
function PaginatedListContainer({ children, className, borderRadiusClass, fillViewport }) {
  let radiusClass = 'rounded-lg'
  if (borderRadiusClass !== undefined) {
    radiusClass = borderRadiusClass
  }

  const shellClass = `w-full overflow-x-hidden overflow-y-auto border border-slate-200 bg-white shadow-sm ${radiusClass}`
  let heightClass = 'max-h-[calc(100dvh-17rem)] lg:max-h-[calc(100dvh-10rem)]'

  if (fillViewport === true) {
    heightClass = 'min-h-0 flex-1  max-h-[calc(100dvh-12rem)] lg:flex-none lg:max-h-[calc(100dvh-10rem)]'
  }

  const extraClass = className ? className : ''

  return (
    <div className={`${shellClass} ${heightClass} ${extraClass}`.trim()}>
      {children}
    </div>
  )
}

export default PaginatedListContainer
