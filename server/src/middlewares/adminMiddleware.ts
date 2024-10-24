import { Request, Response, NextFunction } from 'express';
import { getXataClient } from '../xata';
import { verifyToken } from '../utils/jwtUtils';

const xata = getXataClient();

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    const decoded = verifyToken(token);

    // Make sure the decoded token is of type JwtPayload and has an `id` field
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      res.status(403).json({ message: 'Access denied. Invalid token.' });
      return;
    }

    const user = await xata.db.Users.read(decoded.id);
    if (user && Array.isArray(user.role) && user.role.includes('admin')) {
      next(); // User is an admin, continue with the request
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    res.status(403).json({ message: 'Invalid token or user not found.' });
  }
};
