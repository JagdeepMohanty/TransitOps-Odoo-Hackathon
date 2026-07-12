import { useState, useMemo } from 'react'
import { Plus, Download, Eye, MapPin, User, Truck, Calendar, Clock } from 'lucide-react'

import PageHeader      from '@/components/layout/PageHeader'
import Breadcrumb      from '@/components/common/Breadcrumb'
import Button          from '@/components/common/Button'
import SearchBar       from '@/components/common/SearchBar'
import Table           from '@/components/common/Table'
import StatusBadge     from '@/components/common/StatusBadge'
import Modal           from '@/components/common/Modal'
import Loader          from '@/components/common/Loader'
import Card            from '@/components/common/Card'
import FilterTabBar    from '@/components/common/FilterTabBar'
import StatsGrid       from '@/components/common/StatsGrid'
import BulkActionBar   from '@/components/common/BulkActionBar'
import PaginationBar   from '@/components/common/PaginationBar'
import DetailInfoGrid  from '@/components/common/DetailInfoGrid'
import { formatDate, formatCurrency } from '@/utils'

const ALL_TRIPS = [
  { id: 'T-001', route: 'Lagos → Abuja',         origin: 'Lagos',         destination: 'Abuja',      driver: 'James Okafor',  vehicle: 'LG-001-AA', date: '2024-09-10', departure: '06:00', arrival: '14:30', distance: '755 km', fare: 12500, passengers: 28, status: 'completed'   },
  { id: 'T-002', route: 'Abuja → Kano',           origin: 'Abuja',         destination: 'Kano',       driver: 'Amina Bello',   vehicle: 'AB-002-BB', date: '2024-09-11', departure: '07:30', arrival: '—',     distance: '370 km', fare: 8200,  passengers: 20, status: 'in_progress' },
  { id: 'T-003', route: 'Kano → Kaduna',          origin: 'Kano',          destination: 'Kaduna',     driver: 'Emeka Nwosu',   vehicle: 'KN-003-CC', date: '2024-09-12', departure: '09:00', arrival: '—',     distance: '195 km', fare: 4500,  passengers: 15, status: 'scheduled'   },
  { id: 'T-004', route: 'Lagos → Ibadan',         origin: 'Lagos',         destination: 'Ibadan',     driver: 'Fatima Yusuf',  vehicle: 'LG-004-DD', date: '2024-09-09', departure: '08:00', arrival: '10:15', distance: '128 km', fare: 2800,  passengers: 30, status: 'cancelled'   },
  { id: 'T-005', route: 'Port Harcourt → Enugu',  origin: 'Port Harcourt', destination: 'Enugu',      driver: 'Chidi Eze',     vehicle: 'PH-005-EE', date: '2024-09-10', departure: '05:30', arrival: '09:45', distance: '253 km', fare: 5600,  passengers: 22, status: 'completed'   },
  { id: 'T-006', route: 'Abuja → Lokoja',         origin: 'Abuja',         destination: 'Lokoja',     driver: 'Bola Adeyemi',  vehicle: 'AB-006-FF', date: '2024-09-13', departure: '10:00', arrival: '—',     distance: '180 km', fare: 3900,  passengers: 18, status: 'scheduled'   },
  { id: 'T-007', route: 'Lagos → Benin City',     origin: 'Lagos',         destination: 'Benin City', driver: 'Ngozi Obi',     vehicle: 'LG-007-GG', date: '2024-09-08', departure: '06:30', arrival: '11:00', distance: '310 km', fare: 6800,  passengers: 25, status: 'completed'   },
  { id: 'T-008', route: 'Kano → Maiduguri',       origin: 'Kano',          destination: 'Maiduguri',  driver: 'Usman Garba',   vehicle: 'KN-008-HH', date: '2024-09-14', departure: '05:00', arrival: '—',     distance: '560 km', fare: 11200, passengers: 19, status: 'scheduled'   },
  { id: 'T-009', route: 'Enugu → Onitsha',        origin: 'Enugu',         destination: 'Onitsha',    driver: 'Ada Nwofor',    vehicle: 'EN-009-II', date: '2024-09-07', departure: '07:00', arrival: '09:30', distance: '98 km',  fare: 2200,  passengers: 14, status: 'completed'   },
  { id: 'T-010', route: 'Ibadan → Ilorin',        origin: 'Ibadan',        destination: 'Ilorin',     driver: 'Seun Afolabi',  vehicle: 'IB-010-JJ', date: '2024-09-11', departure: '08:30', arrival: '11:00', distance: '160 km', fare: 3500,  passengers: 21, status: 'completed'   },
  { id: 'T-011', route: 'Lagos → Owerri',         origin: 'Lagos',         destination: 'Owerri',     driver: 'James Okafor',  vehicle: 'LG-001-AA', date: '2024-09-15', departure: '06:00', arrival: '—',     distance: '490 km', fare: 9800,  passengers: 27, status: 'scheduled'   },
  { id: 'T-012', route: 'Abuja → Jos',            origin: 'Abuja',         destination: 'Jos',        driver: 'Amina Bello',   vehicle: 'AB-002-BB', date: '2024-09-06', departure: '09:00', arrival: '13:30', distance: '290 km', fare: 6200,  passengers: 16, status: 'completed'   },
]

