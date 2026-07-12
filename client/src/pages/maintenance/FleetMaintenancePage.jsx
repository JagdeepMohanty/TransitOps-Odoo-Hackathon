import { useState, useMemo } from 'react';
import {
  Wrench, CalendarClock, CheckCircle2, AlertTriangle,
  DollarSign, Timer,
} from 'lucide-react';

import PageShell            from '@components/layout/PageShell';
import MaintenanceHeader    from '@components/maintenance/MaintenanceHeader';
import MaintenanceStatCard  from '@components/maintenance/MaintenanceStatCard';
import MaintenanceCostChart from '@components/maintenance/MaintenanceCostChart';
import MaintenanceStatusChart from '@components/maintenance/MaintenanceStatusChart';
import MaintenanceTable     from '@components/maintenance/MaintenanceTable';
import MaintenanceDrawer    from '@components/maintenance/MaintenanceDrawer';
import MaintenanceFormModal from '@components/maintenance/MaintenanceFormModal';

import {
  MAINTENANCE_RECORDS,
  MAINTENANCE_KPI,
} from '@utils/maintenanceMockData';

const KPI_CONFIG = [
  { key: 'inShop',        label: 'Vehicles In Shop',       icon: Wrench,        color: '#EF4444' },
  { key: 'scheduled',     label: 'Scheduled Maintenance',  icon: CalendarClock, color: '#3B82F6' },
  { key: 'completed',     label: 'Completed Services',     icon: CheckCircle2,  color: '#22C55E' },
  { key: 'overdue',       label: 'Overdue Services',       icon: AlertTriangle, color: '#F59E0B' },
  { key: 'totalCost',     label: 'Total Maintenance Cost', icon: DollarSign,    color: '#8B5CF6' },
  { key: 'avgRepairTime', label: 'Average Repair Time',    icon: Timer,         color: '#38BDF8' },
];

