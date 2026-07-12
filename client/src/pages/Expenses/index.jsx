import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Download, Eye, Receipt, Calendar, Tag, RefreshCw, Truck } from 'lucide-react'

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
import PaginationBar  from '@/components/common/PaginationBar'
import DetailInfoGrid from '@/components/common/DetailInfoGrid'
import { formatDate, formatCurrency } from '@/utils'
import { expensesApi } from '@/api/expenses.api'
import { vehiclesApi } from '@/api/vehicles.api'
import { EXPENSE_TYPES } from '@/utils/constants'

const PAGE_SIZE = 10
const errMsg = (e) => e?.response?.data?.message ?? e?.message ?? 'Something went wrong.'
const today  = () => new Date().toISOString().slice(0, 10)

const TYPE_STYLE = {
  FUEL:        { pill: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-500'   },
  MAINTENANCE: { pill: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-500'  },
  TOLL:        { pill: 'bg-purple-50 text-purple-700',dot: 'bg-purple-500' },
  PARKING:     { pill: 'bg-green-50 text-green-700',  dot: 'bg-green-500'  },
  REPAIR:      { pill: 'bg-red-50 text-red-700',      dot: 'bg-red-500'    },
  OTHER:       { pill: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400'  },
}

const TYPE_LABEL = Object.fromEntries(EXPENSE_TYPES.map(({ value, label }) => [value, label]))

const TYPE_TABS = [
  { key: 'All', label: 'All' },
  ...EXPENSE_TYPES.map(({ value, label }) => ({ key: value, label })),
]

export default function ExpensesPage() {
  const [expenses,      setExpenses]      = useState([])
  const [total,         setTotal]         = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [page,          setPage]          = useState(1)
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState('All')
  const [detailRow,     setDetailRow]     = useState(null)

  // Create modal
  const [showCreate,    setShowCreate]    = useState(false)
  const [vehicles,      setVehicles]      = useState([])
  const [loadingVeh,    setLoadingVeh]    = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError,   setCreateError]   = useState(null)
  const [form, setForm] = useState({
    vehicleId: '', tripId: '', type: '', amount: '', description: '', expenseDate: today(),
  })

  const fetchExpenses = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = { page, limit: PAGE_SIZE }
      if (search.trim())          params.search = search.trim()
      if (typeFilter !== 'All')   params.type   = typeFilter
      const res = await expensesApi.list(params)
      const d   = res.data.data
      setExpenses(d.data ?? [])
      setTotal(d.pagination?.total ?? 0)
    } catch (e) { setError(errMsg(e)) }
    finally     { setLoading(false) }
  }, [page, search, typeFilter])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  const stats = useMemo(() => {
    const totalAmt  = expenses.reduce((s, e) => s + parseFloat(e.amount ?? 0), 0)
    const fuelAmt   = expenses.filter(e => e.type === 'FUEL').reduce((s, e) => s + parseFloat(e.amount ?? 0), 0)
    const maintAmt  = expenses.filter(e => e.type === 'MAINTENANCE').reduce((s, e) => s + parseFloat(e.amount ?? 0), 0)
    return [
      { label: 'Total Records',  value: total,                color: 'text-slate-900' },
      { label: 'Total Amount',   value: formatCurrency(totalAmt), color: 'text-brand-600' },
      { label: 'Fuel Total',     value: formatCurrency(fuelAmt),  color: 'text-blue-600'  },
      { label: 'Maint. Total',   value: formatCurrency(maintAmt), color: 'text-amber-600' },
    ]
  }, [expenses, total])

  const openCreate = async () => {
    setCreateError(null)
    setForm({ vehicleId: '', tripId: '', type: '', amount: '', description: '', expenseDate: today() })
    setShowCreate(true)
    setLoadingVeh(true)
    try {
      const res = await vehiclesApi.getAll({ limit: 100 })
      setVehicles(res.data.data?.data ?? [])
    } catch { setCreateError('Failed to load vehicles.') }
    finally   { setLoadingVeh(false) }
  }

  const handleCreate = async () => {
    setCreateError(null)
    if (!form.vehicleId)                                  { setCreateError('Select a vehicle.'); return }
    if (!form.type)                                       { setCreateError('Select an expense type.'); return }
    if (!form.amount || parseFloat(form.amount) < 0)      { setCreateError('Amount must be ≥ 0.'); return }
    if (!form.expenseDate)                                { setCreateError('Date is required.'); return }

    setCreateLoading(true)
    try {
      await expensesApi.create({
        vehicleId:   parseInt(form.vehicleId),
        type:        form.type,
        amount:      parseFloat(form.amount),
        description: form.description || undefined,
        expenseDate: new Date(form.expenseDate).toISOString(),
        ...(form.tripId && { tripId: parseInt(form.tripId) }),
      })
      setShowCreate(false)
      fetchExpenses()
    } catch (e) { setCreateError(errMsg(e)) }
    finally     { setCreateLoading(false) }
  }

  const getTabCount = (key) => key === 'All' ? total : undefined

  const COLUMNS = [
    { key: 'id', label: 'ID', width: '70px',
      render: (v) => <span className="font-mono text-xs text-brand-600 font-semibold">#{v}</span> },
    { key: 'type', label: 'Type', width: '130px',
      render: (v) => {
        const s = TYPE_STYLE[v] ?? TYPE_STYLE.OTHER
        return (
          <span className={`badge ${s.pill} ring-1 ring-transparent`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1`} />
            {TYPE_LABEL[v] ?? v}
          </span>
        )
      }},
    { key: 'vehicle', label: 'Vehicle',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Truck size={13} className="text-blue-600" />
          </div>
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
            {row.vehicle?.registrationNumber ?? '—'}
          </span>
        </div>
      )},
    { key: 'description', label: 'Description',
      render: (v) => <span className="text-sm text-slate-700 truncate max-w-[200px] block">{v || '—'}</span> },
    { key: 'expenseDate', label: 'Date', sortable: true,
      render: (v) => <span className="text-xs text-slate-500">{formatDate(v)}</span> },
    { key: 'amount', label: 'Amount (₹)', align: 'right',
      render: (v) => <span className="font-bold text-slate-800">{formatCurrency(parseFloat(v ?? 0))}</span> },
    { key: '_actions', label: '', width: '50px',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDetailRow(row) }}
          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
        >
          <Eye size={15} />
        </button>
      )},
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Expenses' }]} />

      <PageHeader
        title="Expenses"
        subtitle="Track and categorise all operational expenditures."
        badge={<span className="badge bg-green-100 text-green-700 ring-1 ring-green-200">{total} records</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchExpenses} loading={loading}>
              Refresh
            </Button>
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={openCreate}>
              Add Expense
            </Button>
          </>
        }
      />

      <StatsGrid stats={stats} />

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <FilterTabBar
            tabs={TYPE_TABS}
            active={typeFilter}
            onChange={(v) => { setTypeFilter(v); setPage(1) }}
            getCount={getTabCount}
          />
          <SearchBar
            placeholder="Search description, vehicle…"
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
            <Button size="sm" variant="secondary" onClick={fetchExpenses}>Retry</Button>
          </div>
        ) : (
          <Table
            columns={COLUMNS}
            data={expenses}
            onRowClick={setDetailRow}
            emptyTitle="No expenses found"
            emptyDesc={search ? 'Try a different search term.' : 'Start tracking your fleet expenses.'}
            emptyAction={!search && <Button size="sm" leftIcon={<Plus size={14} />} onClick={openCreate}>Add Expense</Button>}
          />
        )}

        {!loading && !error && (
          <PaginationBar
            page={page} totalPages={totalPages} totalItems={total}
            pageSize={PAGE_SIZE} itemLabel="expenses" onPageChange={setPage}
          />
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreate} onClose={() => setShowCreate(false)}
        title="Add Expense" size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowCreate(false)} disabled={createLoading}>Cancel</Button>
            <Button size="sm" loading={createLoading} onClick={handleCreate}>Save Expense</Button>
          </>
        }
      >
        <div className="space-y-4">
          {createError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{createError}</div>
          )}

          <MField label="Vehicle *">
            {loadingVeh ? <p className="text-xs text-slate-500 py-2">Loading…</p> : (
              <select value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))} className={iCls()}>
                <option value="">Select vehicle…</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name}</option>
                ))}
              </select>
            )}
          </MField>

          <MField label="Expense Type *">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={iCls()}>
              <option value="">Select type…</option>
              {EXPENSE_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </MField>

          <div className="grid grid-cols-2 gap-3">
            <MField label="Amount (₹) *">
              <input type="number" min="0" step="0.01" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 2500" className={iCls()} />
            </MField>
            <MField label="Date *">
              <input type="date" value={form.expenseDate}
                onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))}
                className={iCls()} />
            </MField>
          </div>

          <MField label="Description">
            <input type="text" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional description" className={iCls()} />
          </MField>

          <MField label="Trip ID (optional)">
            <input type="number" min="1" step="1" value={form.tripId}
              onChange={e => setForm(f => ({ ...f, tripId: e.target.value }))}
              placeholder="Link to a trip" className={iCls()} />
          </MField>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!detailRow} onClose={() => setDetailRow(null)}
        title="Expense Details" subtitle={detailRow ? `#${detailRow.id}` : ''} size="md"
        footer={<Button variant="secondary" size="sm" onClick={() => setDetailRow(null)}>Close</Button>}
      >
        {detailRow && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className={`badge ${TYPE_STYLE[detailRow.type]?.pill ?? 'bg-slate-100 text-slate-600'}`}>
                <Tag size={11} className="mr-1" />{TYPE_LABEL[detailRow.type] ?? detailRow.type}
              </span>
            </div>
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-center">
              <p className="text-xs text-brand-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-brand-700">{formatCurrency(detailRow.amount)}</p>
            </div>
            <DetailInfoGrid fields={[
              { icon: Receipt,  label: 'Description', value: detailRow.description || '—'                    },
              { icon: Calendar, label: 'Date',        value: formatDate(detailRow.expenseDate)               },
              { icon: Tag,      label: 'Vehicle',     value: detailRow.vehicle?.registrationNumber ?? '—'    },
            ]} />
          </div>
        )}
      </Modal>
    </div>
  )
}

function MField({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

const iCls = () =>
  'w-full h-9 px-3 text-sm border border-slate-200 rounded-xl outline-none bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition'
