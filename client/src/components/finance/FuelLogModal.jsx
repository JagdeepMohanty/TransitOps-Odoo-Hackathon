import { useState, useEffect } from 'react';
import { X, Trash2, Droplets, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { FE_VEHICLES, FE_DRIVERS, FUEL_STATIONS, PAYMENT_METHODS } from '@utils/fuelExpenseMockData';

export default function FuelLogModal({ mode, record, onClose, onSubmit }) {
  const isAdd    = mode === 'add';
  const isEdit   = mode === 'edit';
  const isDelete = mode === 'delete';

  const [form, setForm] = useState({
    vehicleId: '', driver: '', trip: '', date: '', station: '',
    quantity: '', pricePerLiter: '', distanceCovered: '',
    paymentMethod: 'Fleet Card', notes: '',
  });

  useEffect(() => {
    if (record && isEdit) {
      setForm({
        vehicleId:       record.vehicleId       ?? '',
        driver:          record.driver          ?? '',
        trip:            record.trip            ?? '',
        date:            record.date            ?? '',
        station:         record.station         ?? '',
        quantity:        record.quantity        ?? '',
        pricePerLiter:   record.pricePerLiter   ?? '',
        distanceCovered: record.distanceCovered ?? '',
        paymentMethod:   record.paymentMethod   ?? 'Fleet Card',
        notes:           record.notes           ?? '',
      });
    }
  }, [record, isEdit]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  const totalCost  = form.quantity && form.pricePerLiter
    ? (Number(form.quantity) * Number(form.pricePerLiter)).toFixed(2) : null;
  const efficiency = form.distanceCovered && form.quantity
    ? (Number(form.distanceCovered) / Number(form.quantity)).toFixed(2) : null;

  const title  = { add: 'Add Fuel Log', edit: 'Edit Fuel Log', delete: 'Delete Fuel Log' }[mode];
  const accent = { add: '#22C55E', edit: '#3B82F6', delete: '#EF4444' }[mode];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 60, animation: 'feFadeIn 0.2s ease' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '100%', maxWidth: isDelete ? 440 : 600,
        background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
        border: `1px solid ${accent}35`,
        borderRadius: 22, zIndex: 61,
        boxShadow: `0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.04)`,
        animation: 'feFadeUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        maxHeight: '92vh', overflowY: 'auto',
      }}>
        {/* Top accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}88, transparent)`, borderRadius: '22px 22px 0 0' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(30,41,59,0.8)', background: `linear-gradient(135deg, ${accent}0c 0%, transparent 100%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}1a`, border: `1px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${accent}20` }}>
              {isDelete ? <Trash2 size={16} color={accent} /> : <Droplets size={16} color={accent} />}
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>{title}</p>
              <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>
                {isAdd ? 'Record a new fuel fill-up' : isEdit ? `Editing ${record?.id}` : 'This action is permanent'}
              </p>
            </div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        <div style={{ padding: '24px' }}>
          {isDelete ? (
            <ConfirmDelete record={record} accent={accent} onClose={onClose} onSubmit={() => onSubmit?.(form)} label="Delete Log" />
          ) : (
            <>
              {/* Business rules banner */}
              <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 22, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Calculator size={14} color="#22C55E" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#86EFAC', lineHeight: 1.6, margin: 0 }}>
                  <strong>Auto-calculated:</strong> Total Cost = Quantity × Price/Liter &nbsp;|&nbsp; Fuel Efficiency = Distance ÷ Quantity
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <FF label="Vehicle" span={2}>
                  <select value={form.vehicleId} onChange={e => set('vehicleId', e.target.value)} style={sel}>
                    <option value="">Select vehicle…</option>
                    {FE_VEHICLES.map(v => <option key={v.id} value={v.id}>{v.name} — {v.registration}</option>)}
                  </select>
                </FF>
                <FF label="Driver">
                  <select value={form.driver} onChange={e => set('driver', e.target.value)} style={sel}>
                    <option value="">Select driver…</option>
                    {FE_DRIVERS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </FF>
                <FF label="Trip ID">
                  <input value={form.trip} onChange={e => set('trip', e.target.value)} placeholder="e.g. T1042" style={inp} />
                </FF>
                <FF label="Fuel Date">
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} />
                </FF>
                <FF label="Fuel Station">
                  <select value={form.station} onChange={e => set('station', e.target.value)} style={sel}>
                    <option value="">Select station…</option>
                    {FUEL_STATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </FF>
                <FF label="Fuel Quantity (Liters)">
                  <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 120" style={inp} />
                </FF>
                <FF label="Price per Liter (₹)">
                  <input type="number" value={form.pricePerLiter} onChange={e => set('pricePerLiter', e.target.value)} placeholder="e.g. 92.5" style={inp} />
                </FF>

                {/* Auto-calculated total cost */}
                <FF label="Total Cost — Auto Calculated" span={2}>
                  <div style={{ ...inp, background: totalCost ? 'rgba(34,197,94,0.07)' : 'rgba(15,23,42,0.5)', border: `1px solid ${totalCost ? 'rgba(34,197,94,0.3)' : '#334155'}`, color: totalCost ? '#86EFAC' : '#475569', fontWeight: totalCost ? 700 : 400, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                    {totalCost ? (
                      <>
                        <CheckCircle size={14} color="#22C55E" />
                        <span style={{ fontSize: 15 }}>₹{Number(totalCost).toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: '#64748B', marginLeft: 'auto' }}>{form.quantity}L × ₹{form.pricePerLiter}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12 }}>Enter quantity and price to calculate…</span>
                    )}
                  </div>
                </FF>

                <FF label="Distance Covered (km)">
                  <input type="number" value={form.distanceCovered} onChange={e => set('distanceCovered', e.target.value)} placeholder="e.g. 480" style={inp} />
                </FF>

                {/* Auto-calculated efficiency */}
                <FF label="Fuel Efficiency — Auto Calculated">
                  <div style={{ ...inp, background: efficiency ? 'rgba(59,130,246,0.07)' : 'rgba(15,23,42,0.5)', border: `1px solid ${efficiency ? 'rgba(59,130,246,0.3)' : '#334155'}`, color: efficiency ? '#93C5FD' : '#475569', fontWeight: efficiency ? 700 : 400, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                    {efficiency ? (
                      <>
                        <CheckCircle size={14} color="#3B82F6" />
                        <span style={{ fontSize: 15 }}>{efficiency} km/L</span>
                        {Number(efficiency) < 3.5 && <span style={{ fontSize: 10, color: '#EF4444', marginLeft: 'auto', fontWeight: 700 }}>⚠ Low efficiency</span>}
                      </>
                    ) : (
                      <span style={{ fontSize: 12 }}>Enter distance and quantity…</span>
                    )}
                  </div>
                </FF>

                <FF label="Payment Method">
                  <select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)} style={sel}>
                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </FF>
                <FF label="Notes" span={2}>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Additional notes…" rows={2} style={{ ...inp, resize: 'vertical', minHeight: 60 }} />
                </FF>
              </div>

              <ModalFooter onClose={onClose} onSubmit={() => onSubmit?.({ ...form, totalCost, efficiency })} accent={accent} label={isAdd ? 'Add Fuel Log' : 'Save Changes'} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FF({ label, children, span = 1 }) {
  return (
    <div style={{ gridColumn: span === 2 ? '1 / -1' : undefined }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      {children}
    </div>
  );
}

function ConfirmDelete({ record, accent, onClose, onSubmit, label }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px', background: `${accent}14`, border: `2px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 28px ${accent}22` }}>
        <Trash2 size={26} color={accent} />
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>Delete Record?</p>
      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 26px' }}>
        This will permanently delete <strong style={{ color: '#F8FAFC' }}>{record?.id}</strong>. This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <SubmitBtn color={accent} onClick={onSubmit}>{label}</SubmitBtn>
      </div>
    </div>
  );
}

function ModalFooter({ onClose, onSubmit, accent, label }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(30,41,59,0.8)' }}>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
      <SubmitBtn color={accent} onClick={onSubmit}>{label}</SubmitBtn>
    </div>
  );
}

function CloseBtn({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${h ? '#475569' : '#334155'}`, background: h ? '#1E293B' : 'transparent', cursor: 'pointer', color: h ? '#F8FAFC' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
      <X size={16} />
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: '10px 22px', borderRadius: 11, border: `1px solid ${h ? '#475569' : '#334155'}`, background: h ? 'rgba(30,41,59,0.8)' : 'transparent', color: h ? '#F8FAFC' : '#94A3B8', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
      {children}
    </button>
  );
}

function SubmitBtn({ children, onClick, color }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: '10px 26px', borderRadius: 11, border: 'none', background: color, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.18s', opacity: h ? 0.88 : 1, transform: h ? 'translateY(-2px)' : 'translateY(0)', boxShadow: h ? `0 8px 24px ${color}50` : `0 4px 14px ${color}35` }}>
      {children}
    </button>
  );
}

const inp = { width: '100%', padding: '11px 13px', borderRadius: 11, background: 'rgba(15,23,42,0.8)', border: '1px solid #334155', color: '#F8FAFC', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' };
const sel = { ...inp, cursor: 'pointer' };
