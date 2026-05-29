import { useState } from 'react'
import { ASSET_CONDITION_OPTIONS, AssetCondition } from '../constants/assets.js'
import AssetTypeCombobox from './AssetTypeCombobox.jsx'

/**
 * Form for registering a new company asset.
 * Used on AddAssetPage.
 */
function AssetForm({ onSubmit, isSubmitting, error }) {
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [condition, setCondition] = useState(AssetCondition.NEW)
  const [notes, setNotes] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    await onSubmit({
      name,
      assetType,
      serialNumber,
      condition,
      notes: notes === '' ? undefined : notes,
    })

    setName('')
    setAssetType('')
    setSerialNumber('')
    setCondition(AssetCondition.NEW)
    setNotes('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="asset-name" className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="asset-name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <AssetTypeCombobox
            label="Type"
            value={assetType}
            onChange={setAssetType}
            required
          />
        </div>

        <div>
          <label htmlFor="asset-serial" className="block text-sm font-medium text-slate-700">
            Serial number
          </label>
          <input
            id="asset-serial"
            type="text"
            required
            value={serialNumber}
            onChange={(event) => setSerialNumber(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="asset-condition" className="block text-sm font-medium text-slate-700">
            Condition
          </label>
          <select
            id="asset-condition"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {ASSET_CONDITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="asset-notes" className="block text-sm font-medium text-slate-700">
            Notes (optional)
          </label>
          <textarea
            id="asset-notes"
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="mt-1 max-h-[7.5rem] min-h-[7.5rem] w-full resize-none overflow-y-auto rounded-lg border border-slate-300 px-3 py-2 text-sm leading-5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Registering...' : 'Register asset'}
      </button>
    </form>
  )
}

export default AssetForm
