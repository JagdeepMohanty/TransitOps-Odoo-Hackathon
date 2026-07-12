import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  title       = 'Something went wrong',
  message,
  onRetry,
  className   = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="p-4 rounded-2xl bg-danger-muted mb-4">
        <AlertCircle className="w-10 h-10 text-danger-text" />
      </div>
      <h3 className="text-base font-semibold text-content-secondary">{title}</h3>
      {message && (
        <p className="mt-1.5 text-sm text-content-muted max-w-sm">{message}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card border border-border text-sm font-medium text-content-secondary hover:bg-bg-hover hover:text-content-primary hover:border-border-strong transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
