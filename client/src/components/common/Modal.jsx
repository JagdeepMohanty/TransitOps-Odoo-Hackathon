import { useEffect, useRef } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils'
import Button from './Button'

const SIZES = {
  sm:   'sm:max-w-sm',
  md:   'sm:max-w-lg',
  lg:   'sm:max-w-2xl',
  xl:   'sm:max-w-4xl',
  full: 'sm:max-w-[95vw]',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  footer,
  danger = false,
  hideClose = false,
  children,
  className,
}) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, centered card on sm+ */}
      <div className={cn(
        'relative w-full bg-white flex flex-col z-10',
        // Mobile: full-width bottom sheet with rounded top corners, max 90vh
        'rounded-t-2xl max-h-[90vh]',
        // sm+: centered card with all rounded corners, constrained width
        'sm:rounded-2xl sm:shadow-2xl',
        SIZES[size],
        className,
      )}>
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className={cn(
          'flex items-start justify-between px-5 py-4 border-b border-slate-100 shrink-0',
          danger && 'bg-red-50 border-red-100',
        )}>
          <div className="flex items-start gap-3">
            {danger && (
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
            )}
            <div>
              <h3
                id="modal-title"
                className={cn('text-base font-semibold leading-tight', danger ? 'text-red-900' : 'text-slate-900')}
              >
                {title}
              </h3>
              {subtitle && (
                <p className={cn('text-sm mt-0.5', danger ? 'text-red-600' : 'text-slate-500')}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {!hideClose && (
            <button
              onClick={onClose}
              className="p-1.5 -mr-1 -mt-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap bg-slate-50/60 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmModal({
  isOpen, onClose, onConfirm,
  title = 'Are you sure?', description,
  confirmLabel = 'Confirm', loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={title} subtitle={description}
      size="sm" danger
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger"    size="sm" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    />
  )
}
