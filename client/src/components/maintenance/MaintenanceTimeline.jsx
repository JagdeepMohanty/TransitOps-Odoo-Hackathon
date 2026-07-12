import { CheckCircle2, Circle, Clock, Wrench, Search, ShoppingCart, ShieldCheck, Truck, CalendarCheck } from 'lucide-react';

const STEP_ICONS = {
  'Scheduled':          CalendarCheck,
  'Inspection Started': Search,
  'Repair Started':     Wrench,
  'Parts Ordered':      ShoppingCart,
  'Repair Completed':   CheckCircle2,
  'Quality Check':      ShieldCheck,
  'Vehicle Available':  Truck,
};

export default function MaintenanceTimeline({ timeline = [] }) {
  const lastDoneIndex = timeline.reduce((acc, step, i) => step.done ? i : acc, -1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {timeline.map((step, i) => {
        const isLast   = i === timeline.length - 1;
        const isActive = i === lastDoneIndex && !isLast;
        const StepIcon = STEP_ICONS[step.event] ?? Clock;

        return (
          <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            {/* Icon + connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 26, flexShrink: 0 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.done
                  ? isActive
                    ? 'rgba(59,130,246,0.2)'
                    : 'rgba(34,197,94,0.15)'
                  : 'rgba(30,41,59,0.8)',
                border: `2px solid ${step.done ? (isActive ? '#3B82F6' : '#22C55E') : '#334155'}`,
                transition: 'all 0.25s',
                zIndex: 1,
                boxShadow: isActive ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
              }}>
                <StepIcon
                  size={12}
                  color={step.done ? (isActive ? '#3B82F6' : '#22C55E') : '#334155'}
                />
              </div>
              {!isLast && (
                <div style={{
                  width: 2, flex: 1, minHeight: 20,
                  background: step.done
                    ? 'linear-gradient(180deg, #22C55E66, #22C55E22)'
                    : '#1E293B',
                  margin: '2px 0',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 18, flex: 1 }}>
              <p style={{
                fontSize: 12, fontWeight: 600,
                color: step.done ? (isActive ? '#93C5FD' : '#F8FAFC') : '#475569',
                transition: 'color 0.2s',
              }}>
                {step.event}
                {isActive && (
                  <span style={{
                    marginLeft: 8, fontSize: 10, fontWeight: 700,
                    color: '#3B82F6', background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    padding: '1px 6px', borderRadius: 999,
                  }}>Active</span>
                )}
              </p>
              {step.time
                ? <p style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{step.time}</p>
                : <p style={{ fontSize: 11, color: '#334155', marginTop: 2, fontStyle: 'italic' }}>Pending</p>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
