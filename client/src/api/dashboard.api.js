import axiosInstance from './axiosInstance'

/**
 * GET /api/dashboard/kpis
 *
 * Optional filters (all vehicle-count-aware):
 *   type   — vehicle type string
 *   region — region string
 *   status — VehicleStatus enum
 *
 * Response shape:
 * {
 *   totalVehicles, activeVehicles, availableVehicles,
 *   vehiclesInMaintenance, vehiclesOnTrip,
 *   activeTrips, pendingTrips,
 *   availableDrivers, driversOnDuty,
 *   fleetUtilization   // percentage 0–100
 * }
 *
 * All monetary values in the broader API are in INR.
 */
export const getKpis = (filters = {}) =>
  axiosInstance.get('/dashboard/kpis', { params: filters })
