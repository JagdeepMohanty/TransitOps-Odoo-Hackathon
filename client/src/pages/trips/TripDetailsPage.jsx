import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

export default function TripDetailsPage() {
  const { id } = useParams();

  return (
    <PageShell
      title={`Trip #${id}`}
      subtitle="View full trip details and status"
      breadcrumbOverrides={{ [id]: `#${id}` }}
      actions={
        <Link to="/trips">
          <Button variant="secondary" icon={ArrowLeft}>Back to Trips</Button>
        </Link>
      }
      card
    >
      <p className="text-sm text-content-muted">Trip details for ID <span className="font-mono text-content-secondary">{id}</span> will be rendered here.</p>
    </PageShell>
  );
}
