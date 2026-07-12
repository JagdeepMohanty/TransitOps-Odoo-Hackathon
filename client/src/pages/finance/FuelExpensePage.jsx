import { useState, useMemo } from 'react';
import { Droplets, DollarSign, Wrench, Receipt, TrendingUp, Zap } from 'lucide-react';

import PageShell                from '@components/layout/PageShell';
import FuelExpenseHeader        from '@components/finance/FuelExpenseHeader';
import FuelStatCard             from '@components/finance/FuelStatCard';
import FuelTrendChart           from '@components/finance/FuelTrendChart';
import ExpenseDistributionChart from '@components/finance/ExpenseDistributionChart';
import FuelLogTable             from '@components/finance/FuelLogTable';
import ExpenseTable             from '@components/finance/ExpenseTable';
import VehicleCostSummary       from '@components/finance/VehicleCostSummary';
import RecentTransactions       from '@components/finance/RecentTransactions';
import FuelLogModal             from '@components/finance/FuelLogModal';
import ExpenseModal             from '@components/finance/ExpenseModal';

import { FUEL_LOGS, EXPENSES, FE_KPI } from '@utils/fuelExpenseMockData';

const KPI_CONFIG = [
  { key: 'totalFuel',     label: 'Total Fuel Consumed',    icon: Droplets,   color: '#3B82F6' },
  { key: 'fuelCost',      label: 'Fuel Cost',              icon: DollarSign, color: '#EF4444' },
  { key: 'maintCost',     label: 'Maintenance Cost',       icon: Wrench,     color: '#F59E0B' },
  { key: 'otherExp',      label: 'Other Expenses',         icon: Receipt,    color: '#94A3B8' },
  { key: 'totalOpCost',   label: 'Total Operational Cost', icon: TrendingUp, color: '#8B5CF6' },
  { key: 'avgEfficiency', label: 'Avg Fuel Efficiency',    icon: Zap,        color: '#22C55E' },
];

