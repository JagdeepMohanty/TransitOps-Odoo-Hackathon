import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGIN_SUCCESS, result).send(res);
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  return new ApiResponse(HTTP_STATUS.OK, 'User retrieved successfully', user).send(res);
});

export const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — client discards the token
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.LOGOUT_SUCCESS, null).send(res);
});
