import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

export default function AddDriverPage() {
  return (
    <PageShell
      title="Add Driver"
      subtitle="Register a new driver"
      actions={
        <Link to="/drivers">
          <Button variant="secondary" icon={ArrowLeft}>Back</Button>
        </Link>
      }
      card
    >
      <p className="text-sm text-content-muted">Driver form will be rendered here.</p>
    </PageShell>
  );
}
