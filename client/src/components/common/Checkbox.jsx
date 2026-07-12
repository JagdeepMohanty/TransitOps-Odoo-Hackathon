export default function Checkbox({
  id,
  label,
  hint,
  error,
  className    = '',
  wrapperClass = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 ${wrapperClass}`}>
      <label htmlFor={id} className="inline-flex items-center gap-2.5 cursor-pointer group">
        <input
          id={id}
          type="checkbox"
          className={[
            'w-4 h-4 rounded border-border-input bg-bg-secondary',
            'text-primary focus:ring-2 focus:ring-border-focus focus:ring-offset-2 focus:ring-offset-bg-base',
            'transition-all duration-150 cursor-pointer',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...props}
        />
        {label && (
          <span className="text-sm text-content-secondary group-hover:text-content-primary transition-colors duration-150">
            {label}
          </span>
        )}
      </label>
      {hint  && !error && <p className="text-xs text-content-muted ml-6">{hint}</p>}
      {error && <p className="text-xs text-danger-text ml-6">{error}</p>}
    </div>
  );
}
