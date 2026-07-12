import { useState, useMemo } from 'react'
import { Plus, Download, Eye, Fuel, Truck, User, MapPin, TrendingUp, TrendingDown } from 'lucide-react'

import PageHeader     from '@/components/layout/PageHeader'
import Breadcrumb     from '@/components/common/Breadcrumb'
import Button         from '@/components/common/Button'
import SearchBar      from '@/components/common/SearchBar'
import Table          from '@/components/common/Table'
import Modal          from '@/components/common/Modal'
import Loader         from '@/components/common/Loader'
import Card           from '@/components/common/Card'
import FilterTabBar   from '@/components/common/FilterTabBar'
import StatsGrid      from '@/components/common/StatsGrid'
import BulkActionBar  from '@/components/common/BulkActionBar'
import PaginationBar  from '@/components/common/PaginationBar'
import DetailInfoGrid from '@/components/common/DetailInfoGrid'
import { formatDate, formatCurrency } from '@/utils'

const ALL_LOGS = [
  { id: 'F-001', vehicle: 'LG-001-AA', make: 'Toyota Coaster',    driver: 'James Okafor',  liters: 80,  costPerLiter: 1.20, cost: 96,   odometer: 48200, prevOdometer: 47450, station: 'Total Energies, Lagos',     date: '2024-09-10', fuelType: 'Diesel' },
  { id: 'F-002', vehicle: 'AB-002-BB', make: 'Mercedes Sprinter',  driver: 'Amina Bello',   liters: 65,  costPerLiter: 1.20, cost: 78,   odometer: 62100, prevOdometer: 61450, station: 'NNPC Mega Station, Abuja',  date: '2024-09-11', fuelType: 'Diesel' },
  { id: 'F-003', vehicle: 'KN-003-CC', make: 'Ford Transit',       driver: 'Emeka Nwosu',   liters: 50,  costPerLiter: 1.20, cost: 60,   odometer: 21500, prevOdometer: 20900, station: 'Oando, Kano',               date: '2024-09-12', fuelType: 'Petrol' },
  { id: 'F-004', vehicle: 'PH-005-EE', make: 'Toyota Hiace',       driver: 'Chidi Eze',     liters: 90,  costPerLiter: 1.20, cost: 108,  odometer: 33800, prevOdometer: 32900, station: 'Conoil, Port Harcourt',     date: '2024-09-10', fuelType: 'Diesel' },
  { id: 'F-005', vehicle: 'AB-006-FF', make: 'Mitsubishi Rosa',    driver: 'Bola Adeyemi',  liters: 70,  costPerLiter: 1.20, cost: 84,   odometer: 55200, prevOdometer: 54500, station: 'MRS Oil, Abuja',             date: '2024-09-13', fuelType: 'Diesel' },
  { id: 'F-006', vehicle: 'LG-007-GG', make: 'Toyota Coaster',    driver: 'Ngozi Obi',     liters: 85,  costPerLiter: 1.20, cost: 102,  odometer: 29100, prevOdometer: 28300, station: 'Total Energies, Lagos',     date: '2024-09-08', fuelType: 'Diesel' },
  { id: 'F-007', vehicle: 'KN-008-HH', make: 'Ford Transit',       driver: 'Usman Garba',   liters: 60,  costPerLiter: 1.20, cost: 72,   odometer: 41600, prevOdometer: 40900, station: 'Oando, Kano',               date: '2024-09-14', fuelType: 'Petrol' },
  { id: 'F-008', vehicle: 'EN-009-II', make: 'Toyota Hiace',       driver: 'Ada Nwofor',    liters: 45,  costPerLiter: 1.20, cost: 54,   odometer: 18900, prevOdometer: 18400, station: 'Forte Oil, Enugu',          date: '2024-09-07', fuelType: 'Petrol' },
  { id: 'F-009', vehicle: 'IB-010-JJ', make: 'Mercedes Sprinter',  driver: 'Seun Afolabi',  liters: 75,  costPerLiter: 1.20, cost: 90,   odometer: 37400, prevOdometer: 36700, station: 'Nipco, Ibadan',             date: '2024-09-11', fuelType: 'Diesel' },
  { id: 'F-010', vehicle: 'LG-001-AA', make: 'Toyota Coaster',    driver: 'James Okafor',  liters: 82,  costPerLiter: 1.20, cost: 98.4, odometer: 49050, prevOdometer: 48200, station: 'Total Energies, Lagos',     date: '2024-09-15', fuelType: 'Diesel' },
]

