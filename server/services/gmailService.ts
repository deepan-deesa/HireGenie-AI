/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { CandidateEmail } from '../types';

export class GmailService {
  private static getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  /**
   * Helper to parse base64url encoded string
   */
  private static decodeBase64Url(data: string): string {
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch (e) {
      console.error('Failed to decode body snippet:', e);
      return '';
    }
  }

  /**
   * Recursive helper to extract clean text body from parts
   */
  private static extractBody(payload: any): string {
    if (!payload) return '';
    if (payload.body && payload.body.data) {
      return this.decodeBase64Url(payload.body.data);
    }
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          return this.decodeBase64Url(part.body.data);
        }
        if (part.parts) {
          const body = this.extractBody(part);
          if (body) return body;
        }
      }
    }
    return '';
  }

  /**
   * Fetch, parse and classify user's real Gmail emails
   */
  static async fetchAndClassifyEmails(accessToken: string): Promise<any[]> {
    try {
      // 1. Fetch latest messages from Gmail
      const listRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!listRes.ok) {
        throw new Error(`Gmail API list failed: ${listRes.statusText}`);
      }

      const listData = await listRes.json();
      const messages = listData.messages || [];

      const parsedEmails: any[] = [];

      // 2. Fetch full details for each email in parallel
      const detailPromises = messages.map(async (msg: any) => {
        try {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (detailRes.ok) {
            return await detailRes.ok ? await detailRes.json() : null;
          }
        } catch (e) {
          console.error(`Error fetching email ${msg.id}:`, e);
        }
        return null;
      });

      const details = await Promise.all(detailPromises);

      // 3. Parse headers and body of each message
      for (const mail of details) {
        if (!mail) continue;

        const headers = mail.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || 'Unknown Date';
        const messageId = headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value || '';

        // Clean name/email from the 'From' header (e.g. "John Doe <john@example.com>")
        let senderName = fromHeader;
        let senderEmail = '';
        const match = fromHeader.match(/(.*?)\s*<(.*?)>/);
        if (match) {
          senderName = match[1].replace(/['"]/g, '').trim() || match[2];
          senderEmail = match[2].trim();
        } else if (fromHeader.includes('@')) {
          senderEmail = fromHeader.trim();
          senderName = fromHeader.split('@')[0];
        }

        const body = this.extractBody(mail.payload) || mail.snippet || '';

        parsedEmails.push({
          id: mail.id,
          threadId: mail.threadId,
          candidateName: senderName,
          candidateEmail: senderEmail,
          subject,
          snippet: mail.snippet || body.substring(0, 60),
          body,
          timestamp: new Date(dateHeader).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: !mail.labelIds?.includes('UNREAD'),
          direction: 'inbound',
          messageId,
        });
      }

      // 4. Classify and draft responses using Gemini AI in parallel
      const ai = this.getGeminiClient();
      const classifiedEmails = await Promise.all(
        parsedEmails.map(async (email) => {
          if (!ai) {
            // Fallback categorization if Gemini isn't available
            return {
              ...email,
              category: this.localClassify(email.body, email.subject),
              aiDraftSuggestion: `Hi ${email.candidateName},\n\nThank you for reaching out! We received your message and will get back to you shortly.\n\nBest regards,\nHireGenie AI Team`,
            };
          }

          try {
            const prompt = `
              Analyze the following incoming corporate/candidate email and perform two tasks:
              1. Classify the email into one of these exact categories: 'Interview', 'HR Reply', 'Offer', 'Spam', 'Marketing'.
              2. Draft a professional, helpful, and highly polished reply body as Alex Mercer, Lead Recruiter at HireGenie AI. Keep the tone friendly, modern, and concise (under 3 short paragraphs).

              --- EMAIL CONTENT ---
              Sender: ${email.candidateName} (${email.candidateEmail})
              Subject: ${email.subject}
              Body:
              ${email.body}

              Ensure that your final output is valid JSON matching this schema:
              {
                "category": "Interview" | "HR Reply" | "Offer" | "Spam" | "Marketing",
                "draft": "Your drafted reply body text here"
              }
            `;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    category: {
                      type: Type.STRING,
                      enum: ['Interview', 'HR Reply', 'Offer', 'Spam', 'Marketing'],
                      description: 'The classified category of the email',
                    },
                    draft: {
                      type: Type.STRING,
                      description: 'The generated reply draft body',
                    },
                  },
                  required: ['category', 'draft'],
                },
              },
            });

            if (response.text) {
              const resJson = JSON.parse(response.text.trim());
              return {
                ...email,
                category: resJson.category || 'HR Reply',
                aiDraftSuggestion: resJson.draft || '',
              };
            }
          } catch (e) {
            console.error(`Gemini classification failed for ${email.id}:`, e);
          }

          return {
            ...email,
            category: this.localClassify(email.body, email.subject),
            aiDraftSuggestion: `Hi ${email.candidateName},\n\nThank you for your response! We'd be glad to discuss details further.\n\nBest regards,\nHireGenie AI Team`,
          };
        })
      );

      return classifiedEmails;
    } catch (err) {
      console.error('Failed to fetch and classify live Gmail messages:', err);
      throw err;
    }
  }

  /**
   * Send outbound reply via real Gmail API
   */
  static async sendGmailResponse(
    accessToken: string,
    threadId: string,
    replyBody: string,
    originalEmail: any
  ): Promise<any> {
    try {
      const toEmail = originalEmail.candidateEmail || '';
      const subject = originalEmail.subject.toLowerCase().startsWith('re:')
        ? originalEmail.subject
        : `Re: ${originalEmail.subject}`;

      const mailParts = [
        `To: ${toEmail}`,
        `Subject: ${subject}`,
      ];

      if (originalEmail.messageId) {
        mailParts.push(`In-Reply-To: ${originalEmail.messageId}`);
        mailParts.push(`References: ${originalEmail.messageId}`);
      }

      mailParts.push('Content-Type: text/plain; charset=utf-8');
      mailParts.push('');
      mailParts.push(replyBody);

      const rawMessage = mailParts.join('\n');
      const base64Safe = Buffer.from(rawMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const sendRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: base64Safe,
            threadId: threadId,
          }),
        }
      );

      if (!sendRes.ok) {
        const errText = await sendRes.text();
        throw new Error(`Gmail API send failed: ${errText}`);
      }

      return await sendRes.json();
    } catch (err) {
      console.error('Failed to dispatch reply via Gmail API:', err);
      throw err;
    }
  }

  /**
   * High-fidelity rule based email category classifier fallback
   */
  private static localClassify(body: string, subject: string): string {
    const text = `${subject} ${body}`.toLowerCase();
    if (text.includes('interview') || text.includes('schedule') || text.includes('calendar') || text.includes('meet') || text.includes('zoom')) {
      return 'Interview';
    }
    if (text.includes('offer') || text.includes('compensation') || text.includes('salary') || text.includes('package')) {
      return 'Offer';
    }
    if (text.includes('unsubscribe') || text.includes('newsletter') || text.includes('promotion') || text.includes('sale')) {
      return 'Marketing';
    }
    if (text.includes('spam') || text.includes('viagra') || text.includes('winner') || text.includes('lottery') || text.includes('crypto')) {
      return 'Spam';
    }
    return 'HR Reply';
  }
}