const STATUS_TABS = [
  { key: 'all',         label: 'All Trips'   },
  { key: 'scheduled',   label: 'Scheduled'   },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed'   },
  { key: 'cancelled',   label: 'Cancelled'   },
]

const STATS = [
  { label: 'Total Trips',   value: ALL_TRIPS.length,                                                color: 'text-slate-900' },
  { label: 'Scheduled',     value: ALL_TRIPS.filter(t => t.status === 'scheduled').length,          color: 'text-blue-600'  },
  { label: 'In Progress',   value: ALL_TRIPS.filter(t => t.status === 'in_progress').length,        color: 'text-amber-600' },
  { label: 'Completed',     value: ALL_TRIPS.filter(t => t.status === 'completed').length,          color: 'text-green-600' },
  { label: 'Cancelled',     value: ALL_TRIPS.filter(t => t.status === 'cancelled').length,          color: 'text-red-500'   },
  { label: 'Total Revenue', value: formatCurrency(ALL_TRIPS.reduce((s, t) => s + t.fare, 0)),       color: 'text-brand-600' },
]

const PAGE_SIZE = 8

const COLUMNS = [
  { key: 'id',         label: 'Trip ID',   sortable: true, width: '90px',
    render: (v) => <span className="font-semibold text-brand-600 font-mono text-xs">{v}</span> },
  { key: 'route',      label: 'Route',     sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
          <MapPin size={11} className="text-brand-600" />
        </div>
        <span className="font-medium text-slate-800 text-sm">{v}</span>
      </div>
    )},
  { key: 'driver',     label: 'Driver',    sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
          {v.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm text-slate-700">{v}</span>
      </div>
    )},
  { key: 'vehicle',    label: 'Vehicle',   sortable: true,
    render: (v) => <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{v}</span> },
  { key: 'date',       label: 'Date',      sortable: true,
    render: (v) => <span className="text-slate-500 text-sm">{formatDate(v)}</span> },
  { key: 'departure',  label: 'Departure', width: '90px',
    render: (v) => <span className="text-slate-500 text-sm">{v}</span> },
  { key: 'passengers', label: 'Pax',       sortable: true, align: 'center', width: '60px',
    render: (v) => <span className="text-slate-700 font-medium text-sm">{v}</span> },
  { key: 'fare',       label: 'Fare',      sortable: true, align: 'right',
    render: (v) => <span className="font-semibold text-slate-800">{formatCurrency(v)}</span> },
  { key: 'status',     label: 'Status',    width: '130px',
    render: (v) => <StatusBadge status={v} /> },
]

