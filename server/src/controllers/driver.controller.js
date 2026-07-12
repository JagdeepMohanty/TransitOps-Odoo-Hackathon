const driverService = require('../services/driver.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const getDrivers = asyncHandler(async (req, res) => {
  const result = await driverService.getAllDrivers(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Drivers fetched.', result));
});

const getDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Driver fetched.', driver));
});

const getAvailableDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverService.getAvailableDrivers();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Available drivers fetched.', drivers));
});

const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.DRIVER_CREATED, driver));
});

const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(parseInt(req.params.id), req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.DRIVER_UPDATED, driver));
});

const deleteDriver = asyncHandler(async (req, res) => {
  await driverService.deleteDriver(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.DRIVER_DELETED));
});

module.exports = { getDrivers, getDriver, getAvailableDrivers, createDriver, updateDriver, deleteDriver };
