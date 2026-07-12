import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
  id,
  label,
  hint,
  error,
  options      = [],
  placeholder  = 'Select an option',
  className    = '',
  wrapperClass = '',
  ...props
}) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClass}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          className={[
            'w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm appearance-none',
            'bg-bg-secondary border text-content-primary',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200 cursor-pointer',
            hasError
              ? 'border-danger focus:ring-danger/40'
              : 'border-border-input hover:border-border-strong focus:ring-border-focus/50',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              className="bg-bg-dropdown text-content-primary"
            >
              {opt.label ?? opt}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-disabled pointer-events-none" />
      </div>

      {hint  && !error && <p className="text-xs text-content-muted">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-danger-text">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}
