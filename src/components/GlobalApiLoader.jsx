/**
 * Full-screen overlay with a circulating spinner shown while API requests are in flight.
 * Rendered by ApiLoadingProvider when at least one request is active.
 */
function GlobalApiLoader() {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-10 py-8 shadow-2xl">
        <div className="relative h-14 w-14" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-r-emerald-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium tracking-wide text-slate-600">Loading…</p>
      </div>
    </div>
  )
}

export default GlobalApiLoader
