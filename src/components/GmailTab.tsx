/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, Sparkles, Check, ChevronRight, CornerDownLeft, RefreshCw, 
  Loader2, Lock, LogOut, ShieldCheck, AlertCircle, Info, Inbox, CheckCircle2,
  Trash2, Eye, Calendar, Sparkle, AlertTriangle, ShieldAlert, BadgeInfo, X
} from 'lucide-react';
import { CandidateEmail, Theme } from '../types';
import { googleSignIn, logout, initAuth } from '../lib/firebase';
import { User } from 'firebase/auth';

interface GmailTabProps {
  emails?: CandidateEmail[];
  onAddEmailResponse?: (threadId: string, replyBody: string) => void;
  onGenerateDraft?: (threadId: string) => Promise<void>;
  theme?: Theme;
}

// Full-fidelity mock emails representing individual job seeker context
const DEMO_EMAILS: CandidateEmail[] = [
  {
    id: 'demo-1',
    candidateId: 'cand-1',
    candidateName: 'Sarah Jenkins (Recruiter)',
    candidateEmail: 'sarah.jenkins@openai.com',
    subject: 'Re: Next Steps - Staff AI Researcher Role',
    snippet: 'Hi Alex, absolutely! I am delighted to hear back. Thursday at 2:00 PM PST works perfectly...',
    body: `Hi Alex,

Thank you for reaching out! I'm very excited about your background in LLM alignment and would love to chat.

I read your project repository on self-correction algorithms and found it extremely aligned with some of the projects we are leading at OpenAI.

Thursday at 2:00 PM PST works perfectly for me. Otherwise, I can also do Friday morning anytime before 11:30 AM PST. 

Looking forward to our conversation!

Best,
Sarah Jenkins
Technical Talent Acquisition, OpenAI`,
    timestamp: '11:15 AM',
    isRead: false,
    direction: 'inbound',
    category: 'Interview',
    aiDraftSuggestion: `Hi Sarah,

That's excellent! I have booked us in for Thursday at 2:00 PM PST. I am really looking forward to deep diving into LLM self-correction architectures with you.

Speak soon,
Alex Mercer`
  },
  {
    id: 'demo-2',
    candidateId: 'cand-2',
    candidateName: 'Marcus Chen (UI Lead)',
    candidateEmail: 'marcus.chen@stripe.dev',
    subject: 'Written Contract Offer - Senior UI Architect',
    snippet: 'Hi Alex, I have prepared the written offer package and am thrilled to dispatch! Let\'s finalize...',
    body: `Hi Alex,

I have thoroughly prepared the written offer package and dispatched it. We are absolutely thrilled to offer you the position of Senior UI Architect at Stripe!

The compensation, benefits structure, and equity parameters align perfectly with our prior discussions ($165,000 base + 0.1% equity). We are incredibly excited to have you join the team.

Let me know if you have any questions and what start date you would prefer!

Best,
Marcus Chen
Director of Frontend Engineering, Stripe`,
    timestamp: '09:40 AM',
    isRead: false,
    direction: 'inbound',
    category: 'Offer',
    aiDraftSuggestion: `Hi Marcus,

I am absolutely thrilled and honored to accept the offer! The terms are perfect, and I can start on the first Monday of next month.

Let me know if there are any documents I should sign ahead of time.

Best,
Alex Mercer`
  },
  {
    id: 'demo-3',
    candidateId: 'cand-3',
    candidateName: 'Elena Rostova (Tech Lead)',
    candidateEmail: 'elena.rostova@vercel.com',
    subject: 'Update regarding your technical screening review',
    snippet: 'Hello, I wanted to follow up on the system design round. Is there any update on the timeline...',
    body: `Hello Alex,

I hope you are doing well.

I wanted to follow up on the technical system design assessment we had last week. The platform team was highly impressed with your React 19 server-side performance case-studies.

We expect to have the panel schedule finalized by tomorrow afternoon for your final rounds.

Thank you so much!

Best,
Elena Rostova
Platform Engineering, Vercel`,
    timestamp: 'Yesterday',
    isRead: true,
    direction: 'inbound',
    category: 'HR Reply',
    aiDraftSuggestion: `Hi Elena,

Thank you for the update! That's wonderful news. I am looking forward to speaking with the Vercel platform team for the final rounds.

Best regards,
Alex Mercer`
  },
  {
    id: 'demo-4',
    candidateId: 'spam-1',
    candidateName: 'Decentralized Draw Admin',
    candidateEmail: 'claim-prize@malicious-sweepstakes.com',
    subject: 'URGENT: You won 5.2 BTC in our summer drawing!',
    snippet: 'DEAR WINNER, your email address was selected in our weekly decentralized crypto draw...',
    body: `DEAR VALUED RECIPIENT,

Your email address has emerged as the grand prize winner of 5.2 BTC (Bitcoin) in our monthly summer promo drawing. This draw is sponsored by decentralized blockchain networks.

To claim your prize, please click the secure link below and deposit 0.01 BTC as a processing fee:
http://malicious-spam-link.net/claim-btc

Failure to claim within 48 hours will result in forfeiture of funds.

Regards,
Sweepstakes Crypto Admin`,
    timestamp: '2 days ago',
    isRead: true,
    direction: 'inbound',
    category: 'Spam',
    aiDraftSuggestion: `[SYSTEM NOTE: Classified as Spam. Automated drafts are suppressed to preserve domain health.]`
  },
  {
    id: 'demo-5',
    candidateId: 'mkt-1',
    candidateName: 'Vercel Product Team',
    candidateEmail: 'news@vercel-marketing.com',
    subject: 'Introducing v0 v2: AI Generative UI for Devs',
    snippet: 'Vercel is excited to announce the next generation of our design-to-code generative system...',
    body: `Hi there,

We are thrilled to launch the latest updates to Vercel v0, our generative UI design engine. 

With v0 v2, you can now generate complete multi-screen dashboards, configure dark/light layouts dynamically, export production-ready Tailwind React components, and deploy directly with a single command.

Check out our new templates and start generating at https://v0.dev

Best,
The Vercel Team`,
    timestamp: '3 days ago',
    isRead: true,
    direction: 'inbound',
    category: 'Marketing',
    aiDraftSuggestion: `[SYSTEM NOTE: Marketing newsletter. Automated replies are skipped.]`
  }
];

