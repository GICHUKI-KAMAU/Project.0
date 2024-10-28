// test.ts

import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './path/to/your/authMiddlewareFile';
import jwt from 'jsonwebtoken';
import { getXataClient } from '../xata';

jest.mock('jsonwebtoken');
jest.mock('../xata');

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should proceed to next middleware if token is valid and user exists', async () => {
    req.cookies.token = 'valid_token';
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'user123', role: 'admin' });
    const xata = getXataClient();
    (xata.db.Users.read as jest.Mock).mockResolvedValue({ id: 'user123', role: 'admin' });

    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    req.cookies.token = 'invalid_token';
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token verification failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user does not exist in database', async () => {
    req.cookies.token = 'valid_token';
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'nonexistent_user', role: 'user' });
    const xata = getXataClient();
    (xata.db.Users.read as jest.Mock).mockResolvedValue(null);

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should check authorization header if token is not in cookies', async () => {
    req.headers.authorization = 'Bearer valid_token';
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'user123', role: 'admin' });
    const xata = getXataClient();
    (xata.db.Users.read as jest.Mock).mockResolvedValue({ id: 'user123', role: 'admin' });

    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
