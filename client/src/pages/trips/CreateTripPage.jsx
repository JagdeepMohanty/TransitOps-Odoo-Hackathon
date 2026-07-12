import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

export default function CreateTripPage() {
  return (
    <PageShell
      title="Create Trip"
      subtitle="Schedule a new trip for your fleet"
      actions={
        <Link to="/trips">
          <Button variant="secondary" icon={ArrowLeft}>Back</Button>
        </Link>
      }
      card
    >
      <p className="text-sm text-content-muted">Trip creation form will be rendered here.</p>
    </PageShell>
  );
}
