import { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { FLEET_VEHICLES, MAINTENANCE_TYPES, SERVICE_CATEGORIES, TECHNICIANS } from '@utils/maintenanceMockData';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export default function MaintenanceFormModal({ mode, record, onClose, onSubmit }) {
  const isAdd      = mode === 'add';
  const isEdit     = mode === 'edit';
  const isComplete = mode === 'complete';
  const isCancel   = mode === 'cancel';
  const isDelete   = mode === 'delete';

  const [form, setForm] = useState({
    vehicleId: '', type: '', category: '', issueDescription: '',
    priority: 'medium', technician: '', cost: '', expectedCompletion: '',
    odometer: '', notes: '',
  });

  useEffect(() => {
    if (record && (isEdit || isComplete)) {
      setForm({
        vehicleId:          record.vehicleId ?? '',
        type:               record.type ?? '',
        category:           record.category ?? '',
        issueDescription:   record.issueDescription ?? '',
        priority:           record.priority ?? 'medium',
        technician:         record.technician ?? '',
        cost:               record.cost ?? '',
        expectedCompletion: record.expectedCompletion ?? '',
        odometer:           record.odometer ?? '',
        notes:              record.notes ?? '',
      });
    }
  }, [record, isEdit, isComplete]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const title = {
    add:      'Schedule Maintenance',
    edit:     'Edit Maintenance',
    complete: 'Complete Maintenance',
    cancel:   'Cancel Maintenance',
    delete:   'Delete Maintenance',
  }[mode];

  const accentColor = {
    add: '#3B82F6', edit: '#8B5CF6', complete: '#22C55E',
    cancel: '#F59E0B', delete: '#EF4444',
  }[mode];

  const ModeIcon = { add: null, edit: null, complete: CheckCircle, cancel: XCircle, delete: Trash2 }[mode];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)', zIndex: 60,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: isDelete || isCancel ? 440 : 580,
        background: '#111827',
        border: `1px solid ${accentColor}33`,
        borderRadius: 20, zIndex: 61, overflow: 'hidden',
        boxShadow: `0 30px 70px rgba(0,0,0,0.85), 0 0 0 1px ${accentColor}18`,
        animation: 'fadeUp 0.25s cubic-bezier(0.4,0,0.2,1)',
        maxHeight: '92vh', overflowY: 'auto',
      }}>
        {/* Top accent line */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}66, transparent)`,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid #1E293B',
          background: `linear-gradient(135deg, ${accentColor}0d 0%, transparent 100%)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {ModeIcon && (
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: `${accentColor}18`, border: `1px solid ${accentColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ModeIcon size={16} color={accentColor} />
              </div>
            )}
            <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>{title}</p>
          </div>
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
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '22px' }}>
          {(isDelete || isCancel) ? (
            <ConfirmBody mode={mode} record={record} accentColor={accentColor} onClose={onClose} onSubmit={onSubmit} />
          ) : isComplete ? (
            <CompleteBody form={form} set={set} record={record} accentColor={accentColor} onClose={onClose} onSubmit={onSubmit} />
          ) : (
            <FormBody form={form} set={set} accentColor={accentColor} onClose={onClose} onSubmit={onSubmit} isEdit={isEdit} />
          )}
        </div>
      </div>
    </>
  );
}

/* ── Add / Edit Form ─────────────────────────────────────────── */
function FormBody({ form, set, accentColor, onClose, onSubmit, isEdit }) {
  return (
    <>
      <div style={{
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)',
        borderRadius: 10, padding: '11px 14px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 9,
      }}>
        <AlertTriangle size={14} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: '#FDE68A', lineHeight: 1.55 }}>
          {isEdit
            ? 'Editing this record will update the maintenance details immediately.'
            : <>Scheduling maintenance will set the vehicle status to <strong>In Shop</strong> and hide it from the Trip Dispatcher.</>
          }
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Vehicle" span={2}>
          <select value={form.vehicleId} onChange={e => set('vehicleId', e.target.value)} style={selectStyle}>
            <option value="">Select vehicle…</option>
            {FLEET_VEHICLES.map(v => (
              <option key={v.id} value={v.id}>{v.name} — {v.registration}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Maintenance Type">
          <select value={form.type} onChange={e => set('type', e.target.value)} style={selectStyle}>
            <option value="">Select type…</option>
            {MAINTENANCE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>

        <FormField label="Service Category">
          <select value={form.category} onChange={e => set('category', e.target.value)} style={selectStyle}>
            <option value="">Select category…</option>
            {SERVICE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>

        <FormField label="Priority">
          <select value={form.priority} onChange={e => set('priority', e.target.value)} style={selectStyle}>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Technician Name">
          <select value={form.technician} onChange={e => set('technician', e.target.value)} style={selectStyle}>
            <option value="">Select technician…</option>
            {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>

        <FormField label="Estimated Cost (₹)">
          <input
            type="number" value={form.cost}
            onChange={e => set('cost', e.target.value)}
            placeholder="e.g. 15000" style={inputStyle}
          />
        </FormField>

        <FormField label="Expected Completion">
          <input
            type="date" value={form.expectedCompletion}
            onChange={e => set('expectedCompletion', e.target.value)}
            style={inputStyle}
          />
        </FormField>

        <FormField label="Current Odometer (km)" span={2}>
          <input
            type="number" value={form.odometer}
            onChange={e => set('odometer', e.target.value)}
            placeholder="e.g. 48200" style={inputStyle}
          />
        </FormField>

        <FormField label="Issue Description" span={2}>
          <textarea
            value={form.issueDescription}
            onChange={e => set('issueDescription', e.target.value)}
            placeholder="Describe the issue or service required…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 76 }}
          />
        </FormField>

        <FormField label="Notes" span={2}>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Additional notes…"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 56 }}
          />
        </FormField>
      </div>

      <ModalFooter
        onClose={onClose}
        onSubmit={() => onSubmit?.(form)}
        accentColor={accentColor}
        submitLabel={isEdit ? 'Save Changes' : 'Schedule Maintenance'}
      />
    </>
  );
}

/* ── Complete Form ───────────────────────────────────────────── */
function CompleteBody({ form, set, record, accentColor, onClose, onSubmit }) {
  return (
    <>
      <div style={{
        background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.22)',
        borderRadius: 10, padding: '11px 14px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 9,
      }}>
        <CheckCircle size={14} color="#22C55E" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: '#86EFAC', lineHeight: 1.55 }}>
          Completing this maintenance will set the vehicle status back to <strong>Available</strong> and make it visible in the Trip Dispatcher.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Actual Cost (₹)">
          <input
            type="number" value={form.cost}
            onChange={e => set('cost', e.target.value)}
            placeholder="Actual cost incurred" style={inputStyle}
          />
        </FormField>
        <FormField label="Completion Date">
          <input
            type="date" value={form.expectedCompletion}
            onChange={e => set('expectedCompletion', e.target.value)}
            style={inputStyle}
          />
        </FormField>
        <FormField label="Completion Notes" span={2}>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Completion notes, observations…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </FormField>
      </div>

      <ModalFooter
        onClose={onClose}
        onSubmit={() => onSubmit?.(form)}
        accentColor={accentColor}
        submitLabel="Mark as Completed"
      />
    </>
  );
}

/* ── Confirm Body (Cancel / Delete) ─────────────────────────── */
function ConfirmBody({ mode, record, accentColor, onClose, onSubmit }) {
  const isDelete = mode === 'delete';
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%', margin: '0 auto 18px',
        background: `${accentColor}14`, border: `2px solid ${accentColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 24px ${accentColor}20`,
      }}>
        {isDelete ? <Trash2 size={24} color={accentColor} /> : <XCircle size={24} color={accentColor} />}
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>
        {isDelete ? 'Delete Maintenance Record?' : 'Cancel Maintenance?'}
      </p>
      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.65, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
        {isDelete
          ? `This will permanently delete record ${record?.id}. This action cannot be undone.`
          : `Cancelling ${record?.id} will mark the vehicle as Available again and remove it from the active maintenance queue.`
        }
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={onClose} style={ghostBtnStyle}>Keep</button>
        <button
          onClick={() => onSubmit?.()}
          style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: accentColor, color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', transition: 'opacity 0.15s',
            boxShadow: `0 4px 14px ${accentColor}40`,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {isDelete ? 'Delete Record' : 'Cancel Maintenance'}
        </button>
      </div>
    </div>
  );
}

/* ── Shared helpers ──────────────────────────────────────────── */
function FormField({ label, children, span = 1 }) {
  return (
    <div style={{ gridColumn: span === 2 ? '1 / -1' : undefined }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700, color: '#94A3B8',
        marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ModalFooter({ onClose, onSubmit, accentColor, submitLabel }) {
  return (
    <div style={{
      display: 'flex', gap: 10, justifyContent: 'flex-end',
      marginTop: 22, paddingTop: 18, borderTop: '1px solid #1E293B',
    }}>
      <button onClick={onClose} style={ghostBtnStyle}>Cancel</button>
      <button
        onClick={onSubmit}
        style={{
          padding: '10px 24px', borderRadius: 10, border: 'none',
          background: accentColor, color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.15s',
          boxShadow: `0 4px 14px ${accentColor}35`,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {submitLabel}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  background: '#0F172A', border: '1px solid #334155',
  color: '#F8FAFC', fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };

const ghostBtnStyle = {
  padding: '10px 20px', borderRadius: 10, border: '1px solid #334155',
  background: 'transparent', color: '#94A3B8', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.15s',
};
