import * as tripRepo from '../repositories/trip.repository.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import * as driverRepo from '../repositories/driver.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } from '../constants/statuses.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { isExpired } from '../utils/date.js';

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
  if (isExpired(driver.licenseExpiryDate))
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_LICENSE_EXPIRED);
};

export const getAllTrips = async (query) => {
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

export const getTripById = async (id) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  return trip;
};

export const createTrip = async (data, userId) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  const driver = await driverRepo.findById(data.driverId);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (Number(data.cargoWeight) > Number(vehicle.maxLoadCapacity))
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_CARGO_EXCEEDS);

  return tripRepo.create({ ...data, status: TRIP_STATUS.DRAFT, createdBy: userId });
};

export const updateTrip = async (id, data) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (trip.status !== TRIP_STATUS.DRAFT)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);
  return tripRepo.update(id, data);
};

export const dispatchTrip = async (id) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (trip.status !== TRIP_STATUS.DRAFT)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);

  const vehicle = await vehicleRepo.findById(trip.vehicleId);
  const driver = await driverRepo.findById(trip.driverId);

  validateVehicleForDispatch(vehicle);
  validateDriverForDispatch(driver);

  await Promise.all([
    vehicleRepo.updateStatus(trip.vehicleId, VEHICLE_STATUS.ON_TRIP),
    driverRepo.updateStatus(trip.driverId, DRIVER_STATUS.ON_TRIP),
  ]);

  return tripRepo.update(id, { status: TRIP_STATUS.DISPATCHED, dispatchedAt: new Date() });
};

export const completeTrip = async (id, data) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (trip.status !== TRIP_STATUS.DISPATCHED)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);

  await Promise.all([
    vehicleRepo.updateStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE),
    driverRepo.updateStatus(trip.driverId, DRIVER_STATUS.AVAILABLE),
  ]);

  return tripRepo.update(id, { ...data, status: TRIP_STATUS.COMPLETED, completedAt: new Date() });
};

export const cancelTrip = async (id) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  if (![TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED].includes(trip.status))
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.TRIP_INVALID_STATUS);

  if (trip.status === TRIP_STATUS.DISPATCHED) {
    await Promise.all([
      vehicleRepo.updateStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE),
      driverRepo.updateStatus(trip.driverId, DRIVER_STATUS.AVAILABLE),
    ]);
  }

  return tripRepo.update(id, { status: TRIP_STATUS.CANCELLED, cancelledAt: new Date() });
};
