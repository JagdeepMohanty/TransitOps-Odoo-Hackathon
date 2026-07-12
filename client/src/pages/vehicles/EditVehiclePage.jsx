import { useState } from 'react';
import { ArrowLeft, Save, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';
import Input     from '@components/common/Input';
import Select    from '@components/common/Select';
import TextArea  from '@components/common/TextArea';
import { MOCK_VEHICLES } from '@utils/mockData';

const VEHICLE_TYPES = ['Heavy Truck','Medium Truck','Light Truck','Mini Truck','Tanker','Trailer'];
const FUEL_TYPES    = ['Diesel','Petrol','CNG','Electric','Hybrid'];
const MAKES         = ['Tata','Ashok Leyland','Eicher','Mahindra','Volvo','Mercedes-Benz','MAN','BharatBenz'];

export default function EditVehiclePage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const vehicle  = MOCK_VEHICLES.find(v => v.id === id) ?? MOCK_VEHICLES[0];

  const [form,    setForm]    = useState({
    plate: vehicle.plate, make: vehicle.make, model: vehicle.model,
    year: String(vehicle.year), type: vehicle.type, fuel: vehicle.fuel,
    capacity: '', color: '', vin: '', insurance: '', insuranceExpiry: '',
    fitness: '', fitnessExpiry: '', notes: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.plate.trim()) e.plate = 'Registration plate is required';
    if (!form.make)         e.make  = 'Make is required';
    if (!form.model.trim()) e.model = 'Model is required';
    if (!form.year)         e.year  = 'Year is required';
    if (!form.type)         e.type  = 'Vehicle type is required';
    if (!form.fuel)         e.fuel  = 'Fuel type is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate('/vehicles');
  }

  return (
    <PageShell
      title="Edit Vehicle"
      subtitle={`Editing ${vehicle.plate} — ${vehicle.make} ${vehicle.model}`}
      actions={
        <Link to="/vehicles">
          <Button variant="secondary" icon={ArrowLeft}>Back to Vehicles</Button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <Truck className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Vehicle Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input id="plate"    label="Registration Plate" value={form.plate}    onChange={e => set('plate', e.target.value)}    error={errors.plate}    required />
              <Select id="make"    label="Make"               options={MAKES}       value={form.make}     onChange={e => set('make', e.target.value)}     error={errors.make}     required placeholder="Select make" />
              <Input id="model"    label="Model"              value={form.model}    onChange={e => set('model', e.target.value)}    error={errors.model}    required />
              <Input id="year"     label="Year"               type="number"         value={form.year}     onChange={e => set('year', e.target.value)}     error={errors.year}     required />
              <Select id="type"    label="Vehicle Type"       options={VEHICLE_TYPES} value={form.type}   onChange={e => set('type', e.target.value)}     error={errors.type}     required placeholder="Select type" />
              <Select id="fuel"    label="Fuel Type"          options={FUEL_TYPES}  value={form.fuel}     onChange={e => set('fuel', e.target.value)}     error={errors.fuel}     required placeholder="Select fuel" />
              <Input id="capacity" label="Load Capacity (tons)" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
              <Input id="color"    label="Color"              value={form.color}    onChange={e => set('color', e.target.value)}    />
              <Input id="vin"      label="VIN / Chassis No."  value={form.vin}      onChange={e => set('vin', e.target.value)}      />
            </div>
          </div>

          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Documents & Compliance</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input id="insurance"       label="Insurance Policy No."    value={form.insurance}       onChange={e => set('insurance', e.target.value)}       />
              <Input id="insuranceExpiry" label="Insurance Expiry"        type="date" value={form.insuranceExpiry} onChange={e => set('insuranceExpiry', e.target.value)} />
              <Input id="fitness"         label="Fitness Certificate No." value={form.fitness}         onChange={e => set('fitness', e.target.value)}         />
              <Input id="fitnessExpiry"   label="Fitness Expiry"          type="date" value={form.fitnessExpiry}   onChange={e => set('fitnessExpiry', e.target.value)}   />
            </div>
          </div>

          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Additional Notes</h2>
            </div>
            <div className="p-6">
              <TextArea id="notes" label="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to="/vehicles"><Button variant="secondary">Cancel</Button></Link>
            <Button type="submit" icon={Save} loading={loading}>Update Vehicle</Button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
