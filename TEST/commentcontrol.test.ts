
import { Request, Response } from 'express';
import { AuthController } from '../server/src/controllers/AuthController'; // Import the AuthController
import { getXataClient } from '../server/src/xata'; // Mocked Xata client
import { generateToken } from '../server/src/utils/jwtUtils'; // Mocked JWT utilities
import { hashPassword, comparePassword } from '../server/src/utils/bcryptUtils'; // Mocked bcrypt utilities

// Mock the required dependencies
jest.mock('../xata');
jest.mock('../utils/jwtUtils');
jest.mock('../utils/bcryptUtils');

// Create mock Xata client and users database
const xata = {
  db: {
    Users: {
      filter: jest.fn(),
      create: jest.fn(),
      getAll: jest.fn(),
      read: jest.fn(),
    },
  },
};
(getXataClient as jest.Mock).mockReturnValue(xata); // Mock getXataClient

describe('AuthController', () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    res = {
      status: statusMock,
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  describe('signup', () => {
    it('should return 400 if email is already in use', async () => {
      req.body = { email: 'test@example.com', password: 'password123', username: 'testuser' };
      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
      });

      await AuthController.signup(req as Request, res as Response);

      expect(xata.db.Users.filter).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Email already in use' });
    });

    it('should hash the password and create a new user', async () => {
      req.body = { email: 'test@example.com', password: 'password123', username: 'testuser' };
      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValue(null),
      });
      hashPassword.mockResolvedValue('hashedpassword');
      xata.db.Users.create.mockResolvedValue({
        xata_id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        role: ['user'],
      });
      generateToken.mockReturnValue('mockedToken');

      await AuthController.signup(req as Request, res as Response);

      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(xata.db.Users.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedpassword',
        username: 'testuser',
        role: ['user'],
      });
      expect(res.cookie).toHaveBeenCalledWith('token', 'mockedToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ token: 'mockedToken' });
    });
  });

  describe('login', () => {
    it('should return 401 if credentials are invalid', async () => {
      req.body = { email: 'invalid@example.com', password: 'wrongpassword' };
      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValue(null),
      });

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 200 and set a cookie with the token if credentials are valid', async () => {
      req.body = { email: 'valid@example.com', password: 'password123' };
      xata.db.Users.filter.mockReturnValueOnce({
        getFirst: jest.fn().mockResolvedValue({
          xata_id: 'user123',
          email: 'valid@example.com',
          password: 'hashedpassword',
          role: ['user'],
        }),
      });
      comparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue('validToken');

      await AuthController.login(req as Request, res as Response);

      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(res.cookie).toHaveBeenCalledWith('token', 'validToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ token: 'validToken' });
    });
  });

  describe('logout', () => {
    it('should clear the token cookie and return success message', async () => {
      await AuthController.logout(req as Request, res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 'user1' }, { id: 'user2' }];
      xata.db.Users.getAll.mockResolvedValue(users);

      await AuthController.getUsers(req as Request, res as Response);

      expect(xata.db.Users.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      req.params = { id: 'user123' };
      const user = { id: 'user123', username: 'testuser' };
      xata.db.Users.read.mockResolvedValue(user);

      await AuthController.getUserById(req as Request, res as Response);

      expect(xata.db.Users.read).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: 'user123' };
      xata.db.Users.read.mockResolvedValue(null);

      await AuthController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

});
