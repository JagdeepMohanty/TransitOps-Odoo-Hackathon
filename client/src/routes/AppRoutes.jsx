import { Routes, Route } from 'react-router-dom'
import AppLayout       from '@/components/layout/AppLayout'
import DashboardPage   from '@/pages/dashboard'
import TripsPage       from '@/pages/trips'
import VehiclesPage    from '@/pages/vehicles'
import DriversPage     from '@/pages/drivers'
import MaintenancePage from '@/pages/maintenance'
import FuelPage        from '@/pages/Fuel'
import ExpensesPage    from '@/pages/Expenses'
import ReportsPage     from '@/pages/reports'
import NotFoundPage    from '@/pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index              element={<DashboardPage />}   />
        <Route path="trips"       element={<TripsPage />}       />
        <Route path="vehicles"    element={<VehiclesPage />}    />
        <Route path="drivers"     element={<DriversPage />}     />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="fuel"        element={<FuelPage />}        />
        <Route path="expenses"    element={<ExpensesPage />}    />
        <Route path="reports"     element={<ReportsPage />}     />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
