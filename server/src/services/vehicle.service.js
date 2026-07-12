import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { VEHICLE_STATUS } from '../constants/statuses.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

const VALID_SORT_FIELDS = new Set(['name', 'status', 'type', 'region', 'createdAt', 'odometer']);

const parseId = (raw) => {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id < 1) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID parameter');
  return id;
};

export const getAllVehicles = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const andConditions = [];

  if (query.status) {
    if (!Object.values(VEHICLE_STATUS).includes(query.status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid status value: ${query.status}`);
    }
    andConditions.push({ status: query.status });
  }

  if (query.type)   andConditions.push({ type:   { contains: query.type } });
  if (query.region) andConditions.push({ region: { contains: query.region } });

  if (query.search) {
    andConditions.push({
      OR: [
        { name:               { contains: query.search } },
        { registrationNumber: { contains: query.search } },
        { type:               { contains: query.search } },
        { region:             { contains: query.search } },
      ],
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const sortBy    = VALID_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const [vehicles, total] = await Promise.all([
    vehicleRepo.findAll(where, skip, limit, { [sortBy]: sortOrder }),
    vehicleRepo.countAll(where),
  ]);

  return paginatedResponse(vehicles, total, page, limit);
};

export const getVehicleById = async (rawId) => {
  const id = parseId(rawId);
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicle;
};

export const getAvailableVehicles = () => vehicleRepo.findAvailable();

export const createVehicle = async (data) => {
  const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  return vehicleRepo.create(data);
};

export const updateVehicle = async (rawId, data) => {
  const id = parseId(rawId);
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
    const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  }

  return vehicleRepo.update(id, data);
};

export const deleteVehicle = async (rawId) => {
  const id = parseId(rawId);
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_ON_TRIP);
  }
  if (vehicle.status === VEHICLE_STATUS.IN_SHOP) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_IN_SHOP);
  }

  const [activeTrip, activeMaintenance] = await Promise.all([
    vehicleRepo.hasActiveTrip(id),
    vehicleRepo.hasActiveMaintenance(id),
  ]);

  if (activeTrip)        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_ON_TRIP);
  if (activeMaintenance) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_IN_SHOP);

  await vehicleRepo.remove(id);
};
