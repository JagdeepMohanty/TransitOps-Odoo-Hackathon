import { ArrowLeft, MapPin, Truck, Users, Package, DollarSign, Calendar, CheckCircle2, Clock, Activity, AlertTriangle, Circle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageShell   from '@components/layout/PageShell';
import Button      from '@components/common/Button';
import StatusBadge from '@components/common/StatusBadge';
import { MOCK_TRIPS } from '@utils/mockData';

function InfoBlock({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-secondary border border-border">
      {Icon && (
        <div className={`p-2 rounded-lg shrink-0 ${color ?? 'bg-bg-hover text-content-muted'}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-content-disabled uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-content-primary mt-0.5 truncate">{value ?? '—'}</p>
      </div>
    </div>
  );
}

const STATUS_TIMELINE = [
  { key: 'pending',     label: 'Pending',     icon: Clock         },
  { key: 'dispatched',  label: 'Dispatched',  icon: Circle        },
  { key: 'in_progress', label: 'In Progress', icon: Activity      },
  { key: 'completed',   label: 'Completed',   icon: CheckCircle2  },
];

function TripTimeline({ status }) {
  const ORDER = ['pending','dispatched','in_progress','completed'];
  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {STATUS_TIMELINE.map((step, i) => {
        const done    = i <= currentIdx && status !== 'cancelled';
        const active  = i === currentIdx && status !== 'cancelled';
        const Icon    = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                active ? 'bg-primary border-primary shadow-glow-sm' :
                done   ? 'bg-success/20 border-success' :
                         'bg-bg-secondary border-border'
              }`}>
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : done ? 'text-success' : 'text-content-disabled'}`} />
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-primary' : done ? 'text-success' : 'text-content-disabled'}`}>
                {step.label}
              </span>
            </div>
            {i < STATUS_TIMELINE.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-all duration-300 ${i < currentIdx && status !== 'cancelled' ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TripDetailsPage() {
  const { id }  = useParams();
  const trip    = MOCK_TRIPS.find(t => t.id === id) ?? MOCK_TRIPS[0];

  return (
    <PageShell
      title={`Trip #${trip.id}`}
      subtitle={`${trip.origin} → ${trip.destination}`}
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge status={trip.status} />
          <Link to="/trips">
            <Button variant="secondary" icon={ArrowLeft}>Back</Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Timeline */}
        {trip.status !== 'cancelled' && (
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-6">
            <h2 className="text-sm font-semibold text-content-primary mb-5">Trip Progress</h2>
            <TripTimeline status={trip.status} />
          </div>
        )}

        {/* Cancelled Banner */}
        {trip.status === 'cancelled' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-muted border border-danger/30 text-danger-text animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">This trip has been cancelled.</span>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Route */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <MapPin className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Route</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoBlock label="Origin"      value={trip.origin}      icon={MapPin}    color="bg-primary/10 text-primary"   />
              <InfoBlock label="Destination" value={trip.destination} icon={MapPin}    color="bg-success/10 text-success"   />
              <InfoBlock label="Distance"    value={`${trip.distance} km`} icon={Activity} color="bg-info/10 text-info"    />
              <InfoBlock label="Cargo"       value={trip.cargo}       icon={Package}   color="bg-accent/10 text-accent"     />
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <Users className="w-4 h-4 text-content-muted" />
              <h2 className="text-sm font-semibold text-content-primary">Assignment</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoBlock label="Driver"     value={trip.driver}  icon={Users} color="bg-secondary/10 text-secondary" />
              <InfoBlock label="Vehicle"    value={trip.vehicle} icon={Truck} color="bg-primary/10 text-primary"     />
              <InfoBlock label="Start Date" value={trip.startDate}  icon={Calendar} color="bg-warning/10 text-warning" />
              <InfoBlock label="End Date"   value={trip.endDate ?? 'In Progress'} icon={Calendar} color="bg-success/10 text-success" />
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <DollarSign className="w-4 h-4 text-content-muted" />
            <h2 className="text-sm font-semibold text-content-primary">Cost Summary</h2>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Trip Cost',    value: trip.cost > 0 ? `₹${trip.cost.toLocaleString()}` : '—', color: 'text-content-primary' },
              { label: 'Fuel Est.',    value: trip.cost > 0 ? `₹${Math.round(trip.cost * 0.35).toLocaleString()}` : '—', color: 'text-info' },
              { label: 'Toll Charges', value: trip.cost > 0 ? `₹${Math.round(trip.cost * 0.08).toLocaleString()}` : '—', color: 'text-warning' },
              { label: 'Driver Allow.', value: trip.cost > 0 ? `₹${Math.round(trip.cost * 0.05).toLocaleString()}` : '—', color: 'text-accent' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-bg-secondary border border-border">
                <p className="text-xs text-content-muted uppercase tracking-wider">{label}</p>
                <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {(trip.status === 'pending' || trip.status === 'dispatched' || trip.status === 'in_progress') && (
          <div className="flex items-center gap-3 flex-wrap">
            {trip.status === 'pending'     && <Button variant="primary">Dispatch Trip</Button>}
            {trip.status === 'dispatched'  && <Button variant="success">Mark In Progress</Button>}
            {trip.status === 'in_progress' && <Button variant="success">Complete Trip</Button>}
            <Button variant="danger">Cancel Trip</Button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
