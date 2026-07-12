/**
 * Fuel Efficiency = Total Distance / Total Liters
 */
const calcFuelEfficiency = (totalDistance, totalLiters) => {
  if (!totalLiters || totalLiters === 0) return 0;
  return parseFloat((totalDistance / totalLiters).toFixed(2));
};

/**
 * Operational Cost = Total Fuel Cost + Total Maintenance Cost
 */
const calcOperationalCost = (totalFuelCost, totalMaintenanceCost) => {
  return parseFloat((totalFuelCost + totalMaintenanceCost).toFixed(2));
};

/**
 * Vehicle ROI = (Revenue - (Maintenance Cost + Fuel Cost)) / Acquisition Cost
 */
const calcVehicleROI = (revenue, maintenanceCost, fuelCost, acquisitionCost) => {
  if (!acquisitionCost || acquisitionCost === 0) return 0;
  return parseFloat(((revenue - (maintenanceCost + fuelCost)) / acquisitionCost).toFixed(4));
};

/**
 * Fleet Utilization = (Vehicles On Trip / Total Active Vehicles) * 100
 */
const calcFleetUtilization = (vehiclesOnTrip, totalActiveVehicles) => {
  if (!totalActiveVehicles || totalActiveVehicles === 0) return 0;
  return parseFloat(((vehiclesOnTrip / totalActiveVehicles) * 100).toFixed(2));
};

module.exports = { calcFuelEfficiency, calcOperationalCost, calcVehicleROI, calcFleetUtilization };
