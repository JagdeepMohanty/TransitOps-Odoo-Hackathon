import { Truck, Car, Wrench, Route, Users, BarChart3 } from 'lucide-react';
import PageShell from '@components/layout/PageShell';
import DashboardHeader from '@components/dashboard/DashboardHeader';
import StatCard from '@components/dashboard/StatCard';
import FleetOverviewChart from '@components/dashboard/FleetOverviewChart';
import VehicleStatusChart from '@components/dashboard/VehicleStatusChart';
import RecentTripsTable from '@components/dashboard/RecentTripsTable';
import DriverActivity from '@components/dashboard/DriverActivity';
import MaintenanceCard from '@components/dashboard/MaintenanceCard';
import QuickActions from '@components/dashboard/QuickActions';
import NotificationTimeline from '@components/dashboard/NotificationTimeline';

const KPI_CARDS = [
  {
    title: 'Active Vehicles',
    value: '6',
    description: 'Currently in operation',
    trend: 'up',
    trendValue: '+2 this month',
    icon: Truck,
    gradientFrom: '#3B82F6',
    gradientTo: '#1D4ED8',
  },
  {
    title: 'Available Vehicles',
    value: '4',
    description: 'Ready for dispatch',
    trend: 'up',
    trendValue: '+1 today',
    icon: Car,
    gradientFrom: '#22C55E',
    gradientTo: '#15803D',
  },
  {
    title: 'Vehicles In Shop',
    value: '1',
    description: 'Under maintenance',
    trend: 'down',
    trendValue: '-1 this week',
    icon: Wrench,
    gradientFrom: '#F59E0B',
    gradientTo: '#B45309',
  },
  {
    title: 'Active Trips',
    value: '3',
    description: 'Currently en route',
    trend: 'up',
    trendValue: '+18% vs last month',
    icon: Route,
    gradientFrom: '#8B5CF6',
    gradientTo: '#6D28D9',
  },
  {
    title: 'Drivers On Duty',
    value: '5',
    description: 'Active & on-trip',
    trend: 'up',
    trendValue: '+2 on trip',
    icon: Users,
    gradientFrom: '#22C55E',
    gradientTo: '#15803D',
  },
  {
    title: 'Fleet Utilization',
    value: '75%',
    description: '6 of 8 vehicles active',
    trend: 'up',
    trendValue: '+8% this month',
    icon: BarChart3,
    gradientFrom: '#6366F1',
    gradientTo: '#4338CA',
  },
];

export default function Dashboard() {
  return (
    <PageShell>
      <div className="space-y-8">

        {/* ── Header ── */}
        <DashboardHeader />

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {KPI_CARDS.map((card, i) => (
            <StatCard key={card.title} {...card} delay={i * 50} />
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <FleetOverviewChart />
          </div>
          <div>
            <VehicleStatusChart />
          </div>
        </div>

        {/* ── Recent Trips Table ── */}
        <RecentTripsTable />

        {/* ── Driver Activity + Quick Actions ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DriverActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* ── Maintenance ── */}
        <MaintenanceCard />

        {/* ── Notifications ── */}
        <NotificationTimeline />

      </div>
    </PageShell>
  );
}
