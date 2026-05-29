import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, X, Package, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { ADMIN_ASSETS_NEW_PATH, adminAssetDetailPath, adminAssetEditPath } from '../constants/routes.js'
import { ASSET_STATUS_OPTIONS } from '../constants/assets.js'
import { useAssets } from '../hooks/useAssets.js'
import { useEmployees } from '../hooks/useEmployees.js'
import { formatAssetTypeLabel } from '../utils/assetType.js'
import { useAssetTypes } from '../hooks/useAssetTypes.js'
import PageHeader from '../components/PageHeader.jsx'
import Badge from '../components/Badge.jsx'
import PaginationControls from '../components/PaginationControls.jsx'
import AssetsListSkeleton from '../components/AssetsListSkeleton.jsx'
import PaginatedListContainer from '../components/PaginatedListContainer.jsx'
import PaginatedPageShell from '../components/PaginatedPageShell.jsx'
import PaginatedListEmpty from '../components/PaginatedListEmpty.jsx'
import { isPaginatedPageFull, isPaginationResultEmpty } from '../utils/paginationUi.js'

/**
 * Admin asset inventory page with filters and paginated table view.
 * Rendered at /admin/assets inside AdminLayout (admin role only).
 */
function AssetsListPage() {
  const [page, setPage] = useState(1)
  const limit = 8
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [assigneeInput, setAssigneeInput] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const assigneeContainerRef = useRef(null)

  const { employees } = useEmployees()
  const { allTypes: assetTypeOptions, isLoading: assetTypesLoading } = useAssetTypes()

  const employeeSuggestions = useMemo(() => {
    if (!assigneeInput.trim() || selectedEmployee) return []
    const q = assigneeInput.toLowerCase()
    return employees.filter((e) => e.name.toLowerCase().includes(q))
  }, [employees, assigneeInput, selectedEmployee])

  useEffect(() => {
    function handleMouseDown(event) {
      if (
        assigneeContainerRef.current &&
        !assigneeContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, typeFilter, searchQuery, selectedEmployee])

  function handleAssigneeInputChange(event) {
    setAssigneeInput(event.target.value)
    setSelectedEmployee(null)
    setShowSuggestions(true)
  }

  function handleSelectEmployee(employee) {
    setSelectedEmployee(employee)
    setAssigneeInput(employee.name)
    setShowSuggestions(false)
  }

  function handleClearAssignee() {
    setSelectedEmployee(null)
    setAssigneeInput('')
    setShowSuggestions(false)
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

  const filters = useMemo(
    () => ({
      status: statusFilter,
      asset_type: typeFilter,
      employee_id: selectedEmployee ? selectedEmployee.id : undefined,
      search: searchQuery.trim() ? searchQuery.trim() : undefined,
    }),
    [statusFilter, typeFilter, selectedEmployee, searchQuery]
  )

  const { assets, pagination, isPending, isFetching, error, refetch } = useAssets(filters, {
    page,
    limit,
  })

  const itemCount = assets ? assets.length : 0
  const fillMobileViewport = isPending || isPaginatedPageFull(itemCount, limit)

  let listContent = null

  if (isPending) {
    listContent = (
      <>
        <div className="hidden sm:block">
          <AssetsListSkeleton count={limit} />
        </div>
        <PaginatedListContainer
          className="sm:hidden"
          borderRadiusClass="rounded-2xl"
          fillViewport={fillMobileViewport}
        >
          <AssetsListSkeleton count={limit} />
        </PaginatedListContainer>
      </>
    )
  } else if (error) {
    listContent = (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="text-sm">{error.message || 'Failed to load assets'}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-sm font-medium underline"
        >
          Retry
        </button>
      </div>
    )
  } else if (isPaginationResultEmpty(pagination)) {
    listContent = (
      <PaginatedListEmpty
        icon={Package}
        title="No assets found"
        description="Try adjusting your filters or register a new asset."
      />
    )
  } else {
    listContent = (
      <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Serial Number
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Condition
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assigned To
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <AssetTableRow key={asset.id} asset={asset} />
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
            {assets.map((asset) => (
              <AssetMobileCard key={asset.id} asset={asset} />
            ))}
          </div>
        </PaginatedListContainer>
      </>
    )
  }

  return (
    <PaginatedPageShell>
      <div className="mb-2 shrink-0 sm:mb-3">
        <PageHeader
          title="Inventory"
          subtitle="Browse and manage company hardware assets"
          action={
            <Link
              to={ADMIN_ASSETS_NEW_PATH}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 sm:w-auto"
            >
              Register Asset
            </Link>
          }
        />
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="mb-3 shrink-0 sm:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {(statusFilter || typeFilter || searchQuery || selectedEmployee) && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {[statusFilter, typeFilter, searchQuery, selectedEmployee].filter(Boolean).length}
              </span>
            )}
          </span>
          {showMobileFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`mb-4 shrink-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:block sm:p-6 ${showMobileFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-slate-700">
              Search
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Name or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All</option>
              {ASSET_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-slate-700">
              Filter by Type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              disabled={assetTypesLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:opacity-60"
            >
              <option value="">All types</option>
              {assetTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {formatAssetTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div ref={assigneeContainerRef} className="relative">
            <label htmlFor="assignee-filter" className="block text-sm font-medium text-slate-700">
              Filter by Assignee
            </label>
            <div className="relative mt-1">
              <input
                id="assignee-filter"
                type="text"
                placeholder="Search employee name..."
                value={assigneeInput}
                onChange={handleAssigneeInputChange}
                onFocus={() => {
                  if (!selectedEmployee && assigneeInput.trim()) {
                    setShowSuggestions(true)
                  }
                }}
                autoComplete="off"
                className={`w-full rounded-lg border px-3 py-2 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  selectedEmployee
                    ? 'border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-500'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              />
              {(assigneeInput || selectedEmployee) && (
                <button
                  type="button"
                  onClick={handleClearAssignee}
                  aria-label="Clear assignee filter"
                  className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showSuggestions && employeeSuggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label="Employee suggestions"
                className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              >
                {employeeSuggestions.map((employee) => (
                  <li key={employee.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectEmployee(employee)}
                      className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-emerald-50"
                    >
                      {employee.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {showSuggestions &&
              assigneeInput.trim() &&
              !selectedEmployee &&
              employeeSuggestions.length === 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-lg">
                  No employees found
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="mb-3 flex shrink-0 justify-end sm:mb-4">
        <PaginationControls
          pagination={pagination}
          page={page}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          isFetching={isFetching}
          ariaLabel="Assets pagination"
        />
      </div>

      {listContent}
    </PaginatedPageShell>
  )
}

/**
 * Desktop table row for a single asset in the inventory list.
 */
function AssetTableRow({ asset }) {
  const assignedLabel =
    asset.status === 'available'
      ? '—'
      : asset.assignedEmployeeName || '—'

  return (
    <tr className="transition-colors hover:bg-slate-50">
      <td className="px-5 py-4 font-medium text-slate-900">{asset.name}</td>
      <td className="px-5 py-4 text-sm capitalize text-slate-600">
        {formatAssetTypeLabel(asset.assetType)}
      </td>
      <td className="px-5 py-4 font-mono text-sm text-slate-600">{asset.serialNumber}</td>
      <td className="px-5 py-4 text-sm capitalize text-slate-600">{asset.condition}</td>
      <td className="px-5 py-4">
        <Badge status={asset.status} />
      </td>
      <td className="px-5 py-4 text-sm text-slate-600">
        {assignedLabel === '—' ? (
          <span className="text-slate-400">—</span>
        ) : (
          assignedLabel
        )}
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={adminAssetDetailPath(asset.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
          <Link
            to={adminAssetEditPath(asset.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </td>
    </tr>
  )
}

/**
 * Mobile card for a single asset in the inventory list.
 */
function AssetMobileCard({ asset }) {
  const assignedLabel =
    asset.status === 'available'
      ? '—'
      : asset.assignedEmployeeName || '—'

  return (
    <article className="w-full bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{asset.name}</p>
          <p className="mt-0.5 text-xs capitalize text-slate-500">
            {formatAssetTypeLabel(asset.assetType)}
          </p>
        </div>
        <Badge status={asset.status} />
      </div>

      <p className="mb-2 font-mono text-xs text-slate-500">{asset.serialNumber}</p>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>
          <span className="font-medium text-slate-700">Condition:</span>{' '}
          <span className="capitalize">{asset.condition}</span>
        </span>
        <span>
          <span className="font-medium text-slate-700">Assigned:</span> {assignedLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          to={adminAssetDetailPath(asset.id)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
        <Link
          to={adminAssetEditPath(asset.id)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>
    </article>
  )
}

export default AssetsListPage
