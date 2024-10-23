import { UserRecord } from './UserRecord';

declare global {
  namespace Express {
    export interface Request {
      user?: Pick<UserRecord, 'xata_id' | 'role'>; // Assuming only id and role are needed
    }
  }
}
