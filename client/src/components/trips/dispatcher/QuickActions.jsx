import { useState } from 'react';
import {
  Plus, Zap, CheckCircle, XCircle,
  UserCheck, Truck, FileBarChart2,
} from 'lucide-react';

const ACTIONS = [
  { id: 'create',   label: 'Create Trip',     desc: 'Schedule a new dispatch',      icon: Plus,         color: '#3B82F6', glow: 'rgba(59,130,246,0.3)'  },
  { id: 'dispatch', label: 'Dispatch Trip',   desc: 'Send a draft trip on route',   icon: Zap,          color: '#22C55E', glow: 'rgba(34,197,94,0.3)'   },
  { id: 'complete', label: 'Complete Trip',   desc: 'Mark a trip as delivered',     icon: CheckCircle,  color: '#8B5CF6', glow: 'rgba(139,92,246,0.3)'  },
  { id: 'cancel',   label: 'Cancel Trip',     desc: 'Abort and free resources',     icon: XCircle,      color: '#EF4444', glow: 'rgba(239,68,68,0.3)'   },
  { id: 'driver',   label: 'Assign Driver',   desc: 'Link a driver to a trip',      icon: UserCheck,    color: '#F59E0B', glow: 'rgba(245,158,11,0.3)'  },
  { id: 'vehicle',  label: 'Assign Vehicle',  desc: 'Link a vehicle to a trip',     icon: Truck,        color: '#38BDF8', glow: 'rgba(56,189,248,0.3)'  },
  { id: 'report',   label: 'Generate Report', desc: 'Export trip analytics',        icon: FileBarChart2,color: '#94A3B8', glow: 'rgba(148,163,184,0.2)' },
];

export default function QuickActions({ onAction }) {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)',
      border: '1px solid #334155', borderRadius: 20, padding: '20px',
    }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>Quick Actions</p>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Common dispatcher operations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {ACTIONS.map(a => (
          <ActionCard key={a.id} action={a} onClick={() => onAction?.(a.id)} />
        ))}
      </div>
    </div>
  );
}

function ActionCard({ action, onClick }) {
  const [hovered, setHovered] = useState(false);
  const Icon = action.icon;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: 8, padding: '14px 14px 12px',
        background: hovered ? `${action.color}0F` : 'rgba(15,23,42,0.6)',
        border: `1px solid ${hovered ? action.color + '44' : '#1E293B'}`,
        borderRadius: 14, cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? `0 6px 20px rgba(0,0,0,0.3), 0 0 0 1px ${action.color}22` : 'none',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: hovered ? `${action.color}22` : `${action.color}11`,
        border: `1px solid ${action.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        boxShadow: hovered ? `0 0 12px ${action.glow}` : 'none',
      }}>
        <Icon size={16} color={action.color} />
      </div>

      {/* Text */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: hovered ? '#F8FAFC' : '#CBD5E1', transition: 'color 0.15s', lineHeight: 1.2 }}>
          {action.label}
        </p>
        <p style={{ fontSize: 10, color: '#64748B', marginTop: 2, lineHeight: 1.3 }}>
          {action.desc}
        </p>
      </div>
    </button>
  );
}
