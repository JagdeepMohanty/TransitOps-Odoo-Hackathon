import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // Prisma connection / initialization errors — DB unreachable
  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error('Database connection error:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Database is currently unavailable',
      errors: [],
    });
  }

  // Operational ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(isDev && { stack: err.stack }),
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A record with this value already exists',
        errors: [{ field: err.meta?.target, message: 'Must be unique' }],
      });
    }
    if (err.code === 'P2025') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Record not found',
        errors: [],
      });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Database request error',
      errors: [],
    });
  }

  // Unknown / programming errors
  console.error('Unhandled error:', err);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred',
    errors: [],
    ...(isDev && { stack: err.stack }),
  });
};

export default errorMiddleware;
