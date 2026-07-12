import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import * as authService from '../services/auth.service.js';

export const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  new ApiResponse(HTTP_STATUS.OK, 'Login successful', result).send(res);
});

export const getMeHandler = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  new ApiResponse(HTTP_STATUS.OK, 'User retrieved successfully', user).send(res);
});

export const logoutHandler = asyncHandler(async (req, res) => {
  // JWT is stateless — client discards the token.
  // This endpoint exists so the frontend has a consistent logout call.
  new ApiResponse(HTTP_STATUS.OK, 'Logged out successfully', null).send(res);
});
