import { useState } from 'react'
import { Download, TrendingUp, TrendingDown, BarChart3, Fuel, Wrench, DollarSign } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import PageHeader  from '@/components/layout/PageHeader'
import Breadcrumb  from '@/components/common/Breadcrumb'
import Button      from '@/components/common/Button'
import Select      from '@/components/common/Select'
import Table       from '@/components/common/Table'
import Loader      from '@/components/common/Loader'
import Card, { CardHeader } from '@/components/common/Card'
import { formatCurrency } from '@/utils'

/* ── Dummy chart data ───────────────────────────────────────────── */
const MONTHLY_COST = [
  { month: 'Apr', fuel: 18000, maintenance: 6000, toll: 1200, other: 3000 },
  { month: 'May', fuel: 16500, maintenance: 4200, toll: 980,  other: 2800 },
  { month: 'Jun', fuel: 21000, maintenance: 8500, toll: 1450, other: 3600 },
  { month: 'Jul', fuel: 19800, maintenance: 5600, toll: 1100, other: 3200 },
  { month: 'Aug', fuel: 22500, maintenance: 7200, toll: 1600, other: 4100 },
  { month: 'Sep', fuel: 20100, maintenance: 6800, toll: 1350, other: 3900 },
]

const FUEL_EFFICIENCY = [
  { month: 'Apr', efficiency: 8.2, target: 8.5 },
  { month: 'May', efficiency: 8.5, target: 8.5 },
  { month: 'Jun', efficiency: 7.9, target: 8.5 },
  { month: 'Jul', efficiency: 8.8, target: 8.5 },
  { month: 'Aug', efficiency: 9.1, target: 8.5 },
  { month: 'Sep', efficiency: 8.6, target: 8.5 },
]

const TRIP_VOLUME = [
  { month: 'Apr', completed: 180, cancelled: 12, scheduled: 20 },
  { month: 'May', completed: 195, cancelled: 8,  scheduled: 18 },
  { month: 'Jun', completed: 210, cancelled: 15, scheduled: 25 },
  { month: 'Jul', completed: 225, cancelled: 10, scheduled: 22 },
  { month: 'Aug', completed: 240, cancelled: 9,  scheduled: 30 },
  { month: 'Sep', completed: 234, cancelled: 11, scheduled: 28 },
]

const EXPENSE_SPLIT = [
  { name: 'Fuel',        value: 118000, color: '#2563eb' },
  { name: 'Maintenance', value: 38300,  color: '#f59e0b' },
  { name: 'Insurance',   value: 16800,  color: '#22c55e' },
  { name: 'Toll',        color: '#a855f7', value: 7680  },
  { name: 'Other',       value: 19000,  color: '#94a3b8' },
]

const VEHICLE_PERF = [
  { id: 'V-001', plate: 'LG-001-AA', make: 'Toyota Coaster',    trips: 142, distance: '68,420 km', fuelCost: 18200, maintCost: 4800, efficiency: '9.1 km/L', uptime: '94%' },
  { id: 'V-002', plate: 'AB-002-BB', make: 'Mercedes Sprinter', trips: 98,  distance: '42,100 km', fuelCost: 14600, maintCost: 9200, efficiency: '7.8 km/L', uptime: '78%' },
  { id: 'V-003', plate: 'KN-003-CC', make: 'Ford Transit',      trips: 76,  distance: '28,500 km', fuelCost: 9800,  maintCost: 2400, efficiency: '8.6 km/L', uptime: '91%' },
  { id: 'V-004', plate: 'LG-004-DD', make: 'Iveco Daily',       trips: 55,  distance: '21,300 km', fuelCost: 8200,  maintCost: 6800, efficiency: '7.2 km/L', uptime: '65%' },
  { id: 'V-005', plate: 'PH-005-EE', make: 'Toyota Hiace',      trips: 110, distance: '38,900 km', fuelCost: 12400, maintCost: 3600, efficiency: '8.9 km/L', uptime: '88%' },
]

const KPI_CARDS = [
  { label: 'Total Revenue',    value: '$284,500', change: +12.4, icon: DollarSign, bg: 'bg-brand-600'  },
  { label: 'Total Expenses',   value: '$199,780', change: -3.2,  icon: BarChart3,  bg: 'bg-amber-500'  },
  { label: 'Fuel Costs',       value: '$118,000', change: +5.1,  icon: Fuel,       bg: 'bg-blue-500'   },
  { label: 'Maintenance Cost', value: '$38,300',  change: -8.7,  icon: Wrench,     bg: 'bg-red-500'    },
]

const DATE_RANGES = [
  { value: '30d',  label: 'Last 30 days'  },
  { value: '90d',  label: 'Last 90 days'  },
  { value: '6m',   label: 'Last 6 months' },
  { value: '1y',   label: 'Last 1 year'   },
]

