import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* Inject keyframes once */
if (typeof document !== 'undefined' && !document.getElementById('mnt-kf')) {
  const s = document.createElement('style');
  s.id = 'mnt-kf';
  s.textContent = `
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.35)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes kpiCount { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  `;
  document.head.appendChild(s);
}

export default function MaintenanceStatCard({
  icon: Icon, label, value, description, trend, trendUp,
  color = '#3B82F6', loading = false,
}) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <div style={cardBase(false, color)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[32, 12, 28, 12].map((h, i) => (
            <div key={i} style={{
              height: h, width: i === 0 ? 44 : i === 2 ? 60 : 90,
              borderRadius: i === 0 ? 12 : 4,
              background: 'linear-gradient(90deg,#1E293B 25%,#273549 50%,#1E293B 75%)',
              backgroundSize: '400% 100%',
              animation: 'shimmer 1.6s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...cardBase(hovered, color),
        opacity: mounted ? 1 : 0,
        transform: hovered
          ? 'translateY(-6px) scale(1.015)'
          : mounted ? 'translateY(0) scale(1)' : 'translateY(10px) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 120, height: 120,
        borderRadius: '50%', background: color,
        opacity: hovered ? 0.18 : 0.07,
        filter: 'blur(32px)',
        transition: 'opacity 0.35s',
        pointerEvents: 'none',
      }} />

      {/* Top gradient shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${color}99 50%, transparent 100%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {/* Gradient border glow on hover */}
      <div style={{
        position: 'absolute', inset: -1, borderRadius: 21, zIndex: -1,
        background: hovered
          ? `linear-gradient(135deg, ${color}60, transparent 60%)`
          : 'transparent',
        transition: 'all 0.3s',
        pointerEvents: 'none',
      }} />

      {/* Icon badge */}
      <div style={{
        width: 46, height: 46, borderRadius: 14,
        background: `linear-gradient(135deg, ${color}22 0%, ${color}0e 100%)`,
        border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        transform: hovered ? 'scale(1.14) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: hovered ? `0 6px 20px ${color}35` : 'none',
      }}>
        <Icon size={21} color={color} strokeWidth={1.8} />
      </div>

      {/* Label */}
      <p style={{
        fontSize: 10, fontWeight: 700, color: '#64748B',
        textTransform: 'uppercase', letterSpacing: '0.09em',
        margin: '0 0 6px',
      }}>
        {label}
      </p>

      {/* Value */}
      <p style={{
        fontSize: 34, fontWeight: 800,
        color: hovered ? color : '#F8FAFC',
        lineHeight: 1, marginBottom: 8,
        letterSpacing: '-0.035em',
        transition: 'color 0.22s',
        animation: 'kpiCount 0.4s ease-out',
      }}>
        {value}
      </p>

      {/* Description */}
      <p style={{
        fontSize: 11, color: '#64748B',
        marginBottom: 16, lineHeight: 1.55,
        minHeight: 34,
      }}>
        {description}
      </p>

      {/* Trend chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 9px', borderRadius: 8,
        background: trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${trendUp ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}`,
      }}>
        {trendUp
          ? <TrendingUp size={11} color="#22C55E" />
          : <TrendingDown size={11} color="#EF4444" />
        }
        <span style={{ fontSize: 11, fontWeight: 700, color: trendUp ? '#22C55E' : '#EF4444' }}>{trend}</span>
      </div>

      {/* Bottom glow border */}
      <div style={{
        position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 2,
        background: `linear-gradient(90deg, transparent, ${color}aa, transparent)`,
        borderRadius: '0 0 20px 20px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />
    </div>
  );
}

function cardBase(hovered, color) {
  return {
    position: 'relative', overflow: 'hidden',
    background: 'rgba(30,41,59,0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${hovered ? color + '55' : '#334155'}`,
    borderRadius: 20,
    padding: '22px 20px 20px',
    cursor: 'default',
    boxShadow: hovered
      ? `0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px ${color}22, inset 0 1px 0 rgba(255,255,255,0.06)`
      : '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
  };
}
