import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageShell from '@components/layout/PageShell';
import Button    from '@components/common/Button';
import Input     from '@components/common/Input';
import Select    from '@components/common/Select';
import Spinner   from '@components/common/Spinner';
import { driversApi } from '@api/drivers.api';
import { LICENSE_CATEGORIES, DRIVER_STATUSES } from '@utils/constants';

export default function EditDriverPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form,     setForm]     = useState(null);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    driversApi.getById(id)
      .then(res => {
        const d = res.data.data;
        setForm({
          name:              d.name,
          licenseNumber:     d.licenseNumber,
          licenseCategory:   d.licenseCategory,
          licenseExpiryDate: d.licenseExpiryDate ? d.licenseExpiryDate.slice(0, 10) : '',
          contactNumber:     d.contactNumber,
          safetyScore:       String(d.safetyScore),
          status:            d.status,
        });
      })
      .catch(() => setApiError('Driver not found'))
      .finally(() => setFetching(false));
  }, [id]);

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())          e.name          = 'Full name is required';
    if (!form.licenseNumber.trim()) e.licenseNumber = 'License number is required';
    if (!form.contactNumber.trim()) e.contactNumber = 'Contact number is required';
    if (form.licenseExpiryDate && new Date(form.licenseExpiryDate) <= new Date()) {
      e.licenseExpiryDate = 'License expiry must be a future date';
    }
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
      await driversApi.update(id, {
        name:              form.name.trim(),
        licenseNumber:     form.licenseNumber.trim(),
        licenseCategory:   form.licenseCategory || undefined,
        licenseExpiryDate: form.licenseExpiryDate || undefined,
        contactNumber:     form.contactNumber.trim(),
        safetyScore:       Number(form.safetyScore),
        status:            form.status,
      });
      navigate('/drivers');
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Failed to update driver');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-sm text-red-500">
        {apiError || 'Driver not found'}
      </div>
    );
  }

  return (
    <PageShell
      title="Edit Driver"
      subtitle={`Editing ${form.name}`}
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
                value={form.name}
                onChange={e => set('name', e.target.value)}
                error={errors.name}
                required
              />
              <Input
                id="contactNumber"
                label="Contact Number"
                value={form.contactNumber}
                onChange={e => set('contactNumber', e.target.value)}
                error={errors.contactNumber}
                required
              />
              <Input
                id="licenseNumber"
                label="License Number"
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
                placeholder="Select category"
              />
              <Input
                id="licenseExpiryDate"
                label="License Expiry Date"
                type="date"
                value={form.licenseExpiryDate}
                onChange={e => set('licenseExpiryDate', e.target.value)}
                error={errors.licenseExpiryDate}
              />
              <Input
                id="safetyScore"
                label="Safety Score (0–100)"
                type="number"
                value={form.safetyScore}
                onChange={e => set('safetyScore', e.target.value)}
                error={errors.safetyScore}
                min="0"
                max="100"
              />
              <Select
                id="status"
                label="Status"
                options={DRIVER_STATUSES}
                value={form.status}
                onChange={e => set('status', e.target.value)}
                placeholder="Select status"
              />
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
