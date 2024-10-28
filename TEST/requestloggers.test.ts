// test.ts

import { Request, Response, NextFunction } from 'express';
import { requestLogger } from './path/to/your/requestLoggerFile';

describe('requestLogger Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/test-route'
    };
    res = {};
    next = jest.fn();
    console.log = jest.fn(); // Mock console.log
  });

  it('should log the request with method, URL, and timestamp', () => {
    const logPattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] GET - \/test-route/;

    requestLogger(req as Request, res as Response, next);

    // Verify that console.log was called with a matching pattern
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(logPattern));

    // Ensure next() was called to pass control to the next middleware
    expect(next).toHaveBeenCalled();
  });
});
