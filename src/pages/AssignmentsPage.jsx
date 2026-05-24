import { useState, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useAssets } from '../hooks/useAssets.js'
import { useEmployees } from '../hooks/useEmployees.js'
import { useAssignAsset } from '../hooks/useAssignAsset.js'
import { useReturnAsset } from '../hooks/useReturnAsset.js'
import { useCancelAssignment } from '../hooks/useCancelAssignment.js'
import { PageHeader, Spinner, Table, ConfirmDialog } from '../components/index.js'
import { formatDate } from '../utils/datetime.js'
import { AssetStatus } from '../constants/assets.js'
import { toast } from '../utils/toast.js'

/**
 * Admin assignments page with assign asset form and active assignments table.
 * Rendered at /admin/assignments inside AdminLayout (admin role only).
 */
function AssignmentsPage() {
  const [assetId, setAssetId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [assignedAt, setAssignedAt] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [formError, setFormError] = useState(null)
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const { assets: availableAssets, isLoading: assetsLoading } = useAssets({
    status: 'available',
  })
  const { assets: assignedAssets, isLoading: assignedLoading, refetch: refetchAssigned } = useAssets({
    active_assignment: 'true',
  })
  const { employees, isLoading: employeesLoading } = useEmployees()
  const { assignAsset, isSubmitting } = useAssignAsset()
  const { returnAsset, isReturning } = useReturnAsset()
  const { cancelAssignment, isCancelling } = useCancelAssignment()

  function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    if (!assetId || !employeeId) {
      setFormError('Please select both asset and employee')
      return
    }

    assignAsset(
      {
        assetId,
        employeeId,
        assignedAt,
      },
      {
        onSuccess: () => {
          toast.success('Asset assigned successfully')
          setAssetId('')
          setEmployeeId('')
          setAssignedAt(new Date().toISOString().split('T')[0])
          refetchAssigned()
        },
        onError: (err) => {
          setFormError(err.message || 'Failed to assign asset')
        },
      }
    )
  }

  function handleReturnClick(assignment) {
    setSelectedAssignment(assignment)
    setReturnDialogOpen(true)
  }

  function handleCancelClick(assignment) {
    setSelectedAssignment(assignment)
    setCancelDialogOpen(true)
  }

  function handleReturnConfirm() {
    if (!selectedAssignment) return

    returnAsset(selectedAssignment.currentAssignment.id, {
      onSuccess: () => {
        toast.success('Asset returned successfully')
        refetchAssigned()
        setReturnDialogOpen(false)
        setSelectedAssignment(null)
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to return asset')
      },
    })
  }

  function handleCancelConfirm() {
    if (!selectedAssignment) return

    cancelAssignment(selectedAssignment.currentAssignment.id, {
      onSuccess: () => {
        toast.success('Assignment cancelled successfully')
        refetchAssigned()
        setCancelDialogOpen(false)
        setSelectedAssignment(null)
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to cancel assignment')
      },
    })
  }

  const activeAssignmentsData = useMemo(() => {
    return assignedAssets
      .filter((asset) => asset.currentAssignment)
      .map((asset) => ({
        id: asset.id,
        assetName: asset.name,
        serialNumber: asset.serialNumber,
        employeeName: asset.assignedEmployeeName || '—',
        assignedAt: asset.currentAssignment?.assignedAt,
        acknowledgedAt: asset.currentAssignment?.acknowledgedAt,
        status: asset.status,
        currentAssignment: asset.currentAssignment,
      }))
  }, [assignedAssets])

  const columns = [
    { key: 'assetName', label: 'Asset Name' },
    { key: 'serialNumber', label: 'Serial Number' },
    { key: 'employeeName', label: 'Employee' },
    {
      key: 'assignedAt',
      label: 'Assigned Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'acknowledgedAt',
      label: 'Acknowledged',
      render: (value) => (value ? formatDate(value) : '—'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        const canCancel = row.status === AssetStatus.ASSIGNED
        const canReturn =
          row.status !== AssetStatus.AVAILABLE && row.status !== AssetStatus.ASSIGNED

        if (canCancel) {
          return (
            <button
              type="button"
              onClick={() => handleCancelClick(row)}
              className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200"
            >
              Cancel
            </button>
          )
        }

        if (canReturn) {
          return (
            <button
              type="button"
              onClick={() => handleReturnClick(row)}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              Return
            </button>
          )
        }

        return <span className="text-sm text-slate-400">—</span>
      },
    },
  ]

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader title="Assignments" subtitle="Assign assets to employees and manage active assignments" />

      {/* Assign Asset Form */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Assign Asset</h2>
        {assetsLoading || employeesLoading ? (
          <Spinner />
        ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Select Asset */}
            <div>
              <label htmlFor="asset-select" className="block text-sm font-medium text-slate-700">
                Select Asset <span className="text-red-500">*</span>
              </label>
              <select
                id="asset-select"
                value={assetId}
                onChange={(e) => {
                  setAssetId(e.target.value)
                  setFormError(null)
                }}
                disabled={isSubmitting}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              >
                <option value="">Select an asset...</option>
                {availableAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.serialNumber}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                {availableAssets.length} available assets
              </p>
            </div>

            {/* Select Employee */}
            <div>
              <label htmlFor="employee-select" className="block text-sm font-medium text-slate-700">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                id="employee-select"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value)
                  setFormError(null)
                }}
                disabled={isSubmitting}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              >
                <option value="">Select an employee...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                {employees.length} employees
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !assetId || !employeeId}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Assigning...' : 'Assign Asset'}
            </button>
          </div>
        </form>
        )}
      </div>

      {/* Active Assignments Table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Active Assignments</h2>
        {assignedLoading ? (
          <Spinner />
        ) : activeAssignmentsData.length > 0 ? (
          <Table columns={columns} data={activeAssignmentsData} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
            <p className="text-sm text-slate-500">No active assignments</p>
          </div>
        )}
      </div>

      {/* Return Confirmation Dialog */}
      <ConfirmDialog
        isOpen={returnDialogOpen}
        onClose={() => {
          setReturnDialogOpen(false)
          setSelectedAssignment(null)
        }}
        onConfirm={handleReturnConfirm}
        isConfirming={isReturning}
        title="Return Asset"
        message={`Are you sure you want to return ${selectedAssignment?.assetName} from ${selectedAssignment?.employeeName}?`}
        confirmLabel="Return Asset"
        confirmingLabel="Returning..."
      />

      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => {
          setCancelDialogOpen(false)
          setSelectedAssignment(null)
        }}
        onConfirm={handleCancelConfirm}
        isConfirming={isCancelling}
        title="Cancel Asset Assignment"
        message={`Cancel the assignment of ${selectedAssignment?.assetName} to ${selectedAssignment?.employeeName}? The asset will become available again because the employee has not acknowledged it yet.`}
        confirmLabel="Cancel Assignment"
        confirmingLabel="Cancelling..."
      />
    </main>
  )
}

export default AssignmentsPage
