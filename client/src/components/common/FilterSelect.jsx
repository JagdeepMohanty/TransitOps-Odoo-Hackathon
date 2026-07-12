import Select from './Select'

/**
 * FilterSelect — a compact labeled select for filter dropdowns.
 * Wraps Select with a horizontal label layout suitable for toolbars.
 *
 * @prop {string} label    — label shown before the select
 * @prop {Array}  options  — [{ value, label }]
 * @prop {string} value    — controlled value
 * @prop {function} onChange — native change event handler
 */
export default function FilterSelect({ label, ...props }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{label}</span>}
      <Select {...props} />
    </div>
  )
}
