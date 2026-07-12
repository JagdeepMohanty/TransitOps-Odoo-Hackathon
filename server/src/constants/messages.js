const MESSAGES = {
  // Vehicle
  VEHICLE_NOT_FOUND: 'Vehicle not found.',
  VEHICLE_REG_EXISTS: 'Vehicle registration number already exists.',
  VEHICLE_NOT_AVAILABLE: 'Vehicle is not available for dispatch.',
  VEHICLE_IN_SHOP: 'Vehicle is currently in maintenance shop.',
  VEHICLE_RETIRED: 'Retired vehicles cannot be dispatched.',
  VEHICLE_ON_TRIP: 'Vehicle is already on a trip.',
  VEHICLE_CREATED: 'Vehicle registered successfully.',
  VEHICLE_UPDATED: 'Vehicle updated successfully.',
  VEHICLE_DELETED: 'Vehicle deleted successfully.',

  // Driver
  DRIVER_NOT_FOUND: 'Driver not found.',
  DRIVER_LICENSE_EXISTS: 'Driver license number already exists.',
  DRIVER_LICENSE_EXPIRED: 'Driver license has expired.',
  DRIVER_SUSPENDED: 'Driver is suspended and cannot be assigned.',
  DRIVER_ON_TRIP: 'Driver is already on a trip.',
  DRIVER_NOT_AVAILABLE: 'Driver is not available for dispatch.',
  DRIVER_CREATED: 'Driver registered successfully.',
  DRIVER_UPDATED: 'Driver updated successfully.',
  DRIVER_DELETED: 'Driver deleted successfully.',

  // Trip
  TRIP_NOT_FOUND: 'Trip not found.',
  TRIP_CARGO_EXCEEDS: 'Cargo weight exceeds vehicle maximum load capacity.',
  TRIP_CREATED: 'Trip created successfully.',
  TRIP_UPDATED: 'Trip updated successfully.',
  TRIP_DISPATCHED: 'Trip dispatched successfully.',
  TRIP_COMPLETED: 'Trip completed successfully.',
  TRIP_CANCELLED: 'Trip cancelled successfully.',
  TRIP_INVALID_STATUS: 'Invalid trip status for this operation.',

  // Maintenance
  MAINTENANCE_NOT_FOUND: 'Maintenance log not found.',
  MAINTENANCE_CREATED: 'Maintenance log created successfully.',
  MAINTENANCE_UPDATED: 'Maintenance log updated successfully.',
  MAINTENANCE_CLOSED: 'Maintenance closed. Vehicle is now available.',
  MAINTENANCE_ALREADY_CLOSED: 'Maintenance log is already closed.',

  // Fuel Log
  FUEL_LOG_NOT_FOUND: 'Fuel log not found.',
  FUEL_LOG_CREATED: 'Fuel log recorded successfully.',

  // Expense
  EXPENSE_NOT_FOUND: 'Expense not found.',
  EXPENSE_CREATED: 'Expense recorded successfully.',

  // General
  INTERNAL_ERROR: 'Internal server error.',
  VALIDATION_ERROR: 'Validation failed.',
};

module.exports = { MESSAGES };
