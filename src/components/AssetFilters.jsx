import { ASSET_STATUS_OPTIONS } from '../constants/assets.js'
import AssetTypeCombobox from './AssetTypeCombobox.jsx'

/**
 * Filter controls for the admin asset inventory list.
 * Stacks vertically on mobile; horizontal row from sm breakpoint up.
 */
function AssetFilters({ filters, onFilterChange, employees, employeesLoading }) {
  function handleStatusChange(event) {
    onFilterChange({ ...filters, status: event.target.value })
  }

  function handleAssetTypeChange(nextAssetType) {
    onFilterChange({ ...filters, asset_type: nextAssetType })
  }

  function handleEmployeeChange(event) {
    onFilterChange({ ...filters, employee_id: event.target.value })
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label htmlFor="filter-status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={handleStatusChange}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">All statuses</option>
          {ASSET_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <AssetTypeCombobox
          label="Asset type"
          value={filters.asset_type}
          onChange={handleAssetTypeChange}
          allowEmpty
          emptyOptionLabel="All types"
        />
      </div>

      <div>
        <label htmlFor="filter-employee" className="block text-sm font-medium text-slate-700">
          Assigned employee
        </label>
        <select
          id="filter-employee"
          value={filters.employee_id}
          onChange={handleEmployeeChange}
          disabled={employeesLoading}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
        >
          <option value="">All employees</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AssetFilters
