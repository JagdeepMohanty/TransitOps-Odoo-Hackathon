import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Wrench, Truck, Calendar, RefreshCw, CheckCircle, FileText } from 'lucide-react'

import PageHeader    from '@/components/layout/PageHeader'
import Breadcrumb    from '@/components/common/Breadcrumb'
import Button        from '@/components/common/Button'
import SearchBar     from '@/components/common/SearchBar'
import Table         from '@/components/common/Table'
import StatusBadge   from '@/components/common/StatusBadge'
import Modal         from '@/components/common/Modal'
import Loader        from '@/components/common/Loader'
import Card          from '@/components/common/Card'
import FilterTabBar  from '@/components/common/FilterTabBar'
import StatsGrid     from '@/components/common/StatsGrid'
import PaginationBar from '@/components/common/PaginationBar'
import { formatDate, formatCurrency } from '@/utils'
import { maintenanceApi } from '@/api/maintenance.api'
import { vehiclesApi    } from '@/api/vehicles.api'

// ── Constants ──────────────────────────────────────────────────────────────────
const MAINTENANCE_TYPES = [
  'Oil Change', 'Tyre Replacement', 'Brake Inspection',
  'Pollution Certificate Check', 'General Service',
  'Engine Overhaul', 'Battery Replacement', 'AC Service', 'Annual Inspection',
]

const STATUS_TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'ACTIVE',    label: 'Active'    },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

const PAGE_SIZE = 10

const errMsg = (err) =>
  err?.response?.data?.message ?? err?.message ?? 'Something went wrong.'

const today = () => new Date().toISOString().slice(0, 10)

