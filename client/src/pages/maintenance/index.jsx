import { useState, useMemo } from 'react'
import { Plus, Download, Eye, Wrench, Truck, Calendar, DollarSign, User, FileText } from 'lucide-react'

import PageHeader     from '@/components/layout/PageHeader'
import Breadcrumb     from '@/components/common/Breadcrumb'
import Button         from '@/components/common/Button'
import SearchBar      from '@/components/common/SearchBar'
import Table          from '@/components/common/Table'
import StatusBadge    from '@/components/common/StatusBadge'
import Modal          from '@/components/common/Modal'
import Loader         from '@/components/common/Loader'
import Card           from '@/components/common/Card'
import FilterTabBar   from '@/components/common/FilterTabBar'
import StatsGrid      from '@/components/common/StatsGrid'
import BulkActionBar  from '@/components/common/BulkActionBar'
import PaginationBar  from '@/components/common/PaginationBar'
import DetailInfoGrid from '@/components/common/DetailInfoGrid'
import { formatDate, formatCurrency } from '@/utils'

const ALL_RECORDS = [
  { id: 'M-001', vehicle: 'LG-001-AA', make: 'Toyota Coaster',    type: 'Oil Change',          priority: 'Low',      cost: 120,  laborCost: 40,   partsCost: 80,   technician: 'Emeka Repairs',    date: '2024-09-05', completedDate: '2024-09-05', notes: 'Routine 5,000 km service.',           status: 'closed'      },
  { id: 'M-002', vehicle: 'AB-002-BB', make: 'Mercedes Sprinter',  type: 'Brake Replacement',   priority: 'High',     cost: 850,  laborCost: 200,  partsCost: 650,  technician: 'AutoFix Ltd',      date: '2024-09-08', completedDate: null,          notes: 'Front and rear brake pads replaced.', status: 'in_progress' },
  { id: 'M-003', vehicle: 'KN-003-CC', make: 'Ford Transit',       type: 'Tyre Rotation',       priority: 'Medium',   cost: 200,  laborCost: 80,   partsCost: 120,  technician: 'Kano Auto Works',  date: '2024-09-12', completedDate: null,          notes: 'All four tyres rotated and balanced.', status: 'open'       },
  { id: 'M-004', vehicle: 'LG-004-DD', make: 'Iveco Daily',        type: 'Engine Overhaul',     priority: 'Critical', cost: 3200, laborCost: 1200, partsCost: 2000, technician: 'ProEngine NG',     date: '2024-09-01', completedDate: '2024-09-07', notes: 'Full engine rebuild after failure.',  status: 'closed'      },
  { id: 'M-005', vehicle: 'PH-005-EE', make: 'Toyota Hiace',       type: 'AC Repair',           priority: 'Medium',   cost: 450,  laborCost: 150,  partsCost: 300,  technician: 'CoolAir Services', date: '2024-09-10', completedDate: null,          notes: 'Compressor replaced.',               status: 'in_progress' },
  { id: 'M-006', vehicle: 'AB-006-FF', make: 'Mitsubishi Rosa',    type: 'Windshield Replace',  priority: 'High',     cost: 680,  laborCost: 100,  partsCost: 580,  technician: 'GlassPro NG',      date: '2024-09-13', completedDate: null,          notes: 'Cracked windshield from road debris.', status: 'open'       },
  { id: 'M-007', vehicle: 'LG-007-GG', make: 'Toyota Coaster',    type: 'Transmission Service',priority: 'High',     cost: 1100, laborCost: 400,  partsCost: 700,  technician: 'AutoFix Ltd',      date: '2024-09-03', completedDate: '2024-09-06', notes: 'Gearbox fluid flush and filter.',    status: 'closed'      },
  { id: 'M-008', vehicle: 'KN-008-HH', make: 'Ford Transit',       type: 'Battery Replacement', priority: 'Low',      cost: 180,  laborCost: 30,   partsCost: 150,  technician: 'Kano Auto Works',  date: '2024-09-14', completedDate: null,          notes: 'Battery dead, replaced with new.',   status: 'open'        },
  { id: 'M-009', vehicle: 'EN-009-II', make: 'Toyota Hiace',       type: 'Suspension Repair',   priority: 'Critical', cost: 2400, laborCost: 800,  partsCost: 1600, technician: 'ProEngine NG',     date: '2024-09-02', completedDate: '2024-09-09', notes: 'Front suspension arms replaced.',    status: 'closed'      },
  { id: 'M-010', vehicle: 'IB-010-JJ', make: 'Mercedes Sprinter',  type: 'Coolant Flush',       priority: 'Medium',   cost: 160,  laborCost: 60,   partsCost: 100,  technician: 'Emeka Repairs',    date: '2024-09-11', completedDate: '2024-09-11', notes: 'Coolant system flushed and refilled.', status: 'closed'    },
]

const STATUS_TABS = [
  { key: 'all',         label: 'All'         },
  { key: 'open',        label: 'Open'        },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'closed',      label: 'Closed'      },
]

const PRIORITY_COLOR = {
  Low:      'bg-slate-100 text-slate-600',
  Medium:   'bg-blue-50 text-blue-700',
  High:     'bg-amber-50 text-amber-700',
  Critical: 'bg-red-50 text-red-700',
}

