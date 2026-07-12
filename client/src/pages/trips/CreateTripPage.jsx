import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck, User, MapPin, Package, Route } from 'lucide-react'

import PageHeader  from '@/components/layout/PageHeader'
import Breadcrumb  from '@/components/common/Breadcrumb'
import Button      from '@/components/common/Button'
import Card        from '@/components/common/Card'
import { vehiclesApi } from '@/api/vehicles.api'
import { driversApi  } from '@/api/drivers.api'
import { tripsApi    } from '@/api/trips.api'

const CITIES = ['Ahmedabad', 'Mumbai', 'Pune', 'Delhi', 'Jaipur', 'Surat', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata']

const errMsg = (err) =>
  err?.response?.data?.message ?? err?.message ?? 'Something went wrong.'

const EMPTY = { source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '' }

export default function CreateTripPage() {
  const navigate = useNavigate()

  const [form,      setForm]      = useState(EMPTY)
  const [vehicles,  setVehicles]  = useState([])
  const [drivers,   setDrivers]   = useState([])
  const [loadingRes, setLoadingRes] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]     = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  // Load available vehicles and drivers
  useEffect(() => {
    setLoadingRes(true)
    Promise.all([vehiclesApi.getAvailable(), driversApi.getAvailable()])
      .then(([vRes, dRes]) => {
        setVehicles(vRes.data.data ?? [])
        setDrivers(dRes.data.data  ?? [])
      })
      .catch(() => setError('Failed to load available vehicles and drivers.'))
      .finally(() => setLoadingRes(false))
  }, [])

  const selectedVehicle = vehicles.find(v => v.id === parseInt(form.vehicleId))

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFieldErrors(fe => ({ ...fe, [field]: null }))
    setError(null)
  }

  const validate = () => {
    const errs = {}
    if (!form.source.trim())        errs.source          = 'Source city is required.'
    if (!form.destination.trim())   errs.destination     = 'Destination city is required.'
    if (form.source.trim() === form.destination.trim() && form.source.trim())
                                    errs.destination     = 'Source and destination must differ.'
    if (!form.vehicleId)            errs.vehicleId       = 'Select a vehicle.'
    if (!form.driverId)             errs.driverId        = 'Select a driver.'
    if (!form.cargoWeight || isNaN(form.cargoWeight) || parseFloat(form.cargoWeight) <= 0)
                                    errs.cargoWeight     = 'Enter a valid cargo weight.'
    if (selectedVehicle && parseFloat(form.cargoWeight) > parseFloat(selectedVehicle.maxLoadCapacity))
                                    errs.cargoWeight     = `Exceeds vehicle capacity of ${parseFloat(selectedVehicle.maxLoadCapacity).toLocaleString('en-IN')} kg.`
    if (!form.plannedDistance || isNaN(form.plannedDistance) || parseFloat(form.plannedDistance) <= 0)
                                    errs.plannedDistance = 'Enter a valid planned distance.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setSubmitting(true)
    setError(null)
    try {
      await tripsApi.create({
        source:          form.source.trim(),
        destination:     form.destination.trim(),
        vehicleId:       parseInt(form.vehicleId),
        driverId:        parseInt(form.driverId),
        cargoWeight:     parseFloat(form.cargoWeight),
        plannedDistance: parseFloat(form.plannedDistance),
      })
      navigate('/trips')
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Trips', path: '/trips' }, { label: 'New Trip' }]} />

      <PageHeader
        title="New Trip"
        subtitle="Schedule a new freight trip."
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate('/trips')}>
            Back to Trips
          </Button>
        }
      />

      {loadingRes ? (
        <Card><div className="py-10 text-center text-sm text-slate-500">Loading available vehicles and drivers…</div></Card>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Main form ─────────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Route */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-brand-600" />
                  <h2 className="text-sm font-semibold text-slate-800">Route</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Source City *" error={fieldErrors.source}>
                    <input
                      list="cities-src"
                      value={form.source}
                      onChange={set('source')}
                      placeholder="e.g. Ahmedabad"
                      className={inputCls(fieldErrors.source)}
                    />
                    <datalist id="cities-src">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                  </FormField>
                  <FormField label="Destination City *" error={fieldErrors.destination}>
                    <input
                      list="cities-dst"
                      value={form.destination}
                      onChange={set('destination')}
                      placeholder="e.g. Mumbai"
                      className={inputCls(fieldErrors.destination)}
                    />
                    <datalist id="cities-dst">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                  </FormField>
                </div>
              </Card>

              {/* Resources */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={16} className="text-brand-600" />
                  <h2 className="text-sm font-semibold text-slate-800">Resources</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Vehicle *" error={fieldErrors.vehicleId}>
                    <select value={form.vehicleId} onChange={set('vehicleId')} className={inputCls(fieldErrors.vehicleId)}>
                      <option value="">Select vehicle…</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} — {v.name} ({parseFloat(v.maxLoadCapacity).toLocaleString('en-IN')} kg)
                        </option>
                      ))}
                    </select>
                    {vehicles.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">No available vehicles. Add or free up a vehicle first.</p>
                    )}
                  </FormField>
                  <FormField label="Driver *" error={fieldErrors.driverId}>
                    <select value={form.driverId} onChange={set('driverId')} className={inputCls(fieldErrors.driverId)}>
                      <option value="">Select driver…</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.licenseCategory}
                        </option>
                      ))}
                    </select>
                    {drivers.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">No available drivers. Add or free up a driver first.</p>
                    )}
                  </FormField>
                </div>
              </Card>

              {/* Cargo & Distance */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Package size={16} className="text-brand-600" />
                  <h2 className="text-sm font-semibold text-slate-800">Cargo & Distance</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Cargo Weight (kg) *" error={fieldErrors.cargoWeight}>
                    <input
                      type="number" min="0.1" step="0.1"
                      value={form.cargoWeight}
                      onChange={set('cargoWeight')}
                      placeholder="e.g. 18000"
                      className={inputCls(fieldErrors.cargoWeight)}
                    />
                  </FormField>
                  <FormField label="Planned Distance (km) *" error={fieldErrors.plannedDistance}>
                    <input
                      type="number" min="1" step="0.1"
                      value={form.plannedDistance}
                      onChange={set('plannedDistance')}
                      placeholder="e.g. 530"
                      className={inputCls(fieldErrors.plannedDistance)}
                    />
                  </FormField>
                </div>
              </Card>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
              )}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => navigate('/trips')} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting} disabled={vehicles.length === 0 || drivers.length === 0}>
                  Create Trip
                </Button>
              </div>
            </div>

            {/* ── Sidebar summary ───────────────────────────────────────────── */}
            <div className="space-y-4">
              {selectedVehicle && (
                <Card variant="ghost">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Selected Vehicle</p>
                  <div className="space-y-2 text-sm">
                    <SummaryRow label="Reg No."   value={selectedVehicle.registrationNumber} />
                    <SummaryRow label="Name"      value={selectedVehicle.name} />
                    <SummaryRow label="Type"      value={selectedVehicle.type} />
                    <SummaryRow
                      label="Max Capacity"
                      value={`${parseFloat(selectedVehicle.maxLoadCapacity).toLocaleString('en-IN')} kg`}
                      highlight={
                        form.cargoWeight &&
                        parseFloat(form.cargoWeight) > parseFloat(selectedVehicle.maxLoadCapacity)
                      }
                    />
                    {form.cargoWeight && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Load</span>
                          <span>
                            {Math.min(100, Math.round((parseFloat(form.cargoWeight) / parseFloat(selectedVehicle.maxLoadCapacity)) * 100))}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              parseFloat(form.cargoWeight) > parseFloat(selectedVehicle.maxLoadCapacity)
                                ? 'bg-red-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${Math.min(100, (parseFloat(form.cargoWeight) / parseFloat(selectedVehicle.maxLoadCapacity)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Card variant="ghost">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trip Summary</p>
                <div className="space-y-2 text-sm">
                  <SummaryRow label="Route"    value={form.source && form.destination ? `${form.source} → ${form.destination}` : '—'} />
                  <SummaryRow label="Distance" value={form.plannedDistance ? `${form.plannedDistance} km` : '—'} />
                  <SummaryRow label="Cargo"    value={form.cargoWeight ? `${parseFloat(form.cargoWeight).toLocaleString('en-IN')} kg` : '—'} />
                  <SummaryRow label="Status"   value="DRAFT (on creation)" />
                </div>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  )
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className={`font-medium text-right truncate ${highlight ? 'text-red-600' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}

const inputCls = (err) =>
  `w-full h-9 px-3 text-sm border rounded-xl outline-none transition bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 ${
    err ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'
  }`
