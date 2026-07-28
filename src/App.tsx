/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, HelpCircle, Compass, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

// Components
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import JobsTab from './components/JobsTab';
import CandidatesTab from './components/CandidatesTab';
import GmailTab from './components/GmailTab';
import AgentTab from './components/AgentTab';
import SettingsTab from './components/SettingsTab';
import ProfileTab from './components/ProfileTab';
import ArchitectureDiagram from './components/ArchitectureDiagram';

// Mock Data & Types
import { mockJobs, mockCandidates, mockEmails } from './mockData';
import { AppView, DashboardTab, Theme, Candidate, JobOpening, CandidateEmail } from './types';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [theme, setTheme] = useState<Theme>('light');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);

  // App Reactive State
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(mockCandidates[0]);
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [emails, setEmails] = useState<CandidateEmail[]>(mockEmails);

  // Load backend database on dashboard enter
  useEffect(() => {
    if (view === 'dashboard') {
      const fetchDashboardData = async () => {
        try {
          const [candidatesRes, jobsRes, emailsRes] = await Promise.all([
            fetch('/api/candidates'),
            fetch('/api/jobs'),
            fetch('/api/emails')
          ]);

          if (candidatesRes.ok) {
            const parsedCandidates = await candidatesRes.json();
            setCandidates(parsedCandidates);
            if (parsedCandidates.length > 0) {
              setSelectedCandidate(parsedCandidates[0]);
            }
          }
          if (jobsRes.ok) {
            const parsedJobs = await jobsRes.json();
            setJobs(parsedJobs);
          }
          if (emailsRes.ok) {
            const parsedEmails = await emailsRes.json();
            setEmails(parsedEmails);
          }
        } catch (error) {
          console.error('Failed to pre-fetch full-stack dashboard datasets:', error);
        }
      };
      fetchDashboardData();
    }
  }, [view]);

  // Synchronize top-level selected candidate if list updates
  useEffect(() => {
    const fresh = candidates.find(c => c.id === selectedCandidate?.id);
    if (fresh) {
      setSelectedCandidate(fresh);
    }
  }, [candidates]);

  // Login Success callback
  const handleLoginSuccess = () => {
    setView('dashboard');
    setActiveTab('overview');
  };

  // Logout callback
  const handleLogout = () => {
    setView('landing');
    setIsMobileMenuOpen(false);
  };

  // Requisition Creator
  const handleCreateJob = async (newJob: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      if (response.ok) {
        const created = await response.json();
        setJobs(prev => [created, ...prev]);
      } else {
        const job: JobOpening = {
          ...newJob,
          id: `job-${jobs.length + 1}`,
          applicantsCount: 0,
          postedDate: new Date().toISOString().split('T')[0]
        };
        setJobs([job, ...jobs]);
      }
    } catch (err) {
      console.error('Failed to create job opening:', err);
    }
  };

  // Candidate status modifier
  const handleStatusChange = async (id: string, status: Candidate['status']) => {
    // Optimistic Update
    setCandidates(prev => 
      prev.map(c => c.id === id ? { ...c, status } : c)
    );

    try {
      await fetch(`/api/candidates/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to alter candidate stage status:', err);
    }
  };

  // Direct outreach email shortener dispatch via workspace
  const handleSendEmailShortcut = async (candidate: Candidate, subject: string, body: string) => {
    try {
      const response = await fetch('/api/emails/shortcut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          candidateName: candidate.name,
          subject,
          body
        })
      });
      if (response.ok) {
        const created = await response.json();
        setEmails(prev => [created, ...prev]);
      } else {
        const newMail: CandidateEmail = {
          id: `email-${emails.length + 1}`,
          candidateId: candidate.id,
          candidateName: candidate.name,
          subject,
          snippet: body.substring(0, 60) + '...',
          body,
          timestamp: 'Just Now',
          isRead: true,
          direction: 'outbound'
        };
        setEmails([newMail, ...emails]);
      }
    } catch (err) {
      console.error('Failed to send outbound mail shortcut:', err);
    }
  };

  // Gmail response responder
  const handleAddEmailResponse = async (threadId: string, replyBody: string) => {
    try {
      const response = await fetch(`/api/emails/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyBody })
      });
      if (response.ok) {
        const updatedEmails = await response.json();
        setEmails(updatedEmails);
      } else {
        setEmails(prev => {
          const target = prev.find(e => e.id === threadId);
          if (!target) return prev;
          
          const responseMail: CandidateEmail = {
            id: `email-reply-${Date.now()}`,
            candidateId: target.candidateId,
            candidateName: target.candidateName,
            subject: `Re: ${target.subject}`,
            snippet: replyBody.substring(0, 60) + '...',
            body: replyBody,
            timestamp: 'Just Now',
            isRead: true,
            direction: 'outbound'
          };
          const updatedOriginal = { ...target, isRead: true, aiDraftSuggestion: undefined };
          return [responseMail, updatedOriginal, ...prev.filter(e => e.id !== threadId)];
        });
      }
    } catch (err) {
      console.error('Failed to post reply message to thread:', err);
    }
  };

  // Run live screening evaluation (AI-agent interaction helper)
  const handleRunScreening = async (id: string, jdText: string) => {
    try {
      const response = await fetch(`/api/candidates/${id}/screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText })
      });
      if (response.ok) {
        const updatedCandidate = await response.json();
        setCandidates(prev => 
          prev.map(c => c.id === id ? updatedCandidate : c)
        );
      }
    } catch (err) {
      console.error('Failed to complete AI screening execution:', err);
    }
  };

  // Generate dynamic AI reply draft
  const handleGenerateDraft = async (threadId: string) => {
    try {
      const response = await fetch(`/api/emails/${threadId}/draft`, {
        method: 'POST'
      });
      if (response.ok) {
        const { draft } = await response.json();
        setEmails(prev => 
          prev.map(e => e.id === threadId ? { ...e, aiDraftSuggestion: draft, isRead: false } : e)
        );
      }
    } catch (err) {
      console.error('Failed to generate automatic AI response draft:', err);
    }
  };

  // Theme updater
  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'light' ? 'theme-light bg-neutral-50 text-neutral-900' : 'theme-dark bg-neutral-950 text-white'
    }`}>
      
      {/* 1. MARKETING / LANDING VIEW */}
      {view === 'landing' && (
        <LandingPage onNavigate={setView} theme={theme} onThemeToggle={handleThemeToggle} />
      )}

      {/* 2. AUTHENTICATION VIEW */}
      {view === 'login' && (
        <LoginPage onNavigate={setView} onSuccess={handleLoginSuccess} />
      )}

      {/* 3. WORKSPACE PORTAL VIEW */}
      {view === 'dashboard' && (
        <div className="flex h-screen overflow-hidden relative">
          
          {/* Desktop Sidebar (Left Rail) */}
          <div className="hidden lg:block w-64 shrink-0">
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              onLogout={handleLogout}
              onToggleBlueprint={() => setShowBlueprint(!showBlueprint)}
              showBlueprint={showBlueprint}
              theme={theme}
            />
          </div>

          {/* Mobile Sidebar Trigger (Overlay Drawer) */}
          {isMobileMenuOpen && (
            <div className={`fixed inset-0 z-40 backdrop-blur-sm lg:hidden ${theme === 'light' ? 'bg-neutral-900/30' : 'bg-neutral-950/80'}`}>
              <div className={`w-64 h-full border-r flex flex-col justify-between ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-900'}`}>
                <div className={`flex items-center justify-between p-4 border-b ${theme === 'light' ? 'border-neutral-150' : 'border-neutral-900'}`}>
                  <span className={`font-display font-semibold ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>Workspace Nav</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className={`p-1 rounded-lg ${theme === 'light' ? 'hover:bg-neutral-100 text-neutral-500' : 'hover:bg-neutral-900 text-neutral-400'}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <Sidebar 
                    activeTab={activeTab} 
                    onTabChange={(tab) => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }} 
                    onLogout={handleLogout}
                    onToggleBlueprint={() => {
                      setShowBlueprint(!showBlueprint);
                      setIsMobileMenuOpen(false);
                    }}
                    showBlueprint={showBlueprint}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Main Panel container */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-2 lg:gap-0 pl-4 lg:pl-0">
              {/* Mobile Menu Burger Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-850 rounded-xl text-neutral-400 lg:hidden cursor-pointer"
              >
                <Menu className="w-4 h-4" />
              </button>
              
              <div className="flex-1">
                <Header 
                  activeTab={activeTab} 
                  theme={theme} 
                  onThemeToggle={handleThemeToggle} 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  showBlueprint={showBlueprint}
                />
              </div>
            </div>

            {/* Dynamic Content Pane */}
            <main className="flex-1 overflow-y-auto p-6 relative">
              <div className="max-w-7xl mx-auto h-full">
                {showBlueprint ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <ArchitectureDiagram />
                  </motion.div>
                ) : (
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    {activeTab === 'overview' && (
                      <OverviewTab 
                        candidates={candidates} 
                        jobs={jobs} 
                        emails={emails}
                        onNavigateTab={setActiveTab} 
                        onSelectCandidate={(c) => {
                          setSelectedCandidate(c);
                          setActiveTab('candidates');
                        }}
                        onStatusChange={handleStatusChange}
                        theme={theme}
                      />
                    )}

                    {activeTab === 'jobs' && (
                      <JobsTab 
                        jobs={jobs} 
                        onCreateJob={handleCreateJob} 
                        theme={theme}
                      />
                    )}

                    {activeTab === 'candidates' && (
                      <CandidatesTab 
                        candidates={candidates} 
                        selectedCandidate={selectedCandidate}
                        onSelectCandidate={setSelectedCandidate}
                        onStatusChange={handleStatusChange}
                        onSendEmailShortcut={handleSendEmailShortcut}
                        onRunScreening={handleRunScreening}
                        theme={theme}
                      />
                    )}

                    {activeTab === 'gmail' && (
                      <GmailTab 
                        emails={emails} 
                        onAddEmailResponse={handleAddEmailResponse} 
                        onGenerateDraft={handleGenerateDraft}
                        theme={theme}
                      />
                    )}

                    {activeTab === 'agent' && (
                      <AgentTab 
                        candidates={candidates} 
                        theme={theme}
                      />
                    )}

                    {activeTab === 'settings' && (
                      <SettingsTab theme={theme} />
                    )}

                    {activeTab === 'profile' && (
                      <ProfileTab theme={theme} />
                    )}
                  </motion.div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
