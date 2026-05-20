/**
 * Returns cell class names for a column; wrap columns allow multi-line text with a max width.
 *
 * @param {{ wrap?: boolean }} column - Column config.
 * @returns {string}
 */
function getColumnCellClassName(column) {
  if (column.wrap === true) {
    return 'min-w-0 max-w-56 px-6 py-4 text-sm text-slate-900 whitespace-normal break-words sm:max-w-xs md:max-w-sm lg:max-w-md'
  }

  return 'whitespace-nowrap px-6 py-4 text-sm text-slate-900'
}

/**
 * Generic table component with responsive design.
 * Accepts columns configuration and data array.
 * Renders a clean striped table with thead and tbody.
 * On mobile, converts to stacked cards for better readability.
 * Set column.wrap to true for long text fields (e.g. descriptions) that should wrap instead of stretching the table.
 */
function Table({ columns, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm text-slate-500">No records found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Desktop table view */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 ${
                    column.wrap === true ? 'max-w-56 sm:max-w-xs md:max-w-sm lg:max-w-md' : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="transition-colors hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className={getColumnCellClassName(column)}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="divide-y divide-slate-200 sm:hidden">
        {data.map((row, rowIndex) => (
          <div key={row.id || rowIndex} className="space-y-3 px-4 py-4">
            {columns.map((column) => (
              <div
                key={column.key}
                className={
                  column.wrap === true
                    ? 'flex flex-col gap-1'
                    : 'flex justify-between gap-2'
                }
              >
                <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500">
                  {column.label}
                </span>
                <span
                  className={`min-w-0 text-sm text-slate-900 whitespace-normal break-words ${
                    column.wrap === true ? 'text-left' : 'wrap-break-word text-right'
                  }`}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Table
