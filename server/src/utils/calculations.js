export const calcFuelEfficiency = (totalDistance, totalLiters) => {
  if (!totalLiters || totalLiters === 0) return 0;
  return parseFloat((totalDistance / totalLiters).toFixed(2));
};

export const calcOperationalCost = (totalFuelCost, totalMaintenanceCost) => {
  return parseFloat((totalFuelCost + totalMaintenanceCost).toFixed(2));
};

export const calcVehicleROI = (revenue, maintenanceCost, fuelCost, acquisitionCost) => {
  if (!acquisitionCost || acquisitionCost === 0) return 0;
  return parseFloat(((revenue - (maintenanceCost + fuelCost)) / acquisitionCost).toFixed(4));
};

export const calcFleetUtilization = (vehiclesOnTrip, totalActiveVehicles) => {
  if (!totalActiveVehicles || totalActiveVehicles === 0) return 0;
  return parseFloat(((vehiclesOnTrip / totalActiveVehicles) * 100).toFixed(2));
};
