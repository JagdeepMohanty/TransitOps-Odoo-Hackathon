import { AlertCircle } from 'lucide-react';

export default function TextArea({
  id,
  label,
  hint,
  error,
  rows       = 4,
  maxLength,
  value      = '',
  className  = '',
  wrapperClass = '',
  ...props
}) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClass}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="input-label mb-0">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
          {maxLength && (
            <span className="text-xs text-content-disabled">
              {String(value).length}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={[
          'w-full px-3.5 py-2.5 rounded-xl text-sm resize-y',
          'bg-bg-secondary border text-content-primary',
          'placeholder:text-content-disabled',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-all duration-200',
          hasError
            ? 'border-danger focus:ring-danger/40'
            : 'border-border-input hover:border-border-strong focus:ring-border-focus/50',
          className,
        ].join(' ')}
        {...props}
      />

      {hint  && !error && <p className="text-xs text-content-muted">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-danger-text">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}
