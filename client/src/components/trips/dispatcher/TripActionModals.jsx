import { useState } from 'react';
import { X, Zap, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

/* ── Shared modal shell ── */
function Shell({ onClose, children }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 60, animation: 'fadeIn 0.2s' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '100%', maxWidth: 440, background: '#111827',
        border: '1px solid #334155', borderRadius: 20,
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)', zIndex: 61,
        animation: 'fadeUp 0.25s ease-out', overflow: 'hidden',
      }}>
        {children}
      </div>
    </>
  );
}

function ModalHeader({ title, sub, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #1E293B' }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>{title}</p>
        {sub && <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{sub}</p>}
      </div>
      <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #334155', background: 'transparent', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={15} />
      </button>
    </div>
  );
}

function TripSummary({ trip }) {
  return (
    <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #1E293B', borderRadius: 12, padding: '12px 14px', margin: '16px 22px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          ['Trip ID', trip.id],
          ['Vehicle', trip.vehicle],
          ['Driver', trip.driver],
          ['Route', `${trip.source} → ${trip.destination}`],
        ].map(([k, v]) => (
          <div key={k}>
            <p style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
            <p style={{ fontSize: 12, color: '#F8FAFC', fontWeight: 600, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Dispatch Confirmation ── */
export function DispatchConfirmModal({ trip, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  function confirm() {
    setLoading(true);
    setTimeout(() => { onConfirm?.(trip); onClose(); }, 800);
  }

  return (
    <Shell onClose={onClose}>
      <ModalHeader title="Dispatch Trip" sub="This will set vehicle & driver to On Trip" onClose={onClose} />
      <TripSummary trip={trip} />

      <div style={{ padding: '14px 22px' }}>
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ fontSize: 12, color: '#93C5FD', lineHeight: 1.5 }}>
            <strong>Status changes:</strong> Trip → Dispatched · Vehicle → On Trip · Driver → On Trip
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid #1E293B' }}>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        <button onClick={confirm} disabled={loading} style={{ ...actionBtn('#22C55E'), opacity: loading ? 0.7 : 1 }}>
          <Zap size={14} />
          {loading ? 'Dispatching…' : 'Confirm Dispatch'}
        </button>
      </div>
    </Shell>
  );
}

/* ── Complete Trip ── */
export function CompleteTripModal({ trip, onClose, onConfirm }) {
  const [odometer, setOdometer] = useState('');
  const [fuel, setFuel]         = useState('');
  const [loading, setLoading]   = useState(false);

  function confirm() {
    setLoading(true);
    setTimeout(() => { onConfirm?.(trip, { odometer, fuel }); onClose(); }, 800);
  }

  return (
    <Shell onClose={onClose}>
      <ModalHeader title="Complete Trip" sub="Mark trip as delivered and free resources" onClose={onClose} />
      <TripSummary trip={trip} />

      <div style={{ padding: '16px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Updated Odometer (km)</label>
          <input value={odometer} onChange={e => setOdometer(e.target.value)} placeholder="e.g. 48500" type="number" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Remaining Fuel (%)</label>
          <input value={fuel} onChange={e => setFuel(e.target.value)} placeholder="e.g. 45" type="number" style={inputStyle} />
        </div>
        <div style={{ gridColumn: 'span 2', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ fontSize: 12, color: '#86EFAC', lineHeight: 1.5 }}>
            <strong>Status changes:</strong> Trip → Completed · Vehicle → Available · Driver → Available
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid #1E293B' }}>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        <button onClick={confirm} disabled={loading} style={{ ...actionBtn('#22C55E'), opacity: loading ? 0.7 : 1 }}>
          <CheckCircle2 size={14} />
          {loading ? 'Completing…' : 'Complete Trip'}
        </button>
      </div>
    </Shell>
  );
}

/* ── Cancel Trip ── */
export function CancelTripModal({ trip, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  function confirm() {
    setLoading(true);
    setTimeout(() => { onConfirm?.(trip, reason); onClose(); }, 800);
  }

  return (
    <Shell onClose={onClose}>
      <ModalHeader title="Cancel Trip" sub="This action cannot be undone" onClose={onClose} />
      <TripSummary trip={trip} />

      <div style={{ padding: '16px 22px' }}>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 8 }}>
          <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#FCA5A5', lineHeight: 1.5 }}>
            Trip → Cancelled · Vehicle → Available · Driver → Available
          </p>
        </div>
        <label style={labelStyle}>Cancellation Reason (optional)</label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Route blockage, customer request…"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid #1E293B' }}>
        <button onClick={onClose} style={secondaryBtn}>Keep Trip</button>
        <button onClick={confirm} disabled={loading} style={{ ...actionBtn('#EF4444'), opacity: loading ? 0.7 : 1 }}>
          <XCircle size={14} />
          {loading ? 'Cancelling…' : 'Cancel Trip'}
        </button>
      </div>
    </Shell>
  );
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 10, background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: 13, outline: 'none', boxSizing: 'border-box' };
const secondaryBtn = { padding: '9px 18px', borderRadius: 10, background: 'transparent', border: '1px solid #334155', color: '#94A3B8', fontSize: 13, fontWeight: 500, cursor: 'pointer' };
function actionBtn(color) {
  return { display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: 'none', background: color, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: `0 0 14px ${color}55` };
}
