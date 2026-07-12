import Table      from '@/components/common/Table'
import StatusBadge from '@/components/common/StatusBadge'
import Card        from '@/components/common/Card'
import { formatDate } from '@/utils'

const MOCK_TRIPS = [
  { id: 'T-001', route: 'Lagos → Abuja',          driver: 'James Okafor',  date: '2024-09-10', status: 'completed'   },
  { id: 'T-002', route: 'Abuja → Kano',           driver: 'Amina Bello',   date: '2024-09-11', status: 'in_progress' },
  { id: 'T-003', route: 'Kano → Kaduna',          driver: 'Emeka Nwosu',   date: '2024-09-12', status: 'scheduled'   },
  { id: 'T-004', route: 'Lagos → Ibadan',         driver: 'Fatima Yusuf',  date: '2024-09-09', status: 'cancelled'   },
  { id: 'T-005', route: 'Port Harcourt → Enugu',  driver: 'Chidi Eze',     date: '2024-09-10', status: 'completed'   },
]

const COLUMNS = [
  { key: 'id',     label: 'Trip ID', sortable: true,
    render: (v) => <span className="font-medium text-brand-600">{v}</span> },
  { key: 'route',  label: 'Route'  },
  { key: 'driver', label: 'Driver' },
  { key: 'date',   label: 'Date',
    render: (v) => <span className="text-slate-500">{formatDate(v)}</span> },
  { key: 'status', label: 'Status',
    render: (v) => <StatusBadge status={v} /> },
]

export default function RecentTrips() {
  return (
    <Card
      padding="none"
      header={
        <div className="px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Recent Trips</h3>
        </div>
      }
    >
      <Table
        columns={COLUMNS}
        data={MOCK_TRIPS}
        emptyTitle="No recent trips"
        emptyDesc="Trips will appear here once created."
      />
    </Card>
  )
}
