import { useState, useCallback } from 'react';

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, variant = 'info', duration = 4000 }) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, opts) => toast({ message, variant: 'success', ...opts }), [toast]);
  const error   = useCallback((message, opts) => toast({ message, variant: 'error',   ...opts }), [toast]);
  const warning = useCallback((message, opts) => toast({ message, variant: 'warning', ...opts }), [toast]);
  const info    = useCallback((message, opts) => toast({ message, variant: 'info',    ...opts }), [toast]);

  return { toasts, toast, dismiss, success, error, warning, info };
}
