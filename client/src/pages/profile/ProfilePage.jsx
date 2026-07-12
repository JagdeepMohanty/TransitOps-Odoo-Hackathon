import { UserCircle, Mail, Shield, Edit } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-border last:border-0">
      <span className="text-xs font-semibold text-content-disabled uppercase tracking-wider w-36 shrink-0">{label}</span>
      <span className="text-sm text-content-secondary">{value ?? '—'}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageShell
      title="Profile"
      subtitle="Manage your account information"
      actions={
        <Button variant="secondary" icon={Edit}>Edit Profile</Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Avatar card */}
        <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center shadow-glow">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-content-primary">{user?.name ?? 'Admin User'}</p>
            <p className="text-xs text-content-muted mt-0.5">{user?.email ?? 'admin@transitops.com'}</p>
          </div>
          <span className="badge badge-primary">{user?.role ?? 'Admin'}</span>
        </div>

        {/* Details card */}
        <div className="lg:col-span-2 bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <UserCircle className="w-4 h-4 text-content-muted" />
            <h2 className="text-base font-semibold text-content-primary">Account Details</h2>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Full Name"  value={user?.name}  />
            <InfoRow label="Email"      value={user?.email} />
            <InfoRow label="Role"       value={user?.role}  />
            <InfoRow label="Member Since" value="2024"      />
          </div>
        </div>

        {/* Security card */}
        <div className="lg:col-span-3 bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <Shield className="w-4 h-4 text-content-muted" />
            <h2 className="text-base font-semibold text-content-primary">Security</h2>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Password"     value="••••••••••••" />
            <InfoRow label="2FA"          value="Not enabled" />
            <InfoRow label="Last Login"   value="Just now"    />
          </div>
        </div>

      </div>
    </PageShell>
  );
}
