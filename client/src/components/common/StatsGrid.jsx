import Card from './Card'

/**
 * StatsGrid — renders a responsive grid of stat cards.
 * Eliminates the repeated stats bar pattern across all list pages.
 *
 * @prop {Array} stats — [{ label: string, value: string|number, color: string }]
 */
export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map(({ label, value, color }) => (
        <Card key={label} padding="sm" variant="flat">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className={`text-xl font-bold ${color}`}>{value}</p>
        </Card>
      ))}
    </div>
  )
}
