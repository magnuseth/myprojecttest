/**
 * Common error handling utilities
 */

import { errorResponse } from './response.ts';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: any) => {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode);
  }

  // Handle Zod validation errors
  if (error?.issues) {
    return errorResponse('Validation failed', 422, error.issues);
  }

  // Default error
  return errorResponse(
    error?.message || 'Internal server error',
    500
  );
};