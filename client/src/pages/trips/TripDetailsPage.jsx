import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/common/Button'

export default function TripDetailsPage() {
  const { id } = useParams()
  return (
    <div className="page-container">
      <PageHeader
        title={`Trip ${id}`}
        subtitle="Trip details"
        actions={<Link to="/trips"><Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>Back to Trips</Button></Link>}
      />
      <div className="card p-8 text-center text-slate-500 text-sm">Trip details view coming soon.</div>
    </div>
  )
}
