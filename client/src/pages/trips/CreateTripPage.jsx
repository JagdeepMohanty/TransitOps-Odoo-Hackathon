import { useState } from 'react';
import { ArrowLeft, Save, Route, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { MOCK_VEHICLES, MOCK_DRIVERS } from '@/utils/mockData';

const CARGO_TYPES = ['Electronics','Textiles','Auto Parts','FMCG','Chemicals','Steel','Machinery','Pharmaceuticals','Food & Beverages','Construction Materials','Other'];

const VEHICLE_OPTIONS = MOCK_VEHICLES
  .filter(v => v.status === 'available')
  .map(v => `${v.plate} — ${v.make} ${v.model}`);

const DRIVER_OPTIONS = MOCK_DRIVERS
  .filter(d => d.status === 'active')
  .map(d => `${d.name} (${d.license})`);

const INITIAL = {
  origin: '', destination: '', driver: '', vehicle: '',
  cargo: '', weight: '', distance: '', startDate: '', startTime: '',
  estimatedArrival: '', notes: '',
};

function Field({ label, error, children, required }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-content-secondary">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </label>
  );
}

const inputCls = (err) =>
  `w-full h-9 px-3 text-sm border rounded-xl outline-none transition bg-bg-card text-content-primary placeholder:text-content-disabled focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    err ? 'border-danger bg-danger-muted' : 'border-border hover:border-border-strong'
  }`;

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.origin.trim())      e.origin      = 'Origin is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.driver)             e.driver      = 'Driver is required';
    if (!form.vehicle)            e.vehicle     = 'Vehicle is required';
    if (!form.startDate)          e.startDate   = 'Start date is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate('/trips');
  }

  return (
    <PageShell
      title="Create Trip"
      subtitle="Schedule a new trip for your fleet"
      actions={
        <Link to="/trips">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-content-secondary hover:bg-bg-hover transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Trips
          </button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">

          {/* Route */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <MapPin className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Route Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Origin"           error={errors.origin}      required>
                <input className={inputCls(errors.origin)}      value={form.origin}           onChange={e => set('origin', e.target.value)}           placeholder="Mumbai, Maharashtra" />
              </Field>
              <Field label="Destination"      error={errors.destination} required>
                <input className={inputCls(errors.destination)} value={form.destination}      onChange={e => set('destination', e.target.value)}      placeholder="Pune, Maharashtra" />
              </Field>
              <Field label="Distance (km)">
                <input className={inputCls()} type="number" min="1"      value={form.distance}         onChange={e => set('distance', e.target.value)}         placeholder="148" />
              </Field>
              <Field label="Departure Date"   error={errors.startDate}   required>
                <input className={inputCls(errors.startDate)}  type="date"                    value={form.startDate}        onChange={e => set('startDate', e.target.value)}        />
              </Field>
              <Field label="Departure Time">
                <input className={inputCls()} type="time"                value={form.startTime}        onChange={e => set('startTime', e.target.value)}        />
              </Field>
              <Field label="Estimated Arrival">
                <input className={inputCls()} type="date"                value={form.estimatedArrival} onChange={e => set('estimatedArrival', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <Route className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Assignment</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Driver"  error={errors.driver}  required>
                <select className={inputCls(errors.driver)}  value={form.driver}  onChange={e => set('driver', e.target.value)}>
                  <option value="">Select available driver</option>
                  {DRIVER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Vehicle" error={errors.vehicle} required>
                <select className={inputCls(errors.vehicle)} value={form.vehicle} onChange={e => set('vehicle', e.target.value)}>
                  <option value="">Select available vehicle</option>
                  {VEHICLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Cargo */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Cargo Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cargo Type">
                <select className={inputCls()} value={form.cargo} onChange={e => set('cargo', e.target.value)}>
                  <option value="">Select cargo type</option>
                  {CARGO_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Weight (tons)">
                <input className={inputCls()} type="number" min="0" step="0.1" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="10.5" />
              </Field>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Additional Notes</h2>
            </div>
            <div className="p-6">
              <textarea
                className={`${inputCls()} h-auto py-2`}
                rows={3}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Special instructions, route notes, or any other details…"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to="/trips">
              <button type="button" className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-content-secondary hover:bg-bg-hover transition-all">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60 transition-all"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Create Trip
            </button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
