import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/utils'

/**
 * SearchBar
 * @prop {string}   value        — controlled value
 * @prop {function} onChange     — called with string on every keystroke
 * @prop {function} onSearch     — called with string after debounce (default 300ms)
 * @prop {number}   debounce     — debounce delay in ms (default: 300)
 * @prop {string}   placeholder  — input placeholder
 * @prop {boolean}  loading      — shows spinner instead of search icon
 * @prop {string}   className    — wrapper class
 * @prop {string}   size         — sm | md | lg
 */
export default function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  debounce = 300,
  placeholder = 'Search…',
  loading = false,
  size = 'md',
  className,
}) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '')
  const isControlled = controlledValue !== undefined
  const value        = isControlled ? controlledValue : internalValue
  const timerRef     = useRef(null)
  const inputRef     = useRef(null)

  useEffect(() => {
    if (!onSearch) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(value), debounce)
    return () => clearTimeout(timerRef.current)
  }, [value, debounce, onSearch])

  const handleChange = (e) => {
    const v = e.target.value
    if (!isControlled) setInternalValue(v)
    onChange?.(v)
  }

  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    onChange?.('')
    onSearch?.('')
    inputRef.current?.focus()
  }

  const SIZES = {
    sm: 'h-8  text-xs pl-8  pr-8',
    md: 'h-9  text-sm pl-9  pr-9',
    lg: 'h-11 text-sm pl-10 pr-10',
  }
  const ICON_SIZES = { sm: 14, md: 15, lg: 17 }
  const ICON_LEFT  = { sm: 'left-2.5', md: 'left-3', lg: 'left-3.5' }
  const ICON_RIGHT = { sm: 'right-2.5', md: 'right-3', lg: 'right-3.5' }

  return (
    <div className={cn('relative flex items-center', className)}>
      {/* Left icon */}
      <span className={cn('absolute flex items-center text-slate-400 pointer-events-none', ICON_LEFT[size])}>
        {loading
          ? <Loader2 size={ICON_SIZES[size]} className="animate-spin" />
          : <Search size={ICON_SIZES[size]} />
        }
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-lg',
          'text-slate-900 placeholder:text-slate-400',
          'hover:border-slate-300 transition duration-150 outline-none',
          'focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
          SIZES[size],
        )}
      />

      {/* Clear button */}
      {value && !loading && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute flex items-center justify-center text-slate-400',
            'hover:text-slate-600 transition-colors rounded',
            ICON_RIGHT[size],
          )}
        >
          <X size={ICON_SIZES[size]} />
        </button>
      )}
    </div>
  )
}