/* Fuel type filter tabs */
const FUEL_TABS = [
  { key: 'All',    label: 'All'    },
  { key: 'Diesel', label: 'Diesel' },
  { key: 'Petrol', label: 'Petrol' },
]

const STATS = [
  { label: 'Total Logs',     value: ALL_LOGS.length,                                                                       color: 'text-slate-900' },
  { label: 'Total Liters',   value: `${ALL_LOGS.reduce((s, l) => s + l.liters, 0).toLocaleString()} L`,                   color: 'text-blue-600'  },
  { label: 'Total Cost',     value: formatCurrency(ALL_LOGS.reduce((s, l) => s + l.cost, 0)),                             color: 'text-brand-600' },
  { label: 'Avg Cost/Liter', value: `$${(ALL_LOGS.reduce((s, l) => s + l.costPerLiter, 0) / ALL_LOGS.length).toFixed(2)}`, color: 'text-amber-600' },
  { label: 'Diesel Fills',   value: ALL_LOGS.filter(l => l.fuelType === 'Diesel').length,                                 color: 'text-slate-700' },
  { label: 'Petrol Fills',   value: ALL_LOGS.filter(l => l.fuelType === 'Petrol').length,                                 color: 'text-slate-700' },
]

const PAGE_SIZE = 8

const COLUMNS = [
  { key: 'id',       label: 'Log ID',   sortable: true, width: '90px',
    render: (v) => <span className="font-semibold text-brand-600 font-mono text-xs">{v}</span> },
  { key: 'vehicle',  label: 'Vehicle',  sortable: true,
    render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Truck size={13} className="text-blue-600" />
        </div>
        <div>
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{v}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">{row.make}</p>
        </div>
      </div>
    )},
  { key: 'driver',   label: 'Driver',   sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
          {v.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm text-slate-700">{v}</span>
      </div>
    )},
  { key: 'fuelType', label: 'Type',     width: '80px',
    render: (v) => (
      <span className={`badge ${v === 'Diesel' ? 'bg-slate-100 text-slate-700' : 'bg-green-50 text-green-700'}`}>{v}</span>
    )},
  { key: 'liters',   label: 'Liters',   sortable: true, align: 'right',
    render: (v) => <span className="font-medium text-slate-800">{v} L</span> },
  { key: 'cost',     label: 'Cost',     sortable: true, align: 'right',
    render: (v) => <span className="font-semibold text-slate-800">{formatCurrency(v)}</span> },
  { key: 'odometer', label: 'Odometer', sortable: true, align: 'right',
    render: (v, row) => {
      const km  = v - row.prevOdometer
      const eff = (km / row.liters).toFixed(1)
      const good = parseFloat(eff) >= 8
      return (
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">{v.toLocaleString()} km</p>
          <p className={`text-[11px] flex items-center justify-end gap-0.5 ${good ? 'text-green-600' : 'text-amber-600'}`}>
            {good ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {eff} km/L
          </p>
        </div>
      )
    }},
  { key: 'station',  label: 'Station',
    render: (v) => (
      <div className="flex items-center gap-1.5">
        <MapPin size={12} className="text-slate-400 shrink-0" />
        <span className="text-xs text-slate-500 truncate max-w-[160px]">{v}</span>
      </div>
    )},
  { key: 'date',     label: 'Date',     sortable: true,
    render: (v) => <span className="text-slate-500 text-sm">{formatDate(v)}</span> },
]

