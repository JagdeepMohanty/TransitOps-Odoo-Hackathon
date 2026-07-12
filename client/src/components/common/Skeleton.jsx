/**
 * Skeleton — loading placeholder components.
 * Uses the `.skeleton` utility class from index.css (bg-bg-hover + animate-pulse).
 */

/** Single skeleton line */
export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return <div className={`skeleton ${width} ${height} ${className}`} />;
}

/** Skeleton for a stat/KPI card */
export function SkeletonStatCard() {
  return (
    <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-6 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-28" height="h-3.5" />
          <SkeletonLine width="w-20" height="h-8" />
          <SkeletonLine width="w-24" height="h-3" />
        </div>
        <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

/** Skeleton for a table row */
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <SkeletonLine width={i === 0 ? 'w-32' : i === cols - 1 ? 'w-16' : 'w-24'} height="h-3.5" />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a full table (header + rows) */
export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border-card">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-bg-secondary">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <SkeletonLine width="w-20" height="h-3" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Skeleton for a card with a header + body */
export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`bg-bg-card border border-border-card rounded-xl shadow-card ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <SkeletonLine width="w-32" height="h-4" />
        <SkeletonLine width="w-16" height="h-3" />
      </div>
      <div className="p-6 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} width={i % 2 === 0 ? 'w-full' : 'w-3/4'} height="h-3.5" />
        ))}
      </div>
    </div>
  );
}

/** Skeleton for the page header (title + subtitle + action button) */
export function SkeletonPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonLine width="w-40" height="h-7" />
        <SkeletonLine width="w-56" height="h-3.5" />
      </div>
      <SkeletonLine width="w-28" height="h-9" className="rounded-xl" />
    </div>
  );
}

/** Full page skeleton: header + stat cards + table */
export function SkeletonDashboard() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SkeletonPageHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <SkeletonCard lines={4} />
    </div>
  );
}

/** Full page skeleton: header + toolbar + table */
export function SkeletonListPage({ cols = 5 }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <SkeletonPageHeader />
      <div className="flex gap-3">
        <SkeletonLine width="w-64" height="h-10" className="rounded-xl" />
        <SkeletonLine width="w-28" height="h-10" className="rounded-xl" />
      </div>
      <SkeletonTable rows={8} cols={cols} />
    </div>
  );
}

export default SkeletonLine;
