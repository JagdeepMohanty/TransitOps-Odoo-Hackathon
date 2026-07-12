import * as vehicleService from '../services/vehicle.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getVehicles = asyncHandler(async (req, res) => {
  const result = await vehicleService.getAllVehicles(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Vehicles fetched.', result).send(res);
});

export const getVehicle = asyncHandler(async (req, res) => {
<<<<<<< Updated upstream
  const vehicle = await vehicleService.getVehicleById(parseInt(req.params.id));
  return new ApiResponse(HTTP_STATUS.OK, 'Vehicle fetched.', vehicle).send(res);
=======
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, 'Vehicle retrieved successfully.', vehicle).send(res);
>>>>>>> Stashed changes
});

export const getAvailableVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAvailableVehicles();
  return new ApiResponse(HTTP_STATUS.OK, 'Available vehicles fetched.', vehicles).send(res);
});

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.VEHICLE_CREATED, vehicle).send(res);
});

export const updateVehicle = asyncHandler(async (req, res) => {
<<<<<<< Updated upstream
  const vehicle = await vehicleService.updateVehicle(parseInt(req.params.id), req.body);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.VEHICLE_UPDATED, vehicle).send(res);
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(parseInt(req.params.id));
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.VEHICLE_DELETED).send(res);
=======
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
  new ApiResponse(HTTP_STATUS.OK, MESSAGES.VEHICLE_UPDATED, vehicle).send(res);
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, MESSAGES.VEHICLE_DELETED, null).send(res);
>>>>>>> Stashed changes
});
