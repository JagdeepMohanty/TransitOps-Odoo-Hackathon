import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  id,
  label,
  hint,
  error,
  className    = '',
  wrapperClass = '',
  ...props
}) {
  const [show, setShow] = useState(false);
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
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={[
            'w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm',
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
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-disabled hover:text-content-secondary transition-colors duration-150"
          tabIndex={-1}
        >
          {show
            ? <EyeOff className="w-4 h-4" />
            : <Eye className="w-4 h-4" />
          }
        </button>
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
