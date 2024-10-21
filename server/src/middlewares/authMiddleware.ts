import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getXataClient } from '../xata';
import dotenv from 'dotenv';


dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token = req.cookies?.token;

  // const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // If no token is found in both cookies and headers, return unauthorized
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decodedToken; 

    // Fetch the user from the Xata database using the decoded token's user ID
    const xata = getXataClient();
    const user = await xata.db.Users.read(decodedToken.id);

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return; // Ensure the function exits after sending a response
    }

    next(); // Call the next middleware
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
};
