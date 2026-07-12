import { useState } from 'react';
import { ArrowLeft, Save, Route, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';
import Input     from '@components/common/Input';
import Select    from '@components/common/Select';
import TextArea  from '@components/common/TextArea';
import { MOCK_VEHICLES, MOCK_DRIVERS } from '@utils/mockData';

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
          <Button variant="secondary" icon={ArrowLeft}>Back to Trips</Button>
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
              <Input id="origin"      label="Origin"      placeholder="Mumbai, Maharashtra"  value={form.origin}      onChange={e => set('origin', e.target.value)}      error={errors.origin}      required />
              <Input id="destination" label="Destination" placeholder="Pune, Maharashtra"    value={form.destination} onChange={e => set('destination', e.target.value)} error={errors.destination} required />
              <Input id="distance"    label="Distance (km)" placeholder="148"               value={form.distance}    onChange={e => set('distance', e.target.value)}    type="number" min="1" />
              <Input id="startDate"   label="Departure Date" type="date"                    value={form.startDate}   onChange={e => set('startDate', e.target.value)}   error={errors.startDate}   required />
              <Input id="startTime"   label="Departure Time" type="time"                    value={form.startTime}   onChange={e => set('startTime', e.target.value)}   />
              <Input id="estimatedArrival" label="Estimated Arrival" type="date"            value={form.estimatedArrival} onChange={e => set('estimatedArrival', e.target.value)} />
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <Route className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Assignment</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="driver"  label="Driver"  options={DRIVER_OPTIONS}  value={form.driver}  onChange={e => set('driver', e.target.value)}  error={errors.driver}  required placeholder="Select available driver"  />
              <Select id="vehicle" label="Vehicle" options={VEHICLE_OPTIONS} value={form.vehicle} onChange={e => set('vehicle', e.target.value)} error={errors.vehicle} required placeholder="Select available vehicle" />
            </div>
          </div>

          {/* Cargo */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Cargo Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="cargo"  label="Cargo Type"    options={CARGO_TYPES} value={form.cargo}  onChange={e => set('cargo', e.target.value)}  placeholder="Select cargo type" />
              <Input  id="weight" label="Weight (tons)" placeholder="10.5"    value={form.weight} onChange={e => set('weight', e.target.value)} type="number" min="0" step="0.1" />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Additional Notes</h2>
            </div>
            <div className="p-6">
              <TextArea id="notes" label="Notes" placeholder="Special instructions, route notes, or any other details…" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to="/trips"><Button variant="secondary">Cancel</Button></Link>
            <Button type="submit" icon={Save} loading={loading}>Create Trip</Button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
