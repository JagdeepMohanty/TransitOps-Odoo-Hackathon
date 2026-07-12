import { useState } from 'react';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';
import Input     from '@components/common/Input';
import Select    from '@components/common/Select';
import TextArea  from '@components/common/TextArea';
import { MOCK_DRIVERS } from '@utils/mockData';

const LICENSE_TYPES = ['LMV','HMV','HGMV','HTV','PSV','Transport'];
const BLOOD_GROUPS  = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function EditDriverPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const driver   = MOCK_DRIVERS.find(d => d.id === id) ?? MOCK_DRIVERS[0];

  const [form,    setForm]    = useState({
    name: driver.name, phone: driver.phone, email: driver.email,
    dob: '', address: '', license: driver.license,
    licenseType: 'HMV', licenseExpiry: driver.licenseExpiry,
    bloodGroup: '', emergencyName: '', emergencyPhone: '', notes: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
    if (!form.license.trim()) e.license = 'License number is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate('/drivers');
  }

  return (
    <PageShell
      title="Edit Driver"
      subtitle={`Editing ${driver.name}`}
      actions={
        <Link to="/drivers">
          <Button variant="secondary" icon={ArrowLeft}>Back to Drivers</Button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <Users className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input id="name"       label="Full Name"     value={form.name}       onChange={e => set('name', e.target.value)}       error={errors.name}  required />
              <Input id="phone"      label="Phone Number"  value={form.phone}      onChange={e => set('phone', e.target.value)}      error={errors.phone} required />
              <Input id="email"      label="Email Address" value={form.email}      onChange={e => set('email', e.target.value)}      type="email" />
              <Input id="dob"        label="Date of Birth" type="date"             value={form.dob}        onChange={e => set('dob', e.target.value)}        />
              <Select id="bloodGroup" label="Blood Group"  options={BLOOD_GROUPS}  value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)} placeholder="Select blood group" />
            </div>
            <div className="px-6 pb-6">
              <TextArea id="address" label="Address" value={form.address} onChange={e => set('address', e.target.value)} rows={2} />
            </div>
          </div>

          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">License Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input  id="license"       label="License Number" value={form.license}       onChange={e => set('license', e.target.value)}       error={errors.license} required />
              <Select id="licenseType"   label="License Type"   options={LICENSE_TYPES}    value={form.licenseType}   onChange={e => set('licenseType', e.target.value)} placeholder="Select type" />
              <Input  id="licenseExpiry" label="License Expiry" type="date"                value={form.licenseExpiry} onChange={e => set('licenseExpiry', e.target.value)} />
            </div>
          </div>

          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Emergency Contact</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="emergencyName"  label="Contact Name"  value={form.emergencyName}  onChange={e => set('emergencyName', e.target.value)}  />
              <Input id="emergencyPhone" label="Contact Phone" value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to="/drivers"><Button variant="secondary">Cancel</Button></Link>
            <Button type="submit" icon={Save} loading={loading}>Update Driver</Button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
