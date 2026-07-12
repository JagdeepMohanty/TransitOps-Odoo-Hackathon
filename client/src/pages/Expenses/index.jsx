import { useState, useMemo } from 'react'
import { Plus, Download, Eye, Receipt, Calendar, User, FileText, Tag } from 'lucide-react'

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

const ALL_EXPENSES = [
  { id: 'E-001', description: 'Diesel refill – LG-001-AA',          category: 'Fuel',        amount: 96,   vehicle: 'LG-001-AA', submittedBy: 'James Okafor',  date: '2024-09-10', approved: true,  receipt: 'RCP-001', notes: 'Regular fuel top-up for Lagos–Abuja trip.' },
  { id: 'E-002', description: 'Brake pads replacement – AB-002-BB',  category: 'Maintenance', amount: 850,  vehicle: 'AB-002-BB', submittedBy: 'Amina Bello',   date: '2024-09-08', approved: true,  receipt: 'RCP-002', notes: 'Front and rear brake pads.' },
  { id: 'E-003', description: 'Lagos–Ibadan expressway toll',         category: 'Toll',        amount: 15,   vehicle: 'LG-004-DD', submittedBy: 'Fatima Yusuf',  date: '2024-09-09', approved: true,  receipt: 'RCP-003', notes: 'Toll gate fee.' },
  { id: 'E-004', description: 'Fleet insurance renewal – Q4',         category: 'Insurance',   amount: 4200, vehicle: 'All Fleet', submittedBy: 'Admin',         date: '2024-09-01', approved: true,  receipt: 'RCP-004', notes: 'Quarterly fleet insurance premium.' },
  { id: 'E-005', description: 'Driver allowance – September',         category: 'Allowance',   amount: 320,  vehicle: '—',         submittedBy: 'Admin',         date: '2024-09-05', approved: true,  receipt: 'RCP-005', notes: 'Monthly driver allowance batch.' },
  { id: 'E-006', description: 'Engine overhaul – LG-004-DD',          category: 'Maintenance', amount: 3200, vehicle: 'LG-004-DD', submittedBy: 'Emeka Nwosu',   date: '2024-09-01', approved: false, receipt: null,      notes: 'Full engine rebuild.' },
  { id: 'E-007', description: 'Diesel refill – PH-005-EE',            category: 'Fuel',        amount: 108,  vehicle: 'PH-005-EE', submittedBy: 'Chidi Eze',     date: '2024-09-10', approved: true,  receipt: 'RCP-007', notes: 'Fuel for Port Harcourt–Enugu route.' },
  { id: 'E-008', description: 'Vehicle wash & detailing',             category: 'Other',       amount: 45,   vehicle: 'LG-007-GG', submittedBy: 'Ngozi Obi',     date: '2024-09-08', approved: true,  receipt: 'RCP-008', notes: 'Monthly vehicle cleaning.' },
  { id: 'E-009', description: 'Abuja–Lokoja toll',                    category: 'Toll',        amount: 10,   vehicle: 'AB-006-FF', submittedBy: 'Bola Adeyemi',  date: '2024-09-13', approved: false, receipt: null,      notes: 'Toll gate fee.' },
  { id: 'E-010', description: 'Tyre rotation – KN-003-CC',            category: 'Maintenance', amount: 200,  vehicle: 'KN-003-CC', submittedBy: 'Emeka Nwosu',   date: '2024-09-12', approved: false, receipt: null,      notes: 'All four tyres rotated.' },
  { id: 'E-011', description: 'Diesel refill – AB-006-FF',            category: 'Fuel',        amount: 84,   vehicle: 'AB-006-FF', submittedBy: 'Bola Adeyemi',  date: '2024-09-13', approved: true,  receipt: 'RCP-011', notes: 'Fuel top-up.' },
  { id: 'E-012', description: 'Road safety compliance fee',           category: 'Regulatory',  amount: 250,  vehicle: 'All Fleet', submittedBy: 'Admin',         date: '2024-09-02', approved: true,  receipt: 'RCP-012', notes: 'Annual FRSC compliance.' },
]

