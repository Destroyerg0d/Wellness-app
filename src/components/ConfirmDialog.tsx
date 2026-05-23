import { cn } from '../lib/cn'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="mb-[10vh] w-full max-w-[24rem] rounded-3xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 leading-relaxed text-ink-soft">{message}</p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-2xl bg-sand font-display font-semibold text-ink transition active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'min-h-11 flex-1 rounded-2xl font-display font-semibold text-white transition active:scale-[0.98]',
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-coral-500 hover:bg-coral-600',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
