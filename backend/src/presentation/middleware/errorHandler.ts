import { Request, Response, NextFunction } from 'express';
import { ValidationException } from '../../core/domain/exceptions/ValidationException';
import { NotFoundException } from '../../core/domain/exceptions/NotFoundException';
import { DomainException } from '../../core/domain/exceptions/DomainException';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle PostgreSQL unique constraint violations
  const dbError = err as DatabaseError;
  if (dbError.code === '23505') {
    let message = 'A record with this information already exists';

    // Parse the constraint name to provide specific error messages
    if (dbError.detail) {
      if (dbError.detail.includes('email_address')) {
        message = 'An employee with this email address already exists';
      } else if (dbError.detail.includes('phone_number')) {
        message = 'An employee with this phone number already exists';
      } else if (dbError.constraint === 'unique_active_employee_cafe') {
        message = 'This employee is already assigned to an active café';
      }
    }

    res.status(409).json({
      error: 'Conflict',
      message: message,
    });
    return;
  }

  if (err instanceof ValidationException) {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof NotFoundException) {
    res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
    return;
  }

  if (err instanceof DomainException) {
    res.status(400).json({
      error: 'Domain Error',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};