export default function FuelPage() {
  const [search,     setSearch]     = useState('')
  const [fuelFilter, setFuelFilter] = useState('All')
  const [page,       setPage]       = useState(1)
  const [selected,   setSelected]   = useState([])
  const [detailRow,  setDetailRow]  = useState(null)
  const [loading,    setLoading]    = useState(false)

  const handleFuelFilter = (type) => {
    setLoading(true); setFuelFilter(type); setPage(1)
    setTimeout(() => setLoading(false), 500)
  }

  const filtered = useMemo(() => ALL_LOGS.filter(l => {
    const matchType   = fuelFilter === 'All' || l.fuelType === fuelFilter
    const q           = search.toLowerCase()
    const matchSearch = !q || l.id.toLowerCase().includes(q)
      || l.vehicle.toLowerCase().includes(q)
      || l.driver.toLowerCase().includes(q)
      || l.station.toLowerCase().includes(q)
    return matchType && matchSearch
  }), [search, fuelFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const getTabCount = (key) =>
    key === 'All' ? ALL_LOGS.length : ALL_LOGS.filter(l => l.fuelType === key).length

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Fuel Logs' }]} />

      <PageHeader
        title="Fuel Logs"
        subtitle="Monitor fuel consumption, costs, and efficiency across the fleet."
        badge={<span className="badge bg-blue-100 text-blue-700 ring-1 ring-blue-200">{ALL_LOGS.length} entries</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>Log Fuel</Button>
          </>
        }
      />

      <StatsGrid stats={STATS} />

      <Card padding="none">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <FilterTabBar
            tabs={FUEL_TABS}
            active={fuelFilter}
            onChange={handleFuelFilter}
            getCount={getTabCount}
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="Search by ID, vehicle, driver, station…"
              value={search}
              onChange={(v) => { setSearch(v); setPage(1) }}
              className="w-full sm:w-72"
            />
            <BulkActionBar
              count={selected.length}
              actions={<Button variant="danger" size="sm">Delete</Button>}
            />
          </div>
        </div>

        {loading ? (
          <Loader variant="skeleton" lines={8} className="p-5" />
        ) : (
          <Table
            columns={[
              ...COLUMNS,
              { key: '_actions', label: '', width: '60px',
                render: (_, row) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetailRow(row) }}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                )},
            ]}
            data={paginated}
            selectable selected={selected} onSelect={setSelected}
            onRowClick={setDetailRow}
            emptyTitle="No fuel logs found"
            emptyDesc={search ? 'Try a different search term.' : 'Start logging fuel fills for your fleet.'}
            emptyAction={!search && <Button size="sm" leftIcon={<Plus size={14} />}>Log Fuel</Button>}
          />
        )}

        {!loading && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="logs"
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Fuel Log Detail Modal */}
      <Modal
        isOpen={!!detailRow} onClose={() => setDetailRow(null)}
        title="Fuel Log Details" subtitle={detailRow?.id} size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDetailRow(null)}>Close</Button>
            <Button size="sm">Edit Log</Button>
          </>
        }
      >
        {detailRow && (
          <div className="space-y-4">
            <DetailInfoGrid fields={[
              { icon: Truck,  label: 'Vehicle',   value: `${detailRow.vehicle} — ${detailRow.make}` },
              { icon: User,   label: 'Driver',    value: detailRow.driver                           },
              { icon: Fuel,   label: 'Fuel Type', value: detailRow.fuelType                         },
              { icon: MapPin, label: 'Station',   value: detailRow.station                          },
            ]} />

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Liters</p>
                <p className="text-lg font-bold text-blue-700">{detailRow.liters} L</p>
              </div>
              <div className="p-3 bg-brand-50 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Total Cost</p>
                <p className="text-lg font-bold text-brand-700">{formatCurrency(detailRow.cost)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Efficiency</p>
                <p className="text-lg font-bold text-green-700">
                  {((detailRow.odometer - detailRow.prevOdometer) / detailRow.liters).toFixed(1)} km/L
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Odometer Reading</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Previous</p>
                  <p className="font-semibold text-slate-700">{detailRow.prevOdometer.toLocaleString()} km</p>
                </div>
                <div className="text-slate-300 font-bold">→</div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Current</p>
                  <p className="font-semibold text-slate-700">{detailRow.odometer.toLocaleString()} km</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Distance</p>
                  <p className="font-semibold text-brand-600">+{(detailRow.odometer - detailRow.prevOdometer).toLocaleString()} km</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-right">{formatDate(detailRow.date)}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
