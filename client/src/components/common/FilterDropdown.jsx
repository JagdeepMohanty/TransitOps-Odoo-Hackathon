import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Filter } from 'lucide-react';

export default function FilterDropdown({
  label     = 'Filter',
  options   = [],
  value,
  onChange,
  multiple  = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isSelected = (opt) => {
    if (multiple) return Array.isArray(value) && value.includes(opt.value ?? opt);
    return value === (opt.value ?? opt);
  };

  const handleSelect = (opt) => {
    const v = opt.value ?? opt;
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onChange?.(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange?.(v === value ? null : v);
      setOpen(false);
    }
  };

  const activeCount = multiple
    ? (Array.isArray(value) ? value.length : 0)
    : (value ? 1 : 0);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium',
          'bg-bg-card border text-content-secondary',
          'hover:bg-bg-hover hover:text-content-primary hover:border-border-strong',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          'transition-all duration-200',
          activeCount > 0 ? 'border-primary/50 text-primary' : 'border-border',
        ].join(' ')}
      >
        <Filter className="w-4 h-4" />
        {label}
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-semibold">
            {activeCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 right-0 z-tooltip bg-bg-dropdown border border-border rounded-xl shadow-card-lg py-1 min-w-[180px] animate-fade-in">
          {options.map((opt) => {
            const label = opt.label ?? opt;
            const selected = isSelected(opt);
            return (
              <button
                key={opt.value ?? opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={[
                  'w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm',
                  'hover:bg-bg-hover transition-colors duration-100',
                  selected ? 'text-primary' : 'text-content-secondary hover:text-content-primary',
                ].join(' ')}
              >
                {label}
                {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
