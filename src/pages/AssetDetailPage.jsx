import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Trash2 } from 'lucide-react'
import { ADMIN_ASSETS_PATH } from '../constants/routes.js'
import { useAsset } from '../hooks/useAsset.js'
import { useReturnAsset } from '../hooks/useReturnAsset.js'
import { useReviewTicket } from '../hooks/useReviewTicket.js'
import { useDeleteAsset } from '../hooks/useDeleteAsset.js'
import {
  PageHeader,
  Spinner,
  Badge,
  Table,
  AuditEventRow,
  ReviewTicketDialog,
  ConfirmDialog,
} from '../components/index.js'
import { formatDate, calculateDuration } from '../utils/datetime.js'
import { formatAssetTypeLabel } from '../utils/assetType.js'
import { toast } from '../utils/toast.js'

/**
 * Asset detail page with assignments history, support tickets, and audit log tabs.
 * Rendered at /admin/assets/:id inside AdminLayout (admin role only).
 */
function AssetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { asset, isLoading, error, refetch } = useAsset(id)
  const { returnAsset, isReturning } = useReturnAsset()
  const { reviewTicket, isReviewing } = useReviewTicket()
  const { deleteAsset, isDeleting } = useDeleteAsset()

  const [activeTab, setActiveTab] = useState('assignments')
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to={ADMIN_ASSETS_PATH}
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
        <Spinner />
      </main>
    )
  }

  if (error || !asset) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-red-900">Asset Not Found</h3>
          <p className="mt-2 text-sm text-red-700">
            {error?.message || 'The requested asset could not be found.'}
          </p>
          <Link
            to={ADMIN_ASSETS_PATH}
            className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Back to Inventory
          </Link>
        </div>
      </main>
    )
  }

  const activeAssignment = asset.assignments?.find((a) => a.isActive)
  const canReturn = activeAssignment && (asset.status === 'assigned' || asset.status === 'acknowledged')
  const canDelete = asset.status === 'available'

  function handleReturnClick() {
    setReturnDialogOpen(true)
  }

  function handleReturnConfirm() {
    returnAsset(activeAssignment.id, {
      onSuccess: () => {
        toast.success('Asset returned successfully')
        refetch()
        setReturnDialogOpen(false)
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to return asset')
      },
    })
  }

  function handleDeleteClick() {
    setDeleteDialogOpen(true)
  }

  function handleDeleteConfirm() {
    deleteAsset(id, {
      onSuccess: () => {
        toast.success('Asset deleted successfully')
        navigate(ADMIN_ASSETS_PATH)
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete asset')
        setDeleteDialogOpen(false)
      },
    })
  }

  function handleReviewClick(ticket) {
    setSelectedTicket(ticket)
    setReviewDialogOpen(true)
  }

  function handleReviewConfirm({ action, adminNotes }) {
    if (!selectedTicket) return

    reviewTicket(
      { ticketId: selectedTicket.id, action, adminNotes },
      {
        onSuccess: () => {
          toast.success('Ticket reviewed successfully')
          refetch()
          setReviewDialogOpen(false)
          setSelectedTicket(null)
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to review ticket')
        },
      }
    )
  }

  const assignmentColumns = [
    {
      key: 'employeeName',
      label: 'Employee',
      render: (_, row) => row.employee?.name || '—',
    },
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
      key: 'returnedAt',
      label: 'Returned',
      render: (value) => (value ? formatDate(value) : '—'),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, row) => calculateDuration(row.assignedAt, row.returnedAt),
    },
  ]

  const ticketColumns = [
    { key: 'description', label: 'Description', wrap: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value} />,
    },
    {
      key: 'reporterName',
      label: 'Reported By',
      render: (_, row) => row.reporter?.name || '—',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        if (row.status === 'open' || row.status === 'under_review') {
          return (
            <button
              type="button"
              onClick={() => handleReviewClick(row)}
              className="rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-200"
            >
              Review
            </button>
          )
        }
        return <span className="text-sm text-slate-400">—</span>
      },
    },
  ]

  const sortedAssignments = asset.assignments
    ? [...asset.assignments].sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
    : []

  const sortedEvents = asset.events
    ? [...asset.events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to={ADMIN_ASSETS_PATH}
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory
      </Link>

      <div className="mt-6">
        <PageHeader
          title={asset.name}
          subtitle={`Serial: ${asset.serialNumber}`}
          action={
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {canReturn && (
                <button
                  type="button"
                  onClick={handleReturnClick}
                  disabled={isReturning}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Return Asset
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Asset
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Info Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Asset Type</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{formatAssetTypeLabel(asset.assetType)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Condition</p>
          <p className="mt-1 text-lg font-semibold capitalize text-slate-700">{asset.condition}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Status</p>
          <div className="mt-1">
            <Badge status={asset.status} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Assigned To</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">
            {activeAssignment?.employee?.name || '—'}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Assigned Date</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">
            {activeAssignment ? formatDate(activeAssignment.assignedAt) : '—'}
          </p>
        </div>
        {asset.notes && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-medium text-slate-700">Notes</p>
            <p className="mt-1 text-sm text-slate-700">{asset.notes}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('assignments')}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'assignments'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              Assignments History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              Support Tickets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'audit'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              Audit Log
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {/* Assignments History Tab */}
          {activeTab === 'assignments' && (
            <div>
              {sortedAssignments.length > 0 ? (
                <Table columns={assignmentColumns} data={sortedAssignments} />
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-sm text-slate-500">No assignment history yet</p>
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div>
              {asset.assignments && asset.assignments.some((a) => a.supportTickets?.length > 0) ? (
                <Table
                  columns={ticketColumns}
                  data={asset.assignments.flatMap((a) => a.supportTickets || [])}
                />
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-sm text-slate-500">No support tickets</p>
                </div>
              )}
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div>
              {sortedEvents.length > 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="divide-y divide-slate-200">
                    {sortedEvents.map((event) => (
                      <AuditEventRow
                        key={event.id}
                        eventType={event.eventType}
                        createdAt={event.createdAt}
                        triggeredByName={event.trigger?.name || 'System'}
                        targetEmployeeName={event.targetEmployee?.name}
                        notes={event.notes}
                        showAssetName={false}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-sm text-slate-500">No audit log entries</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ReviewTicketDialog
        isOpen={reviewDialogOpen}
        onClose={() => {
          setReviewDialogOpen(false)
          setSelectedTicket(null)
        }}
        onConfirm={handleReviewConfirm}
        isReviewing={isReviewing}
      />

      <ConfirmDialog
        isOpen={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        onConfirm={handleReturnConfirm}
        isConfirming={isReturning}
        title="Return Asset"
        message={`Are you sure you want to return this asset from ${activeAssignment?.employee?.name}?`}
        confirmLabel="Return Asset"
        confirmingLabel="Returning..."
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isConfirming={isDeleting}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? This action will permanently delete all associated assignment history and support tickets. This action cannot be undone."
        confirmLabel="Delete Asset"
        confirmingLabel="Deleting..."
      />
    </main>
  )
}

export default AssetDetailPage
