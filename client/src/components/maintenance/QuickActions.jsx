import { useState } from 'react';
import {
  CalendarPlus, CheckCircle, XCircle, History,
  FileText, Download,
} from 'lucide-react';

const ACTIONS = [
  { key: 'schedule', label: 'Schedule Maintenance', icon: CalendarPlus, color: '#3B82F6' },
  { key: 'complete', label: 'Complete Maintenance',  icon: CheckCircle,  color: '#22C55E' },
  { key: 'cancel',   label: 'Cancel Maintenance',    icon: XCircle,      color: '#EF4444' },
  { key: 'history',  label: 'View Vehicle History',  icon: History,      color: '#8B5CF6' },
  { key: 'report',   label: 'Generate Report',       icon: FileText,     color: '#F59E0B' },
  { key: 'export',   label: 'Export Maintenance Log',icon: Download,     color: '#38BDF8' },
];

export default function QuickActions({ onAction, record }) {
  const [hovered, setHovered] = useState(null);
  const isActive = record?.status === 'in_progress' || record?.status === 'scheduled';

  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)', border: '1px solid #1E293B',
      borderRadius: 16, padding: '16px',
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700, color: '#64748B',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
      }}>
        Quick Actions
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ACTIONS.map(a => {
          const disabled =
            (a.key === 'complete' && !isActive) ||
            (a.key === 'cancel'   && !isActive);

          return (
            <button
              key={a.key}
              disabled={disabled}
              onClick={() => !disabled && onAction?.(a.key, record)}
              onMouseEnter={() => setHovered(a.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, border: 'none',
                background: hovered === a.key && !disabled ? `${a.color}12` : 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.3 : 1,
                transition: 'all 0.15s', textAlign: 'left', width: '100%',
                transform: hovered === a.key && !disabled ? 'translateX(2px)' : 'translateX(0)',
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `${a.color}18`,
                border: `1px solid ${a.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                boxShadow: hovered === a.key && !disabled ? `0 0 10px ${a.color}30` : 'none',
              }}>
                <a.icon size={14} color={a.color} />
              </div>
              <span style={{
                fontSize: 12, fontWeight: 500,
                color: hovered === a.key && !disabled ? '#F8FAFC' : '#CBD5E1',
                transition: 'color 0.15s',
              }}>
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
