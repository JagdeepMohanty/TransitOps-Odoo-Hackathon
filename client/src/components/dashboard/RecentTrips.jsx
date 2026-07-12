import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import StatusBadge from '@components/common/StatusBadge';
import { MOCK_TRIPS } from '@utils/constants';
import { formatDate } from '@utils/formatDate';

export default function RecentTrips() {
  const trips = MOCK_TRIPS.slice(0, 5);

  return (
    <div className="divide-y divide-border">
      {trips.map((trip) => (
        <Link
          key={trip.id}
          to={`/trips/${trip.id}`}
          className="flex items-center gap-3 px-6 py-3.5 hover:bg-bg-hover transition-colors duration-150 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-primary font-mono">#{trip.id}</span>
              <span className="text-xs text-content-disabled">·</span>
              <span className="text-xs text-content-secondary truncate">
                {trip.from} → {trip.to}
              </span>
            </div>
            <p className="text-xs text-content-muted mt-0.5">{trip.driver} · {formatDate(trip.date)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={trip.status} dot={false} />
            <ArrowRight className="w-3.5 h-3.5 text-content-disabled group-hover:text-content-muted transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
