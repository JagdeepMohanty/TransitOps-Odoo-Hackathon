import prisma from '../config/prisma.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import * as fuelLogRepo from '../repositories/fuelLog.repository.js';
import * as expenseRepo from '../repositories/expense.repository.js';
import { calcFuelEfficiency, calcOperationalCost, calcVehicleROI, calcFleetUtilization } from '../utils/calculations.js';
import { exportToCsv } from '../utils/csv.js';

export const getReports = async (query) => {
  const filters = {};
  if (query.vehicleId) filters.id = parseInt(query.vehicleId);

  const vehicles = await prisma.vehicle.findMany({
    where: filters,
    include: {
      trips: { where: { status: 'COMPLETED' } },
      fuelLogs: true,
      maintenanceLogs: true,
    },
  });

  const totalVehicles = await vehicleRepo.countAll({});
  const onTripCount = await vehicleRepo.countAll({ status: 'ON_TRIP' });

  const reports = await Promise.all(
    vehicles.map(async (vehicle) => {
      const fuelSum = await fuelLogRepo.sumByVehicle(vehicle.id);
      const maintenanceSum = await expenseRepo.sumMaintenanceByVehicle(vehicle.id);

      const totalLiters = Number(fuelSum._sum.liters) || 0;
      const totalFuelCost = Number(fuelSum._sum.cost) || 0;
      const totalMaintenanceCost = Number(maintenanceSum._sum.amount) || 0;
      const totalDistance = vehicle.trips.reduce((sum, t) => sum + Number(t.actualDistance || t.plannedDistance || 0), 0);
      const totalRevenue = vehicle.trips.reduce((sum, t) => sum + Number(t.revenue || 0), 0);

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        vehicleName: vehicle.name,
        type: vehicle.type,
        status: vehicle.status,
        totalTrips: vehicle.trips.length,
        totalDistance,
        totalLiters,
        totalFuelCost,
        totalMaintenanceCost,
        operationalCost: calcOperationalCost(totalFuelCost, totalMaintenanceCost),
        fuelEfficiency: calcFuelEfficiency(totalDistance, totalLiters),
        totalRevenue,
        roi: calcVehicleROI(totalRevenue, totalMaintenanceCost, totalFuelCost, Number(vehicle.acquisitionCost)),
      };
    })
  );

  return {
    fleetUtilization: calcFleetUtilization(onTripCount, totalVehicles),
    vehicles: reports,
  };
};

export const exportReportsCsv = async (query) => {
  const { vehicles } = await getReports(query);
  const fields = [
    'vehicleId', 'registrationNumber', 'vehicleName', 'type', 'status',
    'totalTrips', 'totalDistance', 'totalLiters', 'totalFuelCost',
    'totalMaintenanceCost', 'operationalCost', 'fuelEfficiency', 'totalRevenue', 'roi',
  ];
  return exportToCsv(fields, vehicles);
};
