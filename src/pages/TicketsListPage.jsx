import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTickets } from '../hooks/useTickets.js'
import { TicketStatus, TICKET_ACTIONS } from '../constants/tickets.js'
import PageHeader from '../components/PageHeader.jsx'
import TicketStatusBadge from '../components/TicketStatusBadge.jsx'
import ReviewTicketModal from '../components/ReviewTicketModal.jsx'
import Spinner from '../components/Spinner.jsx'

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: TicketStatus.OPEN },
  { label: 'Under Review', value: TicketStatus.UNDER_REVIEW },
  { label: 'Resolved', value: TicketStatus.RESOLVED },
]

/**
 * Admin page for viewing and reviewing all support tickets.
 * Lists tickets in a filterable table with status-aware action buttons.
 * Rendered at /admin/tickets inside AdminLayout.
 */
function TicketsListPage() {
  const { tickets, isLoading, error, refetch } = useTickets()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [initialAction, setInitialAction] = useState(null)

  const filteredTickets =
    activeFilter === 'all'
      ? tickets
      : tickets.filter((t) => t.status === activeFilter)

  function handleOpenReview(ticket, action) {
    setSelectedTicket(ticket)
    setInitialAction(action)
  }

  function handleModalClose() {
    setSelectedTicket(null)
    setInitialAction(null)
  }

  function handleReviewSuccess() {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader title="Support Tickets" />
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader title="Support Tickets" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error.message}</p>
          <button type="button" onClick={refetch} className="mt-2 text-sm underline">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Support Tickets"
        subtitle={`${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} total`}
      />

      {/* Filter tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.value === 'all'
                ? tickets.length
                : tickets.filter((t) => t.status === tab.value).length
            const isActive = activeFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Table — desktop */}
      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <AlertCircle className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No tickets found</p>
          <p className="mt-1 text-xs text-slate-400">
            {activeFilter === 'all' ? 'No support tickets have been submitted yet.' : 'No tickets match this filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Asset
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Issue Description
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date Reported
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <TicketTableRow
                    key={ticket.id}
                    ticket={ticket}
                    onAction={handleOpenReview}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {filteredTickets.map((ticket) => (
              <TicketMobileCard
                key={ticket.id}
                ticket={ticket}
                onAction={handleOpenReview}
              />
            ))}
          </div>
        </>
      )}

      <ReviewTicketModal
        isOpen={selectedTicket !== null}
        onClose={handleModalClose}
        ticket={selectedTicket}
        initialAction={initialAction}
        onSuccess={handleReviewSuccess}
      />
    </div>
  )
}

/**
 * Table row for a single support ticket on desktop.
 */
function TicketTableRow({ ticket, onAction }) {
  const assetName = ticket.assignment?.asset?.name ?? 'Unknown Asset'
  const serialNumber = ticket.assignment?.asset?.serialNumber ?? ''
  const employeeName = ticket.assignment?.employee?.name ?? 'Unknown Employee'
  const dateReported = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <tr className="transition-colors hover:bg-slate-50">
      <td className="px-5 py-4">
        <p className="font-medium text-slate-900">{assetName}</p>
        {serialNumber && (
          <p className="text-xs text-slate-500">{serialNumber}</p>
        )}
      </td>
      <td className="px-5 py-4 text-sm text-slate-700">{employeeName}</td>
      <td className="max-w-xs px-5 py-4">
        <p className="line-clamp-2 text-sm text-slate-700">{ticket.description}</p>
      </td>
      <td className="px-5 py-4">
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{dateReported}</td>
      <td className="px-5 py-4 text-right">
        <TicketActionButton ticket={ticket} onAction={onAction} />
      </td>
    </tr>
  )
}

/**
 * Mobile card for a single support ticket.
 */
function TicketMobileCard({ ticket, onAction }) {
  const assetName = ticket.assignment?.asset?.name ?? 'Unknown Asset'
  const employeeName = ticket.assignment?.employee?.name ?? 'Unknown Employee'
  const dateReported = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{assetName}</p>
          <p className="text-xs text-slate-500">{employeeName}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-slate-700">{ticket.description}</p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">{dateReported}</p>
        <TicketActionButton ticket={ticket} onAction={onAction} />
      </div>
    </div>
  )
}

/**
 * Renders the appropriate action button based on ticket status.
 * OPEN → Review button; UNDER_REVIEW → Resolve button; others → nothing.
 */
function TicketActionButton({ ticket, onAction }) {
  if (ticket.status === TicketStatus.OPEN) {
    return (
      <button
        type="button"
        onClick={() => onAction(ticket, null)}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
      >
        Review
      </button>
    )
  }

  if (ticket.status === TicketStatus.UNDER_REVIEW) {
    return (
      <button
        type="button"
        onClick={() => onAction(ticket, TICKET_ACTIONS.RESOLVE)}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
      >
        Resolve
      </button>
    )
  }

  return null
}

export default TicketsListPage
