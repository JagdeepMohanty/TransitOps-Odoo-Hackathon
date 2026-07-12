export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={[
        'bg-bg-card border border-border-card rounded-xl shadow-card',
        'transition-all duration-200',
        hover ? 'hover:border-border-strong hover:shadow-card-md cursor-pointer' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-content-primary ${className}`}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-border bg-bg-secondary rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}

export default Card;
