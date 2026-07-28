/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Briefcase, Users, Mail, TrendingUp, ArrowRight, CheckCircle2, ChevronRight, 
  Send, HelpCircle, Loader2, Clock, Calendar, DollarSign, Award, AlertCircle, Filter, 
  Check, X, ExternalLink, ShieldCheck, Inbox, ChevronDown, Bell, Star, MessageSquare, 
  Activity, ArrowUpRight, BarChart2, Cpu
} from 'lucide-react';
import { Candidate, JobOpening, CandidateEmail, Theme } from '../types';

interface OverviewTabProps {
  candidates: Candidate[];
  jobs: JobOpening[];
  emails: CandidateEmail[];
  onNavigateTab: (tab: 'jobs' | 'candidates' | 'gmail' | 'agent' | 'settings' | 'profile') => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onStatusChange: (id: string, status: Candidate['status']) => void;
  theme?: Theme;
}

interface NotificationItem {
  id: string;
  text: string;
  type: 'candidate' | 'interview' | 'offer' | 'system' | 'security';
  time: string;
  isRead: boolean;
}

export default function OverviewTab({ 
  candidates, 
  jobs, 
  emails, 
  onNavigateTab, 
  onSelectCandidate,
  onStatusChange,
  theme = 'light'
}: OverviewTabProps) {
  const [dashboardSection, setDashboardSection] = useState<'applications' | 'interviews' | 'offers'>('applications');
  const [emailCategory, setEmailCategory] = useState<'recent' | 'important'>('recent');
  
  // Copilot States
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponses, setCopilotResponses] = useState<Array<{ q: string; a: string; isLoading?: boolean }>>([
    {
      q: 'Show my resume keyword optimization recommendations',
      a: 'Based on your targeted roles, adding **Transformers**, **Inference Optimization**, and **System Architecture** keywords would increase your match rate by **14%** across current open requisitions.'
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'notif-1', text: "Stripe recruiter requested a follow-up interview for Staff AI Engineer.", type: "candidate", time: "10m ago", isRead: false },
    { id: 'notif-2', text: "AI drafted a tailored outreach reply for Marcus Chen.", type: "system", time: "1h ago", isRead: false },
    { id: 'notif-3', text: "Technical screening with Elena Rostova on Thursday at 11:00 AM.", type: "interview", time: "2h ago", isRead: true },
    { id: 'notif-4', text: "Written offer letter received from Vercel.", type: "offer", time: "1d ago", isRead: true },
    { id: 'notif-5', text: "Gmail synchronized 4 incoming recruiter threads successfully.", type: "security", time: "2d ago", isRead: true }
  ]);

  // Email Detail State
  const [previewEmail, setPreviewEmail] = useState<CandidateEmail | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Computations
  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const parsedCandidatesCount = candidates.length;
  const averageMatchScore = candidates.length > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length) : 0;
  const intervieweesCount = candidates.filter(c => c.status === 'Interview').length;
  const offersMadeCount = candidates.filter(c => c.status === 'Offer').length;

  const handleCopilotSend = (text: string) => {
    if (!text.trim()) return;
    const q = text;
    setCopilotQuery('');
    setCopilotResponses(prev => [...prev, { q, a: '', isLoading: true }]);

    setTimeout(() => {
      let responseText = '';
      const queryLower = q.toLowerCase();
      if (queryLower.includes('stripe') || queryLower.includes('marcus')) {
        responseText = 'Your application for **Staff Frontend Architect** at Stripe is currently in **Interview Stage**. Their primary focus is on sub-100ms web latency. Highlight your Next.js App Router optimization and Edge computing skills during tomorrow’s panel.';
      } else if (queryLower.includes('resume') || queryLower.includes('gap')) {
        responseText = 'Your resume scored **94%** against OpenAI specifications. Key improvement gaps identified: **C++ serving layers** (vLLM, TensorRT) and **distributed multi-GPU training benchmarks**. Add these under your prior projects to boost automated pipeline matching.';
      } else if (queryLower.includes('offer') || queryLower.includes('salary')) {
        responseText = 'You have 1 active offer from **Vercel** ($165,000 base + 0.1% equity). Market salary telemetry suggests negotiating for a sign-on bonus of **$15,000** is well within the 90th percentile for this experience tier.';
      } else {
        responseText = `Based on your matched profile, we found ${activeJobsCount} highly compatible job openings. Your average suitability score is ${averageMatchScore}%. Let me know if you would like me to optimize your CV keywords for any of them.`;
      }

      setCopilotResponses(prev => 
        prev.map(item => item.isLoading ? { q, a: responseText } : item)
      );
    }, 1200);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSendEmailReply = () => {
    if (!replyBody.trim() || !previewEmail) return;
    setIsSendingReply(true);
    setTimeout(() => {
      setIsSendingReply(false);
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        setPreviewEmail(null);
        setReplyBody('');
        setFeedbackMessage(`Your response reply has been successfully sent to ${previewEmail.candidateName}!`);
        setTimeout(() => setFeedbackMessage(null), 3000);
      }, 1500);
    }, 1200);
  };

  const triggerDownloadNotice = (candidateName: string) => {
    setFeedbackMessage(`Offer pack for ${candidateName} downloaded successfully!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Sort and filter emails
  const recentEmailsList = [...emails].slice(0, 4);
  const importantEmailsList = emails.filter(
    e => e.isRead === false || e.subject.toLowerCase().includes('re:') || e.candidateName.includes('Sarah') || e.candidateName.includes('Marcus')
  ).slice(0, 4);

  // Standard interactive interview objects
  const upcomingInterviews = [
    {
      id: 'int-1',
      candidateName: 'Sarah Jenkins (Recruiter)',
      role: 'Staff AI Engineer @ OpenAI',
      time: 'Thursday, 2:00 PM PST',
      focus: 'LLM Autoregressive Self-Correction & Serving Scale',
      interviewer: 'OpenAI Panel',
      type: 'Technical Deep-Dive',
      avatar: 'SJ'
    },
    {
      id: 'notif-2',
      candidateName: 'Marcus Chen (UI Lead)',
      role: 'Senior UI Architect @ Stripe',
      time: 'Next Tuesday, 10:00 AM PST',
      focus: 'Performance Frameworks, Bundle Splitting & WebGL',
      interviewer: 'Stripe Engineering',
      type: 'Architecture Board',
      avatar: 'MC'
    },
    {
      id: 'notif-3',
      candidateName: 'Elena Rostova (Tech Lead)',
      role: 'Senior Frontend Engineer @ Vercel',
      time: 'Thursday, 11:00 AM PST',
      focus: 'React 19 Server Components & Distributed Rendering',
      interviewer: 'Vercel Platform Team',
      type: 'System Design Interview',
      avatar: 'ER'
    }
  ];

  // Offer Packages matching individual job seeker
  const offerPackages = [
    {
      id: 'off-1',
      candidateName: 'OpenAI',
      role: 'Staff AI Researcher',
      salary: '$210,000 / year',
      equity: '0.12% Options',
      signingBonus: '$35,000',
      status: 'Awaiting Signature',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'off-2',
      candidateName: 'Vercel',
      role: 'Senior UI Engineer',
      salary: '$165,000 / year',
      equity: '0.1% Options',
      signingBonus: 'N/A',
      status: 'Offer Accepted',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  const isLight = theme === 'light';

  // Master Style Variable Bindings
  const cardBg = isLight ? 'bg-white border-neutral-200/80 shadow-md shadow-neutral-100/50' : 'bg-neutral-900 border-neutral-850';
  const panelBg = isLight ? 'bg-neutral-50 border-neutral-200/50' : 'bg-neutral-950 border-neutral-850';
  const labelText = isLight ? 'text-neutral-500 font-bold uppercase font-mono' : 'text-neutral-500 font-mono font-bold';
  const textTitle = isLight ? 'text-neutral-900 font-black' : 'text-white font-extrabold';
  const textBody = isLight ? 'text-neutral-700 font-medium' : 'text-neutral-200';
  const textDesc = isLight ? 'text-neutral-500' : 'text-neutral-400';
  const itemBorder = isLight ? 'border-neutral-100' : 'border-neutral-850';
  const itemBg = isLight ? 'bg-neutral-50' : 'bg-neutral-950';

  return (
    <div className={`space-y-6 font-sans animate-fade-in pb-12 transition-colors duration-200 ${isLight ? 'text-neutral-800' : 'text-white'}`}>
      
      {/* Toast Feedback Banner */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-indigo-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 1. KEY TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className={`${cardBg} p-5 rounded-2xl transition-all flex flex-col justify-between hover:scale-[1.01]`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] tracking-wider ${labelText}`}>Matched Openings</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-mono">+3 Discovered</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl font-black font-display tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>{activeJobsCount}</span>
              <span className="text-xs text-neutral-400 font-mono">Job Posts</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-neutral-400">
            <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
            <span className="cursor-pointer hover:text-indigo-600 hover:underline flex items-center gap-1 font-bold" onClick={() => onNavigateTab('jobs')}>
              Review matching vacancies <ArrowRight className="w-3 h-3 text-neutral-400" />
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`${cardBg} p-5 rounded-2xl transition-all flex flex-col justify-between hover:scale-[1.01]`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] tracking-wider ${labelText}`}>Active Tracks</span>
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-mono">+1 Active</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl font-black font-display tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>{parsedCandidatesCount}</span>
              <span className="text-xs text-neutral-400 font-mono">Applications</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-neutral-400">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span className="cursor-pointer hover:text-indigo-600 hover:underline flex items-center gap-1 font-bold" onClick={() => onNavigateTab('candidates')}>
              Open app tracker <ArrowRight className="w-3 h-3 text-neutral-400" />
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`${cardBg} p-5 rounded-2xl transition-all flex flex-col justify-between hover:scale-[1.01]`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] tracking-wider ${labelText}`}>Upcoming Interviews</span>
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-mono">2 slots</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-indigo-600 font-display tracking-tight">{intervieweesCount}</span>
              <span className="text-xs text-neutral-400 font-mono">Scheduled</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span 
              onClick={() => setDashboardSection('interviews')} 
              className="cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline flex items-center gap-1 font-bold"
            >
              Check interview dates <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`${cardBg} p-5 rounded-2xl transition-all flex flex-col justify-between hover:scale-[1.01]`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] tracking-wider ${labelText}`}>Offer Decisions</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-mono">94% score</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-emerald-600 font-display tracking-tight">{offersMadeCount}</span>
              <span className="text-xs text-neutral-400 font-mono">Offers</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-neutral-400">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span 
              onClick={() => setDashboardSection('offers')} 
              className="cursor-pointer text-emerald-600 hover:text-emerald-500 hover:underline flex items-center gap-1 font-bold"
            >
              Analyze compensation letters <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Timeline Chart Card */}
        <div className={`${cardBg} lg:col-span-8 p-6 rounded-2xl flex flex-col justify-between`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className={`text-sm font-bold ${isLight ? 'text-neutral-800' : 'text-neutral-200'} font-display`}>Career Match Rate & Funnel Telemetry</h3>
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal">
                Analysis of daily matching jobs scanned by the AI agent against successfully processed applications.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-neutral-400">Matched Jobs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-300" />
                <span className="text-neutral-400">Submitted</span>
              </div>
            </div>
          </div>

          {/* SVG Graph */}
          <div className="my-6 relative h-36 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="500" y2="20" stroke={isLight ? "#f3f4f6" : "#1f2937"} strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke={isLight ? "#f3f4f6" : "#1f2937"} strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke={isLight ? "#f3f4f6" : "#1f2937"} strokeWidth="1" strokeDasharray="3 3" />
              
              <path d="M 0 120 L 0 95 L 80 82 L 160 105 L 240 35 L 320 60 L 400 45 L 500 15 L 500 120 Z" fill="url(#chartGlow)" />
              <path d="M 0 95 L 80 82 L 160 105 L 240 35 L 320 60 L 400 45 L 500 15" fill="none" stroke="#4f46e5" strokeWidth="2" />
              
              <circle cx="80" cy="82" r="4" fill="#818cf8" stroke="#4f46e5" strokeWidth="1.5" />
              <circle cx="240" cy="35" r="4" fill="#818cf8" stroke="#4f46e5" strokeWidth="1.5" />
              <circle cx="500" cy="15" r="4" fill="#818cf8" stroke="#4f46e5" strokeWidth="1.5" />
            </svg>
            
            <div className="flex justify-between items-center text-[8px] text-neutral-400 font-mono mt-2.5">
              <span>Jul 15</span>
              <span>Jul 16</span>
              <span>Jul 17</span>
              <span>Jul 18</span>
              <span>Jul 19</span>
              <span>Jul 20</span>
              <span>Jul 21 (Today)</span>
            </div>
          </div>

          <div className={`border-t ${itemBorder} pt-4`}>
            <span className={`text-[8px] ${labelText} block mb-2`}>Visual Application Funnel Progress</span>
            <div className="grid grid-cols-5 gap-2.5">
              {[
                { label: 'Scanned', count: '189', pct: '100%' },
                { label: 'Matched', count: '92', pct: '48%', active: true },
                { label: 'Applied', count: '14', pct: '7.4%' },
                { label: 'Interviews', count: '3', pct: '1.5%' },
                { label: 'Offers', count: '2', pct: '1.0%' }
              ].map((step, idx) => (
                <div key={idx} className={`${panelBg} border p-2 rounded-xl space-y-0.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-neutral-500 font-display truncate max-w-[60px]">{step.label}</span>
                    <span className="text-[7px] font-mono text-neutral-400">{step.pct}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xs font-black font-mono ${step.active ? 'text-indigo-600' : isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{step.count}</span>
                    <span className="text-[7px] text-neutral-400 font-bold">jobs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roles distribution */}
        <div className={`${cardBg} lg:col-span-4 p-6 rounded-2xl flex flex-col justify-between`}>
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <h3 className={`text-sm font-bold ${isLight ? 'text-neutral-800' : 'text-neutral-200'} font-display`}>Active Target Roles</h3>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Discovered positions categorized by match category alignment.
            </p>
          </div>

          <div className="space-y-3 my-4">
            {[
              { dept: 'Artificial Intelligence', count: 1, pct: 45, color: 'bg-indigo-600' },
              { dept: 'UI/UX Engineering', count: 1, pct: 35, color: 'bg-emerald-500' },
              { dept: 'Platform Systems', count: 1, pct: 15, color: 'bg-amber-500' },
              { dept: 'Inference Architectures', count: 0, pct: 5, color: 'bg-rose-500' }
            ].map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-neutral-600">{d.dept}</span>
                  <span className="text-neutral-400 font-mono">{d.count} matched</span>
                </div>
                <div className={`w-full ${itemBg} h-1.5 rounded-full overflow-hidden border ${itemBorder}`}>
                  <div className={`${d.color} h-full rounded-full`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={`${itemBg} p-3 rounded-xl border ${itemBorder} flex items-center gap-2.5`}>
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <p className="text-[9px] text-neutral-500 leading-normal font-medium">
              <strong>Autopilot Tip</strong>: Matching is dense for **Artificial Intelligence**. Consider prioritizing your interview slots on Thursdays for optimal prep focus.
            </p>
          </div>
        </div>

      </div>

      {/* 3. CORE CO-PILOT CHAT INTERACTIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Interactive Master Area */}
        <div className={`${cardBg} lg:col-span-8 p-6 rounded-2xl flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-neutral-100">
              <div className="flex items-center gap-2">
                {[
                  { id: 'applications', label: 'Active Pipelines', icon: Users },
                  { id: 'interviews', label: 'Interviews Hub', icon: Calendar },
                  { id: 'offers', label: 'Offer Packages', icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = dashboardSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDashboardSection(tab.id as any)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isActive
                          ? 'bg-indigo-50/50 border-indigo-200 text-indigo-700 font-bold shadow-sm'
                          : 'border-transparent text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              <span className={`text-[8px] font-mono font-bold hidden sm:inline ${labelText}`}>Active Tracking Panels</span>
            </div>

            {/* Applications Panel */}
            {dashboardSection === 'applications' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono font-bold px-1.5">
                  <span>Match Details & Role</span>
                  <span className="text-right">Action Controls</span>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {candidates.map((c) => (
                    <div 
                      key={c.id}
                      className={`${itemBg} border ${itemBorder} p-3.5 rounded-xl hover:border-indigo-200 transition-colors flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          onClick={() => onSelectCandidate(c)}
                          className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 uppercase shrink-0 cursor-pointer hover:bg-indigo-100 transition-colors"
                          title="View analysis scorecard"
                        >
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="truncate text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-neutral-800 hover:text-indigo-600 cursor-pointer" onClick={() => onSelectCandidate(c)}>
                              {c.name}
                            </span>
                            <span className="text-[9px] bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-mono text-indigo-700 font-bold truncate max-w-[140px]">
                              {c.role}
                            </span>
                          </div>
                          <span className="block text-[9px] text-neutral-400 font-medium leading-none mt-1">Applied {c.appliedDate} • {c.experience}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-black text-indigo-600 block font-mono">{c.matchScore}%</span>
                        </div>
                        <select
                          value={c.status}
                          onChange={(e) => onStatusChange(c.id, e.target.value as any)}
                          className={`border text-[10px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer transition-colors ${
                            isLight 
                              ? 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300' 
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <option value="Screening">Screening</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interviews Panel */}
            {dashboardSection === 'interviews' && (
              <div className="space-y-3">
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {upcomingInterviews.map((int) => (
                    <div 
                      key={int.id}
                      className={`${itemBg} border ${itemBorder} p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-xs shrink-0">
                          {int.avatar}
                        </div>
                        <div className="space-y-1 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-neutral-800">{int.candidateName}</span>
                            <span className="text-[9px] bg-neutral-100 border border-neutral-200 text-neutral-500 px-1.5 py-0.2 rounded font-mono truncate max-w-[150px]">
                              {int.role}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold">
                            <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="font-bold text-emerald-600 font-mono">{int.time}</span>
                          </div>

                          <p className="text-[9px] text-neutral-400 leading-normal max-w-sm font-medium">
                            Focus: <span className="text-neutral-600 font-bold">{int.focus}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <div className="text-left sm:text-right hidden sm:block">
                          <span className="text-[8px] text-neutral-400 block uppercase font-mono font-bold">Interviewer</span>
                          <span className="text-[10px] font-bold text-neutral-700">{int.interviewer}</span>
                        </div>

                        <a 
                          href="https://meet.google.com" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Join Meet</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offers Panel */}
            {dashboardSection === 'offers' && (
              <div className="space-y-3">
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {offerPackages.map((off) => (
                    <div 
                      key={off.id}
                      className={`${itemBg} border ${itemBorder} p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-extrabold text-xs shrink-0">
                          $
                        </div>
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-neutral-800">{off.candidateName}</span>
                            <span className="text-[9px] bg-neutral-100 border border-neutral-200 text-neutral-500 px-1.5 py-0.2 rounded font-mono">
                              {off.role}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-500 font-mono font-semibold">
                            <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3 text-amber-500" />Base: <strong className="text-neutral-700">{off.salary}</strong></span>
                            <span>•</span>
                            <span>Equity: <strong className="text-neutral-700">{off.equity}</strong></span>
                            {off.signingBonus !== 'N/A' && (
                              <>
                                <span>•</span>
                                <span>Sign-on: <strong className="text-neutral-700">{off.signingBonus}</strong></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                        <span className={`px-2.5 py-1 border text-[9px] font-bold rounded-lg uppercase tracking-wider font-mono ${off.statusColor}`}>
                          {off.status}
                        </span>

                        <button 
                          onClick={() => triggerDownloadNotice(off.candidateName)}
                          className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                            isLight ? 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                          }`}
                          title="Download Offer Letter PDF"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`mt-5 pt-4 border-t ${itemBorder} flex items-center justify-between text-[10px] text-neutral-400 font-mono`}>
            <span>Tracking {candidates.length} active applications</span>
            <span className="hover:text-indigo-600 cursor-pointer flex items-center gap-1 font-bold" onClick={() => onNavigateTab('candidates')}>
              Open complete tracker <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Right Smart Email Hub */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Email Card list */}
          <div className={`${cardBg} p-5 rounded-2xl flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between border-b pb-2.5 mb-3.5 border-neutral-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-800 font-display">Recruiter Correspondence</span>
                </div>
                
                <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80">
                  <button 
                    onClick={() => setEmailCategory('recent')}
                    className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${emailCategory === 'recent' ? 'bg-white border border-neutral-200 text-indigo-600 font-mono shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                  >
                    Recent
                  </button>
                  <button 
                    onClick={() => setEmailCategory('important')}
                    className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${emailCategory === 'important' ? 'bg-white border border-neutral-200 text-indigo-600 font-mono shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                  >
                    Priority
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {(emailCategory === 'recent' ? recentEmailsList : importantEmailsList).map((e) => (
                  <div 
                    key={e.id}
                    onClick={() => setPreviewEmail(e)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      e.isRead === false 
                        ? 'bg-indigo-50/40 border-indigo-100 hover:border-indigo-200' 
                        : 'bg-neutral-50 hover:bg-neutral-100/60 border-neutral-150'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-neutral-800 truncate max-w-[120px]">{e.candidateName}</span>
                      <span className="text-[8px] font-mono text-neutral-400">{e.timestamp}</span>
                    </div>
                    <h4 className="text-[10px] font-extrabold text-neutral-700 truncate leading-tight">{e.subject}</h4>
                    <p className="text-[9px] text-neutral-400 mt-1 truncate leading-none font-medium">{e.snippet}</p>
                    {e.aiDraftSuggestion && (
                      <span className="inline-flex items-center gap-1 mt-2 px-1.5 py-0.5 bg-indigo-50 text-[8px] font-bold text-indigo-600 border border-indigo-100 rounded-md font-mono">
                        <Sparkles className="w-2.5 h-2.5" /> AI Draft Available
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('gmail')}
              className="w-full mt-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold rounded-xl text-[10px] transition-all cursor-pointer text-center"
            >
              Configure Gmail sync filters
            </button>
          </div>

          {/* AI Copilot Card */}
          <div className={`${cardBg} p-5 rounded-2xl flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 border-b pb-2.5 mb-3 border-neutral-100">
                <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span className="text-xs font-bold text-neutral-800 font-display">Agent Copilot Terminal</span>
              </div>

              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 mb-3">
                {copilotResponses.map((res, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="bg-neutral-100 p-2 rounded-xl text-neutral-700 text-[10px] border border-neutral-200/50 text-right ml-8 font-medium">
                      {res.q}
                    </div>
                    {res.isLoading ? (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-600 text-[10px] max-w-[200px]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying knowledge graph...</span>
                      </div>
                    ) : (
                      <div className="bg-indigo-50/40 border border-indigo-100 p-2.5 rounded-xl text-neutral-600 text-[10px] leading-relaxed mr-8 text-left font-medium">
                        {res.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="relative mt-2">
              <input 
                type="text"
                placeholder="Ask co-pilot (e.g. Stripe, OpenAI)..."
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCopilotSend(copilotQuery); }}
                className={`w-full text-[10px] font-medium pl-3 pr-10 py-2.5 border rounded-xl outline-none focus:border-indigo-500 ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-neutral-900 border-neutral-800 text-white'
                }`}
              />
              <button 
                onClick={() => handleCopilotSend(copilotQuery)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 4. DETAIL EMAIL RESPONSE PREVIEW MODAL */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/35 backdrop-blur-sm" onClick={() => setPreviewEmail(null)} />
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative z-10 space-y-4 text-neutral-800 text-left">
            <div className="flex items-center justify-between border-b pb-2 border-neutral-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-neutral-400">Recruiter Conversation</h4>
              </div>
              <button onClick={() => setPreviewEmail(null)} className="p-1 hover:bg-neutral-100 rounded-md text-neutral-400 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-neutral-800">{previewEmail.candidateName}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{previewEmail.timestamp}</span>
              </div>
              <div className="text-[11px] bg-neutral-50 border border-neutral-100 p-3 rounded-xl font-medium text-neutral-600">
                <strong className="block text-neutral-800 mb-1">{previewEmail.subject}</strong>
                {previewEmail.body || previewEmail.snippet}
              </div>
            </div>

            {/* AI Draft Assist */}
            {previewEmail.aiDraftSuggestion && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl text-[10px] leading-relaxed space-y-1">
                <div className="flex items-center gap-1 text-indigo-700 font-bold uppercase tracking-wider text-[9px] font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Recommended Reply Draft</span>
                </div>
                <p className="text-neutral-600 font-medium">{previewEmail.aiDraftSuggestion}</p>
                <button 
                  onClick={() => setReplyBody(previewEmail.aiDraftSuggestion || '')}
                  className="mt-2 text-[9px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-2 py-1 rounded-md transition-all cursor-pointer"
                >
                  Insert recommended draft
                </button>
              </div>
            )}

            {/* Reply block */}
            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 font-mono">My Reply Draft</label>
              <textarea 
                rows={3}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Draft custom reply response here..."
                className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 focus:border-indigo-500 rounded-xl outline-none font-medium text-neutral-800"
              />
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setPreviewEmail(null)}
                  className="px-3.5 py-2 text-xs font-bold bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendEmailReply}
                  disabled={isSendingReply || !replyBody.trim()}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSendingReply ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending reply...</span>
                    </>
                  ) : sendSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Reply sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
