// test.ts

import { Request, Response, NextFunction } from 'express';
import { isAdmin } from './path/to/your/isAdminFile';
import { getXataClient } from '../xata';
import { verifyToken } from '../utils/jwtUtils';

jest.mock('../xata');
jest.mock('../utils/jwtUtils');

describe('isAdmin Middleware', () => {
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

  it('should call next if the user is an admin', async () => {
    req.cookies.token = 'valid_token';
    (verifyToken as jest.Mock).mockReturnValue({ id: 'user123' });
    const xata = getXataClient();
    (xata.db.Users.read as jest.Mock).mockResolvedValue({ role: ['admin'] });

    await isAdmin(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 if token is missing', async () => {
    await isAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user role is not admin', async () => {
    req.cookies.token = 'valid_token';
    (verifyToken as jest.Mock).mockReturnValue({ id: 'user123' });
    const xata = getXataClient();
    (xata.db.Users.read as jest.Mock).mockResolvedValue({ role: ['user'] });

    await isAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admins only.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', async () => {
    req.cookies.token = 'invalid_token';
    (verifyToken as jest.Mock).mockReturnValue(null);

    await isAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });
});
