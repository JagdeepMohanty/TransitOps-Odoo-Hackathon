import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: { icon: CheckCircle,   cls: 'border-success/30 bg-success-muted text-success-text'  },
  warning: { icon: AlertTriangle, cls: 'border-warning/30 bg-warning-muted text-warning-text'  },
  danger:  { icon: XCircle,       cls: 'border-danger/30  bg-danger-muted  text-danger-text'   },
  error:   { icon: XCircle,       cls: 'border-danger/30  bg-danger-muted  text-danger-text'   },
  info:    { icon: Info,          cls: 'border-info/30    bg-info-muted    text-info-text'      },
};

export function Toast({
  id,
  message,
  variant   = 'info',
  duration  = 4000,
  onDismiss,
}) {
  const cfg  = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = cfg.icon;

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onDismiss?.(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={[
        'flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-card-md',
        'min-w-[280px] max-w-sm w-full animate-fade-up',
        cfg.cls,
      ].join(' ')}
      role="alert"
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss?.(id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-150"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onDismiss }) {
  return createPortal(
    <div className="fixed bottom-5 right-5 z-toast flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}

export default Toast;
