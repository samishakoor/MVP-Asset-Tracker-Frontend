import { useState } from 'react'
import { useMyActiveAssets } from '../hooks/useMyActiveAssets.js'
import { useMyHistory } from '../hooks/useMyHistory.js'
import { useAcknowledgeAsset } from '../hooks/useAcknowledgeAsset.js'
import AssignedAssetCard from '../components/AssignedAssetCard.jsx'
import CreateTicketModal from '../components/CreateTicketModal.jsx'
import Spinner from '../components/Spinner.jsx'

/**
 * Employee page for viewing active assignments and history.
 * Rendered at /employee/dashboard/assignments.
 */
function EmployeeAssignmentsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  const { assets, isLoading: loadingAssets, error: assetsError, refetch: refetchAssets } = useMyActiveAssets()
  const { history, isLoading: loadingHistory, error: historyError } = useMyHistory()
  const { acknowledgeAsset, isSubmitting } = useAcknowledgeAsset()

  async function handleAcknowledge(assignmentId) {
    try {
      await acknowledgeAsset(assignmentId)
      refetchAssets()
    } catch (err) {
      // Error already stored in hook state
    }
  }

  function handleCreateTicket(assignmentId) {
    setSelectedAssignmentId(assignmentId)
    setIsTicketModalOpen(true)
  }

  function handleTicketModalClose() {
    setIsTicketModalOpen(false)
    setSelectedAssignmentId(null)
  }

  function handleTicketSuccess() {
    refetchAssets()
  }

  const isActive = activeTab === 'active'

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">My Assignments</h1>

      <div className="mt-6 border-b border-slate-200">
        <nav className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              isActive
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            Active Assets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              !isActive
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            History
          </button>
        </nav>
      </div>

      {isActive && (
        <div className="mt-6">
          {loadingAssets && <Spinner />}

          {assetsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <p>{assetsError.message}</p>
              <button type="button" onClick={refetchAssets} className="mt-2 underline">
                Retry
              </button>
            </div>
          )}

          {!loadingAssets && !assetsError && assets.length === 0 && (
            <p className="text-slate-600">No active assignments.</p>
          )}

          {!loadingAssets && !assetsError && assets.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {assets.map((assignment) => (
                <AssignedAssetCard
                  key={assignment.id}
                  assignment={assignment}
                  onAcknowledge={handleAcknowledge}
                  onCreateTicket={handleCreateTicket}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isActive && (
        <div className="mt-6">
          {loadingHistory && <Spinner />}

          {historyError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <p>{historyError.message}</p>
            </div>
          )}

          {!loadingHistory && !historyError && history.length === 0 && (
            <p className="text-slate-600">No assignment history.</p>
          )}

          {!loadingHistory && !historyError && history.length > 0 && (
            <div className="overflow-x-auto">
              <table className="hidden w-full border-collapse sm:table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                      Asset Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                      Assigned
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                      Returned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-4 py-3 text-sm text-slate-900">{item.assetName}</td>
                      <td className="px-4 py-3 text-sm capitalize text-slate-600">
                        {item.assetType}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(item.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(item.returnedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-3 sm:hidden">
                {history.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="font-medium text-slate-900">{item.assetName}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-slate-600">
                        <span className="font-medium">Type:</span>
                        <span className="ml-1 capitalize">{item.assetType}</span>
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium">Assigned:</span>
                        <span className="ml-1">{new Date(item.assignedAt).toLocaleDateString()}</span>
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium">Returned:</span>
                        <span className="ml-1">{new Date(item.returnedAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={handleTicketModalClose}
        assignmentId={selectedAssignmentId}
        onSuccess={handleTicketSuccess}
      />
    </main>
  )
}

export default EmployeeAssignmentsPage
