import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Truck } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-6 text-center">
      {/* Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center shadow-glow">
          <Truck className="w-10 h-10 text-white" />
        </div>

        {/* 404 */}
        <div>
          <p className="text-8xl font-black text-gradient-brand leading-none">404</p>
          <h1 className="mt-3 text-2xl font-bold text-content-primary">Page Not Found</h1>
          <p className="mt-2 text-sm text-content-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-glow-sm hover:shadow-glow"
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
