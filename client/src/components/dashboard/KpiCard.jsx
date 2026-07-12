import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard({ title, value, change, changeLabel, icon: Icon, iconBg }) {
  const isPositive = change >= 0
  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{Math.abs(change)}% {changeLabel}</span>
          </div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  )
}