const STATS = [
  { label: 'Total Records', value: ALL_RECORDS.length,                                                color: 'text-slate-900' },
  { label: 'Open',          value: ALL_RECORDS.filter(r => r.status === 'open').length,               color: 'text-red-500'   },
  { label: 'In Progress',   value: ALL_RECORDS.filter(r => r.status === 'in_progress').length,        color: 'text-amber-600' },
  { label: 'Closed',        value: ALL_RECORDS.filter(r => r.status === 'closed').length,             color: 'text-green-600' },
  { label: 'Critical',      value: ALL_RECORDS.filter(r => r.priority === 'Critical').length,         color: 'text-red-600'   },
  { label: 'Total Cost',    value: formatCurrency(ALL_RECORDS.reduce((s, r) => s + r.cost, 0)),       color: 'text-brand-600' },
]

const PAGE_SIZE = 8

const COLUMNS = [
  { key: 'id',         label: 'ID',           sortable: true, width: '90px',
    render: (v) => <span className="font-semibold text-brand-600 font-mono text-xs">{v}</span> },
  { key: 'vehicle',    label: 'Vehicle',       sortable: true,
    render: (v, row) => (
      <div>
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{v}</span>
        <p className="text-[11px] text-slate-400 mt-0.5">{row.make}</p>
      </div>
    )},
  { key: 'type',       label: 'Service Type',  sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
          <Wrench size={11} className="text-amber-600" />
        </div>
        <span className="text-sm font-medium text-slate-800">{v}</span>
      </div>
    )},
  { key: 'priority',   label: 'Priority',      sortable: true, width: '100px',
    render: (v) => <span className={`badge ${PRIORITY_COLOR[v]}`}>{v}</span> },
  { key: 'technician', label: 'Technician',
    render: (v) => <span className="text-sm text-slate-600">{v}</span> },
  { key: 'date',       label: 'Logged',        sortable: true,
    render: (v) => <span className="text-slate-500 text-sm">{formatDate(v)}</span> },
  { key: 'cost',       label: 'Cost',          sortable: true, align: 'right',
    render: (v) => <span className="font-semibold text-slate-800">{formatCurrency(v)}</span> },
  { key: 'status',     label: 'Status',        width: '130px',
    render: (v) => <StatusBadge status={v} /> },
]

export default function MaintenancePage() {
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

  const filtered = useMemo(() => ALL_RECORDS.filter(r => {
    const matchTab    = activeTab === 'all' || r.status === activeTab
    const q           = search.toLowerCase()
    const matchSearch = !q || r.id.toLowerCase().includes(q)
      || r.vehicle.toLowerCase().includes(q)
      || r.type.toLowerCase().includes(q)
      || r.technician.toLowerCase().includes(q)
    return matchTab && matchSearch
  }), [search, activeTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const getTabCount = (key) =>
    key === 'all' ? ALL_RECORDS.length : ALL_RECORDS.filter(r => r.status === key).length

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Maintenance' }]} />

      <PageHeader
        title="Maintenance"
        subtitle="Track vehicle service records, repairs, and scheduled maintenance."
        badge={<span className="badge bg-amber-100 text-amber-700 ring-1 ring-amber-200">{ALL_RECORDS.length} records</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>Log Maintenance</Button>
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
              placeholder="Search by ID, vehicle, type, technician…"
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
            emptyTitle="No maintenance records"
            emptyDesc={search ? 'Try a different search term.' : 'Log your first maintenance record.'}
            emptyAction={!search && <Button size="sm" leftIcon={<Plus size={14} />}>Log Maintenance</Button>}
          />
        )}

        {!loading && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="records"
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Maintenance Detail Modal */}
      <Modal
        isOpen={!!detailRow} onClose={() => setDetailRow(null)}
        title="Maintenance Record" subtitle={detailRow?.id} size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDetailRow(null)}>Close</Button>
            <Button size="sm">Edit Record</Button>
          </>
        }
      >
        {detailRow && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <StatusBadge status={detailRow.status} size="lg" />
              <span className={`badge ${PRIORITY_COLOR[detailRow.priority]}`}>{detailRow.priority} Priority</span>
            </div>

            <DetailInfoGrid fields={[
              { icon: Truck,      label: 'Vehicle',     value: `${detailRow.vehicle} — ${detailRow.make}` },
              { icon: Wrench,     label: 'Service',     value: detailRow.type                             },
              { icon: User,       label: 'Technician',  value: detailRow.technician                       },
              { icon: Calendar,   label: 'Date Logged', value: formatDate(detailRow.date)                 },
              { icon: Calendar,   label: 'Completed',   value: detailRow.completedDate ? formatDate(detailRow.completedDate) : 'Pending' },
              { icon: DollarSign, label: 'Total Cost',  value: formatCurrency(detailRow.cost)             },
            ]} />

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Labour Cost</p>
                <p className="font-bold text-blue-700">{formatCurrency(detailRow.laborCost)}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Parts Cost</p>
                <p className="font-bold text-amber-700">{formatCurrency(detailRow.partsCost)}</p>
              </div>
            </div>

            {detailRow.notes && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={13} className="text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{detailRow.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
