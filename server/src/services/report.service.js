const prisma = require('../config/prisma');
const vehicleRepo = require('../repositories/vehicle.repository');
const fuelLogRepo = require('../repositories/fuelLog.repository');
const expenseRepo = require('../repositories/expense.repository');
const { calcFuelEfficiency, calcOperationalCost, calcVehicleROI, calcFleetUtilization } = require('../utils/calculations');
const { exportToCsv } = require('../utils/csv');

const getReports = async (query) => {
  const filters = {};
  if (query.vehicleId) filters.id = parseInt(query.vehicleId);

  const vehicles = await prisma.vehicle.findMany({
    where: filters,
    include: {
      trips: { where: { status: 'Completed' } },
      fuelLogs: true,
      maintenanceLogs: true,
    },
  });

  const totalVehicles = await vehicleRepo.countAll({});
  const onTripCount = await vehicleRepo.countAll({ status: 'On Trip' });

  const reports = await Promise.all(
    vehicles.map(async (vehicle) => {
      const fuelSum = await fuelLogRepo.sumByVehicle(vehicle.id);
      const expenseSum = await expenseRepo.sumByVehicle(vehicle.id);
      const maintenanceSum = await expenseRepo.sumMaintenanceByVehicle(vehicle.id);

      const totalLiters = fuelSum._sum.liters || 0;
      const totalFuelCost = fuelSum._sum.cost || 0;
      const totalMaintenanceCost = maintenanceSum._sum.amount || 0;
      const totalDistance = vehicle.trips.reduce((sum, t) => sum + (t.finalDistance || t.plannedDistance || 0), 0);
      const totalRevenue = vehicle.trips.reduce((sum, t) => sum + (t.revenue || 0), 0);

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        vehicleName: vehicle.vehicleName,
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
        roi: calcVehicleROI(totalRevenue, totalMaintenanceCost, totalFuelCost, vehicle.acquisitionCost),
      };
    })
  );

  return {
    fleetUtilization: calcFleetUtilization(onTripCount, totalVehicles),
    vehicles: reports,
  };
};

const exportReportsCsv = async (query) => {
  const { vehicles } = await getReports(query);
  const fields = [
    'vehicleId', 'registrationNumber', 'vehicleName', 'type', 'status',
    'totalTrips', 'totalDistance', 'totalLiters', 'totalFuelCost',
    'totalMaintenanceCost', 'operationalCost', 'fuelEfficiency', 'totalRevenue', 'roi',
  ];
  return exportToCsv(fields, vehicles);
};

module.exports = { getReports, exportReportsCsv };
