import { Route, Truck, Users, DollarSign } from 'lucide-react'
import KpiCard from '@/components/dashboard/KpiCard'
import RecentTrips from '@/components/dashboard/RecentTrips'
import VehicleStatusChart from '@/components/dashboard/VehicleStatusChart'
import ExpenseChart from '@/components/dashboard/ExpenseChart'

const KPI_DATA = [
  { title: 'Total Trips',      value: '1,284',   change: 12,  changeLabel: 'vs last month', icon: Route,      iconBg: 'bg-brand-600' },
  { title: 'Active Vehicles',  value: '18 / 26', change: 0,   changeLabel: 'no change',     icon: Truck,      iconBg: 'bg-emerald-500' },
  { title: 'Active Drivers',   value: '34',      change: 5,   changeLabel: 'vs last month', icon: Users,      iconBg: 'bg-violet-500' },
  { title: 'Monthly Expenses', value: '$49,100', change: -8,  changeLabel: 'vs last month', icon: DollarSign, iconBg: 'bg-amber-500' },
]

export default function DashboardPage() {
  return (
    <div className="page-container">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <VehicleStatusChart />
      </div>

      {/* Recent Trips */}
      <RecentTrips />
    </div>
  )
}
