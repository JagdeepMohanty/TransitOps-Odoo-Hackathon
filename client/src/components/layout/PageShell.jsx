import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  dashboard:   'Dashboard',
  vehicles:    'Vehicles',
  drivers:     'Drivers',
  trips:       'Trips',
  maintenance: 'Maintenance',
  finance:     'Finance',
  fuel:        'Fuel Logs',
  expenses:    'Expenses',
  reports:     'Reports',
  profile:     'Profile',
  add:         'Add',
  create:      'Create',
  edit:        'Edit',
};

function Breadcrumb({ overrides = {} }) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-xs text-content-muted" aria-label="Breadcrumb">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-content-secondary transition-colors duration-150">
        <Home className="w-3 h-3" />
        <span>Home</span>
      </Link>
      {segments.map((seg, i) => {
        const label   = overrides[seg] ?? ROUTE_LABELS[seg] ?? (seg.charAt(0).toUpperCase() + seg.slice(1));
        const path    = '/' + segments.slice(0, i + 1).join('/');
        const isLast  = i === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-content-disabled" />
            {isLast ? (
              <span className="font-semibold text-content-primary">{label}</span>
            ) : (
              <Link to={path} className="hover:text-content-secondary transition-colors duration-150">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/**
 * PageShell — wraps every protected page with:
 *   - Breadcrumb
 *   - Page title + subtitle + actions row
 *   - Responsive max-width container
 *   - Optional card wrapper around children
 *
 * Props:
 *   title          string   — page heading
 *   subtitle       string   — optional sub-heading
 *   actions        ReactNode — buttons rendered top-right
 *   card           boolean  — wrap children in a card (default false)
 *   breadcrumbOverrides  object — { segmentKey: 'Custom Label' }
 *   className      string
 *   children       ReactNode
 */
export default function PageShell({
  title,
  subtitle,
  actions,
  card          = false,
  breadcrumbOverrides = {},
  className     = '',
  children,
}) {
  return (
    <div className={`space-y-5 ${className}`}>

      {/* ── Breadcrumb ── */}
      <Breadcrumb overrides={breadcrumbOverrides} />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          {title && (
            <h1 className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-content-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {card ? (
        <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-6">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
