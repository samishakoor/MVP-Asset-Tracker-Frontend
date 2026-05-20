import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, X } from 'lucide-react'
import { ADMIN_ASSETS_NEW_PATH, adminAssetDetailPath, adminAssetEditPath } from '../constants/routes.js'
import { ASSET_STATUS_OPTIONS } from '../constants/assets.js'
import { useAssets } from '../hooks/useAssets.js'
import { useEmployees } from '../hooks/useEmployees.js'
import { formatAssetTypeLabel } from '../utils/assetType.js'
import { useAssetTypes } from '../hooks/useAssetTypes.js'
import { PageHeader, Spinner, Table, Badge } from '../components/index.js'

/**
 * Admin asset inventory page with filters and table view.
 * Rendered at /admin/assets inside AdminLayout (admin role only).
 */
function AssetsListPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [assigneeInput, setAssigneeInput] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
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

  const filters = useMemo(
    () => ({
      status: statusFilter,
      asset_type: typeFilter,
      employee_id: selectedEmployee ? selectedEmployee.id : undefined,
    }),
    [statusFilter, typeFilter, selectedEmployee]
  )

  const { assets, isLoading, error, refetch } = useAssets(filters)

  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) {
      return assets
    }

    const query = searchQuery.toLowerCase()
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query)
    )
  }, [assets, searchQuery])

  const columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'assetType',
      label: 'Type',
      render: (value) => <span>{formatAssetTypeLabel(value)}</span>,
    },
    { key: 'serialNumber', label: 'Serial Number' },
    {
      key: 'condition',
      label: 'Condition',
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value} />,
    },
    {
      key: 'assignedEmployeeName',
      label: 'Assigned To',
      render: (value, row) => {
        if (row.status === 'available') {
          return <span className="text-slate-400">—</span>
        }
        return value || <span className="text-slate-400">—</span>
      },
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Link
            to={adminAssetDetailPath(value)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
          <Link
            to={adminAssetEditPath(value)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      ),
    },
  ]

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Inventory"
        subtitle="Browse and manage company hardware assets"
        action={
          <Link
            to={ADMIN_ASSETS_NEW_PATH}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Register Asset
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
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

          {/* Status Filter */}
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

          {/* Type Filter */}
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

          {/* Assignee Search Filter */}
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

      {/* Assets Table or Empty State */}
      {isLoading ? (
        <Spinner />
      ) : error ? (
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
      ) : filteredAssets.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-sm text-slate-600">
            {assets.length === 0
              ? 'No assets found.'
              : 'No assets match your filters.'}
          </p>
        </div>
      ) : (
        <Table columns={columns} data={filteredAssets} />
      )}
    </main>
  )
}

export default AssetsListPage
