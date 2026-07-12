import { useState, useMemo } from 'react';
import { X, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { DISPATCHER_VEHICLES, DISPATCHER_DRIVERS } from '@utils/tripDispatcherMockData';

const INITIAL = {
  source: '', destination: '', vehicleId: '', driverId: '',
  cargoWeight: '', cargoType: '', distance: '', duration: '', notes: '',
};

export default function CreateTripModal({ onClose, onSubmit }) {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Business rules: only available vehicles
  const availableVehicles = useMemo(() =>
    DISPATCHER_VEHICLES.filter(v => v.status === 'available'),
  []);

  // Business rules: only available drivers with valid license
  const today = new Date();
  const availableDrivers = useMemo(() =>
    DISPATCHER_DRIVERS.filter(d => {
      if (d.status !== 'available') return false;
      if (new Date(d.licenseExpiry) <= today) return false;
      return true;
    }),
  []);

  const selectedVehicle = availableVehicles.find(v => v.id === form.vehicleId);
  const cargoNum = parseFloat(form.cargoWeight);

  // Cargo weight validation
  const cargoError = selectedVehicle && form.cargoWeight
    ? cargoNum > selectedVehicle.capacity
      ? `Exceeds vehicle capacity of ${selectedVehicle.capacity.toLocaleString()} kg`
      : null
    : null;

  const canDispatch = form.source && form.destination && form.vehicleId &&
    form.driverId && form.cargoWeight && !cargoError;

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.source)      e.source      = 'Source is required';
    if (!form.destination) e.destination = 'Destination is required';
    if (!form.vehicleId)   e.vehicleId   = 'Select a vehicle';
    if (!form.driverId)    e.driverId    = 'Select a driver';
    if (!form.cargoWeight) e.cargoWeight = 'Cargo weight is required';
    if (cargoError)        e.cargoWeight = cargoError;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const vehicle = availableVehicles.find(v => v.id === form.vehicleId);
    const driver  = availableDrivers.find(d => d.id === form.driverId);
    onSubmit?.({ ...form, vehicle: vehicle?.plate, vehicleModel: `${vehicle?.make} ${vehicle?.model}`, driver: driver?.name, driverId: form.driverId });
    setSubmitted(true);
    setTimeout(onClose, 1200);
  }

  if (submitted) {
    return (
      <ModalShell onClose={onClose}>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={28} color="#22C55E" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>Trip Created!</p>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 6 }}>The trip has been added to the dispatcher queue.</p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #1E293B' }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>Create New Trip</p>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Fill in the details to schedule a dispatch</p>
        </div>
        <CloseBtn onClick={onClose} />
      </div>

      {/* Form */}
      <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Source *" error={errors.source}>
            <Input placeholder="e.g. Mumbai, MH" value={form.source} onChange={v => set('source', v)} error={errors.source} />
          </Field>
          <Field label="Destination *" error={errors.destination}>
            <Input placeholder="e.g. Pune, MH" value={form.destination} onChange={v => set('destination', v)} error={errors.destination} />
          </Field>

          {/* Vehicle dropdown */}
          <Field label="Vehicle *" error={errors.vehicleId} span={2}>
            <select
              value={form.vehicleId}
              onChange={e => set('vehicleId', e.target.value)}
              style={selectStyle(!!errors.vehicleId)}
            >
              <option value="">— Select Available Vehicle —</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.plate} · {v.make} {v.model} · Cap: {v.capacity.toLocaleString()} kg · Fuel: {v.fuel}%
                </option>
              ))}
            </select>
            {errors.vehicleId && <ErrMsg msg={errors.vehicleId} />}
          </Field>

          {/* Driver dropdown */}
          <Field label="Driver *" error={errors.driverId} span={2}>
            <select
              value={form.driverId}
              onChange={e => set('driverId', e.target.value)}
              style={selectStyle(!!errors.driverId)}
            >
              <option value="">— Select Available Driver —</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} · {d.trips} trips · ★ {d.rating} · License: {d.licenseExpiry}
                </option>
              ))}
            </select>
            {errors.driverId && <ErrMsg msg={errors.driverId} />}
          </Field>

          <Field label="Cargo Weight (kg) *" error={errors.cargoWeight}>
            <Input
              type="number" placeholder="e.g. 15000"
              value={form.cargoWeight} onChange={v => set('cargoWeight', v)}
              error={errors.cargoWeight}
            />
            {/* Capacity warning */}
            {cargoError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8 }}>
                <AlertTriangle size={12} color="#EF4444" />
                <span style={{ fontSize: 11, color: '#FCA5A5' }}>{cargoError}</span>
              </div>
            )}
            {selectedVehicle && form.cargoWeight && !cargoError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '6px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
                <CheckCircle2 size={12} color="#22C55E" />
                <span style={{ fontSize: 11, color: '#86EFAC' }}>Within capacity ({selectedVehicle.capacity.toLocaleString()} kg max)</span>
              </div>
            )}
          </Field>

          <Field label="Cargo Type">
            <Input placeholder="e.g. Electronics" value={form.cargoType} onChange={v => set('cargoType', v)} />
          </Field>

          <Field label="Planned Distance (km)">
            <Input type="number" placeholder="e.g. 350" value={form.distance} onChange={v => set('distance', v)} />
          </Field>

          <Field label="Expected Duration">
            <Input placeholder="e.g. 6h 30m" value={form.duration} onChange={v => set('duration', v)} />
          </Field>

          <Field label="Notes" span={2}>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Special instructions, handling notes…"
              rows={3}
              style={{
                ...inputBase, resize: 'vertical', lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 24px', borderTop: '1px solid #1E293B' }}>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={!canDispatch}
          style={{
            ...primaryBtn,
            opacity: canDispatch ? 1 : 0.4,
            cursor: canDispatch ? 'pointer' : 'not-allowed',
          }}
        >
          <Zap size={15} />
          Create Trip
        </button>
      </div>
    </ModalShell>
  );
}

