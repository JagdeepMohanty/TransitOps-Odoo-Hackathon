/* ── Inject keyframes once ───────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('fe-kf')) {
  const s = document.createElement('style');
  s.id = 'fe-kf';
  s.textContent = `
    @keyframes feShimmer    { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes feFadeUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes feFadeIn     { from{opacity:0} to{opacity:1} }
    @keyframes fePulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.35)} }
    @keyframes feCount      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes feGlow       { 0%,100%{box-shadow:0 0 12px rgba(59,130,246,0.3)} 50%{box-shadow:0 0 28px rgba(59,130,246,0.6)} }
    @keyframes feRotate     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes feBarFill    { from{width:0%} to{width:var(--bar-w)} }
  `;
  document.head.appendChild(s);
}

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function FuelStatCard({
  icon: Icon, label, value, description, trend, trendUp,
  color = '#3B82F6', loading = false, delay = 0,
}) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const animRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay + 80);
    return () => clearTimeout(t);
  }, [delay]);

  // Animate number display
  useEffect(() => {
    if (!mounted) return;
    clearTimeout(animRef.current);
    animRef.current = setTimeout(() => setDisplayed(value), 60);
    return () => clearTimeout(animRef.current);
  }, [mounted, value]);

  if (loading) {
    return (
      <div style={cardBase(false, color)}>
        {[44, 10, 28, 10, 20].map((h, i) => (
          <div key={i} style={{
            height: h, width: i === 0 ? 44 : i === 2 ? 64 : i === 4 ? 80 : 100,
            borderRadius: i === 0 ? 12 : 6, marginBottom: 10,
            background: 'linear-gradient(90deg,#1E293B 25%,#273549 50%,#1E293B 75%)',
            backgroundSize: '400% 100%',
            animation: 'feShimmer 1.6s ease-in-out infinite',
          }} />
        ))}
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
          : mounted ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
        transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        animation: mounted ? `feFadeUp 0.4s ease-out ${delay}ms both` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left gradient border accent */}
      <div style={{
        position: 'absolute', left: 0, top: '12%', bottom: '12%', width: 3,
        borderRadius: '0 4px 4px 0',
        background: `linear-gradient(180deg, ${color}, ${color}55, transparent)`,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.3s',
        boxShadow: hovered ? `0 0 12px ${color}80` : 'none',
      }} />

      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${color}99 40%, ${color}cc 50%, ${color}99 60%, transparent 100%)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />

      {/* Ambient glow blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 120, height: 120,
        borderRadius: '50%', background: color,
        opacity: hovered ? 0.18 : 0.07,
        filter: 'blur(32px)', transition: 'opacity 0.35s', pointerEvents: 'none',
      }} />

      {/* Corner grid pattern */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, width: 80, height: 80,
        opacity: 0.04, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      }} />

      {/* Icon */}
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: `linear-gradient(135deg, ${color}22, ${color}0e)`,
        border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        transform: hovered ? 'scale(1.14) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: hovered ? `0 6px 20px ${color}35` : 'none',
      }}>
        <Icon size={21} color={color} strokeWidth={1.7} />
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>
        {label}
      </p>

      <p style={{
        fontSize: 30, fontWeight: 800, lineHeight: 1, marginBottom: 8,
        letterSpacing: '-0.035em',
        color: hovered ? color : '#F8FAFC',
        transition: 'color 0.25s',
        animation: mounted ? 'feCount 0.45s ease-out' : 'none',
      }}>
        {displayed || value}
      </p>

      <p style={{ fontSize: 11.5, color: '#64748B', marginBottom: 16, lineHeight: 1.55, minHeight: 34 }}>
        {description}
      </p>

      {/* Trend badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 9px', borderRadius: 8,
        background: trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${trendUp ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}`,
      }}>
        {trendUp
          ? <TrendingUp  size={11} color="#22C55E" />
          : <TrendingDown size={11} color="#EF4444" />
        }
        <span style={{ fontSize: 11, fontWeight: 700, color: trendUp ? '#22C55E' : '#EF4444' }}>{trend}</span>
      </div>

      {/* Bottom glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2,
        background: `linear-gradient(90deg, transparent, ${color}bb, transparent)`,
        borderRadius: '0 0 20px 20px',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />
    </div>
  );
}

function cardBase(hovered, color) {
  return {
    position: 'relative', overflow: 'hidden',
    background: hovered
      ? `linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(30,41,59,0.75) 100%)`
      : 'rgba(30,41,59,0.6)',
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${hovered ? color + '55' : '#334155'}`,
    borderRadius: 20, padding: '22px 20px 20px', cursor: 'default',
    boxShadow: hovered
      ? `0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px ${color}22, inset 0 1px 0 rgba(255,255,255,0.06)`
      : '0 2px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
  };
}
