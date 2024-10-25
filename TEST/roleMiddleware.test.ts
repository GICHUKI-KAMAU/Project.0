// test.ts

import { Request, Response, NextFunction } from 'express';
import { roleMiddleware } from './path/to/your/roleMiddlewareFile';

describe('roleMiddleware', () => {
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
  });

  it('should return 403 if no user is logged in', () => {
    // Simulate no user in request
    roleMiddleware('admin')(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: No user logged in' });
    expect(next).not.toHaveBeenCalled(); // next() should not be called
  });

  it('should return 403 if user role does not match required role', () => {
    req.user = { role: 'user' }; // Simulating a logged-in user with 'user' role

    roleMiddleware('admin')(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Requires admin role' });
    expect(next).not.toHaveBeenCalled(); // next() should not be called
  });

  it('should call next() if user role matches required role', () => {
    req.user = { role: 'admin' }; // Simulating a logged-in user with 'admin' role

    roleMiddleware('admin')(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled(); // next() should be called
    expect(res.status).not.toHaveBeenCalled(); // No status should be set
    expect(res.json).not.toHaveBeenCalled(); // No JSON response should be sent
  });
});
