import { useState, useEffect, useCallback } from 'react'
import { Route, Truck, Users, Activity, RefreshCw } from 'lucide-react'
import { getKpis } from '@/api/dashboard.api'
import KpiCard           from '@/components/dashboard/KpiCard'
import RecentTrips       from '@/components/dashboard/RecentTrips'
import VehicleStatusChart from '@/components/dashboard/VehicleStatusChart'
import ExpenseChart      from '@/components/dashboard/ExpenseChart'
import Button            from '@/components/common/Button'

const errMsg = (e) => e?.response?.data?.message ?? e?.message ?? 'Failed to load KPIs.'

export default function DashboardPage() {
  const [kpis,    setKpis]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchKpis = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await getKpis()
      setKpis(res.data.data)
    } catch (e) { setError(errMsg(e)) }
    finally     { setLoading(false) }
  }, [])

  useEffect(() => { fetchKpis() }, [fetchKpis])

  const kpiCards = kpis ? [
    { title: 'Active Vehicles',    value: `${kpis.activeVehicles} / ${kpis.totalVehicles}`, icon: Truck,    iconBg: 'bg-emerald-500' },
    { title: 'Available Vehicles', value: kpis.availableVehicles,                           icon: Truck,    iconBg: 'bg-brand-600'   },
    { title: 'In Maintenance',     value: kpis.vehiclesInMaintenance,                       icon: Activity, iconBg: 'bg-amber-500'   },
    { title: 'Active Trips',       value: kpis.activeTrips,                                 icon: Route,    iconBg: 'bg-violet-500'  },
    { title: 'Pending Trips',      value: kpis.pendingTrips,                                icon: Route,    iconBg: 'bg-slate-500'   },
    { title: 'Available Drivers',  value: kpis.availableDrivers,                            icon: Users,    iconBg: 'bg-blue-500'    },
    { title: 'Fleet Utilization',  value: `${kpis.fleetUtilization}%`,                      icon: Activity, iconBg: 'bg-rose-500'    },
  ] : []

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchKpis} loading={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <Button size="sm" variant="secondary" onClick={fetchKpis}>Retry</Button>
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <VehicleStatusChart kpis={kpis} />
      </div>

      {/* Recent Trips */}
      <RecentTrips />
    </div>
  )
}
