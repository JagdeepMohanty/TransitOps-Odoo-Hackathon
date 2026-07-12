import { useState } from 'react';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';
import Input     from '@components/common/Input';
import Select    from '@components/common/Select';
import { driversApi } from '@api/drivers.api';
import { LICENSE_CATEGORIES } from '@utils/constants';

const INITIAL = {
  name:              '',
  licenseNumber:     '',
  licenseCategory:   '',
  licenseExpiryDate: '',
  contactNumber:     '',
  safetyScore:       '100',
};

export default function AddDriverPage() {
  const navigate = useNavigate();
  const [form,     setForm]     = useState(INITIAL);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())              e.name              = 'Full name is required';
    if (!form.licenseNumber.trim())     e.licenseNumber     = 'License number is required';
    if (!form.licenseCategory)          e.licenseCategory   = 'License category is required';
    if (!form.licenseExpiryDate)        e.licenseExpiryDate = 'License expiry date is required';
    else if (new Date(form.licenseExpiryDate) <= new Date()) {
      e.licenseExpiryDate = 'License expiry must be a future date';
    }
    if (!form.contactNumber.trim())     e.contactNumber     = 'Contact number is required';
    const score = Number(form.safetyScore);
    if (isNaN(score) || score < 0 || score > 100) e.safetyScore = 'Safety score must be 0–100';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await driversApi.create({
        name:              form.name.trim(),
        licenseNumber:     form.licenseNumber.trim(),
        licenseCategory:   form.licenseCategory,
        licenseExpiryDate: form.licenseExpiryDate,
        contactNumber:     form.contactNumber.trim(),
        safetyScore:       Number(form.safetyScore),
      });
      navigate('/drivers');
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Failed to create driver');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="Add Driver"
      subtitle="Register a new driver to your roster"
      actions={
        <Link to="/drivers">
          <Button variant="secondary" icon={ArrowLeft}>Back to Drivers</Button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">

          {apiError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <Users className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Driver Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                id="name"
                label="Full Name"
                placeholder="Rajesh Kumar"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                error={errors.name}
                required
              />
              <Input
                id="contactNumber"
                label="Contact Number"
                placeholder="9876543210"
                value={form.contactNumber}
                onChange={e => set('contactNumber', e.target.value)}
                error={errors.contactNumber}
                required
              />
              <Input
                id="licenseNumber"
                label="License Number"
                placeholder="DL0120230001234"
                value={form.licenseNumber}
                onChange={e => set('licenseNumber', e.target.value)}
                error={errors.licenseNumber}
                required
              />
              <Select
                id="licenseCategory"
                label="License Category"
                options={LICENSE_CATEGORIES}
                value={form.licenseCategory}
                onChange={e => set('licenseCategory', e.target.value)}
                error={errors.licenseCategory}
                required
                placeholder="Select category"
              />
              <Input
                id="licenseExpiryDate"
                label="License Expiry Date"
                type="date"
                value={form.licenseExpiryDate}
                onChange={e => set('licenseExpiryDate', e.target.value)}
                error={errors.licenseExpiryDate}
                required
              />
              <Input
                id="safetyScore"
                label="Safety Score (0–100)"
                type="number"
                placeholder="100"
                value={form.safetyScore}
                onChange={e => set('safetyScore', e.target.value)}
                error={errors.safetyScore}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to="/drivers"><Button variant="secondary">Cancel</Button></Link>
            <Button type="submit" icon={Save} loading={loading}>Save Driver</Button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
