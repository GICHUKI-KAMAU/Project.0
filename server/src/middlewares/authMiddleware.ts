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
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return; // Ensure the function exits after sending a response
  }

  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decodedToken; // Attach the decoded token to the request object

    // Fetch the user from the Xata database using the decoded token's user ID
    const xata = getXataClient();
    const user = await xata.db.Users.read(decodedToken.id);

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return; // Ensure the function exits after sending a response
    }

    next(); // Call the next middleware
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
};
