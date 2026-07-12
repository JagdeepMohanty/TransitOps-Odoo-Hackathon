import { useState, useEffect } from 'react';
import { X, Trash2, Receipt, Calculator, CheckCircle } from 'lucide-react';
import { FE_VEHICLES, EXPENSE_TYPES, EXPENSE_CATS, PAYMENT_METHODS } from '@utils/fuelExpenseMockData';

const STATUSES = ['pending', 'approved', 'rejected'];

export default function ExpenseModal({ mode, record, onClose, onSubmit }) {
  const isAdd    = mode === 'add';
  const isEdit   = mode === 'edit';
  const isDelete = mode === 'delete';

  const [form, setForm] = useState({
    vehicleId: '', type: '', category: '', amount: '',
    date: '', paymentMethod: 'Fleet Card', status: 'pending', notes: '',
  });

  useEffect(() => {
    if (record && isEdit) {
      setForm({
        vehicleId:     record.vehicleId     ?? '',
        type:          record.type          ?? '',
        category:      record.category      ?? '',
        amount:        record.amount        ?? '',
        date:          record.date          ?? '',
        paymentMethod: record.paymentMethod ?? 'Fleet Card',
        status:        record.status        ?? 'pending',
        notes:         record.notes         ?? '',
      });
    }
  }, [record, isEdit]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  const title  = { add: 'Add Expense', edit: 'Edit Expense', delete: 'Delete Expense' }[mode];
  const accent = { add: '#8B5CF6', edit: '#3B82F6', delete: '#EF4444' }[mode];

  const isHighAmt = form.amount && Number(form.amount) > 40000;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 60, animation: 'feFadeIn 0.2s ease' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '100%', maxWidth: isDelete ? 440 : 580,
        background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
        border: `1px solid ${accent}35`,
        borderRadius: 22, zIndex: 61,
        boxShadow: `0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.04)`,
        animation: 'feFadeUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        maxHeight: '92vh', overflowY: 'auto',
      }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}88, transparent)`, borderRadius: '22px 22px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(30,41,59,0.8)', background: `linear-gradient(135deg, ${accent}0c 0%, transparent 100%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}1a`, border: `1px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${accent}20` }}>
              {isDelete ? <Trash2 size={16} color={accent} /> : <Receipt size={16} color={accent} />}
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>{title}</p>
              <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>
                {isAdd ? 'Log a new fleet expense' : isEdit ? `Editing ${record?.id}` : 'This action is permanent'}
              </p>
            </div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        <div style={{ padding: '24px' }}>
          {isDelete ? (
            <ConfirmDelete record={record} accent={accent} onClose={onClose} onSubmit={() => onSubmit?.(form)} label="Delete Expense" />
          ) : (
            <>
              {/* Business rules banner */}
              <div style={{ background: `${accent}0d`, border: `1px solid ${accent}28`, borderRadius: 12, padding: '12px 16px', marginBottom: 22, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Calculator size={14} color={accent} style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: accent === '#8B5CF6' ? '#C4B5FD' : '#93C5FD', lineHeight: 1.6, margin: 0 }}>
                  <strong>Operational Cost</strong> = Fuel + Maintenance + Other Expenses. Vehicle ROI = (Revenue − Costs) ÷ Acquisition Cost.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <FF label="Vehicle" span={2}>
                  <select value={form.vehicleId} onChange={e => set('vehicleId', e.target.value)} style={sel}>
                    <option value="">Select vehicle…</option>
                    {FE_VEHICLES.map(v => <option key={v.id} value={v.id}>{v.name} — {v.registration}</option>)}
                  </select>
                </FF>
                <FF label="Expense Type">
                  <select value={form.type} onChange={e => set('type', e.target.value)} style={sel}>
                    <option value="">Select type…</option>
                    {EXPENSE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FF>
                <FF label="Category">
                  <select value={form.category} onChange={e => set('category', e.target.value)} style={sel}>
                    <option value="">Select category…</option>
                    {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FF>
                <FF label="Amount (₹)">
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="e.g. 5000"
                      style={{ ...inp, borderColor: isHighAmt ? 'rgba(245,158,11,0.5)' : '#334155', paddingRight: isHighAmt ? 100 : 13 }}
                    />
                    {isHighAmt && (
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#F59E0B', fontWeight: 700, background: 'rgba(245,158,11,0.12)', padding: '2px 7px', borderRadius: 5 }}>
                        High Amount
                      </span>
                    )}
                  </div>
                </FF>
                <FF label="Expense Date">
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp} />
                </FF>
                <FF label="Payment Method">
                  <select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)} style={sel}>
                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </FF>
                <FF label="Status">
                  <select value={form.status} onChange={e => set('status', e.target.value)}
                    style={{ ...sel, borderColor: form.status === 'approved' ? 'rgba(34,197,94,0.4)' : form.status === 'rejected' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)', color: form.status === 'approved' ? '#86EFAC' : form.status === 'rejected' ? '#FCA5A5' : '#FDE68A' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </FF>
                <FF label="Notes" span={2}>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Description or notes…" rows={3} style={{ ...inp, resize: 'vertical', minHeight: 76 }} />
                </FF>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(30,41,59,0.8)' }}>
                <GhostBtn onClick={onClose}>Cancel</GhostBtn>
                <SubmitBtn color={accent} onClick={() => onSubmit?.(form)}>{isAdd ? 'Add Expense' : 'Save Changes'}</SubmitBtn>
              </div>
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
      <p style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>Delete Expense?</p>
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
