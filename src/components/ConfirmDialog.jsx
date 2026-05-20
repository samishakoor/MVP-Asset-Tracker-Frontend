import Modal from './Modal.jsx'

/**
 * Confirmation dialog with Cancel and Confirm buttons.
 * Modal variant for destructive or important actions.
 * Confirm button is styled red by default for danger actions.
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmingLabel,
  isConfirming,
}) {
  const resolvedConfirmLabel = confirmLabel === undefined ? 'Confirm' : confirmLabel
  const resolvedConfirmingLabel =
    confirmingLabel === undefined ? 'Please wait...' : confirmingLabel

  function handleConfirm() {
    onConfirm()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? resolvedConfirmingLabel : resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
