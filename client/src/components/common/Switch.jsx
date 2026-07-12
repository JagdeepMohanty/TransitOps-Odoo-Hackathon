export default function Switch({
  id,
  label,
  hint,
  checked   = false,
  onChange,
  disabled  = false,
  className = '',
  wrapperClass = '',
}) {
  return (
    <div className={`flex flex-col gap-1 ${wrapperClass}`}>
      <label htmlFor={id} className="inline-flex items-center gap-3 cursor-pointer group">
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent',
            'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            checked ? 'bg-primary' : 'bg-border',
            className,
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md',
              'transform transition-transform duration-200',
              checked ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
        {label && (
          <span className="text-sm text-content-secondary group-hover:text-content-primary transition-colors duration-150">
            {label}
          </span>
        )}
      </label>
      {hint && <p className="text-xs text-content-muted ml-14">{hint}</p>}
    </div>
  );
}
