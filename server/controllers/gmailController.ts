/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { GmailService } from '../services/gmailService';

export class GmailController {
  /**
   * Fetches the user's real Gmail inbox and classifies messages using Gemini
   */
  static async listGmailEmails(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'OAuth Bearer access token is required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const emails = await GmailService.fetchAndClassifyEmails(token);
      return res.status(200).json(emails);
    } catch (error: any) {
      console.error('Error listing Gmail emails:', error);
      return res.status(500).json({ error: error.message || 'Failed to sync with Gmail.' });
    }
  }

  /**
   * Dispatches a real response reply via Gmail API on behalf of the user
   */
  static async replyToGmailEmail(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    const { threadId } = req.params;
    const { replyBody, originalEmail } = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'OAuth Bearer access token is required.' });
    }

    if (!replyBody || !originalEmail) {
      return res.status(400).json({ error: 'Reply body and original email metadata are required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const result = await GmailService.sendGmailResponse(token, threadId, replyBody, originalEmail);
      return res.status(200).json({ success: true, result });
    } catch (error: any) {
      console.error('Error replying to Gmail thread:', error);
      return res.status(500).json({ error: error.message || 'Failed to dispatch Gmail reply.' });
    }
  }
}
