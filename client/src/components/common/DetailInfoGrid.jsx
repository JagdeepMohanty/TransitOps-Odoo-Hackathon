/**
 * DetailInfoGrid — renders a responsive grid of icon + label + value cells.
 * Eliminates the repeated pattern in all detail modals.
 *
 * @prop {Array}  fields  — [{ icon: LucideIcon, label: string, value: string|node }]
 * @prop {number} cols    — grid columns (default: 2)
 */
export default function DetailInfoGrid({ fields, cols = 2 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-3`}>
      {fields.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
            <Icon size={13} className="text-slate-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
