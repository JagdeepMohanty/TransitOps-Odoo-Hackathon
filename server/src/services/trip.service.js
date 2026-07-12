const tripRepo = require('../repositories/trip.repository');
const vehicleRepo = require('../repositories/vehicle.repository');
const driverRepo = require('../repositories/driver.repository');
const { ApiError } = require('../utils/ApiError');
const { MESSAGES } = require('../constants/messages');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } = require('../constants/statuses');
const { getPagination, paginatedResponse } = require('../utils/pagination');
const { isExpired } = require('../utils/date');

const validateVehicleForDispatch = (vehicle) => {
  if (vehicle.status === VEHICLE_STATUS.RETIRED)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.VEHICLE_RETIRED);
  if (vehicle.status === VEHICLE_STATUS.IN_SHOP)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.VEHICLE_IN_SHOP);
  if (vehicle.status === VEHICLE_STATUS.ON_TRIP)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.VEHICLE_ON_TRIP);
};

const validateDriverForDispatch = (driver) => {
  if (driver.status === DRIVER_STATUS.SUSPENDED)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_SUSPENDED);
  if (driver.status === DRIVER_STATUS.ON_TRIP)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_ON_TRIP);
  if (isExpired(driver.licenseExpiry))
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_LICENSE_EXPIRED);
};

const getAllTrips = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.vehicleId) filters.vehicleId = parseInt(query.vehicleId);
  if (query.driverId) filters.driverId = parseInt(query.driverId);

  const [trips, total] = await Promise.all([
    tripRepo.findAll(filters, skip, limit),
    tripRepo.countAll(filters),
  ]);
  return paginatedResponse(trips, total, page, limit);
};

const getTripById = async (id) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  return trip;
};

const createTrip = async (data, userId) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  const driver = await driverRepo.findById(data.driverId);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  // Business Rule: Cargo weight must not exceed vehicle max load capacity
  if (data.cargoWeight > vehicle.maxLoadCapacity)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_CARGO_EXCEEDS);

  return tripRepo.create({ ...data, status: TRIP_STATUS.DRAFT, createdBy: userId });
};

const updateTrip = async (id, data) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (trip.status !== TRIP_STATUS.DRAFT)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);
  return tripRepo.update(id, data);
};

const dispatchTrip = async (id) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (trip.status !== TRIP_STATUS.DRAFT)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);

  const vehicle = await vehicleRepo.findById(trip.vehicleId);
  const driver = await driverRepo.findById(trip.driverId);

  // Business Rules: validate vehicle and driver before dispatch
  validateVehicleForDispatch(vehicle);
  validateDriverForDispatch(driver);

  // Business Rule: Dispatching sets both vehicle and driver to On Trip
  await Promise.all([
    vehicleRepo.updateStatus(trip.vehicleId, VEHICLE_STATUS.ON_TRIP),
    driverRepo.updateStatus(trip.driverId, DRIVER_STATUS.ON_TRIP),
  ]);

  return tripRepo.update(id, { status: TRIP_STATUS.DISPATCHED });
};

const completeTrip = async (id, data) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (trip.status !== TRIP_STATUS.DISPATCHED)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);

  // Business Rule: Completing a trip restores vehicle and driver to Available
  await Promise.all([
    vehicleRepo.updateStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE),
    driverRepo.updateStatus(trip.driverId, DRIVER_STATUS.AVAILABLE),
  ]);

  return tripRepo.update(id, { ...data, status: TRIP_STATUS.COMPLETED });
};

const cancelTrip = async (id) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (![TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED].includes(trip.status))
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);

  // Business Rule: Cancelling a dispatched trip restores vehicle and driver to Available
  if (trip.status === TRIP_STATUS.DISPATCHED) {
    await Promise.all([
      vehicleRepo.updateStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE),
      driverRepo.updateStatus(trip.driverId, DRIVER_STATUS.AVAILABLE),
    ]);
  }

  return tripRepo.update(id, { status: TRIP_STATUS.CANCELLED });
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip };
