import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MapPin, User, Truck, RefreshCw, CheckCircle, XCircle, Send, Trash2 } from 'lucide-react'

import PageHeader     from '@/components/layout/PageHeader'
import Breadcrumb     from '@/components/common/Breadcrumb'
import Button         from '@/components/common/Button'
import SearchBar      from '@/components/common/SearchBar'
import Table          from '@/components/common/Table'
import StatusBadge    from '@/components/common/StatusBadge'
import Modal          from '@/components/common/Modal'
import { ConfirmModal } from '@/components/common/Modal'
import Loader         from '@/components/common/Loader'
import Card           from '@/components/common/Card'
import FilterTabBar   from '@/components/common/FilterTabBar'
import StatsGrid      from '@/components/common/StatsGrid'
import PaginationBar  from '@/components/common/PaginationBar'
import { formatDate, formatCurrency } from '@/utils'
import { tripsApi }   from '@/api/trips.api'

// ── Status tab config ──────────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: 'all',        label: 'All'        },
  { key: 'DRAFT',      label: 'Draft'      },
  { key: 'DISPATCHED', label: 'Dispatched' },
  { key: 'COMPLETED',  label: 'Completed'  },
  { key: 'CANCELLED',  label: 'Cancelled'  },
]

const PAGE_SIZE = 10

// ── Helpers ────────────────────────────────────────────────────────────────────
const errMsg = (err) =>
  err?.response?.data?.message ?? err?.message ?? 'Something went wrong.'

