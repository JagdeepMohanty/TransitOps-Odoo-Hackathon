import { useState } from 'react';
import { Activity, Fuel, DollarSign, TrendingUp, BarChart2, Target, Route, Zap } from 'lucide-react';

import ReportsHeader          from '@components/reports/ReportsHeader';
import AnalyticsStatCard      from '@components/reports/AnalyticsStatCard';
import FleetUtilizationChart  from '@components/reports/FleetUtilizationChart';
import FuelEfficiencyChart    from '@components/reports/FuelEfficiencyChart';
import OperationalCostChart   from '@components/reports/OperationalCostChart';
import VehicleROIChart        from '@components/reports/VehicleROIChart';
import FleetPerformanceCards  from '@components/reports/FleetPerformanceCards';
import TopVehiclesLeaderboard from '@components/reports/TopVehiclesLeaderboard';
import LowPerformingVehicles  from '@components/reports/LowPerformingVehicles';
import AnalyticsTable         from '@components/reports/AnalyticsTable';
import InsightsPanel          from '@components/reports/InsightsPanel';
import RecentReportsTimeline  from '@components/reports/RecentReportsTimeline';
import QuickActions           from '@components/reports/QuickActions';

import { KPI_DATA, SPARKLINE_DATA } from '@utils/reportsMockData';

const KPI_CARDS = [
  { key: 'fleetUtilization', icon: 'Activity',   color: 'primary' },
  { key: 'fuelEfficiency',   icon: 'Fuel',        color: 'info'    },
  { key: 'operationalCost',  icon: 'DollarSign',  color: 'warning' },
  { key: 'vehicleROI',       icon: 'TrendingUp',  color: 'accent'  },
  { key: 'totalRevenue',     icon: 'BarChart2',   color: 'success' },
  { key: 'netProfit',        icon: 'Target',      color: 'success' },
  { key: 'avgTripDistance',  icon: 'Route',       color: 'primary' },
  { key: 'totalFuelUsed',    icon: 'Zap',         color: 'danger'  },
];

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="h-px flex-1 bg-border/40" />
      <span className="text-[10px] font-semibold text-content-muted uppercase tracking-widest px-2">{children}</span>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  );
}

export default function ReportsAnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <ReportsHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* ── KPI Cards ── */}
      <SectionLabel>Key Performance Indicators</SectionLabel>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ key, icon, color }) => {
          const d = KPI_DATA[key];
          return (
            <AnalyticsStatCard
              key={key}
              label={d.label}
              value={d.value}
              unit={d.unit}
              trend={d.trend}
              sparkline={SPARKLINE_DATA[key]}
              icon={icon}
              color={color}
            />
          );
        })}
      </div>

      {/* ── Fleet Utilization Trend ── */}
      <SectionLabel>Fleet Utilization Trend</SectionLabel>
      <FleetUtilizationChart />

      {/* ── Fuel + Cost side by side ── */}
      <SectionLabel>Fuel & Cost Analytics</SectionLabel>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FuelEfficiencyChart />
        <OperationalCostChart />
      </div>

      {/* ── Vehicle ROI ── */}
      <SectionLabel>Vehicle ROI Analysis</SectionLabel>
      <VehicleROIChart />

      {/* ── Fleet Performance ── */}
      <SectionLabel>Fleet Performance Dashboard</SectionLabel>
      <FleetPerformanceCards />

      {/* ── Leaderboard + Low Performers ── */}
      <SectionLabel>Vehicle Rankings</SectionLabel>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TopVehiclesLeaderboard />
        <LowPerformingVehicles />
      </div>

      {/* ── Analytics Table ── */}
      <SectionLabel>Analytics Table</SectionLabel>
      <AnalyticsTable />

      {/* ── Bottom Row: Insights + Timeline + Quick Actions ── */}
      <SectionLabel>Intelligence & Actions</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <InsightsPanel />
        </div>
        <div className="space-y-4">
          <RecentReportsTimeline />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
