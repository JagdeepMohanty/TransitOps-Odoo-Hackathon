export default function FilterDropdown({ label, options = [], value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
    >
      <option value="">{label ? `All ${label}` : 'All'}</option>
      {options.map((opt) => {
        const val   = typeof opt === 'string' ? opt : opt.value
        const lbl   = typeof opt === 'string' ? opt : opt.label
        return <option key={val} value={val}>{lbl}</option>
      })}
    </select>
  )
}
