import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT
export const generateToken = (payload: object, expiresIn: string | number = '1h') => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

// Verify JWT
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};
