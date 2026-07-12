import { useState, useEffect, useCallback } from 'react'
import { Download, TrendingUp, TrendingDown, BarChart3, Fuel, Wrench, RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import PageHeader        from '@/components/layout/PageHeader'
import Breadcrumb        from '@/components/common/Breadcrumb'
import Button            from '@/components/common/Button'
import Table             from '@/components/common/Table'
import Loader            from '@/components/common/Loader'
import Card, { CardHeader } from '@/components/common/Card'
import { formatCurrency, formatNumber } from '@/utils'
import { reportsApi }    from '@/api/reports.api'
import { downloadVehicleReportCsv } from '@/utils/exportCsv'

const errMsg = (e) => e?.response?.data?.message ?? e?.message ?? 'Failed to load reports.'

const CHART_TOOLTIP = {
  contentStyle: { borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' },
  labelStyle:   { fontWeight: 600, color: '#1e293b' },
}
const AXIS_PROPS = { tick: { fontSize: 11, fill: '#94a3b8' }, axisLine: false, tickLine: false }

const PIE_COLORS = ['#2563eb', '#f59e0b', '#a855f7', '#ef4444', '#94a3b8']

const PERF_COLUMNS = [
  { key: 'registrationNumber', label: 'Vehicle', sortable: true,
    render: (v, row) => (
      <div>
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{v}</span>
        <p className="text-[11px] text-slate-400 mt-0.5">{row.vehicleName}</p>
      </div>
    )},
  { key: 'totalTrips',     label: 'Trips',       sortable: true, align: 'center',
    render: (v) => <span className="font-semibold text-slate-800">{v}</span> },
  { key: 'totalDistance',  label: 'Distance',    sortable: true, align: 'right',
    render: (v) => <span className="text-slate-700">{formatNumber(v)} km</span> },
  { key: 'totalFuelCost',  label: 'Fuel Cost',   sortable: true, align: 'right',
    render: (v) => <span className="font-medium text-blue-700">{formatCurrency(v)}</span> },
  { key: 'totalMaintenanceCost', label: 'Maint. Cost', sortable: true, align: 'right',
    render: (v) => <span className="font-medium text-amber-700">{formatCurrency(v)}</span> },
  { key: 'operationalCost', label: 'Op. Cost',   sortable: true, align: 'right',
    render: (v) => <span className="font-semibold text-slate-800">{formatCurrency(v)}</span> },
  { key: 'totalRevenue',   label: 'Revenue',     sortable: true, align: 'right',
    render: (v) => <span className="font-semibold text-green-700">{formatCurrency(v)}</span> },
  { key: 'fuelEfficiency', label: 'Efficiency',  sortable: true, align: 'center',
    render: (v) => {
      if (v == null) return <span className="text-slate-400">—</span>
      const val = parseFloat(v)
      return (
        <span className={`flex items-center justify-center gap-1 font-semibold text-sm ${val >= 8.5 ? 'text-green-600' : 'text-amber-600'}`}>
          {val >= 8.5 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {val.toFixed(2)} km/L
        </span>
      )
    }},
  { key: 'roi', label: 'ROI', sortable: true, align: 'center',
    render: (v) => {
      if (v == null) return <span className="text-slate-400">—</span>
      const val = parseFloat(v)
      return (
        <span className={`font-semibold text-sm ${val >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {val >= 0 ? '+' : ''}{val.toFixed(1)}%
        </span>
      )
    }},
]

export default function ReportsPage() {
  const [data,        setData]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [csvLoading,  setCsvLoading]  = useState(false)
  const [csvError,    setCsvError]    = useState(null)

  const fetchReports = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await reportsApi.getReports()
      setData(res.data.data)
    } catch (e) { setError(errMsg(e)) }
    finally     { setLoading(false) }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleCsvExport = async () => {
    setCsvLoading(true); setCsvError(null)
    try {
      await downloadVehicleReportCsv()
    } catch (e) { setCsvError(errMsg(e)) }
    finally     { setCsvLoading(false) }
  }

  // Derived aggregates from vehicle data
  const vehicles = data?.vehicles ?? []
  const totalRevenue    = vehicles.reduce((s, v) => s + (v.totalRevenue ?? 0), 0)
  const totalOpCost     = vehicles.reduce((s, v) => s + (v.operationalCost ?? 0), 0)
  const totalFuelCost   = vehicles.reduce((s, v) => s + (v.totalFuelCost ?? 0), 0)
  const totalMaintCost  = vehicles.reduce((s, v) => s + (v.totalMaintenanceCost ?? 0), 0)

  const kpiCards = [
    { label: 'Total Revenue',    value: formatCurrency(totalRevenue),   icon: BarChart3, bg: 'bg-brand-600'  },
    { label: 'Operational Cost', value: formatCurrency(totalOpCost),    icon: BarChart3, bg: 'bg-amber-500'  },
    { label: 'Fuel Costs',       value: formatCurrency(totalFuelCost),  icon: Fuel,      bg: 'bg-blue-500'   },
    { label: 'Maintenance Cost', value: formatCurrency(totalMaintCost), icon: Wrench,    bg: 'bg-red-500'    },
  ]

  // Pie chart: expense split
  const expenseSplit = [
    { name: 'Fuel',        value: totalFuelCost,  color: '#2563eb' },
    { name: 'Maintenance', value: totalMaintCost, color: '#f59e0b' },
    { name: 'Other',       value: vehicles.reduce((s, v) => s + (v.totalOtherCost ?? 0), 0), color: '#94a3b8' },
  ].filter(d => d.value > 0)

  // Bar chart: top 6 vehicles by operational cost
  const barData = [...vehicles]
    .sort((a, b) => b.operationalCost - a.operationalCost)
    .slice(0, 6)
    .map(v => ({
      name:        v.registrationNumber,
      fuel:        v.totalFuelCost,
      maintenance: v.totalMaintenanceCost,
      other:       v.totalOtherCost,
    }))

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Reports' }]} />

      <PageHeader
        title="Reports"
        subtitle="Operational analytics, cost breakdowns, and fleet performance insights."
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchReports} loading={loading}>
              Refresh
            </Button>
            <Button
              variant="secondary" size="sm"
              leftIcon={<Download size={14} />}
              loading={csvLoading}
              onClick={handleCsvExport}
            >
              Export CSV
            </Button>
          </>
        }
      />

      {csvError && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{csvError}</div>
      )}

      {loading ? (
        <Loader variant="spinner" size="lg" label="Generating report…" fullPage />
      ) : error ? (
        <div className="p-10 text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button size="sm" variant="secondary" onClick={fetchReports}>Retry</Button>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpiCards.map(({ label, value, icon: Icon, bg }) => (
              <Card key={label} variant="flat">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card
              className="lg:col-span-2"
              header={<CardHeader title="Cost Breakdown by Vehicle" subtitle="Fuel, maintenance & other expenses" />}
            >
              {barData.length === 0 ? (
                <div className="flex items-center justify-center h-[240px] text-sm text-slate-400">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barData} barSize={14} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip {...CHART_TOOLTIP} formatter={(v) => [formatCurrency(v)]} />
                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="fuel"        fill="#2563eb" radius={[3,3,0,0]} name="Fuel"        />
                    <Bar dataKey="maintenance" fill="#f59e0b" radius={[3,3,0,0]} name="Maintenance" />
                    <Bar dataKey="other"       fill="#94a3b8" radius={[3,3,0,0]} name="Other"       />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card header={<CardHeader title="Expense Split" subtitle="By category" />}>
              {expenseSplit.length === 0 ? (
                <div className="flex items-center justify-center h-[240px] text-sm text-slate-400">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={expenseSplit} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {expenseSplit.map((entry, i) => <Cell key={entry.name} fill={entry.color ?? PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...CHART_TOOLTIP} formatter={(v) => [formatCurrency(v)]} />
                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Fleet utilization */}
          {data?.fleetUtilization != null && (
            <Card variant="flat">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fleet Utilization</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{data.fleetUtilization}%</p>
                </div>
                <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all"
                    style={{ width: `${Math.min(data.fleetUtilization, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Vehicle performance table */}
          <Card
            padding="none"
            header={
              <div className="px-5 py-4">
                <CardHeader
                  title="Vehicle Performance"
                  subtitle="Trips, costs, efficiency and ROI per vehicle"
                  actions={
                    <Button variant="secondary" size="sm" leftIcon={<Download size={13} />} loading={csvLoading} onClick={handleCsvExport}>
                      Export CSV
                    </Button>
                  }
                />
              </div>
            }
          >
            <Table
              columns={PERF_COLUMNS}
              data={vehicles}
              emptyTitle="No vehicle data"
              emptyDesc="Vehicle performance data will appear once trips and fuel logs are recorded."
            />
          </Card>
        </>
      )}
    </div>
  )
}
