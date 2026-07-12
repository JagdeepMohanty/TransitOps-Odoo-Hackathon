import prisma from '../config/prisma.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import * as fuelLogRepo from '../repositories/fuelLog.repository.js';
import * as maintenanceRepo from '../repositories/maintenance.repository.js';
import * as expenseRepo from '../repositories/expense.repository.js';
import { calcFuelEfficiency, calcVehicleROI } from '../utils/calculations.js';
import { exportToCsv } from '../utils/csv.js';

/**
 * Operational cost strategy (no double-counting):
 *   fuelCost        = sum of FuelLog.cost          (source of truth for fuel)
 *   maintenanceCost = sum of Maintenance.cost       (source of truth for maintenance)
 *   otherCost       = sum of Expense where type NOT IN (FUEL, MAINTENANCE)
 *                     covers TOLL, PARKING, REPAIR, OTHER
 *
 * FUEL and MAINTENANCE expense rows are intentionally excluded from the
 * Expense aggregate to prevent double-counting with FuelLog and Maintenance tables.
 */

const toNum = (val) => (val == null ? 0 : parseFloat(String(val)));

export const getReports = async (query) => {
  const filters = {};
  if (query.vehicleId) filters.id = parseInt(query.vehicleId);

  const vehicles = await prisma.vehicle.findMany({
    where: filters,
    include: {
      trips:          { where: { status: 'COMPLETED' } },
      fuelLogs:       true,
      maintenanceLogs: true,
    },
  });

  // Fleet utilization: ON_TRIP / non-retired × 100
  const [onTripCount, nonRetiredCount] = await Promise.all([
    vehicleRepo.countAll({ status: 'ON_TRIP' }),
    vehicleRepo.countAll({ status: { not: 'RETIRED' } }),
  ]);

  const reports = await Promise.all(
    vehicles.map(async (vehicle) => {
      const [fuelSum, maintenanceSum, otherSum] = await Promise.all([
        fuelLogRepo.sumByVehicle(vehicle.id),
        maintenanceRepo.sumByVehicle(vehicle.id),
        expenseRepo.sumOtherByVehicle(vehicle.id),
      ]);

      const totalLiters          = toNum(fuelSum._sum.liters);
      const totalFuelCost        = toNum(fuelSum._sum.cost);
      const totalMaintenanceCost = toNum(maintenanceSum._sum.cost);
      const totalOtherCost       = toNum(otherSum._sum.amount);
      const operationalCost      = parseFloat((totalFuelCost + totalMaintenanceCost + totalOtherCost).toFixed(2));

      const totalDistance = vehicle.trips.reduce(
        (sum, t) => sum + toNum(t.actualDistance ?? t.plannedDistance),
        0
      );
      const totalRevenue = vehicle.trips.reduce(
        (sum, t) => sum + toNum(t.revenue),
        0
      );
      const acquisitionCost = toNum(vehicle.acquisitionCost);

      return {
        vehicleId:           vehicle.id,
        registrationNumber:  vehicle.registrationNumber,
        vehicleName:         vehicle.name,
        type:                vehicle.type,
        status:              vehicle.status,
        totalTrips:          vehicle.trips.length,
        totalDistance:       parseFloat(totalDistance.toFixed(2)),
        totalLiters:         parseFloat(totalLiters.toFixed(2)),
        totalFuelCost:       parseFloat(totalFuelCost.toFixed(2)),
        totalMaintenanceCost: parseFloat(totalMaintenanceCost.toFixed(2)),
        totalOtherCost:      parseFloat(totalOtherCost.toFixed(2)),
        operationalCost,
        fuelEfficiency:      calcFuelEfficiency(totalDistance, totalLiters),
        totalRevenue:        parseFloat(totalRevenue.toFixed(2)),
        roi:                 calcVehicleROI(totalRevenue, totalMaintenanceCost, totalFuelCost, totalOtherCost, acquisitionCost),
      };
    })
  );

  const fleetUtilization = nonRetiredCount > 0
    ? parseFloat(((onTripCount / nonRetiredCount) * 100).toFixed(2))
    : 0;

  return { fleetUtilization, vehicles: reports };
};

export const exportReportsCsv = async (query) => {
  const { vehicles } = await getReports(query);
  const fields = [
    'vehicleId', 'registrationNumber', 'vehicleName', 'type', 'status',
    'totalTrips', 'totalDistance', 'totalLiters', 'totalFuelCost',
    'totalMaintenanceCost', 'totalOtherCost', 'operationalCost',
    'fuelEfficiency', 'totalRevenue', 'roi',
  ];
  return exportToCsv(fields, vehicles);
};
