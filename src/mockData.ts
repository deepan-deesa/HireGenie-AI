/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobOpening, Candidate, CandidateEmail } from './types';

export const mockJobs: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Senior Staff AI Research Scientist',
    department: 'Core Intelligence',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 42,
    postedDate: '2026-07-10'
  },
  {
    id: 'job-2',
    title: 'Senior Frontend Architect',
    department: 'Product Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 128,
    postedDate: '2026-07-15'
  },
  {
    id: 'job-3',
    title: 'Director of Talent & Culture',
    department: 'People Operations',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 19,
    postedDate: '2026-07-18'
  },
  {
    id: 'job-4',
    title: 'Security Operations Engineer',
    department: 'Infrastructure Security',
    location: 'Remote',
    type: 'Contract',
    status: 'Draft',
    applicantsCount: 0,
    postedDate: '2026-07-20'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+1 (555) 019-2834',
    role: 'Senior Staff AI Research Scientist',
    matchScore: 96,
    experience: '8 years at OpenAI & Meta AI Research',
    skills: ['PyTorch', 'Transformers', 'LLM Alignment', 'Distributed Training', 'Python'],
    status: 'Screening',
    appliedDate: '2026-07-19',
    aiSummary: 'Sarah possesses a brilliant background in deep learning, heavy experience building autoregressive systems, and has a proven track record publishing at NeurIPS. Her technical expertise aligns beautifully with our core LLM initiatives.',
    keyHighlights: [
      'Authored pioneering work on tokenization and alignment optimization.',
      'Designed distributed learning frameworks scaling up to 10k GPUs.',
      'BS & MS in Computer Science from Stanford University.'
    ]
  },
  {
    id: 'cand-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@techcorp.dev',
    phone: '+1 (555) 304-9122',
    role: 'Senior Frontend Architect',
    matchScore: 92,
    experience: '6 years as Lead UI Engineer at Stripe & Vercel',
    skills: ['React 19', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Web Performance'],
    status: 'Interview',
    appliedDate: '2026-07-18',
    aiSummary: 'Marcus is an exceptional design-oriented system engineer with an extreme obsession with pixel-perfection, UI animations, and web accessibility standards. He built Stripe\'s latest dashboard modules.',
    keyHighlights: [
      'Led the migration of multi-tenant enterprise core to React 19 Server Components.',
      'Achieved a 40% improvement in First Contentful Paint metrics across core properties.',
      'Active contributor to major web design system libraries.'
    ]
  },
  {
    id: 'cand-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@netlink.ru',
    phone: '+1 (555) 831-2745',
    role: 'Senior Frontend Architect',
    matchScore: 84,
    experience: '5 years senior developer at GitLab & Shopify',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST/GraphQL', 'Jest'],
    status: 'Screening',
    appliedDate: '2026-07-20',
    aiSummary: 'Elena shows strong product engineering fundamentals, an elegant code writing style, and has great unit test coverage discipline. Minor gap in modern server component frameworks, but highly adaptable.',
    keyHighlights: [
      'Managed a core UI overhaul boosting candidate conversion rates by 15%.',
      'Developed and maintained reusable component libraries for internal teams.'
    ]
  },
  {
    id: 'cand-4',
    name: 'David Kojo',
    email: 'david.kojo@freelance.co',
    phone: '+1 (555) 492-3811',
    role: 'Director of Talent & Culture',
    matchScore: 89,
    experience: '10 years HR Lead at Google & Notion',
    skills: ['Strategic Recruiting', 'Compensation & Benefits', 'Conflict Resolution', 'DEI Initiatives'],
    status: 'Offer',
    appliedDate: '2026-07-14',
    aiSummary: 'David is a consummate professional with profound experience scaling hyper-growth startups from 50 to 500+ employees. Empathic leader with strong analytical, data-driven approach to organizational health.',
    keyHighlights: [
      'Overhauled Google NY\'s technical intern program, boosting return offers by 30%.',
      'Architected Notion\'s performance feedback and promotion rubrics.'
    ]
  },
  {
    id: 'cand-5',
    name: 'Alice Bradley',
    email: 'alice.b@outlook.com',
    phone: '+1 (555) 902-1254',
    role: 'Security Operations Engineer',
    matchScore: 68,
    experience: '3 years at Cloudflare Security Team',
    skills: ['AWS Security', 'Network Protocols', 'Penetration Testing', 'Incident Response'],
    status: 'Rejected',
    appliedDate: '2026-07-16',
    aiSummary: 'Alice displays strong foundation in junior SecOps, but lacks the architectural seniority required for leading enterprise multi-region threat protection modeling.',
    keyHighlights: [
      'Monitored real-time intrusion events with 100% compliance SLA.',
      'Assisted in quarterly ISO-27001 auditing procedures.'
    ]
  }
];

export const mockEmails: CandidateEmail[] = [
  {
    id: 'email-1',
    candidateId: 'cand-1',
    candidateName: 'Sarah Jenkins',
    subject: 'Next Steps - Core Intelligence Role at HireGenie',
    snippet: 'Hi Sarah, thank you for your application! We were incredibly impressed by your PyTorch research paper...',
    body: `Dear Sarah,

Thank you so much for your application for the Senior Staff AI Research Scientist position at HireGenie. We were incredibly impressed by your background, particularly your pioneering work on autoregressive model alignment that was published in NeurIPS last year.

Our core deep learning team has reviewed your application and is eager to discuss how your experience in scaling distributed training runs could assist our next-generation models.

Are you available for a 30-minute introductory call this week on Thursday or Friday? Let us know what times work best for you.

Warm regards,
Alex Mercer
Lead Recruiter, HireGenie AI`,
    timestamp: '10:30 AM',
    isRead: false,
    direction: 'outbound'
  },
  {
    id: 'email-2',
    candidateId: 'cand-1',
    candidateName: 'Sarah Jenkins',
    subject: 'Re: Next Steps - Core Intelligence Role at HireGenie',
    snippet: 'Hi Alex, absolutely! I am delighted to hear back. Thursday at 2:00 PM PST works perfectly...',
    body: `Hi Alex,

Thank you for reaching out! I'm very excited about HireGenie AI's mission and would love to chat.

I read your team's engineering blog post on self-correction algorithms and found it very aligned with some of the projects I led during my time at OpenAI.

Thursday at 2:00 PM PST works perfectly for me. Otherwise, I can also do Friday morning anytime before 11:30 AM PST. 

Looking forward to our conversation!

Best,
Sarah Jenkins`,
    timestamp: '11:15 AM',
    isRead: false,
    direction: 'inbound',
    aiDraftSuggestion: `Hi Sarah,

That's excellent! I have booked us in for Thursday at 2:00 PM PST. A calendar invite has been sent with the Google Meet link.

I am really looking forward to deep diving into our self-correction architectures with you.

Speak soon,
Alex`
  },
  {
    id: 'email-3',
    candidateId: 'cand-2',
    candidateName: 'Marcus Chen',
    subject: 'Scheduling Technical Deep-Dive Interview',
    snippet: 'Hi Marcus, following our great chat, we would love to schedule your 60-minute technical design call...',
    body: `Hi Marcus,

It was absolute pleasure chatting with you yesterday. Your work overhaul on Stripe's core dashboard UI is exactly the kind of design-engineering rigor we practice at HireGenie AI.

For the next step, we would like to schedule a 60-minute Technical Architecture session where you can walk us through one of your complex open-source state-management or micro-interaction designs.

Could you share 2-3 availability slots for next Tuesday or Wednesday?

Best,
Alex Mercer`,
    timestamp: 'Yesterday',
    isRead: true,
    direction: 'outbound'
  }
];
