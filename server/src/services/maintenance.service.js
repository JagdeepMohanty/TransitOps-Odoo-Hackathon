import prisma from '../config/prisma.js';
import * as maintenanceRepo from '../repositories/maintenance.repository.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { VEHICLE_STATUS, MAINTENANCE_STATUS } from '../constants/statuses.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAllMaintenance = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.vehicleId) filters.vehicleId = parseInt(query.vehicleId);
  if (query.status)    filters.status    = query.status;

  const [logs, total] = await Promise.all([
    maintenanceRepo.findAll(filters, skip, limit),
    maintenanceRepo.countAll(filters),
  ]);
  return paginatedResponse(logs, total, page, limit);
};

export const getMaintenanceById = async (id) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  return log;
};

export const createMaintenance = async (data) => {
  // 1. Vehicle must exist
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  // 2. Cannot create maintenance for a vehicle on a trip
  if (vehicle.status === VEHICLE_STATUS.ON_TRIP)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_ON_TRIP_MAINTENANCE);

  // 3. Cannot create maintenance for a retired vehicle
  if (vehicle.status === VEHICLE_STATUS.RETIRED)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_RETIRED_MAINTENANCE);

  // 4. Cannot create duplicate active maintenance for the same vehicle
  const existing = await maintenanceRepo.findActiveByVehicle(data.vehicleId);
  if (existing)
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_ALREADY_IN_MAINTENANCE);

  // 5. Atomically create maintenance record and set vehicle IN_SHOP
  const [log] = await prisma.$transaction([
    prisma.maintenance.create({
      data: { ...data, status: MAINTENANCE_STATUS.ACTIVE },
      include: { vehicle: true },
    }),
    prisma.vehicle.update({
      where: { id: data.vehicleId },
      data:  { status: VEHICLE_STATUS.IN_SHOP },
    }),
  ]);

  return log;
};

export const updateMaintenance = async (id, data) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  if (log.status !== MAINTENANCE_STATUS.ACTIVE)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.MAINTENANCE_ALREADY_CLOSED);
  return maintenanceRepo.update(id, data);
};

export const closeMaintenance = async (id, data) => {
  // 1. Record must exist
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);

  // 2. Only ACTIVE records may be closed
  if (log.status !== MAINTENANCE_STATUS.ACTIVE)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.MAINTENANCE_ALREADY_CLOSED);

  const vehicle = await vehicleRepo.findById(log.vehicleId);

  const updateData = {
    status:  MAINTENANCE_STATUS.COMPLETED,
    endDate: data.endDate ?? new Date(),
    ...(data.cost !== undefined && { cost: data.cost }),
    ...(data.notes !== undefined && { notes: data.notes }),
  };

  // 3. Atomically close maintenance and restore vehicle (unless RETIRED)
  const ops = [
    prisma.maintenance.update({
      where: { id },
      data:  updateData,
      include: { vehicle: true },
    }),
  ];

  if (vehicle && vehicle.status !== VEHICLE_STATUS.RETIRED) {
    ops.push(
      prisma.vehicle.update({
        where: { id: log.vehicleId },
        data:  { status: VEHICLE_STATUS.AVAILABLE },
      })
    );
  }

  const [closedLog] = await prisma.$transaction(ops);
  return closedLog;
};
