import { UserRecord } from './UserRecord';

declare global {
  namespace Express {
    export interface Request {
      user?: Pick<UserRecord, 'xata_id' | 'role'>; // Assuming only id and role are needed
    }
  }
}

export function json(): any {
    throw new Error('Function not implemented.');
}
