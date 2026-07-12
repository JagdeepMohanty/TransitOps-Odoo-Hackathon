const tripService = require('../services/trip.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const getTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getAllTrips(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Trips fetched.', result));
});

const getTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Trip fetched.', trip));
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.body, req.user.id);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.TRIP_CREATED, trip));
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(parseInt(req.params.id), req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_UPDATED, trip));
});

const dispatchTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.dispatchTrip(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_DISPATCHED, trip));
});

const completeTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.completeTrip(parseInt(req.params.id), req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_COMPLETED, trip));
});

const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.cancelTrip(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_CANCELLED, trip));
});

module.exports = { getTrips, getTrip, createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip };
