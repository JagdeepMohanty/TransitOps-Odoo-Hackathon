import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TripStatCard({ icon: Icon, label, value, description, trend, trendUp, color = '#3B82F6', loading = false }) {
  const [hovered, setHovered] = useState(false);

  if (loading) {
    return (
      <div style={cardStyle(false, color)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={skeletonStyle(32, 32, 8)} />
          <div style={skeletonStyle(14, 80)} />
          <div style={skeletonStyle(28, 60)} />
          <div style={skeletonStyle(12, 100)} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={cardStyle(hovered, color)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        borderRadius: '50%', background: color, opacity: hovered ? 0.12 : 0.06,
        filter: 'blur(20px)', transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, transition: 'transform 0.2s',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}>
        <Icon size={18} color={color} />
      </div>

      {/* Label */}
      <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </p>

      {/* Value */}
      <p style={{
        fontSize: 28, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1,
        marginBottom: 4, letterSpacing: '-0.02em',
        transition: 'color 0.2s', ...(hovered ? { color } : {}),
      }}>
        {value}
      </p>

      {/* Description */}
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>{description}</p>

      {/* Trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {trendUp
          ? <TrendingUp size={13} color="#22C55E" />
          : <TrendingDown size={13} color="#EF4444" />
        }
        <span style={{ fontSize: 12, fontWeight: 600, color: trendUp ? '#22C55E' : '#EF4444' }}>{trend}</span>
        <span style={{ fontSize: 11, color: '#64748B' }}>vs yesterday</span>
      </div>

      {/* Bottom gradient border */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}66, transparent)`,
        borderRadius: '0 0 20px 20px',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />
    </div>
  );
}

function cardStyle(hovered, color) {
  return {
    position: 'relative', overflow: 'hidden',
    background: 'rgba(30,41,59,0.7)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${hovered ? color + '44' : '#334155'}`,
    borderRadius: 20, padding: '20px 20px 18px',
    cursor: 'default',
    boxShadow: hovered
      ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`
      : '0 2px 12px rgba(0,0,0,0.3)',
    transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  };
}

function skeletonStyle(height, width, borderRadius = 4) {
  return {
    height, width, borderRadius,
    background: 'linear-gradient(90deg, #1E293B 25%, #273549 50%, #1E293B 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };
}
