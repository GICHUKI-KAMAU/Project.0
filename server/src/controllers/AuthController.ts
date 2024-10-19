import { Request, Response } from 'express';
import { getXataClient } from '../xata';
import { generateToken } from '../utils/jwtUtils';
import { hashPassword, comparePassword } from '../utils/bcryptUtils';

const xata = getXataClient();

export const AuthController = {
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, username } = req.body;
      const existingUser = await xata.db.Users.filter({ email }).getFirst();

      if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await xata.db.Users.create({
        email,
        password: hashedPassword,
        username,
        role: ['user'], // Make sure this matches your schema
      });

      const token = generateToken({ id: newUser.xata_id, role: newUser.role });
      res.status(201).json({ token });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await xata.db.Users.filter({ email }).getFirst();

      if (!user || !(await comparePassword(password, user.password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = generateToken({ id: user.xata_id, role: user.role });
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await xata.db.Users.getAll(); // Fetch all users from the Users table
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getUserById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the user ID from the request parameters

    try {
      const user = await xata.db.Users.read(id); // Fetch user by ID from the Users table

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

};
