import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader  from '@/components/layout/PageHeader'
import Button      from '@/components/common/Button'
import SearchBar   from '@/components/common/SearchBar'
import Table       from '@/components/common/Table'
import StatusBadge from '@/components/common/StatusBadge'

const MOCK_DRIVERS = [
  { id: 'D-001', name: 'James Okafor',  phone: '+234 801 234 5678', license: 'DL-2024-001', trips: 142, status: 'active'   },
  { id: 'D-002', name: 'Amina Bello',   phone: '+234 802 345 6789', license: 'DL-2024-002', trips: 98,  status: 'active'   },
  { id: 'D-003', name: 'Emeka Nwosu',   phone: '+234 803 456 7890', license: 'DL-2024-003', trips: 76,  status: 'on_leave' },
  { id: 'D-004', name: 'Fatima Yusuf',  phone: '+234 804 567 8901', license: 'DL-2024-004', trips: 210, status: 'active'   },
  { id: 'D-005', name: 'Chidi Eze',     phone: '+234 805 678 9012', license: 'DL-2024-005', trips: 55,  status: 'inactive' },
]

const COLUMNS = [
  { key: 'id',      label: 'ID',          sortable: true,
    render: (v) => <span className="font-medium text-brand-600">{v}</span> },
  { key: 'name',    label: 'Name',         sortable: true,
    render: (v) => <span className="font-medium">{v}</span> },
  { key: 'phone',   label: 'Phone',
    render: (v) => <span className="text-slate-500">{v}</span> },
  { key: 'license', label: 'License No.',
    render: (v) => <span className="font-mono text-xs">{v}</span> },
  { key: 'trips',   label: 'Total Trips',  sortable: true, align: 'center',
    render: (v) => <span className="text-slate-500">{v}</span> },
  { key: 'status',  label: 'Status',
    render: (v) => <StatusBadge status={v} /> },
]

export default function DriversPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_DRIVERS.filter(d =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.license.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <PageHeader
        title="Drivers"
        subtitle="Manage driver profiles and assignments"
        actions={<Button leftIcon={<Plus size={16} />}>Add Driver</Button>}
      />

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <SearchBar
            placeholder="Search drivers…"
            value={search}
            onChange={setSearch}
            className="w-full sm:w-72"
          />
        </div>
        <Table
          columns={COLUMNS}
          data={filtered}
          emptyTitle="No drivers found"
          emptyDesc={search ? 'Try a different search term.' : 'Add your first driver to get started.'}
          emptyAction={!search && <Button leftIcon={<Plus size={14} />} size="sm">Add Driver</Button>}
        />
      </div>
    </div>
  )
}
