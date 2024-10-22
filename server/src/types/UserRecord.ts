export interface UserRecord {
    xata_id: string;
    email: string;
    username: string;
    password: string;
    role: string[]; // Array because users can have multiple roles
    xata_createdAt: Date;
    xata_updatedAt: Date;
  }
  