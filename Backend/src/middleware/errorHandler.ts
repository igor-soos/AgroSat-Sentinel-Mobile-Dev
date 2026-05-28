import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/utils/constants';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Default error
  res.status(HTTP_STATUS.INTERNAL_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_ERROR,
    timestamp: new Date().toISOString(),
  });
};