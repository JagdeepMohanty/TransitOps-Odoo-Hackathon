import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils'

const DATA = [
  { month: 'Apr', amount: 42000 },
  { month: 'May', amount: 38500 },
  { month: 'Jun', amount: 51200 },
  { month: 'Jul', amount: 47800 },
  { month: 'Aug', amount: 55300 },
  { month: 'Sep', amount: 49100 },
]

export default function ExpenseChart() {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={DATA} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip formatter={(v) => [formatCurrency(v), 'Expenses']} />
          <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
