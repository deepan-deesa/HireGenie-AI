import { PrismaClient } from '@prisma/client';
import { mockJobs, mockCandidates, mockEmails } from '../../src/mockData';
import { Candidate, JobOpening, CandidateEmail } from '../../src/types';

// Lazy Prisma Client initialization to prevent crashing when DATABASE_URL is missing
let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch (err) {
      console.error('Failed to initialize Prisma client:', err);
      return null;
    }
  }
  return prisma;
}

// In-memory Database Fallback to allow seamless offline/sandbox execution
class MemoryDatabase {
  public users: any[] = [
    {
      id: 'default-recruiter-id',
      email: 'deepanmuthu05@gmail.com',
      name: 'Alex Mercer',
      password: '$2a$10$T1K72Lz753177F888z7X.uy0rX2Z0G8fV6O8zE1S0nZ5t2eDREhW.', // bcrypt hash for 'password123'
      role: 'Lead Recruiter'
    }
  ];
  public jobs: JobOpening[] = [...mockJobs];
  public candidates: Candidate[] = [...mockCandidates];
  public emails: CandidateEmail[] = [...mockEmails];
}

export const dbFallback = new MemoryDatabase();

export function isUsingPrisma(): boolean {
  return !!process.env.DATABASE_URL;
}

console.log(
  isUsingPrisma()
    ? '📡 Database: Prisma with PostgreSQL detected and active.'
    : '💾 Database: Running in Sandboxed mode with high-fidelity In-Memory store.'
);