export default function TripsPage() {
  const navigate = useNavigate()

  // ── Data state ───────────────────────────────────────────────────────────────
  const [trips,     setTrips]     = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  // ── Filter / pagination state ────────────────────────────────────────────────
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [page,      setPage]      = useState(1)

  // ── Action modal state ───────────────────────────────────────────────────────
  const [actionRow,    setActionRow]    = useState(null)   // row being acted on
  const [actionType,   setActionType]   = useState(null)   // 'dispatch'|'cancel'|'delete'|'complete'
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError,  setActionError]  = useState(null)

  // Complete form fields
  const [completeForm, setCompleteForm] = useState({
    actualDistance: '', finalOdometer: '', fuelConsumed: '', revenue: '',
  })

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: PAGE_SIZE }
      if (activeTab !== 'all') params.status = activeTab
      if (search.trim())       params.search  = search.trim()
      const res = await tripsApi.list(params)
      const d   = res.data.data
      setTrips(d.data ?? [])
      setTotal(d.pagination?.total ?? 0)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setLoading(false)
    }
  }, [page, activeTab, search])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  // ── Tab counts (derived from current full list — approximate) ────────────────
  const tabCounts = useMemo(() => {
    const counts = { all: total }
    STATUS_TABS.slice(1).forEach(t => {
      counts[t.key] = trips.filter(r => r.status === t.key).length
    })
    return counts
  }, [trips, total])

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRevenue = trips
      .filter(t => t.status === 'COMPLETED')
      .reduce((s, t) => s + parseFloat(t.revenue ?? 0), 0)
    return [
      { label: 'Total',      value: total,                                                    color: 'text-slate-900' },
      { label: 'Draft',      value: trips.filter(t => t.status === 'DRAFT').length,           color: 'text-slate-600' },
      { label: 'Dispatched', value: trips.filter(t => t.status === 'DISPATCHED').length,      color: 'text-amber-600' },
      { label: 'Completed',  value: trips.filter(t => t.status === 'COMPLETED').length,       color: 'text-emerald-600' },
      { label: 'Cancelled',  value: trips.filter(t => t.status === 'CANCELLED').length,       color: 'text-red-500'   },
      { label: 'Revenue',    value: formatCurrency(totalRevenue),                             color: 'text-brand-600' },
    ]
  }, [trips, total])

  // ── Action handlers ──────────────────────────────────────────────────────────
  const openAction = (row, type) => {
    setActionRow(row)
    setActionType(type)
    setActionError(null)
    if (type === 'complete') {
      setCompleteForm({ actualDistance: '', finalOdometer: '', fuelConsumed: '', revenue: '' })
    }
  }
  const closeAction = () => { setActionRow(null); setActionType(null); setActionError(null) }

  const runAction = async () => {
    setActionLoading(true)
    setActionError(null)
    try {
      if (actionType === 'dispatch') {
        await tripsApi.dispatch(actionRow.id)
      } else if (actionType === 'cancel') {
        await tripsApi.cancel(actionRow.id)
      } else if (actionType === 'delete') {
        await tripsApi.remove(actionRow.id)
      } else if (actionType === 'complete') {
        const payload = {
          actualDistance: parseFloat(completeForm.actualDistance),
          finalOdometer:  parseFloat(completeForm.finalOdometer),
          fuelConsumed:   completeForm.fuelConsumed ? parseFloat(completeForm.fuelConsumed) : undefined,
          revenue:        completeForm.revenue      ? parseFloat(completeForm.revenue)      : undefined,
        }
        await tripsApi.complete(actionRow.id, payload)
      }
      closeAction()
      fetchTrips()
    } catch (err) {
      setActionError(errMsg(err))
    } finally {
      setActionLoading(false)
    }
  }

  // ── Table columns ────────────────────────────────────────────────────────────
  const COLUMNS = [
    { key: 'id', label: 'ID', sortable: true, width: '70px',
      render: (v) => <span className="font-mono text-xs text-brand-600 font-semibold">#{v}</span> },
    { key: 'source', label: 'Route', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-brand-500 shrink-0" />
          <span className="text-sm font-medium text-slate-800 truncate max-w-[160px]">
            {row.source} → {row.destination}
          </span>
        </div>
      )},
    { key: 'vehicle', label: 'Vehicle',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <Truck size={12} className="text-slate-400 shrink-0" />
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
            {row.vehicle?.registrationNumber ?? '—'}
          </span>
        </div>
      )},
    { key: 'driver', label: 'Driver',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-700">{row.driver?.name ?? '—'}</span>
        </div>
      )},
    { key: 'cargoWeight', label: 'Cargo (kg)', align: 'right',
      render: (v) => <span className="text-sm text-slate-600">{parseFloat(v ?? 0).toLocaleString('en-IN')}</span> },
    { key: 'plannedDistance', label: 'Dist (km)', align: 'right',
      render: (v) => <span className="text-sm text-slate-600">{parseFloat(v ?? 0).toLocaleString('en-IN')}</span> },
    { key: 'status', label: 'Status', width: '120px',
      render: (v) => <StatusBadge status={v} /> },
    { key: 'createdAt', label: 'Created', sortable: true,
      render: (v) => <span className="text-xs text-slate-400">{formatDate(v)}</span> },
    { key: '_actions', label: '', width: '120px',
      render: (_, row) => <ActionButtons row={row} onAction={openAction} /> },
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Trips' }]} />

      <PageHeader
        title="Trips"
        subtitle="Schedule, dispatch and monitor all fleet trips."
        badge={<span className="badge bg-brand-100 text-brand-700 ring-1 ring-brand-200">{total} total</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchTrips} loading={loading}>
              Refresh
            </Button>
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => navigate('/trips/create')}>
              New Trip
            </Button>
          </>
        }
      />

      <StatsGrid stats={stats} />

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <FilterTabBar
            tabs={STATUS_TABS}
            active={activeTab}
            onChange={(key) => { setActiveTab(key); setPage(1) }}
            getCount={(key) => tabCounts[key] ?? 0}
          />
          <SearchBar
            placeholder="Search source, destination…"
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            className="w-full sm:w-72"
          />
        </div>

        {loading ? (
          <Loader variant="skeleton" lines={8} className="p-5" />
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <Button size="sm" variant="secondary" onClick={fetchTrips}>Retry</Button>
          </div>
        ) : (
          <Table
            columns={COLUMNS}
            data={trips}
            emptyTitle="No trips found"
            emptyDesc={search || activeTab !== 'all' ? 'Try clearing filters.' : 'Create your first trip to get started.'}
            emptyAction={!search && activeTab === 'all' && (
              <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => navigate('/trips/create')}>New Trip</Button>
            )}
          />
        )}

        {!loading && !error && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={PAGE_SIZE}
            itemLabel="trips"
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* ── Dispatch confirm ─────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={actionType === 'dispatch'}
        onClose={closeAction}
        onConfirm={runAction}
        loading={actionLoading}
        title="Dispatch Trip"
        description={`Dispatch trip #${actionRow?.id} from ${actionRow?.source} to ${actionRow?.destination}? Vehicle and driver will be marked ON_TRIP.`}
        confirmLabel="Dispatch"
      />

      {/* ── Cancel confirm ───────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={actionType === 'cancel'}
        onClose={closeAction}
        onConfirm={runAction}
        loading={actionLoading}
        title="Cancel Trip"
        description={`Cancel trip #${actionRow?.id}? This cannot be undone.`}
        confirmLabel="Cancel Trip"
      />

      {/* ── Delete confirm ───────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={actionType === 'delete'}
        onClose={closeAction}
        onConfirm={runAction}
        loading={actionLoading}
        title="Delete Trip"
        description={`Permanently delete trip #${actionRow?.id}? Only DRAFT and CANCELLED trips can be deleted.`}
        confirmLabel="Delete"
      />

      {/* ── Complete modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={actionType === 'complete'}
        onClose={closeAction}
        title="Complete Trip"
        subtitle={`Trip #${actionRow?.id} — ${actionRow?.source} → ${actionRow?.destination}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={closeAction} disabled={actionLoading}>Cancel</Button>
            <Button
              size="sm"
              variant="success"
              loading={actionLoading}
              onClick={runAction}
              disabled={!completeForm.actualDistance || !completeForm.finalOdometer}
            >
              Mark Completed
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{actionError}</div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Actual Distance (km) *</span>
              <input
                type="number" min="0" step="0.1"
                value={completeForm.actualDistance}
                onChange={e => setCompleteForm(f => ({ ...f, actualDistance: e.target.value }))}
                className="input mt-1 w-full"
                placeholder="e.g. 535"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Final Odometer (km) *</span>
              <input
                type="number" min="0" step="0.1"
                value={completeForm.finalOdometer}
                onChange={e => setCompleteForm(f => ({ ...f, finalOdometer: e.target.value }))}
                className="input mt-1 w-full"
                placeholder="e.g. 48735"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Fuel Consumed (L)</span>
              <input
                type="number" min="0" step="0.1"
                value={completeForm.fuelConsumed}
                onChange={e => setCompleteForm(f => ({ ...f, fuelConsumed: e.target.value }))}
                className="input mt-1 w-full"
                placeholder="e.g. 120"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Revenue (₹)</span>
              <input
                type="number" min="0" step="0.01"
                value={completeForm.revenue}
                onChange={e => setCompleteForm(f => ({ ...f, revenue: e.target.value }))}
                className="input mt-1 w-full"
                placeholder="e.g. 45000"
              />
            </label>
          </div>
        </div>
      </Modal>

      {/* Error toast for non-complete actions */}
      {actionError && actionType !== 'complete' && (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-red-600 text-white rounded-xl shadow-lg text-sm max-w-sm">
          {actionError}
        </div>
      )}
    </div>
  )
}

