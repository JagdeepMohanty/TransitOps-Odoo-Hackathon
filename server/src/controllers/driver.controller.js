import * as driverService from '../services/driver.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getDrivers = asyncHandler(async (req, res) => {
  const result = await driverService.getAllDrivers(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Drivers retrieved successfully.', result).send(res);
});

export const getDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, 'Driver retrieved successfully.', driver).send(res);
});

export const getAvailableDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverService.getAvailableDrivers();
  return new ApiResponse(HTTP_STATUS.OK, 'Available drivers retrieved successfully.', drivers).send(res);
});

export const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.DRIVER_CREATED, driver).send(res);
});

export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(req.params.id, req.body);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.DRIVER_UPDATED, driver).send(res);
});

export const deleteDriver = asyncHandler(async (req, res) => {
  await driverService.deleteDriver(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.DRIVER_DELETED, null).send(res);
});
