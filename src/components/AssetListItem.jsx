import { Link } from 'react-router-dom'
import { adminAssetDetailPath } from '../constants/routes.js'
import AssetStatusBadge from './AssetStatusBadge.jsx'

/**
 * Card row for a single asset in the admin inventory list.
 */
function AssetListItem({ asset }) {
  const assigneeLabel = asset.assignedEmployeeName || 'Unassigned'

  return (
    <Link
      to={adminAssetDetailPath(asset.id)}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{asset.name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {asset.assetType} · SN: {asset.serialNumber}
          </p>
          <p className="mt-1 text-sm text-slate-500">Condition: {asset.condition}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <AssetStatusBadge status={asset.status} />
          <span className="text-xs text-slate-500 sm:text-sm">{assigneeLabel}</span>
        </div>
      </div>
    </Link>
  )
}

export default AssetListItem
