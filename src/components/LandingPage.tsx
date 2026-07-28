/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Sparkles, Shield, Mail, Zap, Check, CheckCircle2, ChevronRight, 
  RefreshCw, Play, Laptop, FileText, Calendar, Compass, Star, TrendingUp, Cpu,
  Inbox, Send, Terminal, AlertCircle, Bell, User, Clock, Filter, Moon, Sun,
  Layers, Lock, Database, Search, MessageSquare, Briefcase, ChevronDown, Globe,
  Award, DollarSign, ArrowUpRight, BarChart3, Settings, Menu, X, CheckSquare, AlertTriangle, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, Theme } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  theme?: Theme;
  onThemeToggle?: () => void;
}

export default function LandingPage({ onNavigate, theme = 'dark', onThemeToggle }: LandingPageProps) {
  const isLight = theme === 'light';

  // State managers
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [selectedDashboardTab, setSelectedDashboardTab] = useState<'applications' | 'calendar' | 'emails' | 'analytics'>('emails');
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'user', text: "Find remote React internships above ₹10 LPA." },
    { sender: 'ai', text: "Analyzing 42 active sources... Found 23 matching jobs. I have auto-applied to 14 of them on your behalf. There are 9 awaiting your manual review. Additionally, I detected replies from recruiters at Zoho and Freshworks. You have an interview scheduled for tomorrow at 2:00 PM!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTypingChat, setIsTypingChat] = useState(false);

  // Resume Score State (Interactive Keyword addition in Hero)
  const [resumeKeywords, setResumeKeywords] = useState<string[]>(['React 19', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Next.js']);
  const [keywordInput, setKeywordInput] = useState('');
  
  // Gmail Sync State
  const [activeGmailFolder, setActiveGmailFolder] = useState<'all' | 'recruiter' | 'assessment' | 'offer' | 'spam'>('recruiter');
  const [selectedGmailId, setSelectedGmailId] = useState<string>('g-1');
  const [aiDraftPreset, setAiDraftPreset] = useState<'accept' | 'decline' | 'negotiate'>('accept');
  const [typedDraftText, setTypedDraftText] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  // Interactive Salary Predictor State
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [skillComplexity, setSkillComplexity] = useState<number>(80);

  // Active pricing billing frequency
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Live Dashboard Animation states
  const [heroSearchIndex, setHeroSearchIndex] = useState(0);
  const [heroSearchProgress, setHeroSearchProgress] = useState(10);
  const [heroEventIndex, setHeroEventIndex] = useState(0);

  // ----------------------------------------------------
  // SIMULATION ENGINES
  // ----------------------------------------------------
  const searchingCompanies = [
    { name: 'Google', domain: 'google.com', role: 'Staff UI Engineer', match: 96 },
    { name: 'Microsoft', domain: 'microsoft.com', role: 'Senior React Developer', match: 91 },
    { name: 'Amazon', domain: 'amazon.com', role: 'Front-End Architect', match: 89 },
    { name: 'Zoho', domain: 'zoho.com', role: 'Lead Design Engineer', match: 94 },
    { name: 'TCS', domain: 'tcs.com', role: 'SDE-II React Specialist', match: 82 },
    { name: 'Infosys', domain: 'infosys.com', role: 'Tech Architect (UI)', match: 80 }
  ];

  const heroSimulationEvents = [
    { text: "Scanning Google Enterprise Boards...", badge: "SEARCHING", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { text: "✔ Match Identified: Zoho React Lead (94% Compatibility)", badge: "MATCHED", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { text: "Submitting application to Zoho Careers Portal...", badge: "APPLYING", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { text: "Application compiled and dispatched successfully", badge: "DISPATCHED", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    { text: "New outreach email detected from Microsoft HR", badge: "INBOUND", color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
    { text: "Synthesized secure draft response (Accepting Interview)", badge: "DRAFT_READY", color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" }
  ];

  // Rolling Activity Log for Timeline section
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, time: "09:12 AM", text: "Searching remote software roles in San Francisco...", status: "active", icon: Search },
    { id: 2, time: "09:18 AM", text: "Auto-applied to Lead Frontend Architect at Zoho", status: "success", icon: Zap },
    { id: 3, time: "09:21 AM", text: "Classified outreach from Microsoft HR as [INTERVIEW REQUEST]", status: "warning", icon: Mail },
    { id: 4, time: "09:23 AM", text: "Synchronized interview slot: Thursday 3:00 PM EST", status: "info", icon: Calendar },
    { id: 5, time: "09:30 AM", text: "Parsed updated CV: Optimized Next.js App Router vectors", status: "success", icon: FileText },
    { id: 6, time: "09:31 AM", text: "Intercepted & quarantined 8 promotional recruitment messages", status: "muted", icon: Shield }
  ]);

  // Interval Loop for Hero Dashboard Animations
  useEffect(() => {
    const crawlerInterval = setInterval(() => {
      setHeroSearchIndex((prev) => (prev + 1) % searchingCompanies.length);
      setHeroSearchProgress(0);
    }, 4000);

    const progressInterval = setInterval(() => {
      setHeroSearchProgress((prev) => Math.min(prev + 2.5, 100));
    }, 100);

    const eventInterval = setInterval(() => {
      setHeroEventIndex((prev) => (prev + 1) % heroSimulationEvents.length);
    }, 3200);

    return () => {
      clearInterval(crawlerInterval);
      clearInterval(progressInterval);
      clearInterval(eventInterval);
    };
  }, []);

  // Interval Loop for Timeline Activity Updates
  useEffect(() => {
    const activityInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const actions = [
        { text: "Crawled 18 new listings on Vercel Requisition Board", icon: Search, status: "active" },
        { text: "Calculated match rate of 96% for Stripe System UI Dev", icon: Award, status: "success" },
        { text: "Injected tailored cover letter to Linear Careers portal", icon: Zap, status: "success" },
        { text: "Draft reply ready for Sarah Jenkins (Talent Acquisition)", icon: MessageSquare, status: "info" },
        { text: "Quarantined crypto placement spam from inbox", icon: Shield, status: "muted" }
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setTimelineEvents((prev) => [
        { id: Date.now(), time: timeStr, text: randomAction.text, status: randomAction.status, icon: randomAction.icon },
        ...prev.slice(0, 5)
      ]);
    }, 5000);

    return () => clearInterval(activityInterval);
  }, []);

  // Sync Draft Text generation based on preset and email click
  useEffect(() => {
    simulateTypeDraft();
  }, [selectedGmailId, aiDraftPreset]);

  const simulateTypeDraft = () => {
    setIsGeneratingDraft(true);
    let rawTemplate = "";
    
    const emailObj = gmailMessages.find(g => g.id === selectedGmailId);
    const company = emailObj?.company || "Prospective Team";
    const sender = emailObj?.sender || "Acquisition Lead";

    if (aiDraftPreset === 'accept') {
      rawTemplate = `Hi ${sender},\n\nThank you for reaching out! I would be absolutely thrilled to schedule a technical session to discuss the position at ${company}.\n\nWednesday at 2:00 PM EST works beautifully on my end. I look forward to connecting.\n\nBest regards,\nAlex Mercer`;
    } else if (aiDraftPreset === 'decline') {
      rawTemplate = `Hi ${sender},\n\nThank you for the note and for considering my profile. While I highly respect ${company}, I am currently prioritizing roles that align strictly with Principal Architect structures.\n\nLet's stay in touch for future opportunities.\n\nBest,\nAlex Mercer`;
    } else {
      rawTemplate = `Hi ${sender},\n\nThank you for the offer. I am incredibly excited about the prospect of joining ${company} as a Principal Architect.\n\nBefore finalizing the credentials, I wanted to discuss if there is flexibility on the base target salary to better align with my benchmark of ₹24,00,000 / year.\n\nWarmly,\nAlex Mercer`;
    }

    setTypedDraftText("");
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < rawTemplate.length) {
        setTypedDraftText((prev) => prev + rawTemplate.charAt(currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsGeneratingDraft(false);
      }
    }, 3);

    return () => clearInterval(interval);
  };

  // Chat Prompt Suggestions handlers
  const handleChatPromptClick = (prompt: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: prompt }]);
    setIsTypingChat(true);
    
    setTimeout(() => {
      setIsTypingChat(false);
      let reply = "";
      if (prompt.includes("₹10 LPA")) {
        reply = "I've initiated an automated pipeline search matching Remote React positions with base rewards > ₹10 LPA. Found 23 targets. Generated & submitted custom documents for 14. Zoho and Freshworks pipelines have already active recruiters requesting conversations. Calendar sync complete.";
      } else if (prompt.includes("Zoho interview")) {
        reply = "Analyzing Zoho Lead Frontend interview guidelines. I have gathered the top 3 focus areas from our history vectors: 1) React 19 State Optimizations, 2) Core Web Vitals profiling, 3) High-performance rendering patterns. I've populated the calendar study widget with custom preparation material.";
      } else if (prompt.includes("resume keywords")) {
        reply = "Adding high-leverage credentials [Next.js App Router, LLM Tool Calling, Tailwind CSS v4] has pushed your index rating to 94% across 14 target enterprise job specifications. Your profile is optimized and ready for auto-submissions.";
      } else {
        reply = "HireGenie core pilot is monitoring job streams. Let me know what role specifications, locations, or package brackets you want configured in your live pipelines.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1000);
  };

  // Manual chat submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const input = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: input }]);
    setIsTypingChat(true);

    setTimeout(() => {
      setIsTypingChat(false);
      const reply = `Search sequence initialized: Scanning live job streams for "${input}". I have updated your AI profile vectors with this requirement and matched 5 potential candidates on your dashboard.`;
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1200);
  };

  // Resume Score calculations
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;
    if (!resumeKeywords.includes(keywordInput.trim())) {
      setResumeKeywords(prev => [...prev, keywordInput.trim()]);
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setResumeKeywords(prev => prev.filter(k => k !== kw));
  };

  const calculatedResumeScore = Math.min(64 + resumeKeywords.length * 6, 98);

  // Raw mock database
  const gmailMessages = [
    { id: 'g-1', sender: "Sarah Jenkins", company: "Stripe", subject: "Urgent: Interview Schedule — Staff UI Engineer Requisition", body: "We reviewed your portfolio and were extremely impressed by your command of React and modern micro-frontends. Let's schedule a 45-minute deep-dive this Wednesday.", category: "recruiter", urgency: "High", time: "Just Now" },
    { id: 'g-2', sender: "Devon Keats", company: "OpenAI", subject: "Opportunity: Developer Relations Lead (AI Engines)", body: "I came across your GitHub contributions. We are actively scaling our relations team and need developers who can build elegant Gemini UI demos. Open to a chat?", category: "recruiter", urgency: "High", time: "2 hours ago" },
    { id: 'g-3', sender: "Vercel Platform", company: "Vercel", subject: "Required Technical Assessment: Staff System Engineer", body: "Please complete this offline architecture assessment within 4 days to proceed to the main panel interview.", category: "assessment", urgency: "Medium", time: "1 day ago" },
    { id: 'g-4', sender: "Zoho Careers", company: "Zoho", subject: "Official Offer Letter - Principal Full Stack Engineer", body: "We are pleased to offer you the position. Find attached the contract stating basic salary details and benefits package.", category: "offer", urgency: "Critical", time: "2 days ago" },
    { id: 'g-5', sender: "Newsletter Bot", company: "CryptoDaily", subject: "Buy tokens now! Guaranteed 100x return in 3 days", body: "This is a premium trading alert for cryptocurrency. Don't miss this massive spike...", category: "spam", urgency: "Low", time: "4 hours ago" }
  ];

  const filteredGmailMessages = gmailMessages.filter(msg => {
    if (activeGmailFolder === 'all') return true;
    return msg.category === activeGmailFolder;
  });

  // Color mapping based on theme
  const canvasBg = isLight ? 'bg-[#F8FAFC]' : 'bg-[#090D16]';
  const cardBgStyle = isLight ? 'bg-white border-[#E2E8F0]' : 'bg-[#131B2E]/90 border-slate-800/80 backdrop-blur-xl';
  const darkSubBg = isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/40 border-slate-900/60';
  const textTitle = isLight ? 'text-[#0F172A]' : 'text-slate-100';
  const textMuted = isLight ? 'text-[#64748B]' : 'text-slate-400';
  const textSub = isLight ? 'text-slate-400' : 'text-slate-500';
  const borderCol = isLight ? 'border-[#E2E8F0]' : 'border-slate-800/70';
  const inputBgStyle = isLight ? 'bg-slate-50 border-slate-200 text-[#0F172A]' : 'bg-[#090D16] border-slate-800 text-slate-100';

  return (
    <div className={`min-h-screen transition-all duration-300 selection:bg-indigo-500/20 selection:text-indigo-400 antialiased font-sans ${canvasBg} overflow-x-hidden`}>
      
      {/* ----------------------------------------------------
          1. STICKY PREMIUM HEADER
          ---------------------------------------------------- */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ${borderCol} ${isLight ? 'bg-white/85 shadow-sm shadow-slate-200/60' : 'bg-[#090D16]/90 shadow-sm shadow-black/30'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          
          {/* Logo with hover animation */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onNavigate('landing')}
            id="header-logo-container"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className={`font-display font-black text-xl tracking-tight ${textTitle} group-hover:opacity-90 transition-opacity`}>
              HireGenie<span className="text-[#4F46E5]">AI</span>
            </span>
          </div>

          {/* Nav Items with animated underlines */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
            {[
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Features', href: '#features' },
              { label: 'Dashboard', href: '#dashboard-showcase' },
              { label: 'AI Chat', href: '#ai-chat' },
              { label: 'Pricing', href: '#pricing' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-slate-400 hover:text-[#4F46E5] transition-colors duration-200 py-1 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Action buttons & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            
            <button 
              onClick={onThemeToggle}
              className={`p-2.5 rounded-xl border ${borderCol} hover:bg-indigo-500/8 transition-all duration-200 text-slate-400 hover:text-[#4F46E5] hover:border-indigo-500/30 cursor-pointer`}
              title="Toggle Theme"
              id="theme-toggle-btn"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => onNavigate('login')}
              className={`hidden sm:inline-flex text-sm font-semibold px-4 py-2 border ${borderCol} rounded-xl transition-all duration-200 cursor-pointer ${isLight ? 'hover:bg-slate-50 hover:border-slate-300 text-slate-700' : 'hover:bg-[#131B2E] text-slate-300 hover:border-slate-600'}`}
              id="header-login-btn"
            >
              Sign In
            </button>
            
            <button 
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#4F46E5] to-[#6D28D9] rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/35 hover:shadow-xl active:scale-95 active:translate-y-0"
              id="header-signup-btn"
            >
              Get Started Free
            </button>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl border ${borderCol} text-slate-400 hover:text-[#4F46E5] hover:border-indigo-500/30 cursor-pointer transition-all duration-200`}
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`lg:hidden border-t ${borderCol} p-6 space-y-2 ${isLight ? 'bg-white/98' : 'bg-[#0A0F1E]/98'} shadow-2xl shadow-black/20 backdrop-blur-xl absolute w-full left-0`}
              id="mobile-menu-dropdown"
            >
              <div className="flex flex-col gap-1 font-semibold">
                {[
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'OS Features', href: '#features' },
                  { label: 'Live Dashboard', href: '#dashboard-showcase' },
                  { label: 'AI Chatbot', href: '#ai-chat' },
                  { label: 'Pricing', href: '#pricing' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-500/5 transition-all duration-150`}
                  >
                    {item.label}
                  </a>
                ))}
                <div className={`my-2 border-t ${borderCol}`} />
                <button 
                  onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }}
                  className="w-full text-center py-3 font-bold border border-indigo-500/25 text-[#4F46E5] rounded-xl hover:bg-indigo-500/8 cursor-pointer transition-all duration-200"
                >
                  Sign In to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ----------------------------------------------------
          2. HERO SECTION: FULL-SCREEN AI WORKSPACE
          ---------------------------------------------------- */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 overflow-hidden min-h-screen flex items-center dot-grid">
        {/* Premium Ambient Glow Effects */}
        <div className="glow-blob top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/12" />
        <div className="glow-blob bottom-10 right-0 w-[600px] h-[400px] bg-purple-500/8" style={{ animationDelay: '1.5s' }} />
        <div className="glow-blob top-1/2 left-0 w-[300px] h-[300px] bg-violet-500/6" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Hero Left: Copywriting with Staggered Motion */}
          <div className="lg:col-span-5 text-left space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/25 rounded-full text-xs font-bold text-[#4F46E5] tracking-wide"
              id="hero-badge"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#7C3AED]" />
              <span>THE COGNITIVE AUTOPILOT ERA</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`text-5xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.04] ${textTitle}`}
              id="hero-title"
            >
              Meet Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-indigo-400 pb-1 inline-block">
                AI Career Agent
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`text-base sm:text-lg leading-relaxed ${textMuted} max-w-lg`}
              id="hero-description"
            >
              Your AI automatically searches jobs, applies based on your preferences, manages recruiter emails, prepares you for interviews, and helps you land your dream job.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-3.5 pt-2"
            >
              <button 
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#6D28D9] text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-indigo-500/35 hover:shadow-2xl active:scale-95 active:translate-y-0 group"
                id="hero-primary-cta"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
              
              <a 
                href="#how-it-works"
                className={`w-full sm:w-auto px-8 py-4 border ${borderCol} hover:border-indigo-500/40 ${isLight ? 'bg-white hover:bg-indigo-500/3 text-slate-700' : 'bg-white/4 hover:bg-white/6 text-slate-300'} font-bold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 group`}
                id="hero-secondary-cta"
              >
                <Play className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20 group-hover:scale-110 transition-transform duration-200" />
                <span>Watch Demo</span>
              </a>
            </motion.div>

            {/* Mini dashboard summary stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-2 gap-6 pt-6 border-t ${isLight ? 'border-slate-200/80' : 'border-slate-800/30'}`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">Active Crawler Nodes</span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]" />
                  </span>
                  <span className={`text-xl font-black font-mono ${textTitle}`}>1,420<span className="text-xs text-slate-500 font-normal ml-0.5">/sec</span></span>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">Autonomously Placed</span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                  <span className={`text-xl font-black font-mono ${textTitle}`}>₹14.2 Cr<span className="text-xs text-slate-500 font-normal ml-0.5">total</span></span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: LIVE AI WORKSPACE WITH FLOATING WIDGETS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
            id="hero-dashboard-container"
          >
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-3xl blur-2xl opacity-20 pointer-events-none animate-glow-pulse" />
            
            {/* Live Interactive OS Shell Frame */}
            <div className={`border ${borderCol} rounded-2xl shadow-2xl overflow-hidden relative ${cardBgStyle} hover:-translate-y-1 transition-transform duration-500 ease-out`}>
              
              {/* Window Header */}
              <div className={`px-4 py-3 border-b ${borderCol} flex items-center justify-between bg-slate-500/5`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-500/10 px-4 py-0.5 rounded-md font-mono text-[10px] text-[#4F46E5] font-bold">
                  <Lock className="w-2.5 h-2.5" />
                  <span>hiregenie-core.sys</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span>AUTOPILOT ENGINE</span>
                </div>
              </div>

              {/* Core Dashboard UI Content - Asymmetric Layout of Widgets */}
              <div className="p-6 space-y-6 text-left">
                
                {/* Active Thought System Banner */}
                <div className="bg-[#4F46E5]/5 border border-[#4F46E5]/15 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4F46E5]/15 rounded-lg text-[#4F46E5]">
                      <Cpu className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold block">Current Operation Log</span>
                      <span className="text-xs font-bold text-[#4F46E5] font-mono">
                        {heroSimulationEvents[heroEventIndex].text}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${heroSimulationEvents[heroEventIndex].color} shrink-0`}>
                    {heroSimulationEvents[heroEventIndex].badge}
                  </span>
                </div>

                {/* Sub bento arrangement of widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Widget 1: Searching Jobs Crawler */}
                  <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-3 relative overflow-hidden`} id="widget-crawler">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-800/10">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1">
                        <Compass className="w-3 h-3 text-[#4F46E5]" /> Crawling Streams
                      </span>
                      <span className="text-[9px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded">Active</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>Target: <span className="text-[#4F46E5] font-bold">{searchingCompanies[heroSearchIndex].name}</span></span>
                        <span className="text-[10px] font-mono text-[#4F46E5]">{searchingCompanies[heroSearchIndex].match}% Match</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 truncate">
                        {searchingCompanies[heroSearchIndex].role}
                      </div>

                      {/* Moving custom progress track */}
                      <div className="w-full bg-slate-800/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-full transition-all duration-100"
                          style={{ width: `${heroSearchProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Widget 2: Application Tracker Progress */}
                  <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-3`} id="widget-app-progress">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-800/10">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Autopilot Funnel</span>
                      <span className="text-[9px] font-mono text-slate-500">24h summary</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-1 bg-[#4F46E5]/5 border border-indigo-500/10 rounded">
                        <span className="block text-xs font-black font-mono text-[#4F46E5]">14</span>
                        <span className="block text-[7px] text-slate-500 uppercase font-bold font-mono">APPLIED</span>
                      </div>
                      <div className="p-1 bg-[#7C3AED]/5 border border-purple-500/10 rounded">
                        <span className="block text-xs font-black font-mono text-[#7C3AED]">4</span>
                        <span className="block text-[7px] text-slate-500 uppercase font-bold font-mono">INTVW</span>
                      </div>
                      <div className="p-1 bg-amber-500/5 border border-amber-500/10 rounded">
                        <span className="block text-xs font-black font-mono text-amber-500">2</span>
                        <span className="block text-[7px] text-slate-500 uppercase font-bold font-mono">ASSESS</span>
                      </div>
                      <div className="p-1 bg-[#22C55E]/5 border border-emerald-500/10 rounded">
                        <span className="block text-xs font-black font-mono text-[#22C55E]">1</span>
                        <span className="block text-[7px] text-slate-500 uppercase font-bold font-mono">OFFER</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 3: Resume Match Rate (INTERACTIVE CHIP SYSTEM) */}
                  <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-3`} id="widget-resume-score">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Dynamic Resume Scorer</span>
                      <span className="text-xs font-black font-mono text-[#4F46E5] bg-[#4F46E5]/10 px-1.5 py-0.5 rounded">
                        {calculatedResumeScore}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {resumeKeywords.map((kw, i) => (
                        <span 
                          key={i} 
                          onClick={() => handleRemoveKeyword(kw)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#4F46E5]/10 border border-indigo-500/15 rounded text-[9px] font-mono font-bold text-[#4F46E5] cursor-pointer hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-all"
                          title="Click to remove keyword"
                        >
                          <span>{kw}</span>
                          <span className="text-[8px] font-normal">×</span>
                        </span>
                      ))}
                    </div>

                    <form onSubmit={handleAddKeyword} className="flex gap-1">
                      <input 
                        type="text" 
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add skill (e.g. Docker, Next.js)" 
                        className={`text-[10px] px-2 py-1 rounded w-full outline-none border focus:border-[#4F46E5] ${inputBgStyle}`}
                      />
                      <button type="submit" className="px-2 py-1 bg-[#4F46E5] text-white rounded text-[10px] font-bold hover:bg-[#7C3AED] transition-colors cursor-pointer">
                        Add
                      </button>
                    </form>
                  </div>

                  {/* Widget 4: Interview Calendar Upcoming */}
                  <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-3`} id="widget-calendar-preview">
                    <div className="flex items-center justify-between border-b pb-1.5 border-slate-800/10">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7C3AED]" /> Confirmed Rounds
                      </span>
                      <span className="text-[9px] text-slate-500">2 Scheduled</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] font-bold">Stripe Architecture Round</span>
                          <span className="text-[8px] text-slate-500">With engineering leadership team</span>
                        </div>
                        <span className="text-[8px] font-mono bg-[#22C55E]/10 text-[#22C55E] px-1 py-0.5 rounded font-bold">Wed 2:00 PM</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Widget 5: Priority Recruiter Emails Sync */}
                <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-3`} id="widget-priority-emails">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-800/10">
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#EF4444]" /> Priority Inbox Intel
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">OAuth 2.0 Synced</span>
                  </div>

                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-300">Clara Oswald</span>
                        <span className="text-[8px] text-slate-500">Stripe Careers</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">
                        "Your portfolio matches our React 19 blueprint perfectly..."
                      </p>
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase bg-[#EF4444]/10 border border-rose-500/20 text-[#EF4444] px-2 py-0.5 rounded shrink-0">
                      INTERVIEW REQUEST
                    </span>
                  </div>
                </div>

                {/* Widget 6: Live AI Activity Feed Terminal */}
                <div className={`p-4 rounded-xl border ${borderCol} bg-slate-950/80 border-slate-900 font-mono text-[10px] text-slate-300 space-y-2`} id="widget-activity-terminal">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1 text-slate-500">
                    <span>SYS_DAEMON_LOG</span>
                    <span>TICKER ON</span>
                  </div>
                  <div className="space-y-1 h-20 overflow-y-auto scrollbar-none">
                    {timelineEvents.slice(0, 3).map((evt, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-slate-500 shrink-0">[{evt.time}]</span>
                        <span className="text-[#22C55E] shrink-0">✔</span>
                        <span className="truncate">{evt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ----------------------------------------------------
          3. LOGO CLOUD: BEAUTIFUL RUNNING LOGO MARQUEE
          ---------------------------------------------------- */}
      <section className={`py-14 border-y ${borderCol} ${isLight ? 'bg-slate-50/80' : 'bg-slate-900/20'} overflow-hidden`} id="social-proof">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">
            Trusted by engineers at the world's best product companies
          </p>
          <div className="relative flex overflow-x-hidden marquee-container">
            <div className="animate-marquee whitespace-nowrap flex gap-16 items-center font-display font-black text-base tracking-widest opacity-40 text-slate-500">
              {['APPLE','GOOGLE','MICROSOFT','AMAZON','STRIPE','VERCEL','LINEAR','NOTION','ZOHO','NETFLIX'].map((name, i) => (
                <span key={i} className="hover:opacity-70 transition-opacity duration-200">{name}</span>
              ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-16 items-center font-display font-black text-base tracking-widest opacity-40 text-slate-500" aria-hidden="true">
              {['APPLE','GOOGLE','MICROSOFT','AMAZON','STRIPE','VERCEL','LINEAR','NOTION','ZOHO','NETFLIX'].map((name, i) => (
                <span key={i}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. AI ACTIVITY TIMELINE SECTION: LIVE TIMELINE
          ---------------------------------------------------- */}
      <section className="py-24 px-6 relative max-w-7xl mx-auto" id="how-it-works">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">Autonomous Execution</span>
          <h2 className={`text-3xl font-black tracking-tight font-sans ${textTitle}`}>
            Your AI Agent Operating Timeline
          </h2>
          <p className={`text-sm ${textMuted}`}>
            While you sleep, focus on coding, or spend time with family, your Career Agent continuously monitors boards, submits applications, and handles incoming mail.
          </p>
        </div>

        {/* Premium Real-Time Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Column: Interactive Settings Node Tuning */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className={`p-6 rounded-2xl border ${borderCol} ${cardBgStyle} space-y-5 shadow-lg relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-[#4F46E5]">
                  <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider">Pilot Configuration</h3>
              </div>
              <p className={`text-xs ${textMuted} leading-relaxed`}>
                Configure threshold controls for your background agent's autonomous processing loops.
              </p>

              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Minimum Fit Suitability Index</span>
                    <span className="font-mono text-[#4F46E5] font-bold">{skillComplexity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="60" 
                    max="95" 
                    value={skillComplexity}
                    onChange={(e) => setSkillComplexity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Pilot Autopilot Intensity</span>
                    <span className="font-mono text-[#7C3AED] font-bold">Continuous Stream</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low (8h)', 'Medium (4h)', 'Autonomous (15m)'].map((mode, i) => (
                      <button 
                        key={i}
                        type="button"
                        onClick={() => setActiveWorkflowStep(i)}
                        className={`text-[10px] py-2 rounded-xl font-bold border transition-all duration-200 cursor-pointer ${
                          activeWorkflowStep === i 
                            ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-md shadow-indigo-500/15' 
                            : `border-slate-800/10 ${isLight ? 'bg-white hover:bg-slate-50 text-slate-600' : 'bg-slate-900 text-slate-400 hover:bg-slate-800/80 hover:text-white'}`
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${borderCol} bg-[#7C3AED]/4 border-[#7C3AED]/15 text-left relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#7C3AED]/10 rounded-lg text-[#7C3AED]">
                  <Shield className="w-4 h-4 shrink-0" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-slate-300">Privacy Safeguards</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Secure credentials run through Sandboxed OAuth 2.0 scopes. Your private metadata never teaches public models, securing your professional footprints.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Timeline list */}
          <div className="lg:col-span-7">
            <div className={`p-6 rounded-2xl border ${borderCol} ${cardBgStyle} text-left space-y-6 relative shadow-lg`}>
              
              <div className="flex items-center justify-between border-b pb-3 border-slate-800/10">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">Sequential System Telemetry</span>
                <span className="text-[9px] font-mono text-[#22C55E] animate-pulse font-extrabold flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> STREAM RUNNING
                </span>
              </div>

              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-2 scrollbar-none relative">
                {timelineEvents.map((evt, idx) => {
                  const IconComponent = evt.icon;
                  return (
                    <motion.div 
                      key={evt.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.25) }}
                      className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${
                        idx === 0 
                          ? 'bg-[#4F46E5]/10 border-indigo-500/25 shadow-md shadow-indigo-500/5' 
                          : `${borderCol} hover:bg-slate-500/5`
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg shrink-0 transition-transform duration-200 hover:scale-105 ${
                        evt.status === 'success' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                        evt.status === 'warning' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        evt.status === 'info' ? 'bg-indigo-500/10 text-indigo-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">{evt.time}</span>
                          {idx === 0 && (
                            <span className="text-[8px] font-mono bg-[#4F46E5] text-white px-2 py-0.5 rounded font-bold animate-pulse">
                              LATEST
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-bold transition-colors ${idx === 0 ? 'text-[#4F46E5]' : textTitle}`}>
                          {evt.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center pt-2.5 border-t border-slate-800/10">
                <span className="text-[10px] text-slate-500 font-mono">Telemetry sync interval: 5.0 seconds automatically</span>
              </div>


            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          5. FEATURES SECTION: ASYMMETRIC BENTO GRID
          ---------------------------------------------------- */}
      <section className="py-24 px-6 border-y border-slate-800/10 bg-slate-500/5 relative" id="features">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">Bento Engine Specification</span>
            <h2 className={`text-3xl font-black tracking-tight font-sans ${textTitle}`}>
              Fully Decoupled Cognitive Ecosystem
            </h2>
            <p className={`text-sm ${textMuted}`}>
              Every single module runs on high-fidelity custom scrapers, semantic parsing embeddings, and Google Workspace integrations to handle complex loops.
            </p>
          </div>

          {/* ASYMMETRIC BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Card 1: AI Job Matching (Span 6) */}
            <div className={`md:col-span-6 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} relative overflow-hidden group gradient-border hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/18 transition-all duration-500" />
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[#4F46E5]/10 rounded-xl text-[#4F46E5] group-hover:bg-[#4F46E5]/20 group-hover:scale-110 transition-all duration-300">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-[#4F46E5] font-bold opacity-60">NODE 01</span>
              </div>
              <h3 className="text-lg font-display font-bold mt-4 text-left">AI Job Matching</h3>
              <p className={`text-xs ${textMuted} text-left mt-2 leading-relaxed`}>
                Deep vector semantic matching indexes over 1,200 tech disciplines and aligns adjacent keywords, scoring job requirements against your portfolio.
              </p>
            </div>

            {/* Bento Card 2: Auto Apply (Span 6) */}
            <div className={`md:col-span-6 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} relative overflow-hidden group gradient-border hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/8 transition-all duration-300`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/8 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/18 transition-all duration-500" />
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[#7C3AED]/10 rounded-xl text-[#7C3AED] group-hover:bg-[#7C3AED]/20 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-6 h-6 group-hover:animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-[#7C3AED] font-bold opacity-60">NODE 02</span>
              </div>
              <h3 className="text-lg font-display font-bold mt-4 text-left">Autonomous Submission Pipeline</h3>
              <p className={`text-xs ${textMuted} text-left mt-2 leading-relaxed`}>
                One-click background dispatch automatically completes questionnaire details, maps experience answers, and constructs custom introductory arguments.
              </p>
            </div>

            {/* Bento Card 3: Email Intelligence (Span 4) */}
            <div className={`md:col-span-4 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} relative overflow-hidden group gradient-border hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/6 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 group-hover:bg-rose-500/20 group-hover:scale-110 transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold opacity-60">NODE 03</span>
              </div>
              <h3 className="text-lg font-display font-bold mt-4 text-left">Email Intelligence</h3>
              <p className={`text-xs ${textMuted} text-left mt-2 leading-relaxed`}>
                Directly syncs to Gmail, quarantine filters placement spams, and sorts conversations under recruiter invites or official offer proposals.
              </p>
            </div>

            {/* Bento Card 4: Resume Analyzer (Span 4) */}
            <div className={`md:col-span-4 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} relative overflow-hidden group gradient-border hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/6 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-[#22C55E] group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-[#22C55E] font-bold opacity-60">NODE 04</span>
              </div>
              <h3 className="text-lg font-display font-bold mt-4 text-left">Dynamic Resume Scorer</h3>
              <p className={`text-xs ${textMuted} text-left mt-2 leading-relaxed`}>
                Upload various CV structures to get immediate feedback of missing parameters, syntax structures, and keyword density.
              </p>
            </div>

            {/* Bento Card 5: Interview Coach (Span 4) */}
            <div className={`md:col-span-4 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} relative overflow-hidden group gradient-border hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/6 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-amber-500/10 rounded-xl text-[#F59E0B] group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-[#F59E0B] font-bold opacity-60">NODE 05</span>
              </div>
              <h3 className="text-lg font-display font-bold mt-4 text-left">Smart Interview Coach</h3>
              <p className={`text-xs ${textMuted} text-left mt-2 leading-relaxed`}>
                Generates hyper-focused test blueprints based on target role vectors, preparing responses mapped to company cultural standards.
              </p>
            </div>

            {/* Bento Card 6: Interactive Salary Predictor Widget (Span 8) */}
            <div className={`md:col-span-8 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} flex flex-col md:flex-row gap-6 justify-between items-stretch gradient-border hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/6 transition-all duration-300`} id="bento-salary-predictor">
              <div className="space-y-4 text-left md:max-w-md">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-indigo-500/10 rounded-lg text-[#4F46E5] hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold">Salary Expectation Modeler</h3>
                    <span className="text-[10px] font-mono text-slate-500">Live dynamic predictor engine</span>
                  </div>
                </div>
                <p className={`text-xs ${textMuted} leading-relaxed`}>
                  Adjust your commercial background profile vectors to predict potential market evaluation for fully remote senior allocations.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Relevant Experience (Years)</span>
                      <span className="text-[#4F46E5] font-mono">{experienceYears} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${borderCol} ${darkSubBg} flex flex-col justify-center items-center text-center shrink-0 min-w-[200px]`}>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Predicted Benchmark</span>
                <span className="text-2xl font-mono font-black text-[#22C55E] mt-1" id="predicted-salary-text">
                  ₹{(200000 + experienceYears * 150000).toLocaleString('en-IN')}
                  <span className="text-xs text-slate-500 font-normal"> / yr</span>
                </span>
                <span className="text-[8px] font-mono bg-emerald-500/10 text-[#22C55E] border border-emerald-500/10 px-2 py-0.5 rounded-full mt-3 font-bold">
                  92% PREDICTIVE ACCURACY
                </span>
              </div>
            </div>

            {/* Bento Card 7: Application Tracker (Span 4) */}
            <div className={`md:col-span-4 p-6 rounded-2xl border ${borderCol} ${cardBgStyle} relative overflow-hidden group gradient-border hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/6 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold opacity-60">NODE 08</span>
              </div>
              <h3 className="text-lg font-display font-bold mt-4 text-left">Visual Kanban Tracking</h3>
              <p className={`text-xs ${textMuted} text-left mt-2 leading-relaxed`}>
                Central pipelines displaying active submission structures, interviewer schedules, and upcoming study checklists.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          6. REALISTIC DOCK / SAAS SHOWCASE INTERACTIVE COMPONENT
          ---------------------------------------------------- */}
      <section className="py-24 px-6 relative max-w-7xl mx-auto" id="dashboard-showcase">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">Immersive SaaS Platform</span>
          <h2 className={`text-3xl font-black tracking-tight font-sans ${textTitle}`}>
            HireGenie Core Workspace
          </h2>
          <p className={`text-sm ${textMuted}`}>
            Explore the live interface. Inspect your dashboard, sync schedules, parse recruiter responses, and generate responses.
          </p>
        </div>

        {/* Dashboard Frame Container */}
        <div className={`border ${borderCol} rounded-2xl shadow-2xl overflow-hidden relative ${cardBgStyle}`} id="saas-dashboard-shell">
          
          {/* Top Panel Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/10 bg-slate-500/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 bg-indigo-500 rounded-lg" />
              <span className="font-bold text-sm tracking-tight">Alex Mercer Workspace</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-800/10 rounded-xl border border-slate-800/10">
              <button 
                onClick={() => setSelectedDashboardTab('emails')}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDashboardTab === 'emails' 
                    ? 'bg-[#4F46E5] text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gmail Sync
              </button>
              <button 
                onClick={() => setSelectedDashboardTab('applications')}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDashboardTab === 'applications' 
                    ? 'bg-[#4F46E5] text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Applications Board
              </button>
              <button 
                onClick={() => setSelectedDashboardTab('calendar')}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDashboardTab === 'calendar' 
                    ? 'bg-[#4F46E5] text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Interview Calendar
              </button>
              <button 
                onClick={() => setSelectedDashboardTab('analytics')}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDashboardTab === 'analytics' 
                    ? 'bg-[#4F46E5] text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Analytics Feed
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-xs">
              <span className="flex items-center gap-1.5 text-[#22C55E]">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-ping" />
                <span>ONLINE</span>
              </span>
            </div>
          </div>

          {/* GMAIL SYNC TAB: HIGHLY SPECIFIED GMAIL-INSPIRED INTERFACE */}
          {selectedDashboardTab === 'emails' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]" id="tab-gmail">
              
              {/* Mail Left Rail: Inbox Categories */}
              <div className="lg:col-span-3 border-r border-slate-800/10 p-4 space-y-6 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block px-2">Folders</span>
                  <div className="space-y-1">
                    {[
                      { id: 'recruiter', label: 'Recruiter Outreach', count: 2, icon: Inbox },
                      { id: 'assessment', label: 'Technical Assessments', count: 1, icon: Clock },
                      { id: 'offer', label: 'Offer Letters', count: 1, icon: Award },
                      { id: 'spam', label: 'Quarantined Spam', count: 1, icon: Shield },
                      { id: 'all', label: 'All Synced Mail', count: 5, icon: Mail }
                    ].map((folder) => {
                      const FolderIcon = folder.icon;
                      return (
                        <button 
                          key={folder.id}
                          onClick={() => { setActiveGmailFolder(folder.id as any); setSelectedGmailId(folder.id === 'all' ? 'g-1' : (folder.id === 'recruiter' ? 'g-1' : (folder.id === 'assessment' ? 'g-3' : (folder.id === 'offer' ? 'g-4' : 'g-5')))); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeGmailFolder === folder.id 
                              ? 'bg-[#4F46E5] text-white' 
                              : `text-slate-400 ${isLight ? 'hover:bg-slate-100 hover:text-[#0F172A]' : 'hover:bg-slate-900 hover:text-white'}`
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <FolderIcon className="w-4 h-4 shrink-0" />
                            <span>{folder.label}</span>
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 font-mono rounded ${
                            activeGmailFolder === folder.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {folder.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-left">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block">OAuth Synchronized</span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    HireGenie AI monitors secondary keywords directly in real-time, matching job tracking boards.
                  </p>
                </div>
              </div>

              {/* Mail Middle: Mail List */}
              <div className="lg:col-span-4 border-r border-slate-800/10 p-4 space-y-4 text-left">
                <div className="flex items-center justify-between border-b pb-2 border-slate-800/10">
                  <span className="text-xs font-bold text-slate-400">Classified Conversations</span>
                  <span className="text-[10px] font-mono text-slate-500">OAuth Vetted</span>
                </div>

                <div className="space-y-2 max-h-[440px] overflow-y-auto scrollbar-none pr-1">
                  {filteredGmailMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      onClick={() => setSelectedGmailId(msg.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        selectedGmailId === msg.id 
                          ? 'bg-[#4F46E5]/10 border-indigo-500/20' 
                          : `border-slate-800/10 ${isLight ? 'bg-white hover:bg-slate-50' : 'bg-slate-900/40 hover:bg-slate-900/60'}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold block truncate max-w-[120px]">{msg.sender}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{msg.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 truncate">{msg.subject}</div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {msg.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mail Right: Mail Detail View & Generative AI Draft Builder */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between text-left space-y-6">
                {gmailMessages.filter(msg => msg.id === selectedGmailId).map((msg) => (
                  <div key={msg.id} className="space-y-6 h-full flex flex-col justify-between">
                    
                    {/* Header Details */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold">{msg.sender}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{msg.company} Careers</span>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          msg.urgency === 'Critical' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-rose-500/10' :
                          msg.urgency === 'High' ? 'bg-pink-500/10 text-pink-500 border border-pink-500/10' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                        }`}>
                          {msg.urgency} Urgency
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-400">
                        {msg.subject}
                      </div>

                      <p className={`text-xs leading-relaxed ${textMuted} p-3.5 rounded-xl border ${borderCol} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
                        {msg.body}
                      </p>
                    </div>

                    {/* AI Autopilot Draft suggestions */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-[#7C3AED]" /> Generative AI Draft suggestions
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Real-time vector model</span>
                      </div>

                      {/* Draft Presets Toggle */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'accept', label: 'Accept Meeting' },
                          { id: 'decline', label: 'Respectful Decline' },
                          { id: 'negotiate', label: 'Salary Negotiation' }
                        ].map((btn) => (
                          <button 
                            key={btn.id}
                            onClick={() => setAiDraftPreset(btn.id as any)}
                            className={`text-[10px] py-2 rounded font-bold border transition-all cursor-pointer ${
                              aiDraftPreset === btn.id 
                                ? 'bg-[#4F46E5] border-[#4F46E5] text-white' 
                                : `border-slate-800/10 ${isLight ? 'bg-white text-slate-600' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Type-simulating dynamic field */}
                      <div className={`p-4 rounded-xl border ${borderCol} font-mono text-[10px] relative min-h-[140px] leading-relaxed select-none ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#090D16] text-slate-300'}`}>
                        {isGeneratingDraft && (
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[8px] text-indigo-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-ping" />
                            <span>GENERATING...</span>
                          </div>
                        )}
                        <span className="whitespace-pre-line">{typedDraftText}</span>
                        <span className="w-1.5 h-3.5 bg-indigo-500 inline-block animate-pulse ml-0.5" />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button 
                          className="px-4 py-2 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                          onClick={() => alert(`Your reply draft has been synchronized to Gmail. Check your Drafts folder!`)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Push Reply to Gmail Drafts</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* APPLICATION TAB - PIPELINE BOARD */}
          {selectedDashboardTab === 'applications' && (
            <div className="p-6 min-h-[500px] text-left space-y-6" id="tab-applications">
              <div className="flex items-center justify-between border-b pb-4 border-slate-800/10">
                <div>
                  <h3 className="text-base font-bold font-sans">Active Submissions Pipelines</h3>
                  <p className={`text-xs ${textMuted} mt-0.5`}>All background applications managed and verified by HireGenie</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Autopilot Status:</span>
                  <span className="text-[10px] bg-[#22C55E]/10 border border-[#22C55E]/15 text-[#22C55E] font-mono px-2 py-0.5 rounded font-bold">
                    STEADY STATE
                  </span>
                </div>
              </div>

              {/* Kanban columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Submissions Out', count: 14, color: 'text-indigo-400 border-indigo-400', roles: [
                    { company: 'Zoho Corporation', role: 'Staff Frontend Developer', status: 'Pending Review', score: 94 },
                    { company: 'Microsoft', role: 'React Core Platform', status: 'Document Verified', score: 91 }
                  ]},
                  { title: 'Technical Assessments', count: 2, color: 'text-amber-500 border-amber-500', roles: [
                    { company: 'Vercel Inc.', role: 'Senior edge infrastructure UI', status: 'Assessment Pending', score: 96 }
                  ]},
                  { title: 'Confirmed Round', count: 4, color: 'text-emerald-500 border-emerald-500', roles: [
                    { company: 'Stripe Careers', role: 'Staff UI Architect', status: 'Interview Scheduled', score: 96 }
                  ]},
                  { title: 'Official Offer', count: 1, color: 'text-pink-500 border-pink-500', roles: [
                    { company: 'OpenAI Dev Relations', role: 'Developer Relations Specialist', status: 'Offer Received', score: 89 }
                  ]}
                ].map((col, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-4 flex flex-col justify-between min-h-[300px]`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2 border-slate-800/10">
                        <span className="text-xs font-black font-sans">{col.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-400">{col.count}</span>
                      </div>

                      <div className="space-y-3">
                        {col.roles.map((item, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border ${borderCol} ${isLight ? 'bg-white shadow-sm' : 'bg-[#090D16]/90'} space-y-2`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{item.company}</span>
                              <span className="text-[10px] font-mono font-black text-[#4F46E5]">{item.score}% Match</span>
                            </div>
                            <h4 className="text-xs font-bold leading-tight">{item.role}</h4>
                            <span className="text-[9px] text-slate-500 block">{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => alert(`Syncing updates directly with ${col.title} portal...`)}
                      className={`w-full py-1.5 text-[10px] font-bold rounded-lg border ${borderCol} text-slate-400 hover:text-white transition-all cursor-pointer`}
                    >
                      Sync Pipeline Portal
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERVIEW CALENDAR TAB */}
          {selectedDashboardTab === 'calendar' && (
            <div className="p-6 min-h-[500px] text-left grid grid-cols-1 lg:grid-cols-12 gap-8" id="tab-calendar">
              
              {/* Left Column: Scheduled interviews */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono text-slate-400">Confirmed Interview Schedule</h3>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">2 TARGETS READY</span>
                </div>

                <div className="space-y-3">
                  {[
                    { company: 'Stripe', role: 'Staff UI Architect', date: 'Wednesday, July 23', time: '2:00 PM EST', status: 'Ready', desc: 'Panel interview covering high-performance micro-frontends and architecture.' },
                    { company: 'Microsoft', role: 'Senior React Developer', date: 'Thursday, July 24', time: '11:30 AM EST', status: 'Ready', desc: 'Initial conversational round on engineering scalability and team alignment.' }
                  ].map((evt, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-400 uppercase font-mono">{evt.company} Round</span>
                        <span className="text-[10px] font-mono bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded font-bold">CONFIRMED</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{evt.role}</h4>
                        <span className="text-[10px] text-slate-500 block font-mono mt-1">{evt.date} • {evt.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{evt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Preparation Assistant */}
              <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-800/10 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#7C3AED]/10 rounded-lg text-[#7C3AED]">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Stripe Prep Assistant</h3>
                      <span className="text-[10px] font-mono text-slate-500">Live Custom Interview Flashcards</span>
                    </div>
                  </div>

                  <p className={`text-xs ${textMuted} leading-relaxed`}>
                    Based on Stripe UI specifications, we have gathered custom technical interview cards to review immediately:
                  </p>

                  <div className="space-y-3">
                    {[
                      { q: "Explain the React 19 transition API and how stripe coordinates state updates.", a: "Transitions let you mark updates as non-blocking. Spends rendering time while keeping the UI immediately responsive during heavy changes." },
                      { q: "How do you handle micro-frontend orchestration secure sandboxes?", a: "Isolating widgets within custom packages using ES Modules or iframe portals to guarantee telemetry doesn't overlap." }
                    ].map((card, i) => (
                      <div key={i} className={`p-3.5 rounded-xl border ${borderCol} ${isLight ? 'bg-slate-50' : 'bg-slate-900/60'} text-left space-y-1.5`}>
                        <div className="text-[11px] font-black text-slate-300">CARD 0{i+1}: {card.q}</div>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">"{card.a}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/10">
                  <button 
                    onClick={() => alert(`Launching mock voice interactive simulation session... Please enable microphone permissions in your settings.`)}
                    className="w-full py-3 bg-[#4F46E5] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Launch Voice Simulation Round</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ANALYTICS TAB */}
          {selectedDashboardTab === 'analytics' && (
            <div className="p-6 min-h-[500px] text-left grid grid-cols-1 lg:grid-cols-12 gap-8" id="tab-analytics">
              
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <h3 className="text-base font-bold font-sans">Ecosystem Performance Metrics</h3>
                  <p className={`text-xs ${textMuted} mt-0.5`}>Review automated crawler and submission indices</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-1`}>
                    <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Crawled Req Streams</span>
                    <span className="text-xl font-mono font-black text-indigo-400">14,249</span>
                    <span className="text-[8px] font-mono text-[#22C55E] block">+12% from yesterday</span>
                  </div>
                  <div className={`p-4 rounded-xl border ${borderCol} ${darkSubBg} space-y-1`}>
                    <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Auto Application Dispatched</span>
                    <span className="text-xl font-mono font-black text-[#7C3AED]">142</span>
                    <span className="text-[8px] font-mono text-[#22C55E] block">100% submission verified</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Pipeline Success Ratio</span>
                  <div className="space-y-1.5 text-xs font-bold text-slate-400">
                    <div className="flex justify-between">
                      <span>Google Index</span>
                      <span>94% Success</span>
                    </div>
                    <div className="w-full bg-slate-800/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#4F46E5] h-full" style={{ width: '94%' }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span>Microsoft Index</span>
                      <span>89% Success</span>
                    </div>
                    <div className="w-full bg-slate-800/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#7C3AED] h-full" style={{ width: '89%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Trend - Tailwind CSS custom SVG representation */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div className={`p-6 rounded-2xl border ${borderCol} ${darkSubBg} h-full flex flex-col justify-between space-y-6`}>
                  <div className="flex items-center justify-between border-b pb-3 border-slate-800/10">
                    <div>
                      <span className="text-xs font-bold block">Autonomous Dispatch Yield Map</span>
                      <span className="text-[10px] text-slate-500 block font-mono">Matched score vectors VS time performance</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">14d chronological frame</span>
                  </div>

                  {/* SVG Custom Render Graph */}
                  <div className="w-full h-48 relative pt-2">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="4 4" />
                      
                      {/* Area Graph */}
                      <path d="M 0,160 Q 100,100 200,80 T 400,60 L 500,50 L 500,200 L 0,200 Z" fill="url(#chartGrad)" />
                      
                      {/* Line Graph */}
                      <path d="M 0,160 Q 100,100 200,80 T 400,60 L 500,50" fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
                      
                      {/* Interactive Dot Points */}
                      <circle cx="200" cy="80" r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="400" cy="60" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
                    </svg>

                    <div className="absolute top-1/3 left-1/3 p-2 rounded bg-slate-900 border border-slate-800 shadow text-[9px] font-mono text-left">
                      <span className="block font-bold text-white">Stripe UI Submission</span>
                      <span className="text-[#22C55E]">96% match vector aligned</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>JULY 08</span>
                    <span>JULY 12</span>
                    <span>JULY 16</span>
                    <span>JULY 20</span>
                    <span>JULY 24</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ----------------------------------------------------
          7. CHATGPT-LIKE CONVERSATION CLIENT
          ---------------------------------------------------- */}
      <section className="py-24 px-6 border-y border-slate-800/10 bg-slate-500/5 relative" id="ai-chat">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">Chat Assistant</span>
          <h2 className={`text-3xl font-black tracking-tight font-sans ${textTitle}`}>
            Ask Your Career Assistant
          </h2>
          <p className={`text-sm ${textMuted}`}>
            Instruct your private agent verbally to update criteria, search specified locations, or analyze incoming contracts.
          </p>
        </div>

        {/* ChatGPT Frame Shell */}
        <div className="max-w-4xl mx-auto relative" id="chat-widget-section">
          
          <div className="glow-blob -inset-2 bg-gradient-to-tr from-[#4F46E5]/10 to-[#7C3AED]/10 opacity-40 pointer-events-none" />

          <div className={`border ${borderCol} rounded-2xl shadow-2xl overflow-hidden relative ${cardBgStyle} flex flex-col justify-between min-h-[480px] hover:shadow-indigo-500/5 transition-all duration-300`}>
            
            {/* Terminal Top Bar */}
            <div className={`px-5 py-3.5 border-b ${borderCol} flex items-center justify-between bg-slate-500/5 text-xs text-slate-400`}>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />
                </div>
                <Terminal className="w-4 h-4 text-[#4F46E5]" />
                <span className="font-bold font-mono tracking-tight text-slate-300">HIREGENIE PILOT CLI v2.0.4</span>
              </div>
              <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded-md font-bold">
                SECURE AES-256
              </span>
            </div>

            {/* Chat list viewport */}
            <div className="p-6 space-y-6 flex-1 max-h-[360px] overflow-y-auto text-left scrollbar-none">
              
              <AnimatePresence initial={false}>
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Bot Icon */}
                    {msg.sender === 'ai' && (
                      <div className="p-2.5 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-xl text-white shrink-0 shadow-md shadow-indigo-500/15">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-xl shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#6D28D9] text-white rounded-tr-none' 
                        : `${isLight ? 'bg-slate-100 text-[#0F172A]' : 'bg-slate-900 text-slate-300'} border ${borderCol} rounded-tl-none`
                    }`}>
                      {msg.text}
                    </div>

                    {/* User Icon */}
                    {msg.sender === 'user' && (
                      <div className={`p-2.5 rounded-xl border ${borderCol} ${isLight ? 'bg-slate-100' : 'bg-slate-900'} shrink-0 shadow-sm`}>
                        <User className="w-4 h-4 text-[#4F46E5]" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTypingChat && (
                <div className="flex items-start gap-4 justify-start">
                  <div className="p-2.5 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-xl text-white shrink-0 animate-bounce">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className={`p-4 rounded-2xl text-xs ${isLight ? 'bg-slate-100' : 'bg-slate-900'} border ${borderCol} italic text-slate-500 font-medium`}>
                    Agent compiling target matrices...
                  </div>
                </div>
              )}

            </div>

            {/* Prompts Suggestions Shortcuts Grid */}
            <div className={`p-4 border-t ${borderCol} bg-slate-500/5 text-left space-y-2.5`}>
              <span className="text-[9px] font-mono text-slate-500 font-bold block uppercase tracking-wider">Suggested Directives</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Find remote React internships above ₹10 LPA.",
                  "Prepare me for Zoho interview focus areas.",
                  "Optimize my resume keywords for Vercel."
                ].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleChatPromptClick(prompt)}
                    className={`text-[10px] px-3.5 py-2 rounded-xl border ${borderCol} font-semibold transition-all duration-200 cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:-translate-y-0.5 shadow-sm active:translate-y-0 ${
                      isLight ? 'bg-white text-slate-700' : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual input box form */}
            <form onSubmit={handleChatSubmit} className={`p-4 border-t ${borderCol} flex gap-3`}>
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Instruct the Pilot Agent... (e.g., Change fit threshold to 90%)"
                className={`w-full outline-none px-4 py-3 text-xs rounded-xl border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all duration-200 ${inputBgStyle}`}
              />
              <button 
                type="submit" 
                className="px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:shadow-lg hover:shadow-indigo-500/20 text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          8. TESTIMONIALS SECTION: GLASS CARDS
          ---------------------------------------------------- */}
      <section className="py-24 px-6 relative max-w-7xl mx-auto" id="testimonials">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">Testimonials</span>
          <h2 className={`text-3xl font-black tracking-tight font-sans ${textTitle}`}>
            Success Stories from Elite Builders
          </h2>
          <p className={`text-sm ${textMuted}`}>
            Professionals who automated their job hunt and unlocked staff allocations.
          </p>
        </div>

        {/* Asymmetric Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-start">
          
          {[
            { name: 'Rohan Sharma', role: 'Staff UI Architect at Stripe', text: 'HireGenie completely flipped my recruitment pipeline. It automatically scanned, scored, and applied to Stripe. The Gmail synchronizer drafted response slots perfectly. Saved me hundreds of hours of manual browsing!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', delay: 0 },
            { name: 'Kavita Patel', role: 'Lead Frontend Developer at Freshworks', text: 'Perfect experience. The dynamic resume scorer gave me real recommendations of missing credentials. Adding them increased my matching index immediately to 94%, landing me technical assessments within 3 days.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', delay: 0.1 },
            { name: 'Ethan Hunt', role: 'Developer Relations Specialist at Vercel', text: 'The voice interview simulator is incredible! It prepared me specifically for micro-frontend optimization topics. The pricing model paid for itself on day one. Strongly recommended for product engineers.', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', delay: 0.2 }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
              className={`p-7 rounded-2xl border ${borderCol} ${cardBgStyle} space-y-5 shadow-lg flex flex-col justify-between h-full gradient-border hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Decorative Quote Mark */}
              <span className="absolute top-4 right-6 text-6xl font-display font-black text-[#4F46E5]/8 select-none leading-none group-hover:text-[#4F46E5]/14 transition-colors duration-300">&rdquo;</span>

              <div className="space-y-4 relative">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed ${textMuted} font-medium`}>
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className={`flex items-center gap-3.5 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/30'} mt-2`}>
                <img
                  referrerPolicy="no-referrer"
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/20 ring-offset-1 ring-offset-transparent"
                />
                <div>
                  <h4 className="text-sm font-display font-bold">{item.name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ----------------------------------------------------
          9. PREMIUM PRICING PLANS
          ---------------------------------------------------- */}
      <section className="py-24 px-6 border-y border-slate-800/10 bg-slate-500/5 relative" id="pricing">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">Premium Brackets</span>
            <h2 className={`text-3xl font-black tracking-tight font-sans ${textTitle}`}>
              Transparent Value Calibration
            </h2>
            <p className={`text-sm ${textMuted}`}>
              Unlock premium background agents, automated recruiter drafting pipelines, and priority developer flashcards.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-2.5 p-1 bg-slate-800/10 rounded-xl border border-slate-800/10 mt-4">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'monthly' ? 'bg-[#4F46E5] text-white' : 'text-slate-400'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'yearly' ? 'bg-[#4F46E5] text-white' : 'text-slate-400'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 text-left max-w-5xl mx-auto items-stretch">
            
            {/* Tier 1: Free Starter */}
            <div className={`p-8 rounded-2xl border ${borderCol} ${cardBgStyle} flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 shadow-lg`}>
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Starter Core</span>
                  <h3 className="text-2xl font-display font-bold mt-1">Free Tier</h3>
                  <p className={`text-xs ${textMuted} mt-2`}>Essential autonomous tools for student exploration</p>
                </div>

                <div className={`border-t ${isLight ? 'border-slate-100' : 'border-slate-800/30'} pt-5`}>
                  <span className="text-4xl font-mono font-black">₹0</span>
                  <span className="text-xs text-slate-500 font-mono"> / forever</span>
                </div>

                <ul className="space-y-3 text-sm font-medium text-slate-400">
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span>3 board crawling streams</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span>Basic keyword matching scorer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span>2 auto applications / month</span>
                  </li>
                  <li className="flex items-center gap-2.5 opacity-40">
                    <div className="w-4 h-4 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-slate-500" />
                    </div>
                    <span className="line-through">Full Gmail sync & replies drafting</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => onNavigate('login')}
                className={`w-full py-3.5 border ${borderCol} ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/50 text-slate-300'} rounded-xl text-sm font-bold mt-8 transition-all duration-200 cursor-pointer hover:border-slate-400/50`}
              >
                Get Started
              </button>
            </div>

            {/* Tier 2: Professional (Popular — glowing ring border + radial bg) */}
            <div className={`p-8 rounded-2xl relative flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 shadow-xl shadow-indigo-500/10`} style={{ background: isLight ? 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)' : 'linear-gradient(135deg, #1a1040 0%, #0f0a2e 100%)', border: '2px solid #4F46E5' }}>
              {/* Radial glow behind card */}
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 70%)' }} />

              {/* Shimmer Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-[10px] font-mono uppercase tracking-wider px-4 py-1.5 rounded-full font-bold shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-3 h-3" />
                <span>Most Popular</span>
              </div>

              <div className="space-y-6 relative">
                <div className="pt-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#4F46E5]">Full Autonomous Engine</span>
                  <h3 className="text-2xl font-display font-bold mt-1">Professional Pilot</h3>
                  <p className={`text-xs ${textMuted} mt-2`}>Complete background automation for active builders</p>
                </div>

                <div className={`border-t border-indigo-500/20 pt-5`}>
                  <span className="text-4xl font-mono font-black text-[#4F46E5]">
                    {billingCycle === 'yearly' ? '₹7,999' : '₹999'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono"> / {billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  {billingCycle === 'yearly' && (
                    <span className="ml-2 text-[10px] bg-emerald-500/15 text-emerald-500 font-mono font-bold px-2 py-0.5 rounded-full">SAVE 33%</span>
                  )}
                </div>

                <ul className="space-y-3 text-sm font-medium text-slate-400">
                  {[
                    '40+ global board crawlers active',
                    'Unlimited dynamic auto-submissions',
                    'Secure Gmail OAuth Sync & Smart Replies',
                    'Custom preparation interview flashcards',
                    'Live voice interactive simulations'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#4F46E5]" />
                      </div>
                      <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => onNavigate('login')}
                className="relative w-full py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl text-sm font-bold mt-8 shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-indigo-500/40 hover:shadow-xl active:scale-95 active:translate-y-0"
              >
                Choose Professional
              </button>
            </div>

            {/* Tier 3: Enterprise custom */}
            <div className={`p-8 rounded-2xl border ${borderCol} ${cardBgStyle} flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 shadow-lg`}>
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Corporate Scale</span>
                  <h3 className="text-2xl font-display font-bold mt-1">Enterprise Custom</h3>
                  <p className={`text-xs ${textMuted} mt-2`}>Tailored custom pipelines for bootcamps, universities & agencies</p>
                </div>

                <div className={`border-t ${isLight ? 'border-slate-100' : 'border-slate-800/30'} pt-5`}>
                  <span className="text-4xl font-mono font-black">Contact</span>
                  <span className="text-xs text-slate-500 font-mono"> / tailored</span>
                </div>

                <ul className="space-y-3 text-sm font-medium text-slate-400">
                  {[
                    'Central console dashboard overview',
                    'Private custom API crawl nodes',
                    'Dedicated success architects',
                    'Enterprise SLA commitments'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => alert(`Redirecting to Enterprise Concierge Support... Please wait.`)}
                className={`w-full py-3.5 border ${borderCol} ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/50 text-slate-300'} rounded-xl text-sm font-bold mt-8 transition-all duration-200 cursor-pointer hover:border-slate-400/50`}
              >
                Contact Sales
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          10. MINIMAL FOOTER
          ---------------------------------------------------- */}
      <footer className={`py-16 border-t ${borderCol} text-slate-500 text-sm text-left`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-5 md:col-span-1">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className={`font-display font-black text-base tracking-tight ${textTitle}`}>
                HireGenie<span className="text-[#4F46E5]">AI</span>
              </span>
            </div>
            <p className={`leading-relaxed text-xs ${textMuted} max-w-[220px]`}>
              Automate your career trajectory. Discover matched roles, send applications, sync recruiters, and land dream jobs.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L6.846 4.126H4.874z' },
                { label: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
              ].map((social) => (
                <button
                  key={social.label}
                  title={social.label}
                  className={`p-2 rounded-lg border ${borderCol} hover:border-indigo-500/30 hover:bg-indigo-500/8 hover:text-[#4F46E5] transition-all duration-200 cursor-pointer`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-400 uppercase tracking-widest text-[10px]">Product</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#how-it-works" className={`hover:text-[#4F46E5] transition-colors duration-150 text-xs ${textMuted}`}>How It Works</a>
              <a href="#features" className={`hover:text-[#4F46E5] transition-colors duration-150 text-xs ${textMuted}`}>Core Features</a>
              <a href="#dashboard-showcase" className={`hover:text-[#4F46E5] transition-colors duration-150 text-xs ${textMuted}`}>Live Dashboard</a>
              <a href="#ai-chat" className={`hover:text-[#4F46E5] transition-colors duration-150 text-xs ${textMuted}`}>AI Assistant</a>
              <a href="#pricing" className={`hover:text-[#4F46E5] transition-colors duration-150 text-xs ${textMuted}`}>Pricing</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-400 uppercase tracking-widest text-[10px]">Security</h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <span className={textMuted}>Sandboxed OAuth 2.0</span>
              <span className={textMuted}>Zero Training Footprint</span>
              <span className={textMuted}>AES-256 Encryption</span>
              <span className={textMuted}>GDPR & SOC-II Compliant</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-400 uppercase tracking-widest text-[10px]">Newsletter</h4>
            <p className={`leading-relaxed text-xs ${textMuted}`}>
              Subscribe for quarterly career optimization guides and salary benchmark reports.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com"
                className={`outline-none px-3.5 py-2.5 text-xs rounded-xl border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 w-full transition-all duration-200 ${inputBgStyle}`}
              />
              <button 
                onClick={() => alert(`Subscribed successfully! Thank you for joining HireGenie.`)}
                className="px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shrink-0 shadow-md shadow-indigo-500/20"
              >
                Join
              </button>
            </div>
          </div>

        </div>

        <div className={`max-w-7xl mx-auto px-6 pt-10 mt-10 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/30'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <span className="text-xs text-slate-500">© {new Date().getFullYear()} HireGenie AI. Built for high-leverage engineers. All rights reserved.</span>
          <div className="flex gap-6 text-xs text-slate-500">
            <span className="hover:text-[#4F46E5] cursor-pointer transition-colors duration-150">Privacy Policy</span>
            <span className="hover:text-[#4F46E5] cursor-pointer transition-colors duration-150">Terms of Service</span>
            <span className="hover:text-[#4F46E5] cursor-pointer transition-colors duration-150">Security</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