export default function MaintenancePage() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [records,   setRecords]   = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  // ── Filter / pagination ──────────────────────────────────────────────────────
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [page,      setPage]      = useState(1)

  // ── Create modal ─────────────────────────────────────────────────────────────
  const [showCreate,    setShowCreate]    = useState(false)
  const [vehicles,      setVehicles]      = useState([])
  const [loadingVeh,    setLoadingVeh]    = useState(false)
  const [createForm,    setCreateForm]    = useState({
    vehicleId: '', maintenanceType: '', description: '', startDate: today(), cost: '', notes: '',
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError,   setCreateError]   = useState(null)

  // ── Close modal ──────────────────────────────────────────────────────────────
  const [closeRow,     setCloseRow]     = useState(null)
  const [closeForm,    setCloseForm]    = useState({ cost: '', notes: '' })
  const [closeLoading, setCloseLoading] = useState(false)
  const [closeError,   setCloseError]   = useState(null)

  // ── Fetch records ────────────────────────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: PAGE_SIZE }
      if (activeTab !== 'all') params.status = activeTab
      const res = await maintenanceApi.list(params)
      const d   = res.data.data
      setRecords(d.data ?? [])
      setTotal(d.pagination?.total ?? 0)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setLoading(false)
    }
  }, [page, activeTab])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  // ── Load vehicles for create form ────────────────────────────────────────────
  const openCreate = async () => {
    setCreateError(null)
    setCreateForm({ vehicleId: '', maintenanceType: '', description: '', startDate: today(), cost: '', notes: '' })
    setShowCreate(true)
    setLoadingVeh(true)
    try {
      // Load all vehicles (not just available) so fleet manager can see what's in shop
      const res = await vehiclesApi.getAll({ limit: 100 })
      const all = res.data.data?.data ?? []
      // Exclude RETIRED and ON_TRIP — only AVAILABLE and IN_SHOP are valid targets
      setVehicles(all.filter(v => v.status !== 'RETIRED' && v.status !== 'ON_TRIP'))
    } catch {
      setCreateError('Failed to load vehicles.')
    } finally {
      setLoadingVeh(false)
    }
  }

  // ── Tab counts ───────────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => {
    const counts = { all: total }
    STATUS_TABS.slice(1).forEach(t => {
      counts[t.key] = records.filter(r => r.status === t.key).length
    })
    return counts
  }, [records, total])

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalCost = records.reduce((s, r) => s + parseFloat(r.cost ?? 0), 0)
    return [
      { label: 'Total',     value: total,                                                  color: 'text-slate-900'   },
      { label: 'Active',    value: records.filter(r => r.status === 'ACTIVE').length,      color: 'text-amber-600'   },
      { label: 'Completed', value: records.filter(r => r.status === 'COMPLETED').length,   color: 'text-emerald-600' },
      { label: 'Cancelled', value: records.filter(r => r.status === 'CANCELLED').length,   color: 'text-slate-500'   },
      { label: 'Total Cost',value: formatCurrency(totalCost),                              color: 'text-brand-600'   },
    ]
  }, [records, total])

  // ── Client-side search filter ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return records
    const q = search.toLowerCase()
    return records.filter(r =>
      r.maintenanceType?.toLowerCase().includes(q) ||
      r.vehicle?.registrationNumber?.toLowerCase().includes(q) ||
      r.vehicle?.name?.toLowerCase().includes(q)
    )
  }, [records, search])

  // ── Create submit ────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setCreateError(null)
    if (!createForm.vehicleId)       { setCreateError('Select a vehicle.'); return }
    if (!createForm.maintenanceType) { setCreateError('Select a maintenance type.'); return }
    if (!createForm.startDate)       { setCreateError('Start date is required.'); return }

    setCreateLoading(true)
    try {
      await maintenanceApi.create({
        vehicleId:       parseInt(createForm.vehicleId),
        maintenanceType: createForm.maintenanceType,
        description:     createForm.description || undefined,
        startDate:       new Date(createForm.startDate).toISOString(),
        cost:            createForm.cost ? parseFloat(createForm.cost) : 0,
        notes:           createForm.notes || undefined,
      })
      setShowCreate(false)
      fetchRecords()
    } catch (err) {
      setCreateError(errMsg(err))
    } finally {
      setCreateLoading(false)
    }
  }

  // ── Close submit ─────────────────────────────────────────────────────────────
  const handleClose = async () => {
    setCloseError(null)
    setCloseLoading(true)
    try {
      await maintenanceApi.close(closeRow.id, {
        cost:  closeForm.cost  ? parseFloat(closeForm.cost)  : undefined,
        notes: closeForm.notes || undefined,
      })
      setCloseRow(null)
      fetchRecords()
    } catch (err) {
      setCloseError(errMsg(err))
    } finally {
      setCloseLoading(false)
    }
  }

  // ── Table columns ────────────────────────────────────────────────────────────
  const COLUMNS = [
    { key: 'id', label: 'ID', width: '70px',
      render: (v) => <span className="font-mono text-xs text-brand-600 font-semibold">#{v}</span> },
    { key: 'vehicle', label: 'Vehicle',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <Truck size={12} className="text-slate-400 shrink-0" />
          <div>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {row.vehicle?.registrationNumber ?? '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">{row.vehicle?.name ?? ''}</p>
          </div>
        </div>
      )},
    { key: 'maintenanceType', label: 'Service Type', sortable: true,
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Wrench size={11} className="text-amber-600" />
          </div>
          <span className="text-sm font-medium text-slate-800">{v}</span>
        </div>
      )},
    { key: 'startDate', label: 'Start Date', sortable: true,
      render: (v) => <span className="text-xs text-slate-500">{formatDate(v)}</span> },
    { key: 'endDate', label: 'End Date',
      render: (v) => <span className="text-xs text-slate-500">{v ? formatDate(v) : '—'}</span> },
    { key: 'cost', label: 'Cost (₹)', align: 'right',
      render: (v) => <span className="font-semibold text-slate-800">{formatCurrency(parseFloat(v ?? 0))}</span> },
    { key: 'status', label: 'Status', width: '120px',
      render: (v) => <StatusBadge status={v} /> },
    { key: '_actions', label: '', width: '60px',
      render: (_, row) => row.status === 'ACTIVE' ? (
        <button
          title="Close Maintenance"
          onClick={(e) => { e.stopPropagation(); setCloseRow(row); setCloseForm({ cost: String(parseFloat(row.cost ?? 0)), notes: '' }); setCloseError(null) }}
          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <CheckCircle size={15} />
        </button>
      ) : null },
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Maintenance' }]} />

      <PageHeader
        title="Maintenance"
        subtitle="Track vehicle service records, repairs, and scheduled maintenance."
        badge={<span className="badge bg-amber-100 text-amber-700 ring-1 ring-amber-200">{total} records</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchRecords} loading={loading}>
              Refresh
            </Button>
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={openCreate}>
              Log Maintenance
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
            placeholder="Search vehicle, service type…"
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
            <Button size="sm" variant="secondary" onClick={fetchRecords}>Retry</Button>
          </div>
        ) : (
          <Table
            columns={COLUMNS}
            data={filtered}
            emptyTitle="No maintenance records"
            emptyDesc={search || activeTab !== 'all' ? 'Try clearing filters.' : 'Log your first maintenance record.'}
            emptyAction={!search && activeTab === 'all' && (
              <Button size="sm" leftIcon={<Plus size={14} />} onClick={openCreate}>Log Maintenance</Button>
            )}
          />
        )}

        {!loading && !error && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={PAGE_SIZE}
            itemLabel="records"
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* ── Create Maintenance Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Log Maintenance"
        subtitle="Vehicle will be set to IN_SHOP on creation."
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowCreate(false)} disabled={createLoading}>Cancel</Button>
            <Button size="sm" loading={createLoading} onClick={handleCreate}>Create Record</Button>
          </>
        }
      >
        <div className="space-y-4">
          {createError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{createError}</div>
          )}

          <MField label="Vehicle *">
            {loadingVeh ? (
              <div className="text-xs text-slate-500 py-2">Loading vehicles…</div>
            ) : (
              <select
                value={createForm.vehicleId}
                onChange={e => setCreateForm(f => ({ ...f, vehicleId: e.target.value }))}
                className={inputCls()}
              >
                <option value="">Select vehicle…</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber} — {v.name} [{v.status}]
                  </option>
                ))}
              </select>
            )}
          </MField>

          <MField label="Maintenance Type *">
            <select
              value={createForm.maintenanceType}
              onChange={e => setCreateForm(f => ({ ...f, maintenanceType: e.target.value }))}
              className={inputCls()}
            >
              <option value="">Select type…</option>
              {MAINTENANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </MField>

          <MField label="Description">
            <input
              type="text"
              value={createForm.description}
              onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of work to be done"
              className={inputCls()}
            />
          </MField>

          <div className="grid grid-cols-2 gap-3">
            <MField label="Start Date *">
              <input
                type="date"
                value={createForm.startDate}
                onChange={e => setCreateForm(f => ({ ...f, startDate: e.target.value }))}
                className={inputCls()}
              />
            </MField>
            <MField label="Estimated Cost (₹)">
              <input
                type="number" min="0" step="0.01"
                value={createForm.cost}
                onChange={e => setCreateForm(f => ({ ...f, cost: e.target.value }))}
                placeholder="e.g. 3500"
                className={inputCls()}
              />
            </MField>
          </div>

          <MField label="Notes">
            <textarea
              rows={2}
              value={createForm.notes}
              onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Additional notes…"
              className={`${inputCls()} h-auto py-2 resize-none`}
            />
          </MField>
        </div>
      </Modal>

      {/* ── Close Maintenance Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={!!closeRow}
        onClose={() => setCloseRow(null)}
        title="Close Maintenance"
        subtitle={`${closeRow?.maintenanceType} — ${closeRow?.vehicle?.registrationNumber ?? ''}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCloseRow(null)} disabled={closeLoading}>Cancel</Button>
            <Button size="sm" variant="success" loading={closeLoading} onClick={handleClose}>Mark Completed</Button>
          </>
        }
      >
        <div className="space-y-4">
          {closeError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{closeError}</div>
          )}
          <p className="text-sm text-slate-600">
            Closing this record will mark it <strong>COMPLETED</strong> and restore the vehicle to <strong>AVAILABLE</strong>.
          </p>
          <MField label="Final Cost (₹)">
            <input
              type="number" min="0" step="0.01"
              value={closeForm.cost}
              onChange={e => setCloseForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="e.g. 3500"
              className={inputCls()}
            />
          </MField>
          <MField label="Closing Notes">
            <textarea
              rows={2}
              value={closeForm.notes}
              onChange={e => setCloseForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Work completed, parts replaced, next service due…"
              className={`${inputCls()} h-auto py-2 resize-none`}
            />
          </MField>
        </div>
      </Modal>
    </div>
  )
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function MField({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

const inputCls = () =>
  'w-full h-9 px-3 text-sm border border-slate-200 rounded-xl outline-none transition bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500'
