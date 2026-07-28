import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPrismaClient, dbFallback } from '../config/db';
import { UserProfile } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'hiregenie-super-secret-key';
const EXPIRES_IN = '7d';

export class AuthService {
  private static getPrisma() {
    return getPrismaClient();
  }

  static async register(email: string, name: string, passwordString: string, role = 'Recruiter'): Promise<{ token: string; user: UserProfile }> {
    const prisma = this.getPrisma();
    const hashedPassword = await bcrypt.hash(passwordString, 10);

    if (prisma) {
      // Check existing user
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new Error('Email already registered');
      }

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role
        }
      });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
      return {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      };
    } else {
      // In-Memory Fallback
      const existing = dbFallback.users.find(u => u.email === email);
      if (existing) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        password: hashedPassword,
        role
      };

      dbFallback.users.push(newUser);

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
      return {
        token,
        user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
      };
    }
  }

  static async login(email: string, passwordString: string): Promise<{ token: string; user: UserProfile }> {
    const prisma = this.getPrisma();

    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(passwordString, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
      return {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      };
    } else {
      // In-Memory Fallback
      const user = dbFallback.users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(passwordString, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
      return {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      };
    }
  }

  static async getProfile(userId: string): Promise<UserProfile> {
    const prisma = this.getPrisma();

    if (prisma) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User profile not found');
      }
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    } else {
      const user = dbFallback.users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User profile not found');
      }
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }
  }
}
