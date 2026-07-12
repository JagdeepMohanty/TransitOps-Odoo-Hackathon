import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

export default function EditDriverPage() {
  const { id } = useParams();

  return (
    <PageShell
      title="Edit Driver"
      subtitle={`Editing driver #${id}`}
      breadcrumbOverrides={{ [id]: `#${id}` }}
      actions={
        <Link to="/drivers">
          <Button variant="secondary" icon={ArrowLeft}>Back</Button>
        </Link>
      }
      card
    >
      <p className="text-sm text-content-muted">Driver edit form will be rendered here.</p>
    </PageShell>
  );
}
