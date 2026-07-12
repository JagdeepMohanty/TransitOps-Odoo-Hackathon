import { useState } from 'react';
import { Droplets, Wrench, Navigation, Shield, CheckCircle, FileText, Clock, ArrowUpRight } from 'lucide-react';
import { RECENT_TXN } from '@utils/fuelExpenseMockData';

const TXN_CFG = {
  fuel:        { icon: Droplets,    color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.28)'  },
  maintenance: { icon: Wrench,      color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.28)' },
  toll:        { icon: Navigation,  color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.28)'  },
  insurance:   { icon: Shield,      color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)' },
  expense:     { icon: CheckCircle, color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.28)'  },
  report:      { icon: FileText,    color: '#94A3B8', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.22)' },
  repairs:     { icon: Wrench,      color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)'  },
};

export default function RecentTransactions() {
  const [hovered, setHovered] = useState(null);
  const totalAmt = RECENT_TXN.reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid #334155', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(51,65,85,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={17} color="#3B82F6" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.01em' }}>Recent Transactions</p>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Latest financial activity across the fleet</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: '5px 12px', borderRadius: 9, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.22)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6' }}>₹{(totalAmt / 1000).toFixed(1)}K total</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', background: 'rgba(100,116,139,0.12)', border: '1px solid rgba(100,116,139,0.2)', padding: '4px 11px', borderRadius: 999 }}>
            {RECENT_TXN.length} entries
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {RECENT_TXN.map((txn, i) => {
          const isLast = i === RECENT_TXN.length - 1;
          const cfg    = TXN_CFG[txn.type] ?? TXN_CFG.expense;
          const Icon   = cfg.icon;
          const isHov  = hovered === txn.id;

          return (
            <div key={txn.id} style={{ display: 'flex', gap: 16, position: 'relative' }}
              onMouseEnter={() => setHovered(txn.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Icon + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: isHov ? cfg.bg : `${cfg.bg.replace('0.12', '0.08')}`,
                  border: `1px solid ${isHov ? cfg.border : cfg.border.replace('0.28', '0.18')}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 1,
                  transition: 'all 0.2s',
                  boxShadow: isHov ? `0 4px 16px ${cfg.color}30` : 'none',
                  transform: isHov ? 'scale(1.08)' : 'scale(1)',
                }}>
                  <Icon size={17} color={cfg.color} />
                </div>
                {!isLast && (
                  <div style={{ width: 1, flex: 1, minHeight: 18, background: 'linear-gradient(180deg, #334155 0%, #1E293B 100%)', margin: '4px 0' }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                paddingBottom: isLast ? 0 : 20, flex: 1,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10,
                padding: isHov ? '8px 12px' : '4px 0',
                background: isHov ? `${cfg.bg.replace('0.12', '0.06')}` : 'transparent',
                borderRadius: isHov ? 12 : 0,
                transition: 'all 0.2s',
                marginBottom: isLast ? 0 : 4,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: isHov ? '#F8FAFC' : '#CBD5E1', margin: 0, transition: 'color 0.2s' }}>{txn.title}</p>
                    {isHov && <ArrowUpRight size={13} color={cfg.color} />}
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.vehicle}</p>
                  <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0' }}>{txn.time}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#F8FAFC', margin: 0 }}>₹{txn.amount.toLocaleString()}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 5, textTransform: 'capitalize', letterSpacing: '0.03em' }}>
                    {txn.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