const CHART_TOOLTIP = {
  contentStyle: { borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' },
  labelStyle:   { fontWeight: 600, color: '#1e293b' },
}
const AXIS_PROPS = { tick: { fontSize: 11, fill: '#94a3b8' }, axisLine: false, tickLine: false }

const PERF_COLUMNS = [
  { key: 'plate',      label: 'Vehicle',    sortable: true,
    render: (v, row) => (
      <div>
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{v}</span>
        <p className="text-[11px] text-slate-400 mt-0.5">{row.make}</p>
      </div>
    )},
  { key: 'trips',      label: 'Trips',      sortable: true, align: 'center',
    render: (v) => <span className="font-semibold text-slate-800">{v}</span> },
  { key: 'distance',   label: 'Distance',   sortable: true, align: 'right',
    render: (v) => <span className="text-slate-700">{v}</span> },
  { key: 'fuelCost',   label: 'Fuel Cost',  sortable: true, align: 'right',
    render: (v) => <span className="font-medium text-blue-700">{formatCurrency(v)}</span> },
  { key: 'maintCost',  label: 'Maint. Cost',sortable: true, align: 'right',
    render: (v) => <span className="font-medium text-amber-700">{formatCurrency(v)}</span> },
  { key: 'efficiency', label: 'Efficiency', sortable: true, align: 'center',
    render: (v) => {
      const val = parseFloat(v)
      return (
        <span className={`flex items-center justify-center gap-1 font-semibold text-sm ${val >= 8.5 ? 'text-green-600' : 'text-amber-600'}`}>
          {val >= 8.5 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {v}
        </span>
      )
    }},
  { key: 'uptime',     label: 'Uptime',     sortable: true, align: 'center',
    render: (v) => {
      const pct = parseInt(v)
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct >= 85 ? 'bg-green-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: v }} />
          </div>
          <span className={`text-xs font-semibold ${pct >= 85 ? 'text-green-600' : pct >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{v}</span>
        </div>
      )
    }},
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('6m')
  const [loading,   setLoading]   = useState(false)

  const handleRangeChange = (v) => {
    setLoading(true); setDateRange(v)
    setTimeout(() => setLoading(false), 700)
  }

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Reports' }]} />

      <PageHeader
        title="Reports"
        subtitle="Operational analytics, cost breakdowns, and fleet performance insights."
        actions={
          <>
            <Select
              options={DATE_RANGES}
              value={dateRange}
              onChange={(e) => handleRangeChange(e.target.value)}
              placeholder={null}
              className="w-40 h-9 text-sm"
            />
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export CSV</Button>
            <Button size="sm" leftIcon={<Download size={14} />}>Export PDF</Button>
          </>
        }
      />

      {loading ? (
        <Loader variant="spinner" size="lg" label="Generating report…" fullPage />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {KPI_CARDS.map(({ label, value, change, icon: Icon, bg }) => {
              const positive = change >= 0
              return (
                <Card key={label} variant="flat">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                      <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
                        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(change)}% vs last period
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={18} className="text-white" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Cost breakdown — 2/3 width */}
            <Card
              className="lg:col-span-2"
              header={<CardHeader title="Monthly Cost Breakdown" subtitle="Fuel, maintenance, toll & other expenses" />}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MONTHLY_COST} barSize={14} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip {...CHART_TOOLTIP} formatter={(v) => [`$${v.toLocaleString()}`]} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="fuel"        fill="#2563eb" radius={[3,3,0,0]} name="Fuel"        />
                  <Bar dataKey="maintenance" fill="#f59e0b" radius={[3,3,0,0]} name="Maintenance" />
                  <Bar dataKey="toll"        fill="#a855f7" radius={[3,3,0,0]} name="Toll"        />
                  <Bar dataKey="other"       fill="#94a3b8" radius={[3,3,0,0]} name="Other"       />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Expense split — 1/3 width */}
            <Card header={<CardHeader title="Expense Split" subtitle="By category" />}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={EXPENSE_SPLIT} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {EXPENSE_SPLIT.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} formatter={(v) => [formatCurrency(v)]} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Fuel efficiency */}
            <Card header={<CardHeader title="Fuel Efficiency" subtitle="km/L vs 8.5 km/L target" />}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={FUEL_EFFICIENCY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} domain={[7, 10]} tickFormatter={(v) => `${v}`} />
                  <Tooltip {...CHART_TOOLTIP} formatter={(v) => [`${v} km/L`]} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="efficiency" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} name="Actual" />
                  <Line type="monotone" dataKey="target"     stroke="#e2e8f0" strokeWidth={2}   strokeDasharray="5 4" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Trip volume */}
            <Card header={<CardHeader title="Trip Volume" subtitle="Completed, cancelled & scheduled" />}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={TRIP_VOLUME}>
                  <defs>
                    <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px' }} />
                  <Area  type="monotone" dataKey="completed"  stroke="#2563eb" strokeWidth={2} fill="url(#gradCompleted)" name="Completed"  />
                  <Line  type="monotone" dataKey="cancelled"  stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Cancelled"  />
                  <Line  type="monotone" dataKey="scheduled"  stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Scheduled"  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Vehicle performance table */}
          <Card
            padding="none"
            header={
              <div className="px-5 py-4">
                <CardHeader
                  title="Vehicle Performance"
                  subtitle="Trips, costs, efficiency and uptime per vehicle"
                  actions={<Button variant="secondary" size="sm" leftIcon={<Download size={13} />}>Export</Button>}
                />
              </div>
            }
          >
            <Table
              columns={PERF_COLUMNS}
              data={VEHICLE_PERF}
              emptyTitle="No vehicle data"
              emptyDesc="Vehicle performance data will appear here."
            />
          </Card>
        </>
      )}
    </div>
  )
}
