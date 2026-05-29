import { useEffect, useState } from 'react'
import { useUpdateAsset } from '../hooks/useUpdateAsset.js'
import { ASSET_CONDITION_OPTIONS } from '../constants/assets.js'
import AssetTypeCombobox from './AssetTypeCombobox.jsx'

/**
 * Modal for editing an existing asset's details.
 * Props: isOpen, onClose, asset (current asset data), onSuccess.
 */
function EditAssetModal({ isOpen, onClose, asset, onSuccess }) {
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [condition, setCondition] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)

  const { updateAsset, isSubmitting } = useUpdateAsset()

  useEffect(() => {
    if (asset) {
      setName(asset.name || '')
      setAssetType(asset.assetType || '')
      setSerialNumber(asset.serialNumber || '')
      setCondition(asset.condition || '')
      setNotes(asset.notes || '')
    }
  }, [asset])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    try {
      const payload = {
        name,
        assetType,
        serialNumber,
        condition,
        notes: notes === '' ? undefined : notes,
      }

      await updateAsset(asset.id, payload)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update asset')
    }
  }

  function handleClose() {
    setError(null)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit Asset</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="edit-asset-name" className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="edit-asset-name"
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
                <label htmlFor="edit-asset-serial" className="block text-sm font-medium text-slate-700">
                  Serial number
                </label>
                <input
                  id="edit-asset-serial"
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="edit-asset-condition" className="block text-sm font-medium text-slate-700">
                  Condition
                </label>
                <select
                  id="edit-asset-condition"
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
                <label htmlFor="edit-asset-notes" className="block text-sm font-medium text-slate-700">
                  Notes (optional)
                </label>
                <textarea
                  id="edit-asset-notes"
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-1 max-h-[7.5rem] min-h-[7.5rem] w-full resize-none overflow-y-auto rounded-lg border border-slate-300 px-3 py-2 text-sm leading-5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Updating...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAssetModal
