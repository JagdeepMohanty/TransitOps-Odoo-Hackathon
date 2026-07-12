import { UserCircle, Mail, Shield, Edit, Lock, Clock, Route, Truck, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageShell from '@/components/layout/PageShell';

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-border last:border-0">
      <span className="text-xs font-semibold text-content-disabled uppercase tracking-wider w-40 shrink-0">{label}</span>
      <span className={`text-sm text-content-secondary ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-secondary border border-border">
      <div className={`p-1.5 rounded-lg ${color}`}><Icon className="w-3.5 h-3.5" /></div>
      <p className="text-base font-bold text-content-primary">{value}</p>
      <p className="text-[11px] text-content-muted text-center">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const initials = (user?.name ?? 'Admin User').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const role     = user?.role?.name ?? user?.role ?? 'Admin';

  return (
    <PageShell
      title="Profile"
      subtitle="Manage your account information and preferences"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-6 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-bg-card" />
          </div>

          <div>
            <p className="text-base font-bold text-content-primary">{user?.name ?? 'Admin User'}</p>
            <p className="text-xs text-content-muted mt-0.5">{user?.email ?? 'admin@transitops.com'}</p>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">{role}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <StatPill icon={Route} label="Trips"    value="24"  color="bg-primary/10 text-primary"    />
            <StatPill icon={Truck} label="Vehicles" value="8"   color="bg-secondary/10 text-secondary" />
            <StatPill icon={Star}  label="Rating"   value="4.9" color="bg-warning/10 text-warning"    />
          </div>

          <div className="w-full pt-2 border-t border-border">
            <p className="text-[11px] text-content-disabled">Member since January 2024</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">Online</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <UserCircle className="w-4 h-4 text-content-muted" />
            <h2 className="text-sm font-semibold text-content-primary">Account Details</h2>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Full Name"     value={user?.name ?? 'Admin User'}             />
            <InfoRow label="Email Address" value={user?.email ?? 'admin@transitops.com'}  />
            <InfoRow label="Role"          value={role}                                   />
            <InfoRow label="Department"    value="Fleet Operations"                       />
            <InfoRow label="Employee ID"   value="EMP-001"                   mono         />
            <InfoRow label="Phone"         value="+91-98765-43210"                        />
            <InfoRow label="Location"      value="Bangalore, Karnataka"                   />
            <InfoRow label="Member Since"  value="January 2024"                           />
          </div>
        </div>

        <div className="lg:col-span-3 bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <Shield className="w-4 h-4 text-content-muted" />
            <h2 className="text-sm font-semibold text-content-primary">Security</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              { icon: Lock,   label: 'Password',  value: 'Last changed 30 days ago', sub: '••••••••••••',  color: 'bg-primary/10 text-primary' },
              { icon: Shield, label: '2FA Status', value: 'Not enabled',              sub: 'Recommended',   color: 'bg-warning/10 text-warning' },
              { icon: Clock,  label: 'Last Login', value: 'Just now',                 sub: 'Bangalore, IN', color: 'bg-success/10 text-success' },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="flex items-start gap-3 p-6">
                <div className={`p-2 rounded-lg shrink-0 ${color}`}><Icon className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-semibold text-content-disabled uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-content-primary mt-0.5">{value}</p>
                  <p className="text-xs text-content-muted mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
