/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Theme = 'light' | 'dark';

export type AppView = 'landing' | 'login' | 'dashboard';

export type DashboardTab = 'overview' | 'jobs' | 'candidates' | 'gmail' | 'agent' | 'settings' | 'profile';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: 'Active' | 'Draft' | 'Closed';
  applicantsCount: number;
  postedDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  matchScore: number; // Out of 100
  experience: string;
  skills: string[];
  status: 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  avatarUrl?: string;
  resumeUrl?: string;
  appliedDate: string;
  aiSummary: string;
  keyHighlights: string[];
}

export interface CandidateEmail {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  direction: 'inbound' | 'outbound';
  aiDraftSuggestion?: string;
  category?: 'Interview' | 'HR Reply' | 'Offer' | 'Spam' | 'Marketing';
  messageId?: string;
  threadId?: string;
}

export interface SitemapNode {
  name: string;
  description: string;
  children?: SitemapNode[];
}

export interface UserFlowStep {
  step: number;
  title: string;
  actor: 'User' | 'System' | 'AI Agent' | 'Gmail';
  description: string;
}
