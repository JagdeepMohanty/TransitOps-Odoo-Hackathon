import * as tripService from '../services/trip.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getAllTrips(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Trips fetched.', result).send(res);
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(parseInt(req.params.id));
  return new ApiResponse(HTTP_STATUS.OK, 'Trip fetched.', trip).send(res);
});

export const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.body, req.user.id);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.TRIP_CREATED, trip).send(res);
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(parseInt(req.params.id), req.body);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_UPDATED, trip).send(res);
});

export const dispatchTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.dispatchTrip(parseInt(req.params.id));
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_DISPATCHED, trip).send(res);
});

export const completeTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.completeTrip(parseInt(req.params.id), req.body);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_COMPLETED, trip).send(res);
});

export const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.cancelTrip(parseInt(req.params.id));
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.TRIP_CANCELLED, trip).send(res);
});
