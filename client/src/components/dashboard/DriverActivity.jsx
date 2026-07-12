const DRIVERS = [
  { name: 'Ravi Kumar',   vehicle: 'KA-01-AB-1234', trip: 'Mumbai → Pune',       status: 'on_trip',  score: 98, avatar: 'RK' },
  { name: 'Suresh Nair',  vehicle: 'KA-02-CD-5678', trip: 'Delhi → Jaipur',      status: 'on_trip',  score: 94, avatar: 'SN' },
  { name: 'Amit Sharma',  vehicle: 'DL-04-GH-3456', trip: 'Idle at depot',        status: 'active',   score: 99, avatar: 'AS' },
  { name: 'Priya Menon',  vehicle: 'TN-05-IJ-7890', trip: 'Idle at depot',        status: 'active',   score: 97, avatar: 'PM' },
  { name: 'Deepak Verma', vehicle: 'GJ-06-KL-2345', trip: 'Ahmedabad → Surat',   status: 'on_trip',  score: 91, avatar: 'DV' },
  { name: 'Kavya Reddy',  vehicle: 'UP-08-OP-0123', trip: 'Scheduled: Kolkata',   status: 'standby',  score: 99, avatar: 'KR' },
];

const STATUS = {
  on_trip: { label: 'On Trip',  dot: 'bg-primary',  text: 'text-primary'  },
  active:  { label: 'Active',   dot: 'bg-success',  text: 'text-success'  },
  standby: { label: 'Standby',  dot: 'bg-warning',  text: 'text-warning'  },
};

const SCORE_COLOR = (s) => s >= 97 ? '#22C55E' : s >= 90 ? '#3B82F6' : '#F59E0B';

export default function DriverActivity() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-content-primary">Driver Activity</h2>
        <p className="text-xs text-content-muted mt-0.5">Live driver status & safety scores</p>
      </div>

      <div className="divide-y divide-border/40">
        {DRIVERS.map((d) => {
          const st = STATUS[d.status];
          const scoreColor = SCORE_COLOR(d.score);
          return (
            <div key={d.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-bg-hover/50 transition-colors duration-150 group">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-content-primary">{d.avatar}</span>
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-card ${st.dot}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-content-primary truncate">{d.name}</p>
                <p className="text-[11px] text-content-muted truncate">{d.vehicle}</p>
              </div>

              {/* Trip */}
              <div className="hidden sm:block flex-1 min-w-0">
                <p className="text-[11px] text-content-secondary truncate">{d.trip}</p>
              </div>

              {/* Status */}
              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                <span className={`text-[11px] font-medium ${st.text}`}>{st.label}</span>
              </div>

              {/* Safety Score */}
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{ borderColor: scoreColor, color: scoreColor }}
                >
                  {d.score}
                </div>
                <span className="text-[9px] text-content-disabled mt-0.5">Safety</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
