import { AlertCircle } from 'lucide-react';

export default function Input({
  id,
  label,
  hint,
  error,
  icon,
  iconRight,
  className = '',
  wrapperClass = '',
  ...props
}) {
  const Icon      = icon;
  const IconRight = iconRight;
  const hasError  = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClass}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-disabled pointer-events-none" />
        )}

        <input
          id={id}
          className={[
            'w-full py-2.5 rounded-xl text-sm',
            'bg-bg-secondary border text-content-primary',
            'placeholder:text-content-disabled',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200',
            Icon      ? 'pl-10' : 'pl-3.5',
            IconRight ? 'pr-10' : 'pr-3.5',
            hasError
              ? 'border-danger focus:ring-danger/40'
              : 'border-border-input hover:border-border-strong focus:ring-border-focus/50',
            className,
          ].join(' ')}
          {...props}
        />

        {IconRight && !hasError && (
          <IconRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-disabled pointer-events-none" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-danger pointer-events-none" />
        )}
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
