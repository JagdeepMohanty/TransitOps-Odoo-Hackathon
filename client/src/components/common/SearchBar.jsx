import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search…',
  className   = '',
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-disabled pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full pl-10 pr-9 py-2.5 rounded-xl text-sm',
          'bg-bg-secondary border border-border-input text-content-primary',
          'placeholder:text-content-disabled',
          'hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-border-focus/50 focus:border-transparent',
          'transition-all duration-200',
        ].join(' ')}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => { onChange?.(''); onClear?.(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-content-disabled hover:text-content-secondary transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
