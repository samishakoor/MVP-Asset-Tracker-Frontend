import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Flag, Info } from 'lucide-react'
import { useEmployeeAsset } from '../hooks/useEmployeeAsset.js'
import { useCreateTicket } from '../hooks/useCreateTicket.js'
import { AssetStatus } from '../constants/assets.js'
import { EMPLOYEE_DASHBOARD_PATH } from '../constants/routes.js'
import PageHeader from '../components/PageHeader.jsx'
import AssetStatusBadge from '../components/AssetStatusBadge.jsx'
import TicketStatusBadge from '../components/TicketStatusBadge.jsx'
import Spinner from '../components/Spinner.jsx'
import { formatAssetTypeLabel } from '../utils/assetType.js'
import { formatDate } from '../utils/datetime.js'

const CONDITION_LABELS = {
  new: 'New',
  good: 'Good',
  fair: 'Fair',
  damaged: 'Damaged',
}

const MIN_DESCRIPTION_LENGTH = 10

/**
 * Employee asset detail page — shows info for a specific assigned asset,
 * allows reporting an issue (if status is ACKNOWLEDGED), and lists ticket history.
 * Redirects to /employee/dashboard if the asset is not found or not assigned.
 * Rendered at /employee/dashboard/assets/:assetId inside EmployeeLayout.
 */
function EmployeeAssetDetailPage() {
  const { assetId } = useParams()
  const navigate = useNavigate()

  const { asset, isLoading, error, refetch } = useEmployeeAsset(assetId)
  const { createTicket, isSubmitting } = useCreateTicket()

  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (!isLoading && !error && asset === null) {
      navigate(EMPLOYEE_DASHBOARD_PATH, { replace: true })
    }
  }, [isLoading, error, asset, navigate])

  useEffect(() => {
    if (error && error.message?.toLowerCase().includes('not found')) {
      navigate(EMPLOYEE_DASHBOARD_PATH, { replace: true })
    }
  }, [error, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    const trimmed = description.trim()
    if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
      setFormError(`Please describe the issue in at least ${MIN_DESCRIPTION_LENGTH} characters.`)
      return
    }

    try {
      await createTicket({ assignmentId: asset.activeAssignment.id, description: trimmed })
      setSuccessMessage('Issue reported. IT has been notified.')
      setDescription('')
      refetch()
    } catch (err) {
      setFormError(err.message || 'Failed to submit the ticket. Please try again.')
    }
  }

  function handleBack() {
    navigate(EMPLOYEE_DASHBOARD_PATH)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <Spinner />
      </div>
    )
  }

  if (error && !error.message?.toLowerCase().includes('not found')) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Gear
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      </div>
    )
  }

  if (!asset) {
    return null
  }

  const assignedDate = formatDate(asset.activeAssignment.assignedAt)
  const hasAcknowledged = Boolean(asset.activeAssignment.acknowledgedAt)
  const acknowledgedDate = hasAcknowledged
    ? formatDate(asset.activeAssignment.acknowledgedAt)
    : null

  const infoGridClassName = hasAcknowledged
    ? 'grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-3 lg:grid-cols-5 sm:divide-y-0 lg:divide-y-0'
    : 'grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0'

  const canReport = asset.status === AssetStatus.ACKNOWLEDGED
  const isPendingReview = asset.status === AssetStatus.PENDING_REVIEW
  const isUnderRepair = asset.status === AssetStatus.UNDER_REPAIR

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Gear
      </button>

      {/* Page header */}
      <PageHeader
        title={asset.name}
        subtitle={asset.serialNumber}
      />

      {/* Info grid */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className={infoGridClassName}>
          <InfoCell label="Type">
            <span>{formatAssetTypeLabel(asset.assetType)}</span>
          </InfoCell>
          <InfoCell label="Condition">
            <span className="capitalize">{CONDITION_LABELS[asset.condition] ?? asset.condition}</span>
          </InfoCell>
          <InfoCell label="Status">
            <AssetStatusBadge status={asset.status} />
          </InfoCell>
          <InfoCell label="Assigned Since">
            {assignedDate}
          </InfoCell>
          {hasAcknowledged && (
            <InfoCell label="Acknowledged Since">
              {acknowledgedDate}
            </InfoCell>
          )}
        </div>
      </div>

      {/* Report an Issue section */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Report an Issue</h2>
        </div>

        <div className="p-5 sm:p-6">
          {isPendingReview && (
            <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>You have an open ticket for this asset. IT is reviewing it.</p>
            </div>
          )}

          {isUnderRepair && (
            <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>This asset is currently under repair. Issue reporting is unavailable until repair is complete.</p>
            </div>
          )}

          {!canReport && !isPendingReview && !isUnderRepair && (
            <p className="text-sm text-slate-500">
              Reporting is available once you have acknowledged the asset.
            </p>
          )}

          {canReport && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </div>
              )}

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="issueDescription"
                  className="block text-sm font-medium text-slate-700"
                >
                  Describe the issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="issueDescription"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setFormError(null)
                    setSuccessMessage(null)
                  }}
                  disabled={isSubmitting}
                  rows={4}
                  minLength={MIN_DESCRIPTION_LENGTH}
                  maxLength={500}
                  placeholder="Describe the problem in detail…"
                  className="mt-1.5 block w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {description.length}/500
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50 sm:w-auto"
              >
                <Flag className="h-4 w-4" />
                {isSubmitting ? 'Submitting…' : 'Report Issue'}
           
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Ticket History */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Ticket History</h2>
        </div>

        {asset.tickets.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            No tickets have been submitted for this asset yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {asset.tickets.map((ticket) => (
              <TicketHistoryItem key={ticket.id} ticket={ticket} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * Single row in the ticket history list.
 */
function InfoCell({ label, children }) {
  return (
    <div className="px-5 py-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="text-sm font-medium text-slate-900">{children}</div>
    </div>
  )
}

/**
 * Single ticket entry in the ticket history list.
 */
function TicketHistoryItem({ ticket }) {
  const date = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <li className="px-5 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-s text-slate-800">{ticket.description}</p>
          {ticket.adminNotes && (
            <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-sm font-semibold text-slate-800">Admin Notes</p>
              <p className="mt-0.5 text-s text-slate-800">{ticket.adminNotes}</p>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
          <TicketStatusBadge status={ticket.status} />
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>
    </li>
  )
}

export default EmployeeAssetDetailPage
