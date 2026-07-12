import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute    from './PublicRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import Spinner from '@components/common/Spinner';

// ── Layouts ────────────────────────────────────────────────────
const AppLayout  = lazy(() => import('@components/layout/AppLayout'));
const AuthLayout = lazy(() => import('@components/layout/AuthLayout'));

// ── Auth ───────────────────────────────────────────────────────
const LoginPage        = lazy(() => import('@pages/auth/LoginPage'));
const UnauthorizedPage = lazy(() => import('@pages/auth/UnauthorizedPage'));

// ── Dashboard ──────────────────────────────────────────────────
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));

// ── Vehicles ───────────────────────────────────────────────────
const VehiclesPage    = lazy(() => import('@pages/vehicles/VehiclesPage'));
const AddVehiclePage  = lazy(() => import('@pages/vehicles/AddVehiclePage'));
const EditVehiclePage = lazy(() => import('@pages/vehicles/EditVehiclePage'));

// ── Drivers ────────────────────────────────────────────────────
const DriversPage      = lazy(() => import('@pages/drivers/DriversPage'));
const DriverSafetyPage = lazy(() => import('@pages/drivers/DriverSafetyPage'));
const AddDriverPage    = lazy(() => import('@pages/drivers/AddDriverPage'));
const EditDriverPage   = lazy(() => import('@pages/drivers/EditDriverPage'));

// ── Trips ──────────────────────────────────────────────────────
const TripsPage          = lazy(() => import('@pages/trips/TripsPage'));
const CreateTripPage     = lazy(() => import('@pages/trips/CreateTripPage'));
const TripDetailsPage    = lazy(() => import('@pages/trips/TripDetailsPage'));
const TripDispatcherPage = lazy(() => import('@pages/trips/TripDispatcherPage'));

// ── Finance ────────────────────────────────────────────────────
const ExpensesPage = lazy(() => import('@pages/finance/ExpensesPage'));
const FuelLogsPage = lazy(() => import('@pages/finance/FuelLogsPage'));

// ── Maintenance ────────────────────────────────────────────────
const MaintenancePage = lazy(() => import('@pages/maintenance/MaintenancePage'));

// ── Reports ────────────────────────────────────────────────────
const ReportsPage = lazy(() => import('@pages/reports/ReportsPage'));

// ── Profile ────────────────────────────────────────────────────
const ProfilePage = lazy(() => import('@pages/profile/ProfilePage'));

// ── 404 ────────────────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

// ── Page-level Suspense fallback ───────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3">
      <Spinner size="lg" />
      <span className="text-sm text-content-muted">Loading…</span>
    </div>
  );
}

// ── Full-screen fallback (used for layout lazy loads) ──────────
function ScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-base gap-3">
      <Spinner size="lg" />
      <span className="text-sm text-content-muted">Loading…</span>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>

        {/* ── Public routes (redirect to /dashboard if authed) ── */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login"        element={<Suspense fallback={<ScreenLoader />}><LoginPage /></Suspense>} />
            <Route path="/unauthorized" element={<Suspense fallback={<ScreenLoader />}><UnauthorizedPage /></Suspense>} />
          </Route>
        </Route>

        {/* ── Protected routes ─────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Index → Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />

            {/* Vehicles */}
            <Route path="/vehicles"          element={<Suspense fallback={<PageLoader />}><VehiclesPage /></Suspense>} />
            <Route path="/vehicles/add"      element={<Suspense fallback={<PageLoader />}><AddVehiclePage /></Suspense>} />
            <Route path="/vehicles/:id/edit" element={<Suspense fallback={<PageLoader />}><EditVehiclePage /></Suspense>} />

            {/* Drivers */}
            <Route path="/drivers"           element={<Suspense fallback={<PageLoader />}><DriversPage /></Suspense>} />
            <Route path="/drivers/safety"    element={<Suspense fallback={<PageLoader />}><DriverSafetyPage /></Suspense>} />
            <Route path="/drivers/add"       element={<Suspense fallback={<PageLoader />}><AddDriverPage /></Suspense>} />
            <Route path="/drivers/:id/edit"  element={<Suspense fallback={<PageLoader />}><EditDriverPage /></Suspense>} />

            {/* Trips */}
            <Route path="/trips"                element={<Suspense fallback={<PageLoader />}><TripsPage /></Suspense>} />
            <Route path="/trips/dispatcher"     element={<Suspense fallback={<PageLoader />}><TripDispatcherPage /></Suspense>} />
            <Route path="/trips/create"         element={<Suspense fallback={<PageLoader />}><CreateTripPage /></Suspense>} />
            <Route path="/trips/:id"            element={<Suspense fallback={<PageLoader />}><TripDetailsPage /></Suspense>} />

            {/* Finance */}
            <Route path="/finance/expenses"  element={<Suspense fallback={<PageLoader />}><ExpensesPage /></Suspense>} />
            <Route path="/finance/fuel"      element={<Suspense fallback={<PageLoader />}><FuelLogsPage /></Suspense>} />

            {/* Maintenance */}
            <Route path="/maintenance"       element={<Suspense fallback={<PageLoader />}><MaintenancePage /></Suspense>} />

            {/* Reports */}
            <Route path="/reports"           element={<Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>} />

            {/* Profile */}
            <Route path="/profile"           element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />

          </Route>
        </Route>

        {/* ── 404 ──────────────────────────────────────────────── */}
        <Route path="*" element={<Suspense fallback={<ScreenLoader />}><NotFoundPage /></Suspense>} />

      </Routes>
    </Suspense>
  );
}
