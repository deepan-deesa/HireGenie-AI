import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';

export class EmailController {
  static async listEmails(req: Request, res: Response) {
    try {
      const emails = await EmailService.listEmails();
      return res.status(200).json(emails);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to list emails.' });
    }
  }

  static async sendEmailShortcut(req: Request, res: Response) {
    const { candidateId, candidateName, subject, body } = req.body;

    if (!candidateId || !candidateName || !subject || !body) {
      return res.status(400).json({ error: 'Missing candidate identification or message content.' });
    }

    try {
      const email = await EmailService.sendEmailShortcut(candidateId, candidateName, subject, body);
      return res.status(201).json(email);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to dispatch email shortcut.' });
    }
  }

  static async respondToThread(req: Request, res: Response) {
    const { threadId } = req.params;
    const { replyBody } = req.body;

    if (!replyBody) {
      return res.status(400).json({ error: 'Reply content is required.' });
    }

    try {
      const emails = await EmailService.respondToThread(threadId, replyBody);
      return res.status(200).json(emails);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to reply to thread.' });
    }
  }

  static async generateAIDraft(req: Request, res: Response) {
    const { threadId } = req.params;

    try {
      const draft = await EmailService.generateAIDraft(threadId);
      return res.status(200).json({ draft });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to generate AI response draft.' });
    }
  }
}
