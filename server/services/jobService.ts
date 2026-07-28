import { getPrismaClient, dbFallback } from '../config/db';
import { JobOpening } from '../types';

export class JobService {
  private static getPrisma() {
    return getPrismaClient();
  }

  static async listJobs(): Promise<JobOpening[]> {
    const prisma = this.getPrisma();

    if (prisma) {
      const dbJobs = await prisma.jobOpening.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return dbJobs.map(job => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type as any,
        status: job.status as any,
        applicantsCount: job.applicantsCount,
        postedDate: job.postedDate
      }));
    } else {
      return [...dbFallback.jobs];
    }
  }

  static async createJob(data: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>): Promise<JobOpening> {
    const prisma = this.getPrisma();
    const postedDate = new Date().toISOString().split('T')[0];

    if (prisma) {
      const created = await prisma.jobOpening.create({
        data: {
          title: data.title,
          department: data.department,
          location: data.location,
          type: data.type,
          status: data.status,
          applicantsCount: 0,
          postedDate
        }
      });
      return {
        id: created.id,
        title: created.title,
        department: created.department,
        location: created.location,
        type: created.type as any,
        status: created.status as any,
        applicantsCount: created.applicantsCount,
        postedDate: created.postedDate
      };
    } else {
      const newJob: JobOpening = {
        ...data,
        id: `job-${Date.now()}`,
        applicantsCount: 0,
        postedDate
      };
      dbFallback.jobs.unshift(newJob);
      return newJob;
    }
  }
}
