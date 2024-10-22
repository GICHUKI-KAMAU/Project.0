import { Request } from 'express';
import { UserRecord } from '../types/UserRecord';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
