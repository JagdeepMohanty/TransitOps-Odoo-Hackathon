import { Routes, Route } from 'react-router-dom'

import ProtectedRoute   from '@/routes/ProtectedRoute'
import AppLayout        from '@/components/layout/AppLayout'

import LoginPage        from '@/pages/auth/LoginPage'
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage'
import NotFoundPage     from '@/pages/NotFoundPage'

import DashboardPage    from '@/pages/dashboard'

// Vehicles — VehiclesPage.jsx is the real API-connected list; index.jsx is mock
import VehiclesPage     from '@/pages/vehicles/VehiclesPage'
import AddVehiclePage   from '@/pages/vehicles/AddVehiclePage'
import EditVehiclePage  from '@/pages/vehicles/EditVehiclePage'

// Drivers — DriversPage.jsx is the real API-connected list; index.jsx is mock
import DriversPage      from '@/pages/drivers/DriversPage'
import AddDriverPage    from '@/pages/drivers/AddDriverPage'
import EditDriverPage   from '@/pages/drivers/EditDriverPage'

// Trips
import TripsPage        from '@/pages/trips'
import CreateTripPage   from '@/pages/trips/CreateTripPage'
import TripDetailsPage  from '@/pages/trips/TripDetailsPage'

import MaintenancePage  from '@/pages/maintenance'
import FuelPage         from '@/pages/Fuel'
import ExpensesPage     from '@/pages/Expenses'
import ReportsPage      from '@/pages/reports'
import ProfilePage      from '@/pages/profile/ProfilePage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index                      element={<DashboardPage />}   />
          <Route path="dashboard"           element={<DashboardPage />}   />
          <Route path="vehicles"            element={<VehiclesPage />}    />
          <Route path="vehicles/add"        element={<AddVehiclePage />}  />
          <Route path="vehicles/:id/edit"   element={<EditVehiclePage />} />
          <Route path="drivers"             element={<DriversPage />}     />
          <Route path="drivers/add"         element={<AddDriverPage />}   />
          <Route path="drivers/:id/edit"    element={<EditDriverPage />}  />
          <Route path="trips"               element={<TripsPage />}       />
          <Route path="trips/create"        element={<CreateTripPage />}  />
          <Route path="trips/:id"           element={<TripDetailsPage />} />
          <Route path="maintenance"         element={<MaintenancePage />} />
          <Route path="fuel"                element={<FuelPage />}        />
          <Route path="expenses"            element={<ExpensesPage />}    />
          <Route path="reports"             element={<ReportsPage />}     />
          <Route path="profile"             element={<ProfilePage />}     />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
