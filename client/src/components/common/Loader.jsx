import { Loader2 } from 'lucide-react';

export default function Loader({
  fullPage  = false,
  size      = 'md',
  label     = 'Loading…',
  className = '',
}) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const inner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeMap[size] ?? sizeMap.md} text-primary animate-spin`} />
      {label && <p className="text-sm text-content-muted">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-modal flex items-center justify-center">
        {inner}
      </div>
    );
  }

  return inner;
}
