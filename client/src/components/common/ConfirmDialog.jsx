import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const VARIANTS = {
  danger:  { icon: XCircle,       iconCls: 'text-danger',  confirmVariant: 'danger'  },
  warning: { icon: AlertTriangle, iconCls: 'text-warning', confirmVariant: 'warning' },
  success: { icon: CheckCircle,   iconCls: 'text-success', confirmVariant: 'success' },
  info:    { icon: Info,          iconCls: 'text-info',    confirmVariant: 'primary' },
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title          = 'Are you sure?',
  description,
  confirmLabel   = 'Confirm',
  cancelLabel    = 'Cancel',
  variant        = 'danger',
  loading        = false,
}) {
  const cfg  = VARIANTS[variant] ?? VARIANTS.danger;
  const Icon = cfg.icon;

  return (
    <Modal open={open} onClose={onClose} size="sm" closable={!loading}>
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className={`p-3 rounded-full bg-bg-hover ${cfg.iconCls}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-content-primary">{title}</h3>
          {description && (
            <p className="mt-1.5 text-sm text-content-muted">{description}</p>
          )}
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={cfg.confirmVariant}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
