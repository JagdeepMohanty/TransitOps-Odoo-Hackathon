import { X, Truck, User, Wrench, DollarSign, Calendar, Gauge, FileText, Package, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import MaintenanceTimeline from './MaintenanceTimeline';
import QuickActions from './QuickActions';

export default function MaintenanceDrawer({ record, onClose, onAction }) {
  if (!record) return null;

  const overdue = record.status === 'overdue';
  const costDiff = record.actualCost != null ? record.actualCost - record.cost : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)', zIndex: 50,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 480,
        background: '#111827',
        borderLeft: '1px solid #334155',
        zIndex: 51, overflowY: 'auto',
        boxShadow: '-12px 0 60px rgba(0,0,0,0.75)',
        animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Sticky header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #1E293B',
          position: 'sticky', top: 0, background: 'rgba(17,24,39,0.97)',
          backdropFilter: 'blur(12px)', zIndex: 1,
        }}>
          <div>
            <p style={{
              fontSize: 10, color: '#64748B', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            }}>
              Maintenance Details
            </p>
            <p style={{
              fontSize: 17, fontWeight: 800, color: '#F8FAFC',
              fontFamily: 'monospace', marginTop: 3, letterSpacing: '-0.01em',
            }}>
              {record.id}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={record.status} size="lg" />
            <button
              onClick={onClose}
              style={{
                width: 34, height: 34, borderRadius: 9, border: '1px solid #334155',
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

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Overdue warning */}
          {overdue && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: '12px 14px',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <AlertTriangle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#FCA5A5', fontWeight: 500, lineHeight: 1.5 }}>
                This maintenance is <strong>past its expected completion date</strong>. Immediate attention required. Vehicle is unavailable for trips.
              </p>
            </div>
          )}

          {/* Vehicle hero card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.07) 100%)',
            border: '1px solid rgba(59,130,246,0.22)', borderRadius: 16, padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 0 20px rgba(59,130,246,0.15)',
              }}>
                <Truck size={26} color="#3B82F6" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 16, fontWeight: 700, color: '#F8FAFC',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {record.vehicle}
                </p>
                <p style={{ fontSize: 12, fontFamily: 'monospace', color: '#93C5FD', marginTop: 3 }}>
                  {record.registration}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Gauge size={11} color="#64748B" />
                    <span style={{ fontSize: 11, color: '#64748B' }}>{record.odometer?.toLocaleString()} km</span>
                  </div>
                  <span style={{ color: '#334155' }}>·</span>
                  <PriorityBadge priority={record.priority} />
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InfoCard icon={<Wrench size={13} color="#F59E0B" />}    label="Maintenance Type"    value={record.type} />
            <InfoCard icon={<FileText size={13} color="#8B5CF6" />}  label="Category"            value={record.category} />
            <InfoCard icon={<User size={13} color="#22C55E" />}      label="Technician"          value={record.technician} />
            <InfoCard icon={<Calendar size={13} color="#3B82F6" />}  label="Start Date"          value={record.startDate} />
            <InfoCard icon={<Calendar size={13} color="#F59E0B" />}  label="Est. Completion"     value={record.expectedCompletion} />
            <InfoCard icon={<Calendar size={13} color="#22C55E" />}  label="Completion Date"     value={record.completionDate ?? '—'} />
          </div>

          {/* Cost breakdown */}
          <div style={{
            background: 'rgba(15,23,42,0.7)', border: '1px solid #1E293B',
            borderRadius: 14, padding: '14px 16px',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14,
            }}>
              Cost Breakdown
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <CostItem label="Estimated" value={`₹${record.cost.toLocaleString()}`} color="#3B82F6" />
              <CostItem
                label="Actual"
                value={record.actualCost != null ? `₹${record.actualCost.toLocaleString()}` : 'Pending'}
                color={record.actualCost != null ? (costDiff > 0 ? '#EF4444' : '#22C55E') : '#64748B'}
              />
              {costDiff != null && (
                <CostItem
                  label="Variance"
                  value={`${costDiff > 0 ? '+' : ''}₹${costDiff.toLocaleString()}`}
                  color={costDiff > 0 ? '#EF4444' : '#22C55E'}
                />
              )}
            </div>
          </div>

          {/* Issue description */}
          <div style={{
            background: 'rgba(15,23,42,0.7)', border: '1px solid #1E293B',
            borderRadius: 14, padding: '14px 16px',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
            }}>
              Issue Description
            </p>
            <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.65 }}>{record.issueDescription}</p>
          </div>

          {/* Parts replaced */}
          {record.partsReplaced?.length > 0 && (
            <div style={{
              background: 'rgba(15,23,42,0.7)', border: '1px solid #1E293B',
              borderRadius: 14, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <Package size={13} color="#8B5CF6" />
                <p style={{
                  fontSize: 10, fontWeight: 700, color: '#64748B',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Parts Replaced
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {record.partsReplaced.map((part, i) => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                    background: 'rgba(139,92,246,0.1)', color: '#C4B5FD',
                    border: '1px solid rgba(139,92,246,0.22)',
                  }}>
                    {part}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div style={{
              background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)',
              borderRadius: 12, padding: '12px 14px',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: '#F59E0B',
                marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Notes</p>
              <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6 }}>{record.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div style={{
            background: 'rgba(15,23,42,0.7)', border: '1px solid #1E293B',
            borderRadius: 16, padding: '16px',
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: '#F8FAFC',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Maintenance Timeline
            </p>
            <MaintenanceTimeline timeline={record.timeline} />
          </div>

          {/* Quick actions */}
          <QuickActions record={record} onAction={onAction} />
        </div>
      </div>
    </>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)', border: '1px solid #1E293B',
      borderRadius: 12, padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {icon}
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#64748B',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>{label}</span>
      </div>
      <p style={{
        fontSize: 13, fontWeight: 600, color: '#F8FAFC',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value}</p>
    </div>
  );
}

function CostItem({ label, value, color }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{
        fontSize: 10, color: '#64748B',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5,
      }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 800, color }}>{value}</p>
    </div>
  );
}
