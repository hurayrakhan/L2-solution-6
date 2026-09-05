import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config/index.js';

export const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong!';
  let errorSources: Array<{ path: string | number; message: string }> = [];

  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorSources = error.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] || 'field',
      message: issue.message,
    }));
  } else if (error?.name === 'UnauthorizedError' || error?.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errorSources.length > 0 ? errorSources : [{ path: '', message }],
    ...(config.env === 'development' && { stack: error?.stack }),
  });
};
