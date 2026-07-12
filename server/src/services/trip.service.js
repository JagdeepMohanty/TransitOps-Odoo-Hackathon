import prisma from '../config/prisma.js';
import * as tripRepo from '../repositories/trip.repository.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import * as driverRepo from '../repositories/driver.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } from '../constants/statuses.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { isExpired } from '../utils/date.js';

// ── Constants ──────────────────────────────────────────────────────────────────

const VALID_SORT_FIELDS = new Set([
  'createdAt', 'dispatchedAt', 'completedAt', 'source', 'destination', 'status',
]);

// ── Helpers ────────────────────────────────────────────────────────────────────

const parseId = (raw) => {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id < 1) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID parameter');
  return id;
};

const assertVehicleAvailable = (vehicle) => {
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  if (vehicle.status === VEHICLE_STATUS.RETIRED)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_RETIRED);
  if (vehicle.status === VEHICLE_STATUS.IN_SHOP)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_IN_SHOP);
  if (vehicle.status !== VEHICLE_STATUS.AVAILABLE)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_NOT_AVAILABLE);
};

const assertDriverAvailable = (driver) => {
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  if (driver.status === DRIVER_STATUS.SUSPENDED)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_SUSPENDED);
  if (driver.status !== DRIVER_STATUS.AVAILABLE)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_NOT_AVAILABLE);
  if (isExpired(driver.licenseExpiryDate))
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXPIRED);
};

// ── List ───────────────────────────────────────────────────────────────────────

export const getAllTrips = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const andConditions = [];

  if (query.status) {
    if (!Object.values(TRIP_STATUS).includes(query.status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid status value: ${query.status}`);
    }
    andConditions.push({ status: query.status });
  }

  if (query.vehicleId) {
    const vid = parseInt(query.vehicleId, 10);
    if (!isNaN(vid)) andConditions.push({ vehicleId: vid });
  }

  if (query.driverId) {
    const did = parseInt(query.driverId, 10);
    if (!isNaN(did)) andConditions.push({ driverId: did });
  }

  // Date range filter on createdAt
  if (query.dateFrom || query.dateTo) {
    const dateFilter = {};
    if (query.dateFrom) dateFilter.gte = new Date(query.dateFrom);
    if (query.dateTo)   dateFilter.lte = new Date(query.dateTo);
    andConditions.push({ createdAt: dateFilter });
  }

  // Full-text search across source and destination
  if (query.search) {
    andConditions.push({
      OR: [
        { source:      { contains: query.search } },
        { destination: { contains: query.search } },
      ],
    });
  }

  const where     = andConditions.length > 0 ? { AND: andConditions } : {};
  const sortBy    = VALID_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const [trips, total] = await Promise.all([
    tripRepo.findAll(where, skip, limit, { [sortBy]: sortOrder }),
    tripRepo.countAll(where),
  ]);

  return paginatedResponse(trips, total, page, limit);
};

// ── Get one ────────────────────────────────────────────────────────────────────

export const getTripById = async (rawId) => {
  const id = parseId(rawId);
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);
  return trip;
};

// ── Create ─────────────────────────────────────────────────────────────────────

export const createTrip = async (data) => {
  const [vehicle, driver] = await Promise.all([
    vehicleRepo.findById(data.vehicleId),
    driverRepo.findById(data.driverId),
  ]);

  assertVehicleAvailable(vehicle);
  assertDriverAvailable(driver);

  if (Number(data.cargoWeight) > Number(vehicle.maxLoadCapacity)) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_CARGO_EXCEEDS);
  }

  return tripRepo.create({
    source:          data.source,
    destination:     data.destination,
    vehicleId:       data.vehicleId,
    driverId:        data.driverId,
    cargoWeight:     data.cargoWeight,
    plannedDistance: data.plannedDistance,
    revenue:         data.revenue ?? null,
    status:          TRIP_STATUS.DRAFT,
  });
};

// ── Update (DRAFT only) ────────────────────────────────────────────────────────

export const updateTrip = async (rawId, data) => {
  const id = parseId(rawId);
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);

  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_INVALID_STATUS);
  }

  const newVehicleId  = data.vehicleId  ?? trip.vehicleId;
  const newDriverId   = data.driverId   ?? trip.driverId;
  const newCargoWeight = data.cargoWeight ?? Number(trip.cargoWeight);

  const vehicleChanging = data.vehicleId !== undefined && data.vehicleId !== trip.vehicleId;
  const driverChanging  = data.driverId  !== undefined && data.driverId  !== trip.driverId;
  // Cargo check needed whenever cargoWeight changes OR vehicle changes (new capacity)
  const cargoCheckNeeded = data.cargoWeight !== undefined || vehicleChanging;

  if (vehicleChanging || driverChanging || cargoCheckNeeded) {
    const [vehicle, driver] = await Promise.all([
      vehicleChanging ? vehicleRepo.findById(newVehicleId) : Promise.resolve(trip.vehicle),
      driverChanging  ? driverRepo.findById(newDriverId)   : Promise.resolve(trip.driver),
    ]);

    if (vehicleChanging) assertVehicleAvailable(vehicle);
    if (driverChanging)  assertDriverAvailable(driver);

    if (cargoCheckNeeded) {
      const capacity = Number(vehicle.maxLoadCapacity);
      if (Number(newCargoWeight) > capacity) {
        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_CARGO_EXCEEDS);
      }
    }
  }

  // Build update payload — only include fields that were actually provided
  const payload = {};
  if (data.source          !== undefined) payload.source          = data.source;
  if (data.destination     !== undefined) payload.destination     = data.destination;
  if (data.vehicleId       !== undefined) payload.vehicleId       = data.vehicleId;
  if (data.driverId        !== undefined) payload.driverId        = data.driverId;
  if (data.cargoWeight     !== undefined) payload.cargoWeight     = data.cargoWeight;
  if (data.plannedDistance !== undefined) payload.plannedDistance = data.plannedDistance;
  if (data.revenue         !== undefined) payload.revenue         = data.revenue;

  return tripRepo.update(id, payload);
};

// ── Dispatch ───────────────────────────────────────────────────────────────────

export const dispatchTrip = async (rawId) => {
  const id = parseId(rawId);

  // Load trip first — outside transaction to give a clean 404 before acquiring locks
  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);

  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_INVALID_STATUS);
  }

  // Fetch fresh vehicle and driver state inside the transaction to avoid TOCTOU
  return prisma.$transaction(async (tx) => {
    const [vehicle, driver] = await Promise.all([
      tx.vehicle.findUnique({ where: { id: trip.vehicleId } }),
      tx.driver.findUnique({ where: { id: trip.driverId } }),
    ]);

    assertVehicleAvailable(vehicle);
    assertDriverAvailable(driver);

    const now = new Date();

    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id },
        data: {
          status:         TRIP_STATUS.DISPATCHED,
          dispatchedAt:   now,
          startOdometer:  vehicle.odometer,
        },
        include: {
          vehicle: { select: { id: true, registrationNumber: true, name: true, type: true, maxLoadCapacity: true, status: true } },
          driver:  { select: { id: true, name: true, licenseNumber: true, licenseCategory: true, licenseExpiryDate: true, status: true } },
        },
      }),
      tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: VEHICLE_STATUS.ON_TRIP } }),
      tx.driver.update({  where: { id: trip.driverId  }, data: { status: DRIVER_STATUS.ON_TRIP  } }),
    ]);

    return updatedTrip;
  });
};

// ── Complete ───────────────────────────────────────────────────────────────────

export const completeTrip = async (rawId, data) => {
  const id = parseId(rawId);

  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);

  if (trip.status !== TRIP_STATUS.DISPATCHED) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_INVALID_STATUS);
  }

  // Odometer validation
  const startOdometer = Number(trip.startOdometer ?? 0);
  if (data.finalOdometer < startOdometer) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Final odometer (${data.finalOdometer}) cannot be less than start odometer (${startOdometer}).`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id },
        data: {
          status:         TRIP_STATUS.COMPLETED,
          completedAt:    now,
          actualDistance: data.actualDistance,
          fuelConsumed:   data.fuelConsumed,
          finalOdometer:  data.finalOdometer,
          revenue:        data.revenue ?? trip.revenue,
        },
        include: {
          vehicle: { select: { id: true, registrationNumber: true, name: true, type: true, maxLoadCapacity: true, status: true } },
          driver:  { select: { id: true, name: true, licenseNumber: true, licenseCategory: true, licenseExpiryDate: true, status: true } },
        },
      }),
      tx.vehicle.update({
        where: { id: trip.vehicleId },
        data:  { status: VEHICLE_STATUS.AVAILABLE, odometer: data.finalOdometer },
      }),
      tx.driver.update({
        where: { id: trip.driverId },
        data:  { status: DRIVER_STATUS.AVAILABLE },
      }),
    ]);

    return updatedTrip;
  });
};

