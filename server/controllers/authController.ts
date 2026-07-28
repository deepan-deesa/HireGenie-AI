import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required fields.' });
    }

    try {
      const result = await AuthService.register(email, name, password, role);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Registration failed.' });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required fields.' });
    }

    try {
      const result = await AuthService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message || 'Invalid credentials.' });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const profile = await AuthService.getProfile(req.user.id);
      return res.status(200).json(profile);
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Profile not found.' });
    }
  }
}