export default function FuelExpensePage() {
  const [fuelLogs,  setFuelLogs]  = useState(FUEL_LOGS);
  const [expenses,  setExpenses]  = useState(EXPENSES);
  const [search,    setSearch]    = useState('');
  const [fuelModal, setFuelModal] = useState(null);
  const [expModal,  setExpModal]  = useState(null);

  const openAddFuel    = ()    => setFuelModal({ mode: 'add',    record: null });
  const openEditFuel   = rec   => setFuelModal({ mode: 'edit',   record: rec  });
  const openDeleteFuel = rec   => setFuelModal({ mode: 'delete', record: rec  });
  const openAddExp     = ()    => setExpModal ({ mode: 'add',    record: null });
  const openEditExp    = rec   => setExpModal ({ mode: 'edit',   record: rec  });
  const openDeleteExp  = rec   => setExpModal ({ mode: 'delete', record: rec  });

  function handleFuelSubmit(formData) {
    const { mode, record } = fuelModal;
    if (mode === 'add') {
      setFuelLogs(prev => [{
        id:              `FL-${String(prev.length + 1).padStart(3, '0')}`,
        vehicleId:       formData.vehicleId,
        vehicle:         FE_VEHICLES_MAP[formData.vehicleId] ?? formData.vehicleId,
        registration:    '',
        driver:          formData.driver,
        trip:            formData.trip || null,
        date:            formData.date,
        station:         formData.station,
        quantity:        Number(formData.quantity) || 0,
        pricePerLiter:   Number(formData.pricePerLiter) || 0,
        totalCost:       Number(formData.totalCost) || 0,
        distanceCovered: Number(formData.distanceCovered) || 0,
        efficiency:      Number(formData.efficiency) || 0,
        paymentMethod:   formData.paymentMethod,
        notes:           formData.notes,
      }, ...prev]);
    }
    if (mode === 'edit') {
      setFuelLogs(prev => prev.map(r =>
        r.id === record.id ? { ...r, ...formData, quantity: Number(formData.quantity) || r.quantity, pricePerLiter: Number(formData.pricePerLiter) || r.pricePerLiter, totalCost: Number(formData.totalCost) || r.totalCost, distanceCovered: Number(formData.distanceCovered) || r.distanceCovered, efficiency: Number(formData.efficiency) || r.efficiency } : r
      ));
    }
    if (mode === 'delete') setFuelLogs(prev => prev.filter(r => r.id !== record.id));
    setFuelModal(null);
  }

  function handleExpSubmit(formData) {
    const { mode, record } = expModal;
    if (mode === 'add') {
      setExpenses(prev => [{
        id:            `EXP-${String(prev.length + 1).padStart(3, '0')}`,
        vehicleId:     formData.vehicleId,
        vehicle:       FE_VEHICLES_MAP[formData.vehicleId] ?? formData.vehicleId,
        registration:  '',
        type:          formData.type,
        category:      formData.category,
        amount:        Number(formData.amount) || 0,
        date:          formData.date,
        status:        formData.status,
        paymentMethod: formData.paymentMethod,
        notes:         formData.notes,
        approvedBy:    formData.status === 'approved' ? 'Admin' : null,
      }, ...prev]);
    }
    if (mode === 'edit') {
      setExpenses(prev => prev.map(r =>
        r.id === record.id ? { ...r, ...formData, amount: Number(formData.amount) || r.amount } : r
      ));
    }
    if (mode === 'delete') setExpenses(prev => prev.filter(r => r.id !== record.id));
    setExpModal(null);
  }

  function handleExport() {
    const fuelHeaders = ['ID', 'Vehicle', 'Driver', 'Trip', 'Date', 'Station', 'Qty(L)', 'Cost', '₹/L', 'Distance', 'Efficiency'];
    const fuelRows    = fuelLogs.map(r => [r.id, r.vehicle, r.driver, r.trip ?? '', r.date, r.station, r.quantity, r.totalCost, r.pricePerLiter, r.distanceCovered, r.efficiency]);
    const expHeaders  = ['ID', 'Vehicle', 'Type', 'Category', 'Amount', 'Date', 'Status', 'Notes'];
    const expRows     = expenses.map(r => [r.id, r.vehicle, r.type, r.category, r.amount, r.date, r.status, r.notes]);
    const csv = [
      '=== FUEL LOGS ===', fuelHeaders.join(','), ...fuelRows.map(r => r.join(',')),
      '', '=== EXPENSES ===', expHeaders.join(','), ...expRows.map(r => r.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'fuel-expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return fuelLogs;
    const q = search.toLowerCase();
    return fuelLogs.filter(r =>
      r.vehicle.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) ||
      r.station.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [fuelLogs, search]);

  const filteredExp = useMemo(() => {
    if (!search.trim()) return expenses;
    const q = search.toLowerCase();
    return expenses.filter(r =>
      r.vehicle.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) ||
      r.notes.toLowerCase().includes(q)   || r.id.toLowerCase().includes(q)
    );
  }, [expenses, search]);

  return (
    <PageShell>
      {/* Page background ambient glows */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: '#3B82F6', opacity: 0.025, filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: '#8B5CF6', opacity: 0.02, filter: 'blur(90px)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <FuelExpenseHeader
          search={search}
          onSearch={setSearch}
          onAddFuel={openAddFuel}
          onAddExpense={openAddExp}
          onExport={handleExport}
          onRefresh={() => {}}
        />

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gap: 16 }}>
          {KPI_CONFIG.map((cfg, i) => {
            const kpi = FE_KPI[cfg.key];
            return (
              <FuelStatCard
                key={cfg.key}
                icon={cfg.icon}
                label={cfg.label}
                value={kpi.value}
                description={kpi.desc}
                trend={kpi.trend}
                trendUp={kpi.trendUp}
                color={cfg.color}
                delay={i * 70}
              />
            );
          })}
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)', gap: 16 }}>
          <FuelTrendChart />
          <ExpenseDistributionChart />
        </div>

        {/* ── Fuel Log Table ── */}
        <FuelLogTable
          logs={filteredLogs}
          onView={rec  => openEditFuel(rec)}
          onEdit={rec  => openEditFuel(rec)}
          onDelete={rec => openDeleteFuel(rec)}
        />

        {/* ── Expense Table ── */}
        <ExpenseTable
          expenses={filteredExp}
          onView={rec  => openEditExp(rec)}
          onEdit={rec  => openEditExp(rec)}
          onDelete={rec => openDeleteExp(rec)}
        />

        {/* ── Vehicle Cost Summary ── */}
        <VehicleCostSummary />

        {/* ── Recent Transactions ── */}
        <RecentTransactions />

      </div>

      {/* ── Fuel Log Modal ── */}
      {fuelModal && (
        <FuelLogModal
          mode={fuelModal.mode}
          record={fuelModal.record}
          onClose={() => setFuelModal(null)}
          onSubmit={handleFuelSubmit}
        />
      )}

      {/* ── Expense Modal ── */}
      {expModal && (
        <ExpenseModal
          mode={expModal.mode}
          record={expModal.record}
          onClose={() => setExpModal(null)}
          onSubmit={handleExpSubmit}
        />
      )}
    </PageShell>
  );
}

// Vehicle name lookup for new records
const FE_VEHICLES_MAP = {
  V001: 'Tata Prima 4028.S',
  V002: 'Ashok Leyland 2518',
  V003: 'Eicher Pro 6031',
  V004: 'Mahindra Blazo X 35',
  V005: 'Tata LPT 1613',
  V006: 'Volvo FH 500',
  V008: 'Eicher Pro 3015',
};
