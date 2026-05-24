import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, CheckCircle, Wrench } from 'lucide-react'
import { useAcknowledgeAsset } from '../hooks/useAcknowledgeAsset.js'
import { AssetStatus } from '../constants/assets.js'
import { employeeAssetDetailPath } from '../constants/routes.js'
import { formatDate } from '../utils/datetime.js'
import { formatAssetTypeLabel } from '../utils/assetType.js'

const CONDITION_STYLES = {
  new: 'bg-emerald-100 text-emerald-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-yellow-100 text-yellow-700',
  damaged: 'bg-red-100 text-red-700',
}

const CONDITION_LABELS = {
  new: 'New',
  good: 'Good',
  fair: 'Fair',
  damaged: 'Damaged',
}

const STATUS_STYLES = {
  assigned: 'bg-orange-100 text-orange-700',
  acknowledged: 'bg-emerald-100 text-emerald-700',
  pending_review: 'bg-amber-100 text-amber-700',
  under_repair: 'bg-purple-100 text-purple-700',
}

const STATUS_LABELS = {
  assigned: 'Pending',
  acknowledged: 'Acknowledged',
  pending_review: 'Pending Review',
  under_repair: 'Under Repair',
}

/**
 * Card for a single active asset assignment on the employee dashboard.
 * Displays asset details (name, type, condition, serial, status, date) and
 * status-aware banners and action buttons:
 *   - ASSIGNED      → yellow "pending" banner + "Acknowledge Asset" button
 *   - ACKNOWLEDGED  → clickable asset name + "Report an Issue" button (navigates to asset detail)
 *   - PENDING_REVIEW → clickable asset name + "View Asset Details" button
 *   - UNDER_REPAIR   → clickable asset name + "View Asset Details" button
 *
 * Props:
 *   assignment — assignment object from GET /users/me/assets
 */
function AssignedAssetCard({ assignment }) {
  const navigate = useNavigate()
  const { acknowledgeAsset, isAcknowledging } = useAcknowledgeAsset()
  const [acknowledged, setAcknowledged] = useState(false)
  const [ackError, setAckError] = useState(null)

  const assetName = assignment.assetName ?? 'Unknown Asset'
  const assetTypeLabel = formatAssetTypeLabel(assignment.assetType ?? '')
  const condition = assignment.condition ?? ''
  const serialNumber = assignment.serialNumber ?? ''
  const status = assignment.currentStatus
  const assignedDate = formatDate(assignment.assignedAt)
  const acknowledgedDate = formatDate(assignment.acknowledgedAt)
  const hasAcknowledged = Boolean(assignment.acknowledgedAt)

  const conditionClass = CONDITION_STYLES[condition] ?? 'bg-slate-100 text-slate-600'
  const conditionLabel = CONDITION_LABELS[condition] ?? condition
  const statusClass = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'
  const statusLabel = STATUS_LABELS[status] ?? status

  async function handleAcknowledge() {
    setAckError(null)
    try {
      await acknowledgeAsset(assignment.id)
      setAcknowledged(true)
    } catch (err) {
      setAckError(err.message || 'Failed to acknowledge. Please try again.')
    }
  }

  function handleReportIssue() {
    navigate(employeeAssetDetailPath(assignment.assetId))
  }

  function handleViewDetails() {
    navigate(employeeAssetDetailPath(assignment.assetId))
  }

  const canViewDetails =
    status === AssetStatus.ACKNOWLEDGED ||
    status === AssetStatus.PENDING_REVIEW ||
    status === AssetStatus.UNDER_REPAIR

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Status banner */}
      {status === AssetStatus.ASSIGNED && !acknowledged && (
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-800">
          <Clock className="h-4 w-4 shrink-0" />
          Pending your acknowledgment
        </div>
      )}
      {acknowledged && (
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Asset acknowledged!
        </div>
      )}
      {status === AssetStatus.PENDING_REVIEW && (
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Issue under IT review
        </div>
      )}
      {status === AssetStatus.UNDER_REPAIR && (
        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700">
          <Wrench className="h-4 w-4 shrink-0" />
          Asset is currently under repair
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-3">
          {canViewDetails ? (
            <button
              type="button"
              onClick={handleViewDetails}
              className="text-left text-lg font-bold leading-snug text-slate-900 transition-colors hover:text-emerald-700"
            >
              {assetName}
            </button>
          ) : (
            <h3 className="text-lg font-bold leading-snug text-slate-900">{assetName}</h3>
          )}
          <span
            className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Badges row */}
        <div className="mb-4 flex flex-wrap gap-2">
          {assetTypeLabel && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {assetTypeLabel}
            </span>
          )}
          {condition && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${conditionClass}`}
            >
              {conditionLabel}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="mb-5 space-y-1.5 text-sm">
          {serialNumber && (
            <p className="text-slate-400">
              <span className="font-medium text-slate-600">Serial:</span>{' '}
              <span className="font-mono">{serialNumber}</span>
            </p>
          )}
          <p className="text-slate-500">
            <span className="font-medium text-slate-600">Assigned:</span> {assignedDate}
          </p>
          {hasAcknowledged && (
            <p className="text-slate-500">
              <span className="font-medium text-slate-600">Acknowledged:</span>{' '}
              {acknowledgedDate}
            </p>
          )}
        </div>

        {/* Error */}
        {ackError && (
          <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {ackError}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto">
          {status === AssetStatus.ASSIGNED && !acknowledged && (
            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={isAcknowledging}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {isAcknowledging ? 'Acknowledging…' : 'Acknowledge Asset'}
            </button>
          )}
          {status === AssetStatus.ACKNOWLEDGED && (
            <button
              type="button"
              onClick={handleReportIssue}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Report an Issue
            </button>
          )}
          {(status === AssetStatus.PENDING_REVIEW || status === AssetStatus.UNDER_REPAIR) && (
            <button
              type="button"
              onClick={handleViewDetails}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              View Asset Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssignedAssetCard
