import { getPrismaClient, dbFallback } from '../config/db';
import { CandidateEmail } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

export class EmailService {
  private static getPrisma() {
    return getPrismaClient();
  }

  private static getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  static async listEmails(): Promise<CandidateEmail[]> {
    const prisma = this.getPrisma();

    if (prisma) {
      const dbEmails = await prisma.candidateEmail.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return dbEmails.map(e => ({
        id: e.id,
        candidateId: e.candidateId,
        candidateName: e.candidateName,
        subject: e.subject,
        snippet: e.snippet,
        body: e.body,
        timestamp: e.timestamp,
        isRead: e.isRead,
        direction: e.direction as any,
        aiDraftSuggestion: e.aiDraftSuggestion || undefined
      }));
    } else {
      return [...dbFallback.emails];
    }
  }

  static async sendEmailShortcut(candidateId: string, candidateName: string, subject: string, body: string): Promise<CandidateEmail> {
    const prisma = this.getPrisma();
    const timestamp = 'Just Now';
    const snippet = body.length > 60 ? body.substring(0, 60) + '...' : body;

    if (prisma) {
      const created = await prisma.candidateEmail.create({
        data: {
          candidateId,
          candidateName,
          subject,
          snippet,
          body,
          timestamp,
          isRead: true,
          direction: 'outbound'
        }
      });
      return {
        id: created.id,
        candidateId: created.candidateId,
        candidateName: created.candidateName,
        subject: created.subject,
        snippet: created.snippet,
        body: created.body,
        timestamp: created.timestamp,
        isRead: created.isRead,
        direction: 'outbound'
      };
    } else {
      const newMail: CandidateEmail = {
        id: `email-${Date.now()}`,
        candidateId,
        candidateName,
        subject,
        snippet,
        body,
        timestamp,
        isRead: true,
        direction: 'outbound'
      };
      dbFallback.emails.unshift(newMail);
      return newMail;
    }
  }

  static async respondToThread(threadId: string, replyBody: string): Promise<CandidateEmail[]> {
    const prisma = this.getPrisma();
    const timestamp = 'Just Now';
    const snippet = replyBody.length > 60 ? replyBody.substring(0, 60) + '...' : replyBody;

    if (prisma) {
      // Find original thread
      const original = await prisma.candidateEmail.findUnique({ where: { id: threadId } });
      if (!original) {
        throw new Error('Thread not found');
      }

      // Create outbound response
      const createdResponse = await prisma.candidateEmail.create({
        data: {
          candidateId: original.candidateId,
          candidateName: original.candidateName,
          subject: `Re: ${original.subject}`,
          snippet,
          body: replyBody,
          timestamp,
          isRead: true,
          direction: 'outbound'
        }
      });

      // Mark original read and clear AI Draft
      await prisma.candidateEmail.update({
        where: { id: threadId },
        data: { isRead: true, aiDraftSuggestion: null }
      });

      return this.listEmails();
    } else {
      const target = dbFallback.emails.find(e => e.id === threadId);
      if (!target) {
        throw new Error('Thread not found');
      }

      const responseMail: CandidateEmail = {
        id: `email-reply-${Date.now()}`,
        candidateId: target.candidateId,
        candidateName: target.candidateName,
        subject: `Re: ${target.subject}`,
        snippet,
        body: replyBody,
        timestamp,
        isRead: true,
        direction: 'outbound'
      };

      // Update original
      target.isRead = true;
      target.aiDraftSuggestion = undefined;

      dbFallback.emails.unshift(responseMail);
      return [...dbFallback.emails];
    }
  }

  static async generateAIDraft(threadId: string): Promise<string> {
    const prisma = this.getPrisma();
    
    let original: CandidateEmail | undefined;
    if (prisma) {
      const dbEmail = await prisma.candidateEmail.findUnique({ where: { id: threadId } });
      if (dbEmail) {
        original = {
          id: dbEmail.id,
          candidateId: dbEmail.candidateId,
          candidateName: dbEmail.candidateName,
          subject: dbEmail.subject,
          snippet: dbEmail.snippet,
          body: dbEmail.body,
          timestamp: dbEmail.timestamp,
          isRead: dbEmail.isRead,
          direction: dbEmail.direction as any,
          aiDraftSuggestion: dbEmail.aiDraftSuggestion || undefined
        };
      }
    } else {
      original = dbFallback.emails.find(e => e.id === threadId);
    }

    if (!original) {
      throw new Error('Original email not found');
    }

    const ai = this.getGeminiClient();
    if (ai) {
      try {
        const prompt = `
          Draft a professional, helpful, and polite response email as an expert Lead Recruiter (Alex Mercer) at HireGenie AI.
          
          --- ORIGINAL EMAIL ---
          Sender: ${original.candidateName}
          Subject: ${original.subject}
          Body:
          ${original.body}
          
          Generate ONLY the email body response. Keep the tone premium, polite, and minimal.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt
        });

        const draft = response.text || '';
        if (draft) {
          // Store draft in database
          if (prisma) {
            await prisma.candidateEmail.update({
              where: { id: threadId },
              data: { aiDraftSuggestion: draft }
            });
          } else {
            const idx = dbFallback.emails.findIndex(e => e.id === threadId);
            dbFallback.emails[idx].aiDraftSuggestion = draft;
          }
          return draft;
        }
      } catch (err) {
        console.error('Gemini draft suggestion failed:', err);
      }
    }

    // High fidelity backup draft
    const genericDraft = `Hi ${original.candidateName.split(' ')[0]},
    
Thank you for your response! We'd be absolutely thrilled to schedule a discussion.
    
Could we schedule a convenient time tomorrow or the following day? Let me know your general availability and I'll send over a calendar invitation.
    
Best regards,
Alex Mercer
Lead Recruiter, HireGenie AI`;

    if (prisma) {
      await prisma.candidateEmail.update({
        where: { id: threadId },
        data: { aiDraftSuggestion: genericDraft }
      });
    } else {
      const idx = dbFallback.emails.findIndex(e => e.id === threadId);
      dbFallback.emails[idx].aiDraftSuggestion = genericDraft;
    }
    return genericDraft;
  }
}
