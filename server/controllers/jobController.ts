import { Request, Response } from 'express';
import { JobService } from '../services/jobService';

export class JobController {
  static async listJobs(req: Request, res: Response) {
    try {
      const jobs = await JobService.listJobs();
      return res.status(200).json(jobs);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to list jobs.' });
    }
  }

  static async createJob(req: Request, res: Response) {
    const { title, department, location, type, status } = req.body;

    if (!title || !department || !location || !type || !status) {
      return res.status(400).json({ error: 'All fields are required to create a job opening.' });
    }

    try {
      const job = await JobService.createJob({ title, department, location, type, status });
      return res.status(201).json(job);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to create job.' });
    }
  }
}
