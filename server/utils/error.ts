import { createError } from 'h3'

function createApiError(statusCode: number, message: string, details?: unknown) {
  return createError({
    statusCode,
    statusMessage: message,
    data: details ? { details } : undefined,
  })
}

export const ApiErrors = {
  notFound: (message = 'Resource not found') =>
    createApiError(404, message),

  badRequest: (message = 'Bad request', details?: unknown) =>
    createApiError(400, message, details),

  unauthorized: (message = 'Unauthorized') =>
    createApiError(401, message),

  forbidden: (message = 'Forbidden') =>
    createApiError(403, message),

  internalError: (message = 'Internal server error') =>
    createApiError(500, message),

  serviceUnavailable: (message = 'Service unavailable') =>
    createApiError(503, message),
}
