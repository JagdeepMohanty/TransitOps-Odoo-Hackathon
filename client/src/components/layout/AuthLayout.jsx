import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-base flex">

      {/* ── Left Brand Panel — hidden on mobile ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] shrink-0 flex-col justify-between
                      bg-bg-sidebar border-r border-border p-10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-content-primary tracking-tight">TransitOps</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold text-content-primary leading-tight">
            Enterprise Transport<br />Management Platform
          </h2>
          <p className="text-content-muted text-base leading-relaxed">
            Manage your entire fleet, drivers, trips, and finances from a single powerful dashboard.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '10K+', label: 'Trips Managed' },
              { value: '500+', label: 'Vehicles' },
              { value: '99.9%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="card p-4 text-center">
                <p className="text-xl font-bold text-primary">{value}</p>
                <p className="text-xs text-content-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-content-disabled relative z-10">
          © {new Date().getFullYear()} TransitOps · Enterprise Edition
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-content-primary">TransitOps</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
