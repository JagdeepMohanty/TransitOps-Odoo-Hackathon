import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils'

/**
 * Select
 * @prop {string}   label       — field label
 * @prop {string}   hint        — helper text
 * @prop {string}   error       — error message
 * @prop {boolean}  required    — shows asterisk
 * @prop {string}   placeholder — first disabled option (default: 'Select an option')
 * @prop {Array}    options     — [{ value, label, disabled? }]
 * @prop {node}     leftAddon   — icon inside left of select
 */
export default function Select({
  label,
  hint,
  error,
  required,
  placeholder = 'Select an option',
  options = [],
  leftAddon,
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
          <span className="absolute left-3 flex items-center text-slate-400 pointer-events-none z-10">
            {leftAddon}
          </span>
        )}

        <select
          id={inputId}
          required={required}
          className={cn(
            'w-full h-9 pr-9 text-sm bg-white border rounded-lg appearance-none',
            'text-slate-900 transition duration-150 outline-none cursor-pointer',
            'focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            error
              ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
              : 'border-slate-200 hover:border-slate-300',
            leftAddon ? 'pl-9' : 'pl-3',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label: optLabel, disabled }) => (
            <option key={value} value={value} disabled={disabled}>
              {optLabel}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="absolute right-3 text-slate-400 pointer-events-none"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
