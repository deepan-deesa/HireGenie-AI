import { Request, Response } from 'express';
import { CandidateService } from '../services/candidateService';

export class CandidateController {
  static async listCandidates(req: Request, res: Response) {
    try {
      const candidates = await CandidateService.listCandidates();
      return res.status(200).json(candidates);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to list candidates.' });
    }
  }

  static async updateCandidateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    try {
      const candidate = await CandidateService.updateCandidateStatus(id, status);
      return res.status(200).json(candidate);
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Candidate not found.' });
    }
  }

  static async createCandidate(req: Request, res: Response) {
    const { name, email, phone, role, matchScore, experience, skills, status, avatarUrl, resumeUrl, aiSummary, keyHighlights } = req.body;

    if (!name || !email || !role || !experience || !skills || !status) {
      return res.status(400).json({ error: 'Missing required candidate registration parameters.' });
    }

    try {
      const candidate = await CandidateService.createCandidate({
        name,
        email,
        phone: phone || '',
        role,
        matchScore: matchScore || 70,
        experience,
        skills,
        status,
        avatarUrl,
        resumeUrl,
        aiSummary: aiSummary || '',
        keyHighlights: keyHighlights || []
      });
      return res.status(201).json(candidate);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to register candidate.' });
    }
  }

  static async runScreeningAgent(req: Request, res: Response) {
    const { id } = req.params;
    const { jdText } = req.body;

    if (!jdText) {
      return res.status(400).json({ error: 'Job description text (jdText) is required for AI screening.' });
    }

    try {
      const updatedCandidate = await CandidateService.runScreeningAgent(id, jdText);
      return res.status(200).json(updatedCandidate);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'AI Screening operation failed.' });
    }
  }
}