// ── Cancel ─────────────────────────────────────────────────────────────────────

export const cancelTrip = async (rawId) => {
  const id = parseId(rawId);

  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);

  if (![TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED].includes(trip.status)) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_INVALID_STATUS);
  }

  if (trip.status === TRIP_STATUS.DRAFT) {
    // No vehicle/driver state to roll back — simple update
    return tripRepo.update(id, { status: TRIP_STATUS.CANCELLED, cancelledAt: new Date() });
  }

  // DISPATCHED — must restore vehicle and driver atomically
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id },
        data:  { status: TRIP_STATUS.CANCELLED, cancelledAt: now },
        include: {
          vehicle: { select: { id: true, registrationNumber: true, name: true, type: true, maxLoadCapacity: true, status: true } },
          driver:  { select: { id: true, name: true, licenseNumber: true, licenseCategory: true, licenseExpiryDate: true, status: true } },
        },
      }),
      tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: VEHICLE_STATUS.AVAILABLE } }),
      tx.driver.update({  where: { id: trip.driverId  }, data: { status: DRIVER_STATUS.AVAILABLE  } }),
    ]);

    return updatedTrip;
  });
};

// ── Delete ─────────────────────────────────────────────────────────────────────

export const deleteTrip = async (rawId) => {
  const id = parseId(rawId);

  const trip = await tripRepo.findById(id);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.TRIP_NOT_FOUND);

  // DISPATCHED — vehicle/driver locked, deletion corrupts fleet state
  // COMPLETED  — fuel logs and expenses reference this trip (FK integrity)
  if (trip.status === TRIP_STATUS.DISPATCHED || trip.status === TRIP_STATUS.COMPLETED) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.TRIP_INVALID_STATUS);
  }

  await tripRepo.remove(id);
};
