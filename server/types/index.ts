import { Candidate, JobOpening, CandidateEmail } from '../../src/types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

export type { Candidate, JobOpening, CandidateEmail };