/* ── Helpers ── */

function ModalShell({ children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 60, animation: 'fadeIn 0.2s' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '100%', maxWidth: 620, background: '#111827',
        border: '1px solid #334155', borderRadius: 20,
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)', zIndex: 61,
        animation: 'fadeUp 0.25s ease-out',
      }}>
        {children}
      </div>
    </>
  );
}

function Field({ label, error, children, span }) {
  return (
    <div style={{ gridColumn: span === 2 ? 'span 2' : undefined }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: error ? '#FCA5A5' : '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', error }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...inputBase, borderColor: error ? '#EF4444' : '#334155' }}
    />
  );
}

function ErrMsg({ msg }) {
  return <p style={{ fontSize: 11, color: '#FCA5A5', marginTop: 4 }}>{msg}</p>;
}

function CloseBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #334155', background: 'transparent', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <X size={16} />
    </button>
  );
}

const inputBase = {
  width: '100%', padding: '9px 12px', borderRadius: 10,
  background: '#0F172A', border: '1px solid #334155',
  color: '#F8FAFC', fontSize: 13, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
};

function selectStyle(hasError) {
  return {
    ...inputBase,
    borderColor: hasError ? '#EF4444' : '#334155',
    cursor: 'pointer', appearance: 'none',
  };
}

const primaryBtn = {
  display: 'flex', alignItems: 'center', gap: 7,
  padding: '9px 20px', borderRadius: 10, border: 'none',
  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  color: '#fff', fontSize: 13, fontWeight: 600,
  boxShadow: '0 0 16px rgba(59,130,246,0.4)',
};

const secondaryBtn = {
  padding: '9px 18px', borderRadius: 10,
  background: 'transparent', border: '1px solid #334155',
  color: '#94A3B8', fontSize: 13, fontWeight: 500, cursor: 'pointer',
};
