import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader  from '@/components/layout/PageHeader'
import Button      from '@/components/common/Button'
import SearchBar   from '@/components/common/SearchBar'
import Table       from '@/components/common/Table'
import StatusBadge from '@/components/common/StatusBadge'

const MOCK_VEHICLES = [
  { id: 'V-001', plate: 'LG-001-AA', make: 'Toyota Coaster',   year: 2021, capacity: 30, mileage: '48,200 km', status: 'active'      },
  { id: 'V-002', plate: 'AB-002-BB', make: 'Mercedes Sprinter', year: 2020, capacity: 20, mileage: '62,100 km', status: 'maintenance' },
  { id: 'V-003', plate: 'KN-003-CC', make: 'Ford Transit',      year: 2022, capacity: 15, mileage: '21,500 km', status: 'active'      },
  { id: 'V-004', plate: 'LG-004-DD', make: 'Iveco Daily',       year: 2019, capacity: 25, mileage: '89,300 km', status: 'inactive'    },
]

const COLUMNS = [
  { key: 'id',       label: 'ID',          sortable: true,
    render: (v) => <span className="font-medium text-brand-600">{v}</span> },
  { key: 'plate',    label: 'Plate',
    render: (v) => <span className="font-mono text-xs">{v}</span> },
  { key: 'make',     label: 'Make / Model', sortable: true },
  { key: 'year',     label: 'Year',         sortable: true,
    render: (v) => <span className="text-slate-500">{v}</span> },
  { key: 'capacity', label: 'Capacity',
    render: (v) => <span className="text-slate-500">{v} seats</span> },
  { key: 'mileage',  label: 'Mileage',
    render: (v) => <span className="text-slate-500">{v}</span> },
  { key: 'status',   label: 'Status',
    render: (v) => <StatusBadge status={v} /> },
]

export default function VehiclesPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_VEHICLES.filter(v =>
    !search ||
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.make.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <PageHeader
        title="Vehicles"
        subtitle="Manage your fleet of vehicles"
        actions={<Button leftIcon={<Plus size={16} />}>Add Vehicle</Button>}
      />

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <SearchBar
            placeholder="Search vehicles…"
            value={search}
            onChange={setSearch}
            className="w-full sm:w-72"
          />
        </div>
        <Table
          columns={COLUMNS}
          data={filtered}
          emptyTitle="No vehicles found"
          emptyDesc={search ? 'Try a different search term.' : 'Add your first vehicle to get started.'}
          emptyAction={!search && <Button leftIcon={<Plus size={14} />} size="sm">Add Vehicle</Button>}
        />
      </div>
    </div>
  )
}
