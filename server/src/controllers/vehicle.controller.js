const vehicleService = require('../services/vehicle.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const getVehicles = asyncHandler(async (req, res) => {
  const result = await vehicleService.getAllVehicles(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Vehicles fetched.', result));
});

const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Vehicle fetched.', vehicle));
});

const getAvailableVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAvailableVehicles();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Available vehicles fetched.', vehicles));
});

const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.VEHICLE_CREATED, vehicle));
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(parseInt(req.params.id), req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.VEHICLE_UPDATED, vehicle));
});

const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.VEHICLE_DELETED));
});

module.exports = { getVehicles, getVehicle, getAvailableVehicles, createVehicle, updateVehicle, deleteVehicle };
