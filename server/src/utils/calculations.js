export const calcFuelEfficiency = (totalDistance, totalLiters) => {
  if (!totalLiters || totalLiters === 0) return 0;
  return parseFloat((totalDistance / totalLiters).toFixed(2));
};

export const calcOperationalCost = (totalFuelCost, totalMaintenanceCost) => {
  return parseFloat((totalFuelCost + totalMaintenanceCost).toFixed(2));
};

/**
 * Vehicle ROI = (revenue - operationalCost) / acquisitionCost × 100
 * operationalCost = fuelCost + maintenanceCost + otherCost
 * Returns percentage rounded to 2 decimal places. Returns 0 if acquisitionCost is 0.
 */
export const calcVehicleROI = (revenue, maintenanceCost, fuelCost, otherCost, acquisitionCost) => {
  if (!acquisitionCost || acquisitionCost === 0) return 0;
  const operationalCost = fuelCost + maintenanceCost + otherCost;
  return parseFloat(((revenue - operationalCost) / acquisitionCost * 100).toFixed(2));
};

export const calcFleetUtilization = (vehiclesOnTrip, totalActiveVehicles) => {
  if (!totalActiveVehicles || totalActiveVehicles === 0) return 0;
  return parseFloat(((vehiclesOnTrip / totalActiveVehicles) * 100).toFixed(2));
};
