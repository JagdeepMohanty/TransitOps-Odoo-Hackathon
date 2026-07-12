import { useState } from 'react';

const POSITIONS = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

export default function Tooltip({
  content,
  children,
  position  = 'top',
  delay     = 300,
  className = '',
}) {
  const [visible, setVisible] = useState(false);
  const [timer,   setTimer]   = useState(null);

  const show = () => setTimer(setTimeout(() => setVisible(true), delay));
  const hide = () => { clearTimeout(timer); setVisible(false); };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <span
          className={[
            'absolute z-tooltip px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none',
            'bg-bg-dropdown text-content-primary border border-border shadow-card-md animate-fade-in',
            POSITIONS[position] ?? POSITIONS.top,
            className,
          ].join(' ')}
        >
          {content}
        </span>
      )}
    </span>
  );
}
