import { cn } from '@/utils'

/**
 * Textarea
 * @prop {string}  label      — field label
 * @prop {string}  hint       — helper text
 * @prop {string}  error      — error message
 * @prop {boolean} required   — shows asterisk
 * @prop {number}  maxLength  — enables character counter
 * @prop {number}  rows       — visible rows (default: 4)
 * @prop {boolean} resize     — allow manual resize (default: false)
 */
export default function Textarea({
  label,
  hint,
  error,
  required,
  maxLength,
  rows = 4,
  resize = false,
  className,
  id,
  value,
  ...props
}) {
  const inputId    = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const charCount  = typeof value === 'string' ? value.length : 0

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 leading-none">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        required={required}
        maxLength={maxLength}
        value={value}
        className={cn(
          'w-full px-3 py-2.5 text-sm bg-white border rounded-lg',
          'placeholder:text-slate-400 text-slate-900 leading-relaxed',
          'transition duration-150 outline-none',
          'focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
          !resize && 'resize-none',
          error
            ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
            : 'border-slate-200 hover:border-slate-300',
          className,
        )}
        {...props}
      />

      <div className="flex items-center justify-between">
        <div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
        {maxLength && (
          <p className={cn('text-xs tabular-nums', charCount >= maxLength ? 'text-red-500' : 'text-slate-400')}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
