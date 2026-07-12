import { useState, useEffect } from 'react'
import Table       from '@/components/common/Table'
import StatusBadge from '@/components/common/StatusBadge'
import Card        from '@/components/common/Card'
import { formatDate } from '@/utils'
import { tripsApi } from '@/api/trips.api'

const COLUMNS = [
  { key: 'id',     label: 'Trip ID', sortable: true,
    render: (v) => <span className="font-medium text-brand-600">#{v}</span> },
  { key: 'origin',       label: 'Origin'  },
  { key: 'destination',  label: 'Destination' },
  { key: 'driver', label: 'Driver',
    render: (_, row) => <span>{row.driver ? `${row.driver.firstName} ${row.driver.lastName}` : '—'}</span> },
  { key: 'scheduledAt', label: 'Date',
    render: (v) => <span className="text-slate-500">{formatDate(v)}</span> },
  { key: 'status', label: 'Status',
    render: (v) => <StatusBadge status={v} /> },
]

export default function RecentTrips() {
  const [trips,   setTrips]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tripsApi.list({ limit: 5, page: 1 })
      .then(res => setTrips(res.data.data?.data ?? []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false))
  }, [])

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
        data={trips}
        loading={loading}
        emptyTitle="No recent trips"
        emptyDesc="Trips will appear here once created."
      />
    </Card>
  )
}
