import { useState, useMemo } from 'react';
import { Users, UserCheck, Truck, Ban, AlertTriangle, Shield, X } from 'lucide-react';
import PageShell from '@components/layout/PageShell';
import DriverHeader from '@components/drivers/DriverHeader';
import DriverStatCard from '@components/drivers/DriverStatCard';
import DriverAnalyticsChart from '@components/drivers/DriverAnalyticsChart';
import LicenseExpiryChart from '@components/drivers/LicenseExpiryChart';
import DriverTable from '@components/drivers/DriverTable';
import DriverProfileDrawer from '@components/drivers/DriverProfileDrawer';
import DriverFormModal from '@components/drivers/DriverFormModal';
import SafetyTimeline from '@components/drivers/SafetyTimeline';
import { DRIVER_PROFILES } from '@utils/driverMockData';

// ─── Suspend Confirm Modal ────────────────────────────────────
function SuspendModal({ driver, onConfirm, onClose }) {
  if (!driver) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border rounded-[20px] shadow-modal w-full max-w-sm animate-fade-up p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <Ban className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primary">Suspend Driver</h3>
            <p className="text-xs text-content-muted">This action will restrict trip assignments</p>
          </div>
        </div>
        <p className="text-sm text-content-secondary mb-6">
          Are you sure you want to suspend <span className="font-semibold text-content-primary">{driver.name}</span>? They will not be assignable to any trips.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-content-muted bg-bg-secondary border border-border hover:bg-bg-hover transition-all">
            Cancel
          </button>
          <button onClick={() => { onConfirm(driver); onClose(); }} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-danger hover:bg-danger-hover transition-all">
            Suspend Driver
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── License Warning Banner ───────────────────────────────────
function LicenseWarningBanner({ count }) {
  const [dismissed, setDismissed] = useState(false);
  if (!count || dismissed) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/25 animate-fade-in">
      <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
      <p className="text-xs font-medium text-warning flex-1">
        <span className="font-bold">{count} driver{count > 1 ? 's have' : ' has'} a license expiring within 30 days.</span>
        {' '}Immediate renewal action required.
      </p>
      <button onClick={() => setDismissed(true)} className="text-warning/60 hover:text-warning transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function DriverSafetyPage() {
  const [drivers, setDrivers]         = useState(DRIVER_PROFILES);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState('');
  const [selectedDriver, setSelected] = useState(null);
  const [modal, setModal]             = useState(null); // 'add' | 'edit' | 'suspend'
  const [suspendTarget, setSuspend]   = useState(null);

  // ── Derived stats ──
  const today = new Date();
  const in30  = new Date(today); in30.setDate(today.getDate() + 30);

  const stats = useMemo(() => ({
    total:      drivers.length,
    available:  drivers.filter(d => d.status === 'available').length,
    onTrip:     drivers.filter(d => d.status === 'on_trip').length,
    suspended:  drivers.filter(d => d.status === 'suspended').length,
    expiring:   drivers.filter(d => { const e = new Date(d.licenseExpiry); return e > today && e <= in30; }).length,
    expired:    drivers.filter(d => new Date(d.licenseExpiry) <= today).length,
    avgScore:   Math.round(drivers.reduce((s, d) => s + d.safetyScore, 0) / drivers.length),
  }), [drivers]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    let data = drivers;
    if (search) data = data.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.license.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.vehicle.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter) data = data.filter(d => d.status === statusFilter);
    return data;
  }, [drivers, search, statusFilter]);

  function handleSave(formData) {
    if (modal === 'add') {
      setDrivers(prev => [...prev, { ...formData, id: `D00${prev.length + 1}`, empId: `EMP-2024-00${prev.length + 1}`, trips: 0, totalDistance: 0, rating: 5.0 }]);
    } else {
      setDrivers(prev => prev.map(d => d.id === selectedDriver?.id ? { ...d, ...formData } : d));
    }
  }

  function handleSuspend(driver) {
    setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: 'suspended' } : d));
    if (selectedDriver?.id === driver.id) setSelected(prev => ({ ...prev, status: 'suspended' }));
  }

  function handleExport() {
    const csv = [
      ['Name', 'License', 'Category', 'Phone', 'Safety Score', 'Status', 'Expiry', 'Vehicle'].join(','),
      ...drivers.map(d => [d.name, d.license, d.licenseCategory, d.phone, d.safetyScore, d.status, d.licenseExpiry, d.vehicle].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'drivers.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const KPI_CARDS = [
    { title: 'Total Drivers',      value: stats.total,     description: 'Registered in system',    trend: 'up',   trendValue: '+1 this month', icon: Users,         color: '#3B82F6' },
    { title: 'Available Drivers',  value: stats.available, description: 'Ready for assignment',    trend: 'up',   trendValue: '+2 today',      icon: UserCheck,     color: '#22C55E' },
    { title: 'Drivers On Trip',    value: stats.onTrip,    description: 'Currently en route',      trend: 'up',   trendValue: 'Live',          icon: Truck,         color: '#8B5CF6' },
    { title: 'Suspended',          value: stats.suspended, description: 'Cannot be assigned',      trend: 'down', trendValue: 'Action needed', icon: Ban,           color: '#EF4444' },
    { title: 'Expiring Licenses',  value: stats.expiring,  description: 'Within 30 days',          trend: 'down', trendValue: 'Renew now',     icon: AlertTriangle, color: '#F59E0B' },
    { title: 'Avg Safety Score',   value: stats.avgScore,  description: 'Fleet-wide average',      trend: 'up',   trendValue: '+2 this month', icon: Shield,        color: '#10B981' },
  ];

  return (
    <PageShell>
      <div className="space-y-6">

        {/* Header */}
        <DriverHeader
          search={search}
          onSearch={setSearch}
          onAdd={() => setModal('add')}
          onExport={handleExport}
          statusFilter={statusFilter}
          onStatusFilter={setStatus}
        />

        {/* License warning banner */}
        <LicenseWarningBanner count={stats.expiring + stats.expired} />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {KPI_CARDS.map((card, i) => (
            <DriverStatCard key={card.title} {...card} delay={i * 60} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DriverAnalyticsChart />
          </div>
          <div>
            <LicenseExpiryChart drivers={drivers} />
          </div>
        </div>

        {/* Table + Drawer */}
        <div className={`transition-all duration-300 ${selectedDriver ? 'xl:mr-[400px]' : ''}`}>
          <DriverTable
            drivers={filtered}
            selectedId={selectedDriver?.id}
            onSelect={setSelected}
            onEdit={d => { setSelected(d); setModal('edit'); }}
            onSuspend={d => { setSuspend(d); setModal('suspend'); }}
          />
        </div>

        {/* Safety Timeline */}
        <SafetyTimeline />

      </div>

      {/* Profile Drawer */}
      {selectedDriver && (
        <DriverProfileDrawer
          driver={selectedDriver}
          onClose={() => setSelected(null)}
          onEdit={d => { setModal('edit'); }}
          onSuspend={d => { setSuspend(d); setModal('suspend'); }}
        />
      )}

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <DriverFormModal
          mode={modal}
          driver={modal === 'edit' ? selectedDriver : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Suspend Modal */}
      {modal === 'suspend' && (
        <SuspendModal
          driver={suspendTarget}
          onConfirm={handleSuspend}
          onClose={() => { setModal(null); setSuspend(null); }}
        />
      )}
    </PageShell>
  );
}
