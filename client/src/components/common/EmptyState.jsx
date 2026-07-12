import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon,
  title       = 'No data found',
  description,
  action,
  className   = '',
}) {
  const Icon = icon ?? Inbox;

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="p-4 rounded-2xl bg-bg-hover mb-4">
        <Icon className="w-10 h-10 text-content-disabled" />
      </div>
      <h3 className="text-base font-semibold text-content-secondary">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-content-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