export default function GmailTab({ emails: propEmails, onAddEmailResponse, onGenerateDraft, theme = 'light' }: GmailTabProps) {
  // Auth & Mode
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Email
  const [inboxEmails, setInboxEmails] = useState<CandidateEmail[]>([]);
  const [selectedThread, setSelectedThread] = useState<CandidateEmail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Category Filtering
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Interview' | 'HR Reply' | 'Offer' | 'Spam' | 'Marketing'>('All');

  // Draft Reply
  const [customDraft, setCustomDraft] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setGoogleUser(user);
        setToken(cachedToken);
        setNeedsAuth(false);
        setIsDemoMode(false);
      },
      () => {
        if (!isDemoMode) {
          setNeedsAuth(true);
        }
      }
    );
    return () => unsubscribe();
  }, [isDemoMode]);

  // Sync Emails
  useEffect(() => {
    if (!needsAuth && token) {
      fetchRealGmailEmails();
    } else if (isDemoMode) {
      setInboxEmails(DEMO_EMAILS);
      setSelectedThread(DEMO_EMAILS[0]);
    } else {
      setInboxEmails([]);
      setSelectedThread(null);
    }
  }, [needsAuth, token, isDemoMode]);

  // Keep reply draft in sync with selected email thread
  useEffect(() => {
    if (selectedThread) {
      setCustomDraft(selectedThread.aiDraftSuggestion || '');
    } else {
      setCustomDraft('');
    }
    setIsSuccess(false);
  }, [selectedThread]);

  const fetchRealGmailEmails = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gmail', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setInboxEmails(data);
        if (data.length > 0) {
          setSelectedThread(data[0]);
        } else {
          setSelectedThread(null);
        }
      } else {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to fetch from Gmail API.');
      }
    } catch (err: any) {
      console.error('Gmail sync failed:', err);
      setErrorMsg(err.message || 'Gmail Sync failed. Please verify credentials or refresh connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error('Google Auth Failed:', err);
      setErrorMsg('Google Authentication was cancelled or failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    setGoogleUser(null);
    setToken(null);
    setNeedsAuth(true);
    setIsDemoMode(false);
    setInboxEmails([]);
    setSelectedThread(null);
  };

  const launchDemoInbox = () => {
    setIsDemoMode(true);
    setNeedsAuth(false);
    setErrorMsg(null);
  };

  const handleConfirmedSend = async () => {
    if (!selectedThread) return;
    setShowConfirmModal(false);
    setIsSending(true);

    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setInboxEmails(prev => 
          prev.map(m => m.id === selectedThread.id ? { ...m, isRead: true, aiDraftSuggestion: undefined } : m)
        );
        setIsSuccess(true);
        setFeedbackMessage("Reply response dispatched successfully!");
        setTimeout(() => {
          setIsSuccess(false);
          setFeedbackMessage(null);
        }, 3000);
      } else if (token) {
        const res = await fetch(`/api/gmail/${selectedThread.id}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            replyBody: customDraft,
            originalEmail: selectedThread
          })
        });

        if (res.ok) {
          setIsSuccess(true);
          setInboxEmails(prev => 
            prev.map(m => m.id === selectedThread.id ? { ...m, isRead: true, aiDraftSuggestion: undefined } : m)
          );
          setFeedbackMessage("Reply response successfully dispatched!");
          setTimeout(() => {
            setIsSuccess(false);
            setFeedbackMessage(null);
          }, 3000);
        } else {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to dispatch Gmail reply.');
        }
      }
    } catch (err: any) {
      console.error('Send failed:', err);
      setFeedbackMessage(`Failed to dispatch reply: ${err.message}`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = inboxEmails.filter(email => {
    if (selectedCategory === 'All') return true;
    return email.category === selectedCategory;
  });

  const getCategoryMeta = (category?: string) => {
    switch (category) {
      case 'Interview':
        return { text: 'Interview Stage', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' };
      case 'HR Reply':
        return { text: 'Recruiter Conversation', bg: 'bg-indigo-50 border-indigo-100 text-indigo-700' };
      case 'Offer':
        return { text: 'Offer Letter', bg: 'bg-amber-50 border-amber-100 text-amber-700' };
      case 'Spam':
        return { text: 'Spam Suppressed', bg: 'bg-rose-50 border-rose-100 text-rose-700' };
      case 'Marketing':
        return { text: 'Newsletter', bg: 'bg-neutral-100 border-neutral-200 text-neutral-600' };
      default:
        return { text: 'Inbound Thread', bg: 'bg-neutral-50 border-neutral-150 text-neutral-500' };
    }
  };

  const isLight = theme === 'light';

  // Styles
  const cardBg = isLight ? 'bg-white border-neutral-200 shadow-md shadow-neutral-100/50' : 'bg-neutral-900 border-neutral-850';
  const panelBg = isLight ? 'bg-neutral-50 border-neutral-200/60' : 'bg-neutral-950 border-neutral-850';
  const inputBg = isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-indigo-500' : 'bg-neutral-950 border-neutral-800 text-white focus:border-indigo-500';

  // Auth panel
  if (needsAuth && !isDemoMode) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[480px] p-8 text-center border rounded-2xl relative overflow-hidden shadow-xl font-sans ${cardBg}`}>
        <div className="absolute top-0 right-0 w-96 h-48 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />
        
        {feedbackMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-indigo-400">
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="max-w-xl space-y-6 relative z-10">
          <div className={`w-16 h-16 border rounded-2xl flex items-center justify-center mx-auto shadow-sm ${panelBg}`}>
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
          
          <div className="space-y-2">
            <h2 className={`text-xl font-bold tracking-tight font-display ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
              Connect Gmail Integration Autopilot
            </h2>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Enable real-time Gmail inbox scanning and let HireGenie AI automatically parse, sort, and categorize your recruiting inbox into highly organized actionable bins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left font-medium">
            <div className={`border p-4 rounded-xl space-y-1.5 ${panelBg}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4 className="text-[11px] font-bold text-neutral-700">Real Gmail Scanning</h4>
              <p className="text-[9px] text-neutral-400 leading-relaxed">Securely reads recruiter emails via Google OAuth connection with absolute safety.</p>
            </div>
            <div className={`border p-4 rounded-xl space-y-1.5 ${panelBg}`}>
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <h4 className="text-[11px] font-bold text-neutral-700">AI Classification</h4>
              <p className="text-[9px] text-neutral-400 leading-relaxed">Instantly classifies emails into Interview Request, Offer, HR Reply or Newsletters.</p>
            </div>
            <div className={`border p-4 rounded-xl space-y-1.5 ${panelBg}`}>
              <CornerDownLeft className="w-4 h-4 text-indigo-400" />
              <h4 className="text-[11px] font-bold text-neutral-700">Smart Auto-Drafts</h4>
              <p className="text-[9px] text-neutral-400 leading-relaxed">Generates elegant, politely drafted suggestions ready for immediate dispatcher send.</p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl flex items-start gap-2.5 text-left text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/15 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Connect with Google OAuth</span>
                </>
              )}
            </button>
            <button
              onClick={launchDemoInbox}
              className="w-full sm:w-auto py-3 px-6 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-xl text-xs transition-all cursor-pointer text-center border border-neutral-250/50"
            >
              Enter Autopilot Sandbox Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans transition-colors duration-200 ${isLight ? 'text-neutral-800' : 'text-white'}`}>
      
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-indigo-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Left Column: Inbox thread listing */}
      <div className={`${cardBg} lg:col-span-4 p-5 rounded-2xl flex flex-col gap-4 text-left`}>
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b pb-3.5 border-neutral-100">
            <div className="flex items-center gap-2">
              <Mail className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className={`text-sm font-bold ${isLight ? 'text-neutral-800' : 'text-neutral-200'} font-display`}>Career Inbox</h3>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              title="Disconnect Autopilot Sync"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1">
            {(['All', 'Interview', 'HR Reply', 'Offer', 'Spam', 'Marketing'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedThread(null);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-800'
                }`}
              >
                {cat === 'All' ? 'All Threads' : cat === 'HR Reply' ? 'Replies' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* List scrollarea */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
              <span>Synchronizing mailbox threads...</span>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400 text-xs text-center border border-dashed rounded-xl border-neutral-200">
              <Inbox className="w-8 h-8 text-neutral-300 mb-2" />
              <span>No synchronized messages in this category</span>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedThread(email)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  selectedThread?.id === email.id
                    ? 'bg-indigo-50/40 border-indigo-300 shadow-sm'
                    : 'bg-neutral-50/60 border-neutral-150 hover:border-neutral-300 text-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold truncate max-w-[120px] ${selectedThread?.id === email.id ? 'text-indigo-900' : 'text-neutral-800'}`}>
                    {email.candidateName}
                  </span>
                  <span className="text-[8px] font-mono text-neutral-400 font-bold">{email.timestamp}</span>
                </div>
                <h4 className={`text-[10px] font-extrabold truncate ${selectedThread?.id === email.id ? 'text-neutral-900' : 'text-neutral-700'}`}>{email.subject}</h4>
                <p className="text-[9px] text-neutral-400 font-medium truncate leading-none">{email.snippet}</p>
                
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${getCategoryMeta(email.category).bg}`}>
                    {getCategoryMeta(email.category).text}
                  </span>
                  {email.aiDraftSuggestion && (
                    <span className="flex items-center gap-1 text-[8px] font-bold text-indigo-600 font-mono">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-500 animate-pulse" /> AI Drafted
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Deep message read and response pane */}
      <div className={`${cardBg} lg:col-span-8 p-6 rounded-2xl flex flex-col justify-between text-left`}>
        {selectedThread ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            
            {/* Header Details */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-neutral-100">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 font-display leading-snug">{selectedThread.subject}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-400 font-semibold font-mono">
                    <span className="text-neutral-700 font-bold">{selectedThread.candidateName}</span>
                    <span>&lt;{selectedThread.candidateEmail}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getCategoryMeta(selectedThread.category).bg}`}>
                    {getCategoryMeta(selectedThread.category).text}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-mono font-bold">Inbound Thread</span>
                </div>
              </div>

              {/* Message Body */}
              <div className={`p-4 rounded-xl border leading-relaxed text-xs text-neutral-600 font-medium max-h-60 overflow-y-auto whitespace-pre-line ${panelBg}`}>
                {selectedThread.body || selectedThread.snippet}
              </div>
            </div>

            {/* AI Response and Drafting Drawer */}
            <div className="mt-6 pt-5 border-t border-neutral-100 space-y-4">
              {/* Draft Box */}
              {selectedThread.aiDraftSuggestion && (
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold uppercase tracking-wider text-[9px] font-mono">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <span>Gemini Tailored outreach reply</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-medium leading-relaxed whitespace-pre-line">{selectedThread.aiDraftSuggestion}</p>
                  
                  {customDraft !== selectedThread.aiDraftSuggestion && (
                    <button 
                      onClick={() => setCustomDraft(selectedThread.aiDraftSuggestion || '')}
                      className="text-[9px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-2 py-1 rounded-md transition-all cursor-pointer"
                    >
                      Use recommended draft text
                    </button>
                  )}
                </div>
              )}

              {/* Response Text Editor */}
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 font-mono">Compose Response Reply</label>
                <textarea
                  rows={4}
                  value={customDraft}
                  onChange={(e) => setCustomDraft(e.target.value)}
                  placeholder="Draft your response here..."
                  className={`w-full text-xs p-3.5 border focus:border-indigo-500 rounded-xl outline-none font-medium text-neutral-800 ${inputBg}`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-neutral-400 font-mono font-bold"> Autopilot synchronized via Google OAuth API</span>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setCustomDraft(selectedThread.aiDraftSuggestion || '')}
                    className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-500 border border-neutral-200 rounded-xl cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isSending || !customDraft.trim()}
                    className="px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/15 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Response</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400 text-xs text-center flex-1">
            <Mail className="w-12 h-12 text-neutral-200 mb-2.5" />
            <h4 className="font-bold text-neutral-500 text-sm">No Thread Selected</h4>
            <p className="max-w-xs text-neutral-400 font-medium leading-normal mt-1">Select an active recruiter correspondence thread from the left pane to analyze and respond.</p>
          </div>
        )}

        {/* Reply Confirmation Modal */}
        {showConfirmModal && selectedThread && (
          <div className="fixed inset-0 z-50 bg-neutral-900/35 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl text-neutral-800 text-left space-y-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2 border-b pb-2.5 border-neutral-100">
                <Send className="w-4.5 h-4.5 text-indigo-600" />
                <h4 className="font-bold text-sm text-neutral-800 font-display">Confirm Outbox Send</h4>
              </div>

              <div className="space-y-3 font-medium text-xs text-neutral-600">
                <p>You are about to dispatch this email to the recruiter:</p>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-150 text-neutral-800 font-mono font-semibold">
                  {selectedThread.candidateName} &lt;{selectedThread.candidateEmail}&gt;
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-150 max-h-36 overflow-y-auto italic text-[11px]">
                  {customDraft}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-1/2 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-bold border border-neutral-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedSend}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
