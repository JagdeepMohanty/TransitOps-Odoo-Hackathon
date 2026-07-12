import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function TripTimeline({ timeline = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {timeline.map((step, i) => {
        const isLast = i === timeline.length - 1;
        const isActive = step.done && (isLast || !timeline[i + 1]?.done);

        return (
          <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            {/* Line + Icon column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.done
                  ? isActive ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.15)'
                  : 'rgba(30,41,59,0.8)',
                border: `2px solid ${step.done ? (isActive ? '#3B82F6' : '#22C55E') : '#334155'}`,
                transition: 'all 0.2s',
                zIndex: 1,
              }}>
                {step.done
                  ? isActive
                    ? <Clock size={10} color="#3B82F6" />
                    : <CheckCircle2 size={10} color="#22C55E" />
                  : <Circle size={10} color="#334155" />
                }
              </div>
              {!isLast && (
                <div style={{
                  width: 2, flex: 1, minHeight: 20,
                  background: step.done ? 'linear-gradient(180deg, #22C55E44, #22C55E22)' : '#1E293B',
                  margin: '2px 0',
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 14, flex: 1 }}>
              <p style={{
                fontSize: 12, fontWeight: 600,
                color: step.done ? (isActive ? '#93C5FD' : '#F8FAFC') : '#475569',
              }}>
                {step.event}
              </p>
              {step.time && (
                <p style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{step.time}</p>
              )}
              {!step.time && !step.done && (
                <p style={{ fontSize: 11, color: '#334155', marginTop: 1 }}>Pending</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
