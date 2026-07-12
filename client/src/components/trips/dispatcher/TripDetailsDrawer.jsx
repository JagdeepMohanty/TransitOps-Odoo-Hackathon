import { X, Truck, User, MapPin, Package, Ruler, Clock, Navigation } from 'lucide-react';
import StatusBadge from './StatusBadge';
import TripTimeline from './TripTimeline';

export default function TripDetailsDrawer({ trip, onClose }) {
  if (!trip) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', zIndex: 50,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 440,
        background: '#111827', borderLeft: '1px solid #334155',
        zIndex: 51, overflowY: 'auto',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
        animation: 'slideInRight 0.3s ease-out',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #1E293B',
          position: 'sticky', top: 0, background: '#111827', zIndex: 1,
        }}>
          <div>
            <p style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trip Details</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', fontFamily: 'monospace', marginTop: 2 }}>{trip.id}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={trip.status} size="lg" />
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid #334155',
                background: 'transparent', cursor: 'pointer', color: '#64748B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#F8FAFC'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Map Placeholder */}
          <div style={{
            borderRadius: 16, overflow: 'hidden', marginBottom: 20,
            border: '1px solid #334155', position: 'relative', height: 160,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 60%),
                radial-gradient(circle at 70% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)`,
            }} />
            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: 0, right: 0,
                top: `${(i + 1) * 14}%`, height: 1,
                background: 'rgba(51,65,85,0.4)',
              }} />
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${(i + 1) * 11}%`, width: 1,
                background: 'rgba(51,65,85,0.4)',
              }} />
            ))}
            {/* Route line */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path d="M 60 80 C 120 40, 280 120, 380 80" stroke="url(#routeGrad)" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
              <circle cx="60" cy="80" r="6" fill="#3B82F6" />
              <circle cx="380" cy="80" r="6" fill="#8B5CF6" />
            </svg>
            {/* Labels */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: '#93C5FD', fontWeight: 600, background: 'rgba(15,23,42,0.8)', padding: '2px 8px', borderRadius: 6 }}>{trip.source}</span>
              <span style={{ fontSize: 10, color: '#C4B5FD', fontWeight: 600, background: 'rgba(15,23,42,0.8)', padding: '2px 8px', borderRadius: 6 }}>{trip.destination}</span>
            </div>
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(15,23,42,0.8)', padding: '3px 8px', borderRadius: 6 }}>
              <Navigation size={10} color="#64748B" />
              <span style={{ fontSize: 10, color: '#64748B' }}>Route Map</span>
            </div>
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <InfoCard icon={<Truck size={14} color="#3B82F6" />} label="Vehicle" value={trip.vehicle} sub={trip.vehicleModel} />
            <InfoCard icon={<User size={14} color="#8B5CF6" />} label="Driver" value={trip.driver} />
            <InfoCard icon={<MapPin size={14} color="#22C55E" />} label="Source" value={trip.source} />
            <InfoCard icon={<MapPin size={14} color="#EF4444" />} label="Destination" value={trip.destination} />
            <InfoCard icon={<Package size={14} color="#F59E0B" />} label="Cargo" value={`${trip.cargoWeight?.toLocaleString()} kg`} sub={trip.cargoType} />
            <InfoCard icon={<Ruler size={14} color="#38BDF8" />} label="Distance" value={`${trip.distance} km`} />
            <InfoCard icon={<Clock size={14} color="#94A3B8" />} label="Duration" value={trip.duration ?? '—'} />
            <InfoCard icon={<Clock size={14} color="#F59E0B" />} label="ETA" value={trip.eta ?? '—'} />
          </div>

          {/* Notes */}
          {trip.notes && (
            <div style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 12, padding: '10px 14px', marginBottom: 20,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</p>
              <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5 }}>{trip.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div style={{
            background: 'rgba(15,23,42,0.6)', border: '1px solid #1E293B',
            borderRadius: 16, padding: '16px',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trip Timeline
            </p>
            <TripTimeline timeline={trip.timeline} />
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ icon, label, value, sub }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)', border: '1px solid #1E293B',
      borderRadius: 12, padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{sub}</p>}
    </div>
  );
}
