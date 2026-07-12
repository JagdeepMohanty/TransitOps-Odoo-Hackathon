import prisma from '../config/prisma.js';

/**
 * KPI filter-awareness:
 *   - vehicleType / vehicleStatus / region filters apply ONLY to vehicle counts
 *     and fleet-utilization (which is derived from vehicle counts).
 *   - activeTrips / pendingTrips are global (not filtered by vehicle attributes).
 *   - availableDrivers / driversOnDuty are global (not filtered by vehicle attributes).
 */
export const getKpis = async (query = {}) => {
  const vehicleWhere = {};
  if (query.type)   vehicleWhere.type   = query.type;
  if (query.region) vehicleWhere.region = query.region;
  if (query.status) vehicleWhere.status = query.status;

  const now = new Date();

  const [
    totalVehicles,
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    vehiclesOnTrip,
    nonRetiredVehicles,
    activeTrips,
    pendingTrips,
    availableDrivers,
    driversOnDuty,
  ] = await Promise.all([
    // totalVehicles — all vehicles (filter-aware)
    prisma.vehicle.count({ where: vehicleWhere }),

    // activeVehicles — all except RETIRED (filter-aware)
    prisma.vehicle.count({ where: { ...vehicleWhere, status: { not: 'RETIRED' } } }),

    // availableVehicles — status AVAILABLE (filter-aware)
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'AVAILABLE' } }),

    // vehiclesInMaintenance — status IN_SHOP (filter-aware)
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'IN_SHOP' } }),

    // vehiclesOnTrip — status ON_TRIP (filter-aware)
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'ON_TRIP' } }),

    // nonRetiredVehicles — denominator for fleet utilization (filter-aware)
    prisma.vehicle.count({ where: { ...vehicleWhere, status: { not: 'RETIRED' } } }),

    // activeTrips — DISPATCHED (global)
    prisma.trip.count({ where: { status: 'DISPATCHED' } }),

    // pendingTrips — DRAFT (global)
    prisma.trip.count({ where: { status: 'DRAFT' } }),

    // availableDrivers — AVAILABLE with non-expired license (global)
    prisma.driver.count({
      where: { status: 'AVAILABLE', licenseExpiryDate: { gt: now } },
    }),

    // driversOnDuty — AVAILABLE + ON_TRIP (global)
    prisma.driver.count({
      where: { status: { in: ['AVAILABLE', 'ON_TRIP'] } },
    }),
  ]);

  const fleetUtilization = nonRetiredVehicles > 0
    ? parseFloat(((vehiclesOnTrip / nonRetiredVehicles) * 100).toFixed(2))
    : 0;

  return {
    totalVehicles,
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    vehiclesOnTrip,
    activeTrips,
    pendingTrips,
    availableDrivers,
    driversOnDuty,
    fleetUtilization,
  };
};
