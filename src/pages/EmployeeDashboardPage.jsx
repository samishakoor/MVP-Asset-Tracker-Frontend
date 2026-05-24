import { Package } from 'lucide-react'
import { useMyActiveAssets } from '../hooks/useMyActiveAssets.js'
import PageHeader from '../components/PageHeader.jsx'
import AssignedAssetCard from '../components/AssignedAssetCard.jsx'
import Spinner from '../components/Spinner.jsx'

/**
 * Employee dashboard — shows all assets currently assigned to the logged-in employee.
 * Renders a card grid with status-aware banners and action buttons.
 * Rendered at /employee/dashboard inside EmployeeLayout (employee role only).
 */
function EmployeeDashboardPage() {
  const { assignments, isLoading, error, refetch } = useMyActiveAssets()

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="My Gear"
          subtitle="Assets currently assigned to you"
        />
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="My Gear"
          subtitle="Assets currently assigned to you"
        />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">{error.message}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-2 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="My Gear"
        subtitle="Assets currently assigned to you"
      />

      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center sm:px-6">
          <Package className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No assets assigned to you yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Your assigned equipment will appear here once assigned by your admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <AssignedAssetCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboardPage
