// test.ts

import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './path/to/your/errorHandlerFile';

describe('errorHandler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    console.error = jest.fn(); // Mock console.error to test error logging
  });

  it('should log the error and return a 500 status with a default message if no status or message is provided', () => {
    const error = new Error('Test error');
    errorHandler(error, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
  });

  it('should return the provided status and message if they exist on the error object', () => {
    const error = {
      status: 404,
      message: 'Resource not found',
      stack: 'Error stack'
    };

    errorHandler(error, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
  });

  it('should use a 500 status if error status is not provided', () => {
    const error = {
      message: 'Unknown server error',
      stack: 'Error stack'
    };

    errorHandler(error, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unknown server error' });
  });

  it('should use the default message if error message is not provided', () => {
    const error = {
      status: 400,
      stack: 'Error stack'
    };

    errorHandler(error, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
  });
});
