import { useState } from 'react'
import { useEmployees } from '../hooks/useEmployees.js'
import { useAssignAsset } from '../hooks/useAssignAsset.js'

/**
 * Modal for assigning an asset to an employee.
 * Props: isOpen, onClose, assetId, onSuccess.
 */
function AssignAssetModal({ isOpen, onClose, assetId, onSuccess }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [error, setError] = useState(null)

  const { employees, isLoading: loadingEmployees } = useEmployees()
  const { assignAsset, isSubmitting } = useAssignAsset()

  function handleEmployeeChange(event) {
    setSelectedEmployeeId(event.target.value)
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!selectedEmployeeId) {
      setError('Please select an employee')
      return
    }

    try {
      await assignAsset({
        assetId,
        employeeId: selectedEmployeeId,
      })
      setSelectedEmployeeId('')
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to assign asset')
    }
  }

  function handleClose() {
    setSelectedEmployeeId('')
    setError(null)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Assign Asset</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="employee" className="block text-sm font-medium text-slate-700">
                Select Employee
              </label>
              <select
                id="employee"
                value={selectedEmployeeId}
                onChange={handleEmployeeChange}
                disabled={loadingEmployees || isSubmitting}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100"
                required
              >
                <option value="">Select an employee...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingEmployees}
              className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignAssetModal
