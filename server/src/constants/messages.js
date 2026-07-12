export const MESSAGES = Object.freeze({
  // Generic
  SUCCESS: 'Operation completed successfully',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'An unexpected error occurred',
  NOT_IMPLEMENTED: 'This module will be implemented in the next phase',
  VALIDATION_ERROR: 'Validation failed',

  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to perform this action',
  TOKEN_EXPIRED: 'Session expired, please log in again',

  // Vehicle
  VEHICLE_CREATED: 'Vehicle created successfully',
  VEHICLE_UPDATED: 'Vehicle updated successfully',
  VEHICLE_DELETED: 'Vehicle deleted successfully',
  VEHICLE_NOT_FOUND: 'Vehicle not found',
  VEHICLE_REG_EXISTS: 'A vehicle with this registration number already exists',
  VEHICLE_UNAVAILABLE: 'Vehicle is not available for assignment',
  VEHICLE_ON_TRIP: 'Vehicle is currently on a trip',
  VEHICLE_IN_SHOP: 'Vehicle is currently in maintenance',

  // Driver
  DRIVER_CREATED: 'Driver created successfully',
  DRIVER_UPDATED: 'Driver updated successfully',
  DRIVER_DELETED: 'Driver deleted successfully',
  DRIVER_NOT_FOUND: 'Driver not found',
  DRIVER_LICENSE_EXISTS: 'A driver with this license number already exists',
  DRIVER_UNAVAILABLE: 'Driver is not available for assignment',
  DRIVER_LICENSE_EXPIRED: 'Driver license has expired',

  // Trip
  TRIP_CREATED: 'Trip created successfully',
  TRIP_UPDATED: 'Trip updated successfully',
  TRIP_NOT_FOUND: 'Trip not found',
  TRIP_DISPATCHED: 'Trip dispatched successfully',
  TRIP_COMPLETED: 'Trip completed successfully',
  TRIP_CANCELLED: 'Trip cancelled successfully',
  TRIP_CARGO_EXCEEDS: 'Cargo weight exceeds vehicle maximum load capacity',
  TRIP_INVALID_TRANSITION: 'Invalid trip status transition',

  // Maintenance
  MAINTENANCE_CREATED: 'Maintenance record created successfully',
  MAINTENANCE_UPDATED: 'Maintenance record updated successfully',
  MAINTENANCE_NOT_FOUND: 'Maintenance record not found',
  MAINTENANCE_CLOSED: 'Maintenance closed successfully',
  MAINTENANCE_VEHICLE_INELIGIBLE: 'Vehicle cannot enter maintenance in its current status',

  // Fuel & Expense
  FUEL_LOG_CREATED: 'Fuel log created successfully',
  EXPENSE_CREATED: 'Expense created successfully',
});
