/**
 * Centered animated loading spinner.
 * Used for loading states across the application.
 */
function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
    </div>
  )
}

export default Spinner