export default function FleetMaintenancePage() {
  const [records, setRecords]           = useState(MAINTENANCE_RECORDS);
  const [drawer, setDrawer]             = useState(null);
  const [modal, setModal]               = useState(null);
  const [headerSearch, setHeaderSearch] = useState('');

  const overdueCount = useMemo(
    () => records.filter(r => r.status === 'overdue').length,
    [records]
  );

  /* ── Modal helpers ───────────────────────────────────────── */
  const openAdd      = ()    => setModal({ mode: 'add',      record: null });
  const openEdit     = rec   => setModal({ mode: 'edit',     record: rec  });
  const openComplete = rec   => setModal({ mode: 'complete', record: rec  });
  const openCancel   = rec   => setModal({ mode: 'cancel',   record: rec  });
  const openDelete   = rec   => setModal({ mode: 'delete',   record: rec  });
  const closeModal   = ()    => setModal(null);

  /* ── Quick action from drawer ────────────────────────────── */
  function handleQuickAction(key, rec) {
    if (key === 'schedule') { openAdd();         return; }
    if (key === 'complete') { openComplete(rec); return; }
    if (key === 'cancel')   { openCancel(rec);   return; }
    if (key === 'export')   { handleExport();    return; }
  }

  /* ── Submit handlers ─────────────────────────────────────── */
  function handleSubmit(formData) {
    const { mode, record } = modal;

    if (mode === 'add') {
      const newRec = {
        id: `MNT-2024-${String(records.length + 1).padStart(3, '0')}`,
        vehicleId: formData.vehicleId,
        vehicle: formData.vehicleId,
        registration: '',
        type: formData.type,
        category: formData.category,
        technician: formData.technician,
        priority: formData.priority,
        startDate: new Date().toISOString().slice(0, 10),
        expectedCompletion: formData.expectedCompletion,
        completionDate: null,
        cost: Number(formData.cost) || 0,
        actualCost: null,
        status: 'scheduled',
        odometer: Number(formData.odometer) || 0,
        issueDescription: formData.issueDescription,
        partsReplaced: [],
        notes: formData.notes,
        timeline: [
          { event: 'Scheduled',          time: new Date().toLocaleString(), done: true  },
          { event: 'Inspection Started', time: null, done: false },
          { event: 'Repair Started',     time: null, done: false },
          { event: 'Parts Ordered',      time: null, done: false },
          { event: 'Repair Completed',   time: null, done: false },
          { event: 'Quality Check',      time: null, done: false },
          { event: 'Vehicle Available',  time: null, done: false },
        ],
      };
      setRecords(prev => [newRec, ...prev]);
    }

    if (mode === 'edit') {
      setRecords(prev => prev.map(r =>
        r.id === record.id
          ? {
              ...r,
              type:               formData.type,
              category:           formData.category,
              technician:         formData.technician,
              priority:           formData.priority,
              cost:               Number(formData.cost) || r.cost,
              expectedCompletion: formData.expectedCompletion,
              notes:              formData.notes,
            }
          : r
      ));
    }

    if (mode === 'complete') {
      setRecords(prev => prev.map(r =>
        r.id === record.id
          ? {
              ...r,
              status:         'completed',
              actualCost:     Number(formData.cost) || r.cost,
              completionDate: formData.expectedCompletion || new Date().toISOString().slice(0, 10),
              notes:          formData.notes || r.notes,
              timeline:       r.timeline.map(t => ({
                ...t, done: true,
                time: t.time ?? new Date().toLocaleString(),
              })),
            }
          : r
      ));
      if (drawer?.id === record.id) setDrawer(null);
    }

    if (mode === 'cancel') {
      setRecords(prev => prev.map(r =>
        r.id === record.id ? { ...r, status: 'cancelled' } : r
      ));
      if (drawer?.id === record.id) setDrawer(null);
    }

    if (mode === 'delete') {
      setRecords(prev => prev.filter(r => r.id !== record.id));
      if (drawer?.id === record.id) setDrawer(null);
    }

    closeModal();
  }

  /* ── Export CSV ──────────────────────────────────────────── */
  function handleExport() {
    const headers = ['ID', 'Vehicle', 'Registration', 'Type', 'Technician', 'Priority', 'Start Date', 'Expected Completion', 'Cost', 'Status'];
    const rows = records.map(r => [
      r.id, r.vehicle, r.registration, r.type, r.technician,
      r.priority, r.startDate, r.expectedCompletion, r.cost, r.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fleet-maintenance.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0' }}>

        {/* ── Header ── */}
        <MaintenanceHeader
          search={headerSearch}
          onSearch={setHeaderSearch}
          onSchedule={openAdd}
          onExport={handleExport}
          onRefresh={() => {}}
        />

        {/* ── Overdue global alert ── */}
        {overdueCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '13px 18px', borderRadius: 14,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.28)',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={15} color="#EF4444" />
            </div>
            <p style={{ fontSize: 13, color: '#FCA5A5', margin: 0, lineHeight: 1.5 }}>
              <strong>{overdueCount} maintenance task{overdueCount > 1 ? 's are' : ' is'} overdue</strong>
              {' '}— immediate attention required.{' '}
              <span style={{ color: '#94A3B8' }}>
                Vehicles cannot be assigned to trips while maintenance is active.
              </span>
            </p>
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 16,
        }}>
          {KPI_CONFIG.map(cfg => {
            const kpi = MAINTENANCE_KPI[cfg.key];
            return (
              <MaintenanceStatCard
                key={cfg.key}
                icon={cfg.icon}
                label={cfg.label}
                value={kpi.value}
                description={kpi.desc}
                trend={kpi.trend}
                trendUp={kpi.trendUp}
                color={cfg.color}
              />
            );
          })}
        </div>

        {/* ── Charts Row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)',
          gap: 16,
        }}>
          <MaintenanceCostChart />
          <MaintenanceStatusChart />
        </div>

        {/* ── Maintenance Table ── */}
        <MaintenanceTable
          records={records}
          onView={rec => setDrawer(rec)}
          onEdit={openEdit}
          onComplete={openComplete}
          onCancel={openCancel}
          onDelete={openDelete}
        />

      </div>

      {/* ── Drawer ── */}
      {drawer && (
        <MaintenanceDrawer
          record={drawer}
          onClose={() => setDrawer(null)}
          onAction={handleQuickAction}
        />
      )}

      {/* ── Modal ── */}
      {modal && (
        <MaintenanceFormModal
          mode={modal.mode}
          record={modal.record}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </PageShell>
  );
}
