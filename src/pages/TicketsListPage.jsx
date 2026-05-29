import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTickets } from '../hooks/useTickets.js'
import { TicketStatus, TICKET_ACTIONS } from '../constants/tickets.js'
import PageHeader from '../components/PageHeader.jsx'
import TicketStatusBadge from '../components/TicketStatusBadge.jsx'
import ReviewTicketModal from '../components/ReviewTicketModal.jsx'
import PaginationControls from '../components/PaginationControls.jsx'
import TicketsListSkeleton from '../components/TicketsListSkeleton.jsx'
import PaginatedListContainer from '../components/PaginatedListContainer.jsx'
import PaginatedPageShell from '../components/PaginatedPageShell.jsx'
import PaginatedListEmpty from '../components/PaginatedListEmpty.jsx'
import { isPaginatedPageFull, isPaginationResultEmpty } from '../utils/paginationUi.js'

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: TicketStatus.OPEN },
  { label: 'Under Review', value: TicketStatus.UNDER_REVIEW },
  { label: 'Resolved', value: TicketStatus.RESOLVED },
]

/**
 * Admin page for viewing and reviewing all support tickets.
 * Lists tickets in a filterable, paginated table with status-aware action buttons.
 * Rendered at /admin/tickets inside AdminLayout.
 */
function TicketsListPage() {
  const [page, setPage] = useState(1)
  const limit = 15
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [initialAction, setInitialAction] = useState(null)

  const statusParam = activeFilter === 'all' ? undefined : activeFilter

  const { tickets, pagination, statusCounts, isPending, isFetching, error, refetch } = useTickets({
    page,
    limit,
    status: statusParam,
  })

  useEffect(() => {
    setPage(1)
  }, [activeFilter])

  function handleFilterChange(value) {
    setActiveFilter(value)
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNextPage() {
    if (pagination && page < pagination.total_pages) {
      setPage(page + 1)
    }
  }

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

  function getTabCount(tabValue) {
    if (!statusCounts) {
      return 0
    }
    if (tabValue === 'all') {
      return statusCounts.all
    }
    if (tabValue === TicketStatus.OPEN) {
      return statusCounts.open
    }
    if (tabValue === TicketStatus.UNDER_REVIEW) {
      return statusCounts.under_review
    }
    if (tabValue === TicketStatus.RESOLVED) {
      return statusCounts.resolved
    }
    return 0
  }

  const itemCount = tickets ? tickets.length : 0
  const fillMobileViewport = isPending || isPaginatedPageFull(itemCount, limit)

  let mainContent = null

  if (isPending) {
    mainContent = (
      <>
        <div className="hidden sm:block">
          <TicketsListSkeleton count={limit} />
        </div>
        <PaginatedListContainer
          className="sm:hidden"
          borderRadiusClass="rounded-2xl"
          fillViewport={fillMobileViewport}
        >
          <TicketsListSkeleton count={limit} />
        </PaginatedListContainer>
      </>
    )
  } else if (error) {
    mainContent = (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>{error.message}</p>
        <button type="button" onClick={refetch} className="mt-2 text-sm underline">
          Retry
        </button>
      </div>
    )
  } else if (isPaginationResultEmpty(pagination)) {
    mainContent = (
      <PaginatedListEmpty
        icon={AlertCircle}
        title="No tickets found"
        description={
          activeFilter === 'all'
            ? 'No support tickets have been submitted yet.'
            : 'No tickets match this filter.'
        }
      />
    )
  } else {
    mainContent = (
      <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
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
              {tickets.map((ticket) => (
                <TicketTableRow
                  key={ticket.id}
                  ticket={ticket}
                  onAction={handleOpenReview}
                />
              ))}
            </tbody>
          </table>
        </div>

        <PaginatedListContainer
          className="sm:hidden"
          borderRadiusClass="rounded-2xl"
          fillViewport={fillMobileViewport}
        >
          <div className="flex flex-col divide-y divide-slate-200">
            {tickets.map((ticket) => (
              <TicketMobileCard
                key={ticket.id}
                ticket={ticket}
                onAction={handleOpenReview}
              />
            ))}
          </div>
        </PaginatedListContainer>
      </>
    )
  }

  return (
    <PaginatedPageShell>
      <div className="mb-2 shrink-0 sm:mb-3">
        <PageHeader title="Support Tickets" />
        <div className="mt-1">
          <div className="mt-2 flex justify-end">
            <PaginationControls
              pagination={pagination}
              page={page}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              isFetching={isFetching}
              ariaLabel="Support tickets pagination"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 shrink-0 overflow-x-auto sm:mb-6">
        <div className="flex min-w-max gap-2">
          {FILTER_TABS.map((tab) => {
            const count = getTabCount(tab.value)
            const isActive = activeFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleFilterChange(tab.value)}
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

      {mainContent}

      <ReviewTicketModal
        isOpen={selectedTicket !== null}
        onClose={handleModalClose}
        ticket={selectedTicket}
        initialAction={initialAction}
        onSuccess={handleReviewSuccess}
      />
    </PaginatedPageShell>
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
    <article className="w-full bg-white p-4">
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
    </article>
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
