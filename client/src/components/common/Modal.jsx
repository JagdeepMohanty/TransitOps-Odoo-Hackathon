import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const SIZES = {
  sm:   'max-w-md',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[95vw]',
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size      = 'md',
  closable  = true,
  className = '',
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape' && closable) onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, closable, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget && closable) onClose?.(); }}
    >
      <div
        className={[
          'bg-bg-modal border border-border-card rounded-2xl shadow-modal w-full animate-fade-up',
          SIZES[size] ?? SIZES.md,
          className,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {(title || closable) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            {title && <h2 className="text-lg font-semibold text-content-primary">{title}</h2>}
            {closable && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover transition-all duration-150 ml-auto"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