const CATEGORY_STYLE = {
  Fuel:        { pill: 'bg-blue-50 text-blue-700',     dot: 'bg-blue-500'    },
  Maintenance: { pill: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-500'   },
  Toll:        { pill: 'bg-purple-50 text-purple-700', dot: 'bg-purple-500'  },
  Insurance:   { pill: 'bg-green-50 text-green-700',   dot: 'bg-green-500'   },
  Allowance:   { pill: 'bg-pink-50 text-pink-700',     dot: 'bg-pink-500'    },
  Regulatory:  { pill: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-500'  },
  Other:       { pill: 'bg-slate-100 text-slate-600',  dot: 'bg-slate-400'   },
}

const CATEGORY_TABS = [
  { key: 'All', label: 'All' },
  ...Object.keys(CATEGORY_STYLE).map(k => ({ key: k, label: k })),
]

const STATS = [
  { label: 'Total Expenses', value: ALL_EXPENSES.length,                                                                    color: 'text-slate-900' },
  { label: 'Total Amount',   value: formatCurrency(ALL_EXPENSES.reduce((s, e) => s + e.amount, 0)),                         color: 'text-brand-600' },
  { label: 'Approved',       value: ALL_EXPENSES.filter(e => e.approved).length,                                            color: 'text-green-600' },
  { label: 'Pending',        value: ALL_EXPENSES.filter(e => !e.approved).length,                                           color: 'text-amber-600' },
  { label: 'Fuel Total',     value: formatCurrency(ALL_EXPENSES.filter(e => e.category === 'Fuel').reduce((s, e) => s + e.amount, 0)),        color: 'text-blue-600'  },
  { label: 'Maint. Total',   value: formatCurrency(ALL_EXPENSES.filter(e => e.category === 'Maintenance').reduce((s, e) => s + e.amount, 0)), color: 'text-amber-600' },
]

const PAGE_SIZE = 8

const COLUMNS = [
  { key: 'id',          label: 'ID',           sortable: true, width: '90px',
    render: (v) => <span className="font-semibold text-brand-600 font-mono text-xs">{v}</span> },
  { key: 'description', label: 'Description',  sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <Receipt size={11} className="text-slate-500" />
        </div>
        <span className="text-sm font-medium text-slate-800 truncate max-w-[220px]">{v}</span>
      </div>
    )},
  { key: 'category',    label: 'Category',     sortable: true, width: '130px',
    render: (v) => {
      const s = CATEGORY_STYLE[v] ?? CATEGORY_STYLE.Other
      return (
        <span className={`badge ${s.pill} ring-1 ring-transparent`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1`} />
          {v}
        </span>
      )
    }},
  { key: 'vehicle',     label: 'Vehicle',
    render: (v) => <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{v}</span> },
  { key: 'submittedBy', label: 'Submitted By',
    render: (v) => <span className="text-sm text-slate-600">{v}</span> },
  { key: 'date',        label: 'Date',         sortable: true,
    render: (v) => <span className="text-slate-500 text-sm">{formatDate(v)}</span> },
  { key: 'amount',      label: 'Amount',       sortable: true, align: 'right',
    render: (v) => <span className="font-bold text-slate-800">{formatCurrency(v)}</span> },
  { key: 'approved',    label: 'Status',       width: '110px',
    render: (v) => (
      <span className={`badge ring-1 ${v ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${v ? 'bg-green-500' : 'bg-amber-500'}`} />
        {v ? 'Approved' : 'Pending'}
      </span>
    )},
]

export default function ExpensesPage() {
  const [search,    setSearch]    = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [page,      setPage]      = useState(1)
  const [selected,  setSelected]  = useState([])
  const [detailRow, setDetailRow] = useState(null)
  const [loading,   setLoading]   = useState(false)

  const handleCatFilter = (cat) => {
    setLoading(true); setCatFilter(cat); setPage(1)
    setTimeout(() => setLoading(false), 500)
  }

  const filtered = useMemo(() => ALL_EXPENSES.filter(e => {
    const matchCat    = catFilter === 'All' || e.category === catFilter
    const q           = search.toLowerCase()
    const matchSearch = !q || e.id.toLowerCase().includes(q)
      || e.description.toLowerCase().includes(q)
      || e.category.toLowerCase().includes(q)
      || e.submittedBy.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [search, catFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const getTabCount = (key) =>
    key === 'All' ? ALL_EXPENSES.length : ALL_EXPENSES.filter(e => e.category === key).length

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Expenses' }]} />

      <PageHeader
        title="Expenses"
        subtitle="Track, categorise and approve all operational expenditures."
        badge={<span className="badge bg-green-100 text-green-700 ring-1 ring-green-200">{ALL_EXPENSES.length} records</span>}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>Add Expense</Button>
          </>
        }
      />

      <StatsGrid stats={STATS} />

      <Card padding="none">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <FilterTabBar
            tabs={CATEGORY_TABS}
            active={catFilter}
            onChange={handleCatFilter}
            getCount={getTabCount}
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="Search by ID, description, category…"
              value={search}
              onChange={(v) => { setSearch(v); setPage(1) }}
              className="w-full sm:w-72"
            />
            <BulkActionBar
              count={selected.length}
              actions={
                <>
                  <Button variant="secondary" size="sm">Approve All</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </>
              }
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
            emptyTitle="No expenses found"
            emptyDesc={search ? 'Try a different search term.' : 'Start tracking your fleet expenses.'}
            emptyAction={!search && <Button size="sm" leftIcon={<Plus size={14} />}>Add Expense</Button>}
          />
        )}

        {!loading && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="expenses"
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Expense Detail Modal */}
      <Modal
        isOpen={!!detailRow} onClose={() => setDetailRow(null)}
        title="Expense Details" subtitle={detailRow?.id} size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDetailRow(null)}>Close</Button>
            {!detailRow?.approved && <Button variant="secondary" size="sm">Approve</Button>}
            <Button size="sm">Edit</Button>
          </>
        }
      >
        {detailRow && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className={`badge ${CATEGORY_STYLE[detailRow.category]?.pill ?? 'bg-slate-100 text-slate-600'}`}>
                <Tag size={11} className="mr-1" />{detailRow.category}
              </span>
              <span className={`badge ${detailRow.approved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {detailRow.approved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>

            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-center">
              <p className="text-xs text-brand-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-brand-700">{formatCurrency(detailRow.amount)}</p>
            </div>

            <DetailInfoGrid fields={[
              { icon: Receipt,  label: 'Description',  value: detailRow.description              },
              { icon: User,     label: 'Submitted By', value: detailRow.submittedBy              },
              { icon: Calendar, label: 'Date',         value: formatDate(detailRow.date)         },
              { icon: FileText, label: 'Receipt No.',  value: detailRow.receipt ?? 'Not uploaded' },
            ]} />

            {detailRow.notes && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Notes</p>
                <p className="text-sm text-slate-700 leading-relaxed">{detailRow.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
