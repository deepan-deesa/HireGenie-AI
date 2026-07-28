import { Request, Response } from 'express';
import { CareerAgentService } from '../services/careerAgentService';
import { JobService } from '../services/jobService';

export class CareerAgentController {
  static async analyzeResume(req: Request, res: Response) {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text is required for parsing.' });
    }

    try {
      const parsedProfile = await CareerAgentService.analyzeResume(resumeText);
      return res.status(200).json(parsedProfile);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to analyze resume.' });
    }
  }

  static async matchJobs(req: Request, res: Response) {
    const { profile, preferences } = req.body;

    if (!profile || !preferences) {
      return res.status(400).json({ error: 'Profile and preferences are required for matching.' });
    }

    try {
      const activeJobs = await JobService.listJobs();
      const matchResults = await CareerAgentService.matchJobs(profile, preferences, activeJobs);
      return res.status(200).json(matchResults);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to match profile to jobs.' });
    }
  }

  static async autoApply(req: Request, res: Response) {
    const { profile, jobId } = req.body;

    if (!profile || !jobId) {
      return res.status(400).json({ error: 'Profile and jobId are required to auto-apply.' });
    }

    try {
      const activeJobs = await JobService.listJobs();
      const targetJob = activeJobs.find(j => j.id === jobId);

      if (!targetJob) {
        return res.status(404).json({ error: `Requisition with ID ${jobId} not found.` });
      }

      const applyResult = await CareerAgentService.autoApply(profile, targetJob);
      return res.status(200).json(applyResult);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed during AI auto apply sequence.' });
    }
  }

  static async classifyEmail(req: Request, res: Response) {
    const { emailBody } = req.body;

    if (!emailBody) {
      return res.status(400).json({ error: 'Email body is required for classification.' });
    }

    try {
      const classification = await CareerAgentService.classifyEmail(emailBody);
      return res.status(200).json(classification);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to classify email.' });
    }
  }

  static async generateReply(req: Request, res: Response) {
    const { emailBody, profile, action } = req.body;

    if (!emailBody || !profile || !action) {
      return res.status(400).json({ error: 'emailBody, profile, and action are required to draft a response.' });
    }

    try {
      const replyText = await CareerAgentService.generateReply(emailBody, profile, action);
      return res.status(200).json({ reply: replyText });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to generate custom AI reply.' });
    }
  }
}
