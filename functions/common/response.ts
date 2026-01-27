/**
 * Common response utilities for consistent API responses
 */

export const successResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const errorResponse = (message: string, status: number = 400, details?: any) => {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      ...(details && { details }),
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const unauthorizedResponse = (message: string = 'Unauthorized') => {
  return errorResponse(message, 401);
};

export const forbiddenResponse = (message: string = 'Forbidden') => {
  return errorResponse(message, 403);
};

export const notFoundResponse = (message: string = 'Resource not found') => {
  return errorResponse(message, 404);
};

export const validationErrorResponse = (errors: any) => {
  return errorResponse('Validation failed', 422, errors);
};