export default function TripsPage() {
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [page,      setPage]      = useState(1)
  const [selected,  setSelected]  = useState([])
  const [detailRow, setDetailRow] = useState(null)
  const [loading,   setLoading]   = useState(false)

  const handleTabChange = (key) => {
    setLoading(true); setActiveTab(key); setPage(1)
    setTimeout(() => setLoading(false), 600)
  }

  const filtered = useMemo(() => ALL_TRIPS.filter(t => {
    const matchTab    = activeTab === 'all' || t.status === activeTab
    const q           = search.toLowerCase()
    const matchSearch = !q || t.id.toLowerCase().includes(q)
      || t.route.toLowerCase().includes(q)
      || t.driver.toLowerCase().includes(q)
      || t.vehicle.toLowerCase().includes(q)
    return matchTab && matchSearch
  }), [search, activeTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const getTabCount = (key) =>
    key === 'all' ? ALL_TRIPS.length : ALL_TRIPS.filter(t => t.status === key).length

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Trips' }]} />

      <PageHeader
        title="Trips"
        subtitle="Schedule, dispatch and monitor all fleet trips in real time."
        badge={<span className="badge bg-brand-100 text-brand-700 ring-1 ring-brand-200">{ALL_TRIPS.length} total</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>New Trip</Button>
          </>
        }
      />

      <StatsGrid stats={STATS} />

      <Card padding="none">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <FilterTabBar
            tabs={STATUS_TABS}
            active={activeTab}
            onChange={handleTabChange}
            getCount={getTabCount}
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="Search by ID, route, driver, vehicle…"
              value={search}
              onChange={(v) => { setSearch(v); setPage(1) }}
              className="w-full sm:w-72"
            />
            <BulkActionBar
              count={selected.length}
              actions={<Button variant="danger" size="sm">Delete Selected</Button>}
            />
          </div>
        </div>

        {loading ? (
          <Loader variant="skeleton" lines={8} className="p-5" />
        ) : (
          <Table
            columns={[
              ...COLUMNS,
              {
                key: '_actions', label: '', width: '60px',
                render: (_, row) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetailRow(row) }}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                ),
              },
            ]}
            data={paginated}
            selectable
            selected={selected}
            onSelect={setSelected}
            onRowClick={setDetailRow}
            emptyTitle="No trips found"
            emptyDesc={search ? 'Try a different search term or clear filters.' : 'Create your first trip to get started.'}
            emptyAction={!search && <Button size="sm" leftIcon={<Plus size={14} />}>New Trip</Button>}
          />
        )}

        {!loading && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="trips"
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Trip Detail Modal */}
      <Modal
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title="Trip Details"
        subtitle={detailRow?.id}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDetailRow(null)}>Close</Button>
            <Button size="sm">Edit Trip</Button>
          </>
        }
      >
        {detailRow && (
          <div className="space-y-5">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-600">Current Status</span>
              <StatusBadge status={detailRow.status} size="lg" />
            </div>

            {/* Route */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Route</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-green-50 rounded-xl text-center">
                  <p className="text-xs text-slate-500 mb-1">Origin</p>
                  <p className="font-semibold text-slate-800">{detailRow.origin}</p>
                </div>
                <div className="text-slate-300 font-bold">→</div>
                <div className="flex-1 p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-xs text-slate-500 mb-1">Destination</p>
                  <p className="font-semibold text-slate-800">{detailRow.destination}</p>
                </div>
              </div>
            </div>

            {/* Trip info grid */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trip Info</p>
              <DetailInfoGrid fields={[
                { icon: User,     label: 'Driver',     value: detailRow.driver                  },
                { icon: Truck,    label: 'Vehicle',    value: detailRow.vehicle                 },
                { icon: Calendar, label: 'Date',       value: formatDate(detailRow.date)        },
                { icon: Clock,    label: 'Departure',  value: detailRow.departure               },
                { icon: MapPin,   label: 'Distance',   value: detailRow.distance                },
                { icon: User,     label: 'Passengers', value: `${detailRow.passengers} pax`     },
              ]} />
            </div>

            {/* Fare */}
            <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl border border-brand-100">
              <span className="text-sm font-medium text-brand-700">Total Fare</span>
              <span className="text-xl font-bold text-brand-700">{formatCurrency(detailRow.fare)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
