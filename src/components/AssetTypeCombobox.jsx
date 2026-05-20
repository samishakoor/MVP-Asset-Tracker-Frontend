import { useEffect, useId, useRef, useState } from 'react'
import { useAssetTypes } from '../hooks/useAssetTypes.js'
import { formatAssetTypeLabel, normalizeAssetTypeInput } from '../utils/assetType.js'

/**
 * Searchable asset type combobox with default options and custom type support.
 * Used on asset registration/edit forms and inventory filters.
 */
function AssetTypeCombobox({
  value,
  onChange,
  label,
  required,
  allowEmpty,
  emptyOptionLabel,
  disabled,
}) {
  const generatedId = useId()
  const inputId = `asset-type-combobox-${generatedId}`
  const listboxId = `asset-type-listbox-${generatedId}`
  const containerRef = useRef(null)

  const { allTypes, isLoading } = useAssetTypes()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedSearch = normalizeAssetTypeInput(searchQuery)
  const trimmedSearch = searchQuery.trim()

  const filteredOptions = allTypes.filter((option) => {
    const labelText = formatAssetTypeLabel(option).toLowerCase()
    const query = trimmedSearch.toLowerCase()
    return labelText.includes(query) || option.includes(normalizedSearch)
  })

  const canAddCustom =
    normalizedSearch.length > 0 && !allTypes.includes(normalizedSearch)

  const displayValue = isOpen
    ? searchQuery
    : value === ''
      ? allowEmpty
        ? emptyOptionLabel
        : ''
      : formatAssetTypeLabel(value)

  useEffect(() => {
    function handleDocumentMouseDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
    }
  }, [])

  function handleInputFocus() {
    if (disabled) {
      return
    }

    setIsOpen(true)
    setSearchQuery('')
  }

  function handleInputChange(event) {
    setSearchQuery(event.target.value)
    setIsOpen(true)
  }

  function handleSelectOption(optionValue) {
    onChange(optionValue)
    setSearchQuery('')
    setIsOpen(false)
  }

  function handleSelectCustomOption() {
    onChange(normalizedSearch)
    setSearchQuery('')
    setIsOpen(false)
  }

  function handleSelectEmptyOption() {
    onChange('')
    setSearchQuery('')
    setIsOpen(false)
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
    }

    if (event.key === 'Enter' && isOpen) {
      event.preventDefault()

      if (canAddCustom) {
        handleSelectCustomOption()
        return
      }

      if (filteredOptions.length > 0) {
        handleSelectOption(filteredOptions[0])
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        disabled={disabled || isLoading}
        placeholder={isLoading ? 'Loading types...' : 'Search or add a type'}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:opacity-60"
      />

      {required && (
        <input
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          value={value}
          required
          readOnly
          className="sr-only"
        />
      )}

      {isOpen && !disabled && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {allowEmpty && (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ''}
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleSelectEmptyOption}
                className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                {emptyOptionLabel}
              </button>
            </li>
          )}

          {filteredOptions.map((option) => (
            <li key={option} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelectOption(option)}
                className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-emerald-50"
              >
                {formatAssetTypeLabel(option)}
              </button>
            </li>
          ))}

          {canAddCustom && (
            <li role="presentation">
              <button
                type="button"
                role="option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleSelectCustomOption}
                className="w-full border-t border-slate-100 px-3 py-2 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Add &quot;{formatAssetTypeLabel(normalizedSearch)}&quot;
              </button>
            </li>
          )}

          {!allowEmpty && filteredOptions.length === 0 && !canAddCustom && (
            <li className="px-3 py-2 text-sm text-slate-500">No matching types</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default AssetTypeCombobox
