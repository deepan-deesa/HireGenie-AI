/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, Sparkles, Settings, Play, ChevronRight, CheckCircle2, Shield, Loader2, 
  ArrowRight, User, Target, Briefcase, Send, Terminal, Layers, Inbox, 
  AlertCircle, Check, FileText, Sliders, DollarSign, MapPin, RotateCcw, 
  Power, ArrowUpRight, Brain, ExternalLink, Mail, X
} from 'lucide-react';
import { Candidate, Theme } from '../types';

interface AgentTabProps {
  candidates: Candidate[];
  theme?: Theme;
}

export interface UserCareerProfile {
  name: string;
  role: string;
  experienceYears: number;
  skills: string[];
  education: string;
  summary: string;
}

export interface CareerPreferences {
  targetRoles: string[];
  minSalary: number;
  workMode: 'Remote' | 'Hybrid' | 'Onsite' | 'Any';
  location: string;
  industry: string;
}

interface SimulatedInboxEmail {
  id: string;
  senderName: string;
  senderCompany: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  category?: 'Interview Request' | 'Offer' | 'Rejection' | 'Inquiry' | 'Other';
  urgency?: 'High' | 'Medium' | 'Low';
  aiDraft?: string;
}

export default function AgentTab({ candidates, theme = 'light' }: AgentTabProps) {
  // Navigation & Sub-Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'matching' | 'apply' | 'inbox'>('profile');
  
  // Master Autonomous Agent Toggle
  const [agentActive, setAgentActive] = useState<boolean>(true);

  // Profile & Preferences State
  const [resumeInput, setResumeInput] = useState<string>(
    `ALEX MERCER
Principal Full-Stack Architect
alex.mercer@hiregeniedev.io | +1 (555) 234-9876 | San Francisco, CA

PROFESSIONAL SUMMARY
Highly accomplished Full-Stack Software Architect with 8+ years of expertise designing, constructing, and optimizing cloud-native SaaS systems. Specializes in React 19, Node.js, PostgreSQL, and LLM orchestration. Proven track record leading UI architectural refreshes at top startups and maintaining pixel-perfect typography.

CORE SKILLS
- Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
- Frontend: React 19, Next.js (App Router), Tailwind CSS, Redux Toolkit, Framer Motion
- Backend & Cloud: Node.js, Express, Fastify, Prisma ORM, PostgreSQL, AWS, Docker
- AI Integration: OpenAI SDK, Gemini API, LangChain, vector databases (Pinecone)`
  );
  
  const [userProfile, setUserProfile] = useState<UserCareerProfile>({
    name: 'Alex Mercer',
    role: 'Principal Full-Stack Architect',
    experienceYears: 8,
    skills: ['React 19', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'AWS', 'Gemini API'],
    education: 'M.S. in Computer Science, Stanford University',
    summary: 'Highly accomplished Full-Stack Software Architect with 8+ years of expertise designing and constructing high-scale SaaS systems.'
  });

  const [preferences, setPreferences] = useState<CareerPreferences>({
    targetRoles: ['Senior Staff Architect', 'Lead Frontend Engineer', 'Principal Full Stack Developer'],
    minSalary: 165000,
    workMode: 'Remote',
    location: 'San Francisco, CA',
    industry: 'Artificial Intelligence & DevTools'
  });

  // Loading States
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  const [isMatchingJobs, setIsMatchingJobs] = useState<boolean>(false);
  const [isClassifyingEmails, setIsClassifyingEmails] = useState<boolean>(false);

  // Job Matching Output
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);

  // Apply Engine States
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applyCoverLetter, setApplyCoverLetter] = useState<string>('');
  const [applyRefId, setApplyRefId] = useState<string>('');
  const [applyTerminalLogs, setApplyTerminalLogs] = useState<string[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-3']); // mock initially applied

  // Email Inbox State with detailed initial recruiter outreach messages
  const [inboxEmails, setInboxEmails] = useState<SimulatedInboxEmail[]>([
    {
      id: 'msg-1',
      senderName: 'Clara Oswald',
      senderCompany: 'Stripe API Core',
      subject: 'Interview Schedule: Staff Frontend Engineer Requisition',
      body: `Hi Alex,\n\nOur Stripe UI Systems team reviewed your profile and resume. We are extremely impressed by your extensive history leading responsive design refactors and your command of React and modern micro-frontends.\n\nWe would love to schedule a 45-minute technical deep dive session next week.\n\nCould you please let me know if Wednesday or Thursday works for a Google Meet conversation?\n\nBest regards,\nClara Oswald`,
      timestamp: 'Just Now',
      isRead: false
    },
    {
      id: 'msg-2',
      senderName: 'Devon Keats',
      senderCompany: 'OpenAI Developer Platform',
      subject: 'Opportunity: Developer Relations Lead (AI Engines)',
      body: `Hey Alex,\n\nCame across your GitHub contributions to LLM pipeline UI layers. It looks like you've got an exceptional blend of heavy full-stack product work combined with an understanding of model orchestration APIs.\n\nWe are actively scaling our Developer Relations team and need technical leaders who can construct production-grade demo applications.\n\nLet me know if you are open to a brief chat!\n\nBest,\nDevon Keats`,
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: 'msg-3',
      senderName: 'Tricia Vance',
      senderCompany: 'Linear App',
      subject: 'Update on application: Senior Product Designer / Developer',
      body: `Hi Alex,\n\nThank you for applying to Linear. We wanted to let you know that we appreciate the high quality of your portfolio and your emphasis on clean, pixel-perfect visual styling.\n\nUnfortunately, we have decided to move forward with candidates whose professional backgrounds focus more heavily on low-level native desktop engine layouts at this stage.\n\nBest,\nTricia Vance`,
      timestamp: 'Yesterday',
      isRead: true
    }
  ]);

  const [selectedInboxEmail, setSelectedInboxEmail] = useState<SimulatedInboxEmail>(inboxEmails[0]);
  const [replyGoal, setReplyGoal] = useState<'Accept & Schedule' | 'Politely Decline' | 'Request Information'>('Accept & Schedule');
  const [customDraftReply, setCustomDraftReply] = useState<string>('');
  const [isGeneratingReply, setIsGeneratingReply] = useState<boolean>(false);
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);

  // Trigger auto job matching upon entering matching tab or when profile changes
  useEffect(() => {
    if (activeTab === 'matching' && matchedJobs.length === 0) {
      triggerJobMatching();
    }
  }, [activeTab]);

  // Synchronize first email selection
  useEffect(() => {
    const updated = inboxEmails.find(m => m.id === selectedInboxEmail?.id);
    if (updated) {
      setSelectedInboxEmail(updated);
    }
  }, [inboxEmails]);

  // 1. Trigger Resume Parsing via Gemini Backend
  const handleAnalyzeResume = async () => {
    if (!resumeInput.trim()) return;
    setIsParsingResume(true);
    try {
      const response = await fetch('/api/agent/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeInput })
      });
      if (response.ok) {
        const data: UserCareerProfile = await response.json();
        setUserProfile(data);
        setPreferences(prev => ({
          ...prev,
          targetRoles: [data.role, `Senior ${data.role}`, `Lead ${data.role}`]
        }));
        setMatchedJobs([]);
      }
    } catch (err) {
      console.error('Failed to parse resume:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  // 2. Trigger Auto-Job Matching with Backend Service
  const triggerJobMatching = async () => {
    setIsMatchingJobs(true);
    try {
      const response = await fetch('/api/agent/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          preferences: preferences
        })
      });
      if (response.ok) {
        const matches = await response.json();
        setMatchedJobs(matches);
      }
    } catch (err) {
      console.error('Failed to query job matches:', err);
    } finally {
      setIsMatchingJobs(false);
    }
  };

  // 3. Trigger Auto Apply Pipeline with Live Logs Simulation & Cover Letter
  const runAutoApplyPipeline = async (jobId: string, jobTitle: string) => {
    setApplyingJobId(jobId);
    setShowApplyModal(true);
    setApplyTerminalLogs([]);
    setApplyCoverLetter('');
    
    const logs = [
      `[INITIATING AUTO-APPLY ENGINE] Matching job requisition ID: ${jobId}`,
      `[AGENT COGNITION] Evaluating alignment for candidate profile: ${userProfile.name}...`,
      `[AI METRIC ALIGNMENT] Core skills match calculated at high relevance. Technology vectorizing complete.`,
      `[GEMINI-2.5-FLASH] Formulating hyper-custom cover letter emphasizing skills: ${userProfile.skills.slice(0, 4).join(', ')}...`,
      `[COMPOSING COVER LETTER] Refining text to meet executive, Stripe-inspired copywriting specifications...`,
      `[DRAFT SUCCESS] Cover letter structured and saved in local app state.`,
      `[SUBMISSION INTEGRATION] Bundling package (Parsed Resume Metadata + Tailored Cover Letter + Contact Payload)...`,
      `[API CALL] Dispatching requisition application to partner gateway integrations...`,
      `[SUCCESS] Application uploaded successfully! Reference signature saved.`,
      `[Autonomous Agent Completed Application Pipeline] ✅`
    ];

    try {
      const response = await fetch('/api/agent/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          jobId: jobId
        })
      });
      if (response.ok) {
        const result = await response.json();
        setApplyCoverLetter(result.coverLetter);
        setApplyRefId(result.referenceId);
      }
    } catch (err) {
      console.error('Failed cover letter generation:', err);
    }

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 350));
      setApplyTerminalLogs(prev => [...prev, logs[i]]);
    }

    setAppliedJobIds(prev => [...prev, jobId]);
    setApplyingJobId(null);
  };

  // 4. Trigger Email Ingestion & Intelligent AI Classification
  const runEmailClassifier = async () => {
    setIsClassifyingEmails(true);
    try {
      const updatedList = await Promise.all(
        inboxEmails.map(async (mail) => {
          const response = await fetch('/api/agent/classify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailBody: mail.body })
          });
          if (response.ok) {
            const data = await response.json();
            return {
              ...mail,
              category: data.category,
              urgency: data.urgency
            };
          }
          return mail;
        })
      );
      setInboxEmails(updatedList);
    } catch (err) {
      console.error('Failed classification sequence:', err);
    } finally {
      setIsClassifyingEmails(false);
    }
  };

  // 5. Generate AI draft replies
  const handleGenerateReplyDraft = async () => {
    if (!selectedInboxEmail) return;
    setIsGeneratingReply(true);
    setCustomDraftReply('');
    try {
      const response = await fetch('/api/agent/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailBody: selectedInboxEmail.body,
          profile: userProfile,
          action: replyGoal
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCustomDraftReply(data.reply);
      }
    } catch (err) {
      console.error('Draft generation error:', err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // 6. Send draft reply simulation
  const handleSendDraftResponse = () => {
    if (!customDraftReply.trim()) return;
    setIsSendingReply(true);
    setTimeout(() => {
      const updatedEmails = inboxEmails.map(mail => {
        if (mail.id === selectedInboxEmail.id) {
          return {
            ...mail,
            isRead: true,
            aiDraft: customDraftReply,
            subject: `Replied: ${mail.subject}`
          };
        }
        return mail;
      });
      setInboxEmails(updatedEmails);
      setIsSendingReply(false);
      setCustomDraftReply('');
    }, 1200);
  };

  const matchRateAverage = matchedJobs.length > 0 
    ? Math.round(matchedJobs.reduce((acc, curr) => acc + curr.matchScore, 0) / matchedJobs.length)
    : 92;

  const isLight = theme === 'light';

  // Styles
  const cardBg = isLight ? 'bg-white border-neutral-200 shadow-md shadow-neutral-100/50' : 'bg-neutral-900 border-neutral-850';
  const panelBg = isLight ? 'bg-neutral-50 border-neutral-200/60' : 'bg-neutral-950 border-neutral-850';
  const inputBg = isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-indigo-500' : 'bg-neutral-950 border-neutral-800 text-white focus:border-indigo-500';

  return (
    <div className={`space-y-6 font-sans transition-colors duration-200 text-left ${isLight ? 'text-neutral-800' : 'text-white'}`}>
      
      {/* Top Professional Control Dashboard Panel */}
      <div className={`${cardBg} p-6 rounded-2xl relative overflow-hidden text-left`}>
        <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-neutral-100">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <h1 className="text-sm font-bold text-neutral-800 font-display">HireGenie Autopilot Career Agent</h1>
            </div>
            <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed max-w-2xl">
              An AI-powered co-pilot for elite professionals. Your agent automatically reviews active system jobs, validates tech gaps, prepares custom-tailored cover letters, applies autonomously, and drafts verified responses to incoming recruiter emails.
            </p>
          </div>

          {/* Autonomous Status Engine Switch */}
          <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl self-start md:self-auto">
            <div className="flex flex-col text-left">
              <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-bold font-mono">Agent State</span>
              <span className={`text-[10px] font-bold ${agentActive ? 'text-emerald-600' : 'text-neutral-400'}`}>
                {agentActive ? 'ACTIVE & MONITORED' : 'PAUSED'}
              </span>
            </div>
            <button
              onClick={() => setAgentActive(!agentActive)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                agentActive ? 'bg-indigo-600' : 'bg-neutral-350'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  agentActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className={`border p-3.5 rounded-xl ${panelBg}`}>
            <span className="block text-[8px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Profile Persona</span>
            <span className="block text-xs font-bold text-neutral-700 mt-1 truncate">{userProfile.name}</span>
          </div>
          <div className={`border p-3.5 rounded-xl ${panelBg}`}>
            <span className="block text-[8px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Average Match Fit</span>
            <span className="block text-xs font-bold text-indigo-600 mt-1">{matchRateAverage}% Match</span>
          </div>
          <div className={`border p-3.5 rounded-xl ${panelBg}`}>
            <span className="block text-[8px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Dispatched Applications</span>
            <span className="block text-xs font-bold text-neutral-700 mt-1">{appliedJobIds.length} Roles</span>
          </div>
          <div className={`border p-3.5 rounded-xl ${panelBg}`}>
            <span className="block text-[8px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Classification Engine</span>
            <span className="block text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              Gemini Flash 2.5
            </span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Sub-Tabs */}
      <div className="flex border-b gap-2 border-neutral-100">
        {[
          { key: 'profile', label: 'Profile & Resume Analyzer', icon: User },
          { key: 'matching', label: 'Auto Job Matcher', icon: Target },
          { key: 'apply', label: 'Auto-Apply Queue', icon: Briefcase },
          { key: 'inbox', label: 'Inbox Classifier & Reply', icon: Inbox }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/20'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. Profile & Resume Parser */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Resume Upload & Pasting Box */}
          <div className={`${cardBg} lg:col-span-7 p-6 rounded-2xl flex flex-col justify-between space-y-4`}>
            <div className="space-y-1 text-left">
              <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 font-display">
                <FileText className="w-4 h-4 text-indigo-600" />
                Resume Analysis Engine
              </h3>
              <p className="text-[10px] text-neutral-400 font-semibold">Paste your raw technical resume. Our AI parser extracts experience benchmarks, credentials, and technical skills.</p>
            </div>

            <textarea
              rows={12}
              value={resumeInput}
              onChange={(e) => setResumeInput(e.target.value)}
              className={`w-full border p-4 rounded-xl outline-none transition-all font-mono text-[11px] leading-relaxed ${inputBg}`}
              placeholder="Paste your markdown or plain text CV here..."
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAnalyzeResume}
                disabled={isParsingResume || !resumeInput.trim()}
                className="w-full sm:w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isParsingResume ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Reparse with Gemini AI</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setResumeInput('')}
                className="w-full sm:w-1/2 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 border border-neutral-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Clear Slate
              </button>
            </div>
          </div>

          {/* Parsed Output & Targeted Preferences */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Parsed Profile Data Box */}
            <div className={`${cardBg} p-6 rounded-2xl space-y-4`}>
              <div className="flex items-center justify-between border-b pb-3 border-neutral-100">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Parsed Candidate Persona</h4>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Extracted
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-left">
                <div>
                  <span className="text-[9px] text-neutral-400 block font-bold font-mono uppercase">Identified Name</span>
                  <span className="text-xs font-extrabold text-neutral-800 block mt-0.5">{userProfile.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-bold font-mono uppercase">Target Role</span>
                  <span className="text-xs font-bold text-neutral-700 block mt-0.5">{userProfile.role}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-bold font-mono uppercase">Industry Experience</span>
                  <span className="text-xs font-bold text-neutral-700 block mt-0.5">{userProfile.experienceYears} Years Benchmarked</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-bold font-mono uppercase">Credentials</span>
                  <span className="text-xs font-bold text-neutral-700 block mt-0.5">{userProfile.education}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-bold font-mono uppercase mb-1.5">Extracted Vectors</span>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100/60 text-[9px] text-indigo-700 rounded font-bold font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-bold font-mono uppercase">Gemini Bio Summary</span>
                  <p className="text-[11px] text-neutral-500 leading-relaxed mt-1 italic font-medium">"{userProfile.summary}"</p>
                </div>
              </div>
            </div>

            {/* Targeted Preferences Box */}
            <div className={`${cardBg} p-6 rounded-2xl space-y-4`}>
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Career Strategy Controls</h4>
              </div>

              <div className="space-y-4 text-xs text-left">
                <div>
                  <div className="flex items-center justify-between mb-1.5 font-medium">
                    <span className="text-[10px] text-neutral-400">Minimum Annual Salary</span>
                    <span className="text-indigo-600 font-mono font-bold">${preferences.minSalary.toLocaleString()} / yr</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="250000"
                    step="5000"
                    value={preferences.minSalary}
                    onChange={(e) => setPreferences(prev => ({ ...prev, minSalary: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 mb-1 font-mono uppercase">Work Mode</label>
                    <select
                      value={preferences.workMode}
                      onChange={(e: any) => setPreferences(prev => ({ ...prev, workMode: e.target.value }))}
                      className={`w-full border text-xs p-2.5 rounded-xl outline-none font-semibold ${inputBg}`}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Any">Any Mode</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-400 mb-1 font-mono uppercase">Location</label>
                    <input
                      type="text"
                      value={preferences.location}
                      onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full border text-xs p-2.5 rounded-xl outline-none font-medium ${inputBg}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 mb-1 font-mono uppercase">Target Sectors</label>
                  <input
                    type="text"
                    value={preferences.industry}
                    onChange={(e) => setPreferences(prev => ({ ...prev, industry: e.target.value }))}
                    className={`w-full border text-xs p-2.5 rounded-xl outline-none font-medium ${inputBg}`}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Auto Job Matcher */}
      {activeTab === 'matching' && (
        <div className="space-y-4">
          <div className={`${cardBg} p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left`}>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-800 font-display">Neural Alignment Match Engine</h3>
              <p className="text-[10px] text-neutral-400 font-semibold">Cross-analyzes technical requirements from database requisitions against your parsed experience levels and skills.</p>
            </div>
            <button
              onClick={triggerJobMatching}
              disabled={isMatchingJobs}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isMatchingJobs ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Matching Analysis</span>
                </>
              )}
            </button>
          </div>

          {isMatchingJobs ? (
            <div className={`${cardBg} rounded-2xl p-16 text-center space-y-3`}>
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <div className="text-xs font-bold text-neutral-500 font-mono">Running vector similarity alignments...</div>
              <p className="text-[10px] text-neutral-400 max-w-sm mx-auto font-medium">Evaluating skills overlap, salary benchmarks, and workmode guidelines across all live system jobs.</p>
            </div>
          ) : matchedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedJobs.map((match) => {
                const jobTitle = match.jobId === 'job-1' ? 'Staff AI Architect' : match.jobId === 'job-2' ? 'Senior UI Engineer' : match.jobId === 'job-3' ? 'Director of Frontend Platforms' : 'Security Architect';
                const jobDept = match.jobId === 'job-1' ? 'AI Intelligence' : match.jobId === 'job-2' ? 'Platform Systems' : match.jobId === 'job-3' ? 'Core Dev' : 'Infrastructure Security';
                const jobLoc = match.jobId === 'job-1' ? 'San Francisco, CA' : match.jobId === 'job-2' ? 'Remote' : 'New York, NY';

                const scoreColor = match.matchScore >= 90 
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                  : 'text-indigo-700 bg-indigo-50 border-indigo-100';

                return (
                  <div key={match.jobId} className={`${cardBg} p-5 rounded-2xl flex flex-col justify-between space-y-4 text-left`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b pb-3 border-neutral-100">
                        <div className="space-y-1 text-left">
                          <h4 className="text-xs font-bold text-neutral-850 font-display">{jobTitle}</h4>
                          <span className="text-[9px] text-neutral-400 font-semibold font-mono">{jobDept} • {jobLoc}</span>
                        </div>
                        <div className={`px-2 py-1 border rounded-lg text-[10px] font-bold font-mono ${scoreColor}`}>
                          {match.matchScore}% Match
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">{match.matchReason}</p>

                      {match.techGaps && match.techGaps.length > 0 && (
                        <div className="space-y-1 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                          <span className="block text-[8px] uppercase font-bold text-amber-700 tracking-wider font-mono">Potential Skills/Tech Gaps</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.techGaps.map((gap: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-white text-amber-800 text-[9px] rounded font-bold border border-amber-200">
                                {gap}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 border-neutral-100">
                      <span className="text-[9px] text-neutral-400 font-bold font-mono">ID: {match.jobId}</span>
                      
                      {appliedJobIds.includes(match.jobId) ? (
                        <span className="text-[10px] text-emerald-600 font-bold font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dispatched Successfully</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => runAutoApplyPipeline(match.jobId, jobTitle)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-150 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Auto-Apply with AI</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`${cardBg} rounded-2xl p-16 text-center space-y-3`}>
              <Sliders className="w-8 h-8 text-neutral-300 mx-auto" />
              <div className="text-sm font-bold text-neutral-400">No alignments loaded yet</div>
              <button
                onClick={triggerJobMatching}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Trigger Initial Alignment Matching
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Auto-Apply Queue */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Active Job Applications Grid */}
          <div className={`${cardBg} lg:col-span-6 p-6 rounded-2xl flex flex-col justify-between space-y-4 text-left`}>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-800 font-display">Active Outreach Applications</h3>
              <p className="text-[10px] text-neutral-400 font-semibold">Autonomous application queues currently tracking or dispatched on your behalf.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'job-1', title: 'Senior Staff AI Research Scientist', company: 'OpenAI Core', status: 'Dispatched', date: 'Just Now', fit: 96 },
                { id: 'job-2', title: 'Senior Frontend Architect', company: 'Stripe API Platforms', status: 'In Review', date: 'Just Now', fit: 92 },
                { id: 'job-3', title: 'Director of Talent & Culture', company: 'Vercel Engineering', status: 'Interviewing', date: '3 days ago', fit: 89 }
              ].map((app) => (
                <div key={app.id} className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0 text-left">
                    <h4 className="text-xs font-bold text-neutral-850 truncate">{app.title}</h4>
                    <span className="block text-[9px] text-neutral-400 font-semibold truncate">{app.company} • Applied {app.date}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[8px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {app.fit}% Match
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'Interviewing' 
                        ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                        : app.status === 'Dispatched'
                          ? 'bg-sky-50 border border-sky-100 text-sky-700'
                          : 'bg-neutral-100 border border-neutral-200 text-neutral-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-neutral-400 font-semibold pt-4 border-t border-neutral-100 leading-relaxed font-sans flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>Applications are dispatched to relevant portals along with custom, resume-aligned assets immediately upon trigger when the Autonomous career engine is active.</span>
            </div>
          </div>

          {/* Real-time Applied Cover Letter & Terminal Viewer */}
          <div className={`${cardBg} lg:col-span-6 p-6 rounded-2xl flex flex-col space-y-4 justify-between text-left`}>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 font-display">
                <Terminal className="w-4 h-4 text-indigo-600" />
                AI Agent Submission Engine Logs
              </h3>
              <p className="text-[10px] text-neutral-400 font-semibold">View live compiler processes and API integrations as your profile reaches prospective pipelines.</p>
            </div>

            {/* Terminal Log Output Window */}
            <div className="bg-neutral-900 border border-neutral-200 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[10px] leading-relaxed text-indigo-100 space-y-1 text-left">
              {applyTerminalLogs.length > 0 ? (
                applyTerminalLogs.map((log, index) => (
                  <div key={index} className={`font-mono ${log.includes('✅') || log.includes('Success') ? 'text-emerald-400 font-bold' : log.includes('[INITIATING') ? 'text-indigo-400' : 'text-neutral-300'}`}>
                    <span className="text-neutral-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-2 text-center py-10 font-sans">
                  <Cpu className="w-7 h-7 text-neutral-300 animate-pulse" />
                  <p className="max-w-[240px] text-[10px] font-semibold text-neutral-400">No active auto-apply sequences running. Match a job and click "Auto-Apply with AI" to boot the runner.</p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-4">
              Autonomous submission credentials are signed with your authenticated key structure.
            </div>
          </div>

        </div>
      )}

      {/* 4. Inbox Classifier & Smart Replies */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Recruiter Email Thread List */}
          <div className={`${cardBg} lg:col-span-5 p-6 rounded-2xl flex flex-col space-y-4 text-left`}>
            <div className="flex items-center justify-between border-b pb-3 border-neutral-100">
              <div className="space-y-0.5 text-left">
                <h3 className="text-sm font-bold text-neutral-800 font-display">Recruiter Direct Ingest</h3>
                <p className="text-[10px] text-neutral-400 font-sans font-semibold">Synced email communications from talent acquisition</p>
              </div>

              <button
                onClick={runEmailClassifier}
                disabled={isClassifyingEmails}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-150 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isClassifyingEmails ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                )}
                <span>Classify Threads</span>
              </button>
            </div>

            {/* Ingest List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
              {inboxEmails.map((mail) => {
                const isSelected = selectedInboxEmail?.id === mail.id;
                
                const catBadge = mail.category 
                  ? mail.category === 'Interview Request'
                    ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                    : mail.category === 'Offer'
                      ? 'bg-amber-50 border-amber-150 text-amber-700'
                      : mail.category === 'Rejection'
                        ? 'bg-rose-50 border-rose-150 text-rose-700'
                        : 'bg-indigo-50 border-indigo-150 text-indigo-700'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-400';

                return (
                  <div
                    key={mail.id}
                    onClick={() => setSelectedInboxEmail(mail)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2 relative select-none ${
                      isSelected 
                        ? 'bg-indigo-50/40 border-indigo-300 shadow-sm' 
                        : 'bg-neutral-50/60 border-neutral-150 hover:border-neutral-300'
                    }`}
                  >
                    {!mail.isRead && (
                      <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" />
                    )}

                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-xs font-bold text-neutral-800 font-display truncate max-w-[70%]">{mail.senderName}</span>
                        <span className="text-[9px] text-neutral-400 font-mono font-semibold shrink-0">{mail.timestamp}</span>
                      </div>
                      <span className="block text-[9px] text-indigo-600 font-mono font-bold truncate">{mail.senderCompany}</span>
                    </div>

                    <p className="text-[10px] text-neutral-500 font-semibold truncate leading-none">{mail.subject}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${catBadge}`}>
                        {mail.category || 'Classified Unread'}
                      </span>
                      {mail.aiDraft && (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Sent Reply
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recruiter Email Reader Pane */}
          {selectedInboxEmail ? (
            <div className={`${cardBg} lg:col-span-7 p-6 rounded-2xl flex flex-col justify-between space-y-4 text-left`}>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-neutral-100">
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-neutral-850 font-display leading-tight">{selectedInboxEmail.subject}</h3>
                    <span className="text-[10px] text-neutral-400 font-semibold block mt-1">From: {selectedInboxEmail.senderName} &lt;{selectedInboxEmail.senderCompany}&gt;</span>
                  </div>

                  <div className="shrink-0">
                    <span className="text-[8px] font-mono font-bold bg-neutral-50 border border-neutral-200 text-neutral-500 px-2 py-1 rounded">
                      Correspondence
                    </span>
                  </div>
                </div>

                {/* Email content */}
                <div className={`p-4 rounded-xl border leading-relaxed text-xs text-neutral-600 font-semibold whitespace-pre-line max-h-52 overflow-y-auto ${panelBg}`}>
                  {selectedInboxEmail.body}
                </div>
              </div>

              {/* Autopilot Responder */}
              <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
                <div className="flex flex-wrap sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Reply Calibration Objective</span>
                  </div>

                  <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                    {['Accept & Schedule', 'Politely Decline', 'Request Info'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setReplyGoal(goal as any)}
                        className={`px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                          replyGoal === goal
                            ? 'bg-white border border-neutral-250/50 text-indigo-700 shadow-sm'
                            : 'text-neutral-400 hover:text-neutral-800'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Autopilot reply box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-neutral-400 font-mono uppercase">Draft Output Preview</span>
                    <button
                      onClick={handleGenerateReplyDraft}
                      disabled={isGeneratingReply}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[9px] font-extrabold rounded-lg border border-indigo-150 cursor-pointer flex items-center gap-1"
                    >
                      {isGeneratingReply ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-2.5 h-2.5" />
                      )}
                      <span>Draft response with Gemini</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={customDraftReply}
                    onChange={(e) => setCustomDraftReply(e.target.value)}
                    placeholder="Click draft response above or start writing..."
                    className={`w-full border text-xs p-3.5 focus:border-indigo-500 rounded-xl outline-none font-semibold text-neutral-850 ${inputBg}`}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-neutral-400 font-bold">Dispatched via integrated Gmail SMTP</span>
                  <button
                    onClick={handleSendDraftResponse}
                    disabled={isSendingReply || !customDraftReply.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/15 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingReply ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>Dispatch Outbound Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${cardBg} lg:col-span-7 p-12 rounded-2xl flex flex-col items-center justify-center text-center`}>
              <Mail className="w-10 h-10 text-neutral-200 mb-2" />
              <h4 className="font-bold text-neutral-500">No message selected</h4>
            </div>
          )}

        </div>
      )}

      {/* Auto-Apply Log details Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/35 backdrop-blur-sm flex items-center justify-center p-6 text-left select-none">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl text-neutral-800 space-y-4">
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2 border-b pb-3 border-neutral-100">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-neutral-805 font-display">Autonomous Pipeline Action</h3>
                <p className="text-[10px] text-neutral-400 font-mono font-bold font-mono">Dispatched application profile & tailored credentials</p>
              </div>
            </div>

            <div className="space-y-4">
              {applyCoverLetter && (
                <div className="space-y-1 text-left">
                  <span className="text-[8px] uppercase font-bold text-neutral-400 font-mono">Structured Cover Letter Draft</span>
                  <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl leading-relaxed text-[10px] text-neutral-600 font-semibold max-h-40 overflow-y-auto whitespace-pre-line">
                    {applyCoverLetter}
                  </div>
                </div>
              )}

              <div className="space-y-1 text-left">
                <span className="text-[8px] uppercase font-bold text-neutral-400 font-mono">Submission Logs</span>
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl h-44 overflow-y-auto font-mono text-[9px] leading-relaxed text-indigo-100 space-y-1.5">
                  {applyTerminalLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('✅') ? 'text-emerald-400 font-bold' : ''}>
                      <span className="text-neutral-500 mr-1.5">[{idx}]</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {applyRefId && (
                <span className="text-[9px] font-mono text-neutral-400 font-bold">Ref Signature ID: {applyRefId}</span>
              )}
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Queue Monitor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
