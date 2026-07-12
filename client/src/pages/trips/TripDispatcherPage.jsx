import { useState, useMemo } from 'react';
import {
  FileText, Zap, CheckCircle2, XCircle,
  Route, Gauge, TrendingUp,
} from 'lucide-react';

import TripHeader        from '@components/trips/dispatcher/TripHeader';
import TripStatCard      from '@components/trips/dispatcher/TripStatCard';
import TripProgressChart from '@components/trips/dispatcher/TripProgressChart';
import TripStatusChart   from '@components/trips/dispatcher/TripStatusChart';
import TripTable         from '@components/trips/dispatcher/TripTable';
import TripDetailsDrawer from '@components/trips/dispatcher/TripDetailsDrawer';
import CreateTripModal   from '@components/trips/dispatcher/CreateTripModal';
import QuickActions      from '@components/trips/dispatcher/QuickActions';
import { DispatchConfirmModal, CompleteTripModal, CancelTripModal } from '@components/trips/dispatcher/TripActionModals';

import { DISPATCHER_TRIPS, DISPATCHER_KPI } from '@utils/tripDispatcherMockData';

// ── Toast notification ────────────────────────────────────────
function Toast({ msg, type }) {
  const colors = { success: '#22C55E', error: '#EF4444', info: '#3B82F6' };
  const color = colors[type] ?? colors.info;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#1E293B', border: `1px solid ${color}44`,
      borderRadius: 12, padding: '12px 18px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}22`,
      animation: 'fadeUp 0.25s ease-out',
      maxWidth: 320,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 8px ${color}` }} />
      <span style={{ fontSize: 13, color: '#F8FAFC', fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

export default function TripDispatcherPage() {
  const [trips, setTrips]           = useState(DISPATCHER_TRIPS);
  const [search, setSearch]         = useState('');
  const [selectedTrip, setSelected] = useState(null);
  const [drawerOpen, setDrawer]     = useState(false);

  // Modal states
  const [showCreate,   setShowCreate]   = useState(false);
  const [dispatchTrip, setDispatchTrip] = useState(null);
  const [completeTrip, setCompleteTrip] = useState(null);
  const [cancelTrip,   setCancelTrip]   = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Filtered trips for table ──────────────────────────────
  const filteredTrips = useMemo(() => {
    if (!search) return trips;
    const q = search.toLowerCase();
    return trips.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.driver.toLowerCase().includes(q) ||
      t.vehicle.toLowerCase().includes(q) ||
      t.source.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  }, [trips, search]);

  // ── KPI counts ────────────────────────────────────────────
  const kpi = useMemo(() => ({
    draft:      trips.filter(t => t.status === 'draft').length,
    dispatched: trips.filter(t => t.status === 'dispatched').length,
    completed:  trips.filter(t => t.status === 'completed').length,
    cancelled:  trips.filter(t => t.status === 'cancelled').length,
    distance:   trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.distance, 0),
  }), [trips]);

  // ── Actions ───────────────────────────────────────────────
  function handleView(trip) {
    setSelected(trip);
    setDrawer(true);
  }

  function handleCreateSubmit(formData) {
    const newTrip = {
      id: `TRP-2024-${String(trips.length + 1).padStart(3, '0')}`,
      vehicle: formData.vehicle,
      vehicleModel: formData.vehicleModel,
      driver: formData.driver,
      driverId: formData.driverId,
      source: formData.source,
      destination: formData.destination,
      cargoWeight: parseFloat(formData.cargoWeight),
      cargoType: formData.cargoType,
      distance: parseFloat(formData.distance) || 0,
      duration: formData.duration,
      status: 'draft',
      dispatchTime: null,
      eta: null,
      notes: formData.notes,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      timeline: [
        { event: 'Trip Created',    time: new Date().toISOString().slice(0, 16).replace('T', ' '), done: true  },
        { event: 'Driver Assigned', time: null, done: false },
        { event: 'Vehicle Assigned',time: null, done: false },
        { event: 'Trip Dispatched', time: null, done: false },
        { event: 'On Route',        time: null, done: false },
        { event: 'Delivered',       time: null, done: false },
        { event: 'Completed',       time: null, done: false },
      ],
    };
    setTrips(prev => [newTrip, ...prev]);
    showToast(`Trip ${newTrip.id} created successfully`);
  }

  function handleDispatchConfirm(trip) {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setTrips(prev => prev.map(t => t.id !== trip.id ? t : {
      ...t,
      status: 'dispatched',
      dispatchTime: now,
      eta: 'TBD',
      timeline: t.timeline.map(s =>
        ['Driver Assigned', 'Vehicle Assigned', 'Trip Dispatched', 'On Route'].includes(s.event)
          ? { ...s, done: true, time: s.time ?? now }
          : s
      ),
    }));
    showToast(`Trip ${trip.id} dispatched — vehicle & driver set to On Trip`);
  }

  function handleCompleteConfirm(trip) {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setTrips(prev => prev.map(t => t.id !== trip.id ? t : {
      ...t,
      status: 'completed',
      timeline: t.timeline.map(s =>
        ['Delivered', 'Completed'].includes(s.event)
          ? { ...s, done: true, time: now }
          : s
      ),
    }));
    showToast(`Trip ${trip.id} completed — vehicle & driver now available`);
  }

  function handleCancelConfirm(trip) {
    setTrips(prev => prev.map(t => t.id !== trip.id ? t : { ...t, status: 'cancelled' }));
    showToast(`Trip ${trip.id} cancelled`, 'error');
  }

  function handleExport() {
    const headers = ['ID', 'Vehicle', 'Driver', 'Source', 'Destination', 'Cargo (kg)', 'Distance (km)', 'Status', 'Dispatch Time', 'ETA'];
    const rows = trips.map(t => [t.id, t.vehicle, t.driver, t.source, t.destination, t.cargoWeight, t.distance, t.status, t.dispatchTime ?? '', t.eta ?? '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'trips.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'info');
  }

  function handleQuickAction(id) {
    if (id === 'create')  setShowCreate(true);
    if (id === 'report')  handleExport();
    if (id === 'dispatch') {
      const draft = trips.find(t => t.status === 'draft');
      if (draft) setDispatchTrip(draft);
      else showToast('No draft trips to dispatch', 'error');
    }
    if (id === 'complete') {
      const dispatched = trips.find(t => t.status === 'dispatched');
      if (dispatched) setCompleteTrip(dispatched);
      else showToast('No dispatched trips to complete', 'error');
    }
    if (id === 'cancel') {
      const active = trips.find(t => t.status === 'draft' || t.status === 'dispatched');
      if (active) setCancelTrip(active);
      else showToast('No active trips to cancel', 'error');
    }
  }

  const fleetUtil = Math.round((kpi.dispatched / Math.max(trips.length, 1)) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        select option { background: #1E293B; color: #F8FAFC; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Row 0: Header ── */}
        <div style={{ marginBottom: 28 }}>
          <TripHeader
            onCreateTrip={() => setShowCreate(true)}
            onSearch={setSearch}
            onRefresh={() => showToast('Data refreshed', 'info')}
            onExport={handleExport}
          />
        </div>

        {/* ── Row 1: KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
          <TripStatCard icon={FileText}    label="Draft Trips"       value={kpi.draft}      description="Awaiting dispatch"       trend={DISPATCHER_KPI.draft.trend}         trendUp={DISPATCHER_KPI.draft.trendUp}         color="#94A3B8" />
          <TripStatCard icon={Zap}         label="Dispatched"        value={kpi.dispatched} description="Currently on route"      trend={DISPATCHER_KPI.dispatched.trend}    trendUp={DISPATCHER_KPI.dispatched.trendUp}    color="#3B82F6" />
          <TripStatCard icon={CheckCircle2}label="Completed"         value={kpi.completed}  description="Successfully delivered"  trend={DISPATCHER_KPI.completed.trend}     trendUp={DISPATCHER_KPI.completed.trendUp}     color="#22C55E" />
          <TripStatCard icon={XCircle}     label="Cancelled"         value={kpi.cancelled}  description="Aborted operations"      trend={DISPATCHER_KPI.cancelled.trend}     trendUp={DISPATCHER_KPI.cancelled.trendUp}     color="#EF4444" />
          <TripStatCard icon={Route}       label="Total Distance"    value={`${kpi.distance.toLocaleString()} km`} description="Completed today" trend={DISPATCHER_KPI.totalDistance.trend} trendUp={DISPATCHER_KPI.totalDistance.trendUp} color="#8B5CF6" />
          <TripStatCard icon={Gauge}       label="Fleet Utilization" value={`${fleetUtil}%`} description="Vehicles on trip"       trend={DISPATCHER_KPI.fleetUtil.trend}     trendUp={DISPATCHER_KPI.fleetUtil.trendUp}     color="#F59E0B" />
        </div>

        {/* ── Row 2: Charts ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 14, marginBottom: 20 }}>
          <TripProgressChart />
          <TripStatusChart />
        </div>

        {/* ── Row 3: Trip Table ── */}
        <div style={{ marginBottom: 20 }}>
          <TripTable
            trips={filteredTrips}
            onView={handleView}
            onDispatch={t => setDispatchTrip(t)}
            onComplete={t => setCompleteTrip(t)}
            onCancel={t => setCancelTrip(t)}
          />
        </div>

        {/* ── Row 4: Quick Actions ── */}
        <div style={{ marginBottom: 20 }}>
          <QuickActions onAction={handleQuickAction} />
        </div>

      </div>

      {/* ── Drawers & Modals ── */}
      {drawerOpen && selectedTrip && (
        <TripDetailsDrawer trip={selectedTrip} onClose={() => setDrawer(false)} />
      )}

      {showCreate && (
        <CreateTripModal onClose={() => setShowCreate(false)} onSubmit={handleCreateSubmit} />
      )}

      {dispatchTrip && (
        <DispatchConfirmModal trip={dispatchTrip} onClose={() => setDispatchTrip(null)} onConfirm={handleDispatchConfirm} />
      )}

      {completeTrip && (
        <CompleteTripModal trip={completeTrip} onClose={() => setCompleteTrip(null)} onConfirm={handleCompleteConfirm} />
      )}

      {cancelTrip && (
        <CancelTripModal trip={cancelTrip} onClose={() => setCancelTrip(null)} onConfirm={handleCancelConfirm} />
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
