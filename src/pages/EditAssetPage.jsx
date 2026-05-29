import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { ADMIN_ASSETS_PATH } from '../constants/routes.js'
import { ASSET_CONDITION_OPTIONS } from '../constants/assets.js'
import AssetTypeCombobox from '../components/AssetTypeCombobox.jsx'
import { useAsset } from '../hooks/useAsset.js'
import { useUpdateAsset } from '../hooks/useUpdateAsset.js'
import { toast } from '../utils/toast.js'
import { PageHeader, Spinner } from '../components/index.js'

/**
 * Normalizes asset form fields for dirty comparison.
 *
 * @param {{ name: string, assetType: string, serialNumber: string, condition: string, notes: string }} data
 * @returns {{ name: string, assetType: string, serialNumber: string, condition: string, notes: string }}
 */
function normalizeFormSnapshot(data) {
  return {
    name: data.name.trim(),
    assetType: data.assetType,
    serialNumber: data.serialNumber.trim(),
    condition: data.condition,
    notes: data.notes.trim(),
  }
}

/**
 * Returns true when current form values differ from the loaded asset.
 *
 * @param {{ name: string, assetType: string, serialNumber: string, condition: string, notes: string }} current
 * @param {{ name: string, assetType: string, serialNumber: string, condition: string, notes: string }} initial
 * @returns {boolean}
 */
function isFormDirty(current, initial) {
  const normalizedCurrent = normalizeFormSnapshot(current)
  const normalizedInitial = normalizeFormSnapshot(initial)

  return (
    normalizedCurrent.name !== normalizedInitial.name ||
    normalizedCurrent.assetType !== normalizedInitial.assetType ||
    normalizedCurrent.serialNumber !== normalizedInitial.serialNumber ||
    normalizedCurrent.condition !== normalizedInitial.condition ||
    normalizedCurrent.notes !== normalizedInitial.notes
  )
}

/**
 * Admin screen to edit an existing company asset.
 * Pre-populates the form with current asset values fetched by id.
 * Rendered at /admin/assets/:id/edit inside AdminLayout (admin role only).
 */
function EditAssetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { asset, isLoading, error } = useAsset(id)
  const { updateAsset, isSubmitting } = useUpdateAsset()

  const [formData, setFormData] = useState({
    name: '',
    assetType: '',
    serialNumber: '',
    condition: '',
    notes: '',
  })
  const [initialFormData, setInitialFormData] = useState(null)
  const [populated, setPopulated] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (asset && !populated) {
      const snapshot = {
        name: asset.name ?? '',
        assetType: asset.assetType ?? '',
        serialNumber: asset.serialNumber ?? '',
        condition: asset.condition ?? '',
        notes: asset.notes ?? '',
      }
      setFormData(snapshot)
      setInitialFormData(snapshot)
      setPopulated(true)
    }
  }, [asset, populated])

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }))
    }
    if (apiError) {
      setApiError(null)
    }
  }

  function validateForm() {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Asset name is required'
    }

    if (!formData.assetType) {
      errors.assetType = 'Asset type is required'
    }

    if (!formData.serialNumber.trim()) {
      errors.serialNumber = 'Serial number is required'
    }

    if (!formData.condition) {
      errors.condition = 'Condition is required'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setApiError(null)

    if (initialFormData && !isFormDirty(formData, initialFormData)) {
      toast.info('No changes were made. Update a field before saving.')
      return
    }

    try {
      await updateAsset(id, {
        name: formData.name.trim(),
        assetType: formData.assetType,
        serialNumber: formData.serialNumber.trim(),
        condition: formData.condition,
        notes: formData.notes.trim() || undefined,
      })

      toast.success('Asset updated successfully')
      navigate(ADMIN_ASSETS_PATH)
    } catch (err) {
      setApiError(err.message || 'Failed to update asset')
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to={ADMIN_ASSETS_PATH}
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory
      </Link>

      <div className="mt-6">
        <PageHeader
          title="Update Asset"
          subtitle="Edit the details of an existing company asset"
        />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error.message || 'Failed to load asset'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Asset Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Asset Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  fieldErrors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
                placeholder="Dell Latitude 5420"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Asset Type */}
              <div>
                <AssetTypeCombobox
                  label={<>Asset Type <span className="text-red-500">*</span></>}
                  value={formData.assetType}
                  onChange={(value) => handleChange('assetType', value)}
                  required
                />
                {fieldErrors.assetType && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.assetType}</p>
                )}
              </div>

              {/* Serial Number */}
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-slate-700">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleChange('serialNumber', e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                    fieldErrors.serialNumber
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                  placeholder="SN123456789"
                />
                {fieldErrors.serialNumber && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.serialNumber}</p>
                )}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-slate-700">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  fieldErrors.condition
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              >
                {ASSET_CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.condition && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.condition}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={5}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="mt-1 max-h-[7.5rem] min-h-[7.5rem] w-full resize-none overflow-y-auto rounded-lg border border-slate-300 px-3 py-2 text-sm leading-5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Any additional information about this asset..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(ADMIN_ASSETS_PATH)}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Updating...' : 'Update Asset'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default EditAssetPage
