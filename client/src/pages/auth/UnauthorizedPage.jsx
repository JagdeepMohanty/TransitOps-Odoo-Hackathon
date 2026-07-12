import { Link } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-6 text-center">
      <div className="absolute w-96 h-96 rounded-full bg-danger/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-danger-muted border border-danger/30 flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-danger-text" />
        </div>

        <div>
          <p className="text-8xl font-black text-danger leading-none">403</p>
          <h1 className="mt-3 text-2xl font-bold text-content-primary">Access Denied</h1>
          <p className="mt-2 text-sm text-content-muted">
            You don't have permission to view this page. Contact your administrator if you believe this is a mistake.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-glow-sm"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-card border border-border text-content-secondary text-sm font-medium hover:bg-bg-hover hover:text-content-primary hover:border-border-strong transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
