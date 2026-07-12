import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

export default function EditVehiclePage() {
  const { id } = useParams();

  return (
    <PageShell
      title="Edit Vehicle"
      subtitle={`Editing vehicle #${id}`}
      breadcrumbOverrides={{ [id]: `#${id}` }}
      actions={
        <Link to="/vehicles">
          <Button variant="secondary" icon={ArrowLeft}>Back</Button>
        </Link>
      }
      card
    >
      <p className="text-sm text-content-muted">Vehicle edit form will be rendered here.</p>
    </PageShell>
  );
}
