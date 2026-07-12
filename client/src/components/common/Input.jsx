import { cn } from '@/utils'

/**
 * Input
 * @prop {string}  label      — field label
 * @prop {string}  hint       — helper text below input
 * @prop {string}  error      — error message (turns border red)
 * @prop {node}    leftAddon  — icon/element inside left of input
 * @prop {node}    rightAddon — icon/element inside right of input
 * @prop {boolean} required   — shows red asterisk on label
 */
export default function Input({
  label,
  hint,
  error,
  leftAddon,
  rightAddon,
  required,
  className,
  id,
  ...props
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 leading-none">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftAddon && (
          <span className="absolute left-3 flex items-center text-slate-400 pointer-events-none">
            {leftAddon}
          </span>
        )}

        <input
          id={inputId}
          required={required}
          className={cn(
            'w-full h-9 px-3 text-sm bg-white border rounded-lg',
            'placeholder:text-slate-400 text-slate-900',
            'transition duration-150 outline-none',
            'focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            error
              ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300',
            leftAddon  && 'pl-9',
            rightAddon && 'pr-9',
            className,
          )}
          {...props}
        />

        {rightAddon && (
          <span className="absolute right-3 flex items-center text-slate-400 pointer-events-none">
            {rightAddon}
          </span>
        )}
      </div>

      {error && !hint && (
        <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
}