// ── Action buttons per row ─────────────────────────────────────────────────────
function ActionButtons({ row, onAction }) {
  const { status } = row
  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      {status === 'DRAFT' && (
        <>
          <ActionBtn icon={<Send size={13} />}    title="Dispatch" color="text-amber-600 hover:bg-amber-50"  onClick={() => onAction(row, 'dispatch')} />
          <ActionBtn icon={<XCircle size={13} />} title="Cancel"   color="text-red-500 hover:bg-red-50"      onClick={() => onAction(row, 'cancel')}   />
          <ActionBtn icon={<Trash2 size={13} />}  title="Delete"   color="text-slate-400 hover:bg-slate-100" onClick={() => onAction(row, 'delete')}   />
        </>
      )}
      {status === 'DISPATCHED' && (
        <>
          <ActionBtn icon={<CheckCircle size={13} />} title="Complete" color="text-emerald-600 hover:bg-emerald-50" onClick={() => onAction(row, 'complete')} />
          <ActionBtn icon={<XCircle size={13} />}     title="Cancel"   color="text-red-500 hover:bg-red-50"         onClick={() => onAction(row, 'cancel')}   />
        </>
      )}
    </div>
  )
}

function ActionBtn({ icon, title, color, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${color}`}
    >
      {icon}
    </button>
  )
}
