import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

export default function AddVehiclePage() {
  return (
    <PageShell
      title="Add Vehicle"
      subtitle="Register a new vehicle to your fleet"
      actions={
        <Link to="/vehicles">
          <Button variant="secondary" icon={ArrowLeft}>Back</Button>
        </Link>
      }
      card
    >
      <p className="text-sm text-content-muted">Vehicle form will be rendered here.</p>
    </PageShell>
  );
}
