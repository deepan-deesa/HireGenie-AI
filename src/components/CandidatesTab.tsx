/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Mail, Phone, Calendar, Sparkles, Check, ChevronRight, Search, Play, Send, ChevronDown, Loader2, X 
} from 'lucide-react';
import { Candidate, Theme } from '../types';

interface CandidatesTabProps {
  candidates: Candidate[];
  selectedCandidate: Candidate;
  onSelectCandidate: (candidate: Candidate) => void;
  onStatusChange: (id: string, status: Candidate['status']) => void;
  onSendEmailShortcut: (candidate: Candidate, subject: string, body: string) => void;
  onRunScreening?: (id: string, jdText: string) => Promise<void>;
  theme?: Theme;
}

export default function CandidatesTab({ 
  candidates, 
  selectedCandidate, 
  onSelectCandidate, 
  onStatusChange,
  onSendEmailShortcut,
  onRunScreening,
  theme = 'light'
}: CandidatesTabProps) {
  const [filterStage, setFilterStage] = useState<'All' | Candidate['status']>('All');
  const [search, setSearch] = useState('');
  const [showOutboundAction, setShowOutboundAction] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'intro' | 'interview' | 'rejection' | null>(null);
  
  // AI screening states
  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const [jdInput, setJdInput] = useState('');
  const [isScreening, setIsScreening] = useState(false);

  const filteredCandidates = candidates.filter(c => {
    const matchesStage = filterStage === 'All' || c.status === filterStage;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
                          c.role.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Screening': return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'Interview': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'Offer': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Rejected': return 'bg-rose-50 border-rose-200 text-rose-700';
    }
  };

  const handleComposeTemplate = (type: 'intro' | 'interview' | 'rejection') => {
    setActiveTemplate(type);
    setShowOutboundAction(true);
  };

  const handleSendDraft = () => {
    let subject = '';
    let body = '';
    
    if (activeTemplate === 'intro') {
      subject = `Follow up - ${selectedCandidate.role} match discussion`;
      body = `Hi ${selectedCandidate.name},\n\nThank you for reaching out! I would love to schedule a 15-minute quick introduction call to discuss how my skill set aligns with your team's objectives.\n\nBest regards,\nAlex Mercer`;
    } else if (activeTemplate === 'interview') {
      subject = `Technical Deep-dive Scheduling - Alex Mercer`;
      body = `Hi ${selectedCandidate.name},\n\nI'm looking forward to our technical design session next week! I've reserved availability on Tuesday and Thursday. Let me know what slot works best.\n\nBest,\nAlex Mercer`;
    } else {
      subject = `Application status update - Alex Mercer`;
      body = `Hi ${selectedCandidate.name},\n\nThank you for the update. Although I'm moving forward with other interview panels, I would love to stay in touch for future technical alignments.\n\nBest regards,\nAlex Mercer`;
    }

    onSendEmailShortcut(selectedCandidate, subject, body);
    setShowOutboundAction(false);
    setActiveTemplate(null);
  };

  const isLight = theme === 'light';

  // Theme-aware bindings
  const cardBg = isLight ? 'bg-white border-neutral-200 shadow-md shadow-neutral-100/50' : 'bg-neutral-900 border-neutral-850';
  const panelBg = isLight ? 'bg-neutral-50 border-neutral-200/60' : 'bg-neutral-950 border-neutral-850';
  const inputBg = isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-indigo-500' : 'bg-neutral-950 border-neutral-800 text-white focus:border-indigo-500';
  const textTitle = isLight ? 'text-neutral-800' : 'text-neutral-200';
  const textDesc = isLight ? 'text-neutral-500' : 'text-neutral-400';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans transition-colors duration-200 ${isLight ? 'text-neutral-800' : 'text-white'}`}>
      
      {/* Left Column: List Panel */}
      <div className={`${cardBg} lg:col-span-5 p-5 rounded-2xl flex flex-col gap-4 text-left`}>
        <div className="space-y-3">
          <div>
            <h3 className={`text-sm font-bold ${isLight ? 'text-neutral-800' : 'text-neutral-200'} font-display`}>Applications Tracker</h3>
            <p className="text-[10px] text-neutral-400 font-medium">Monitor active roles, match indicators, and recruiter alignment stages</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, company, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full text-xs pl-9 pr-4 py-2 border rounded-xl outline-none transition-all placeholder-neutral-400 font-medium ${inputBg}`}
            />
          </div>

          {/* Stage Filters Row */}
          <div className="flex flex-wrap gap-1">
            {(['All', 'Screening', 'Interview', 'Offer', 'Rejected'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  filterStage === stage
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                    : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-800'
                }`}
              >
                {stage === 'Rejected' ? 'Archived' : stage}
              </button>
            ))}
          </div>
        </div>

        {/* Ingested List */}
        <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                selectedCandidate.id === cand.id
                  ? 'bg-indigo-50/40 border-indigo-300 text-indigo-900 shadow-sm font-bold'
                  : 'bg-neutral-50/60 border-neutral-150 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs uppercase shadow-sm ${
                  selectedCandidate.id === cand.id 
                    ? 'bg-indigo-100 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-neutral-200 text-neutral-600'
                }`}>
                  {cand.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="truncate max-w-[140px] text-left">
                  <span className={`block text-xs font-bold truncate ${selectedCandidate.id === cand.id ? 'text-indigo-900' : 'text-neutral-800'}`}>
                    {cand.name}
                  </span>
                  <span className="block text-[9px] text-neutral-400 font-semibold truncate leading-none mt-1">
                    {cand.role}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-extrabold text-indigo-600 font-mono block">{cand.matchScore}%</span>
                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border mt-1.5 inline-block leading-none ${getStageColor(cand.status)}`}>
                  {cand.status === 'Rejected' ? 'Archived' : cand.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Deep Scorecard Detail View */}
      <div className={`${cardBg} lg:col-span-7 p-6 rounded-2xl flex flex-col justify-between text-left`}>
        
        <div className="space-y-6">
          {/* Detail Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-neutral-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-neutral-800 font-display">{selectedCandidate.name}</h3>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStageColor(selectedCandidate.status)}`}>
                    {selectedCandidate.status === 'Rejected' ? 'Archived' : selectedCandidate.status}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 font-semibold block mt-1">{selectedCandidate.role}</span>
              </div>
            </div>

            {/* Stage Quick Changer */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              {(['Screening', 'Interview', 'Offer', 'Rejected'] as Candidate['status'][]).map((stage) => (
                <button
                  key={stage}
                  onClick={() => onStatusChange(selectedCandidate.id, stage)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCandidate.status === stage
                      ? 'bg-white border border-neutral-200 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-800'
                  }`}
                >
                  {stage === 'Rejected' ? 'Archive' : stage}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Contacts & Metas */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] text-neutral-500 font-mono font-semibold p-3.5 rounded-xl border ${panelBg}`}>
            <span className="flex items-center gap-1.5 truncate" title={selectedCandidate.email}>
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              {selectedCandidate.email}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              {selectedCandidate.phone}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              Applied {selectedCandidate.appliedDate}
            </span>
          </div>

          {/* Overall Match Score and Skills Tagging */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Match Circle */}
            <div className={`sm:col-span-4 p-4 rounded-xl border flex flex-col items-center justify-center text-center ${panelBg}`}>
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono font-bold mb-2">Resume Match Ratio</span>
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke={isLight ? "#e5e7eb" : "#1f2937"} strokeWidth="5" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke="#4f46e5" strokeWidth="5" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 28} 
                    strokeDashoffset={2 * Math.PI * 28 * (1 - selectedCandidate.matchScore / 100)} 
                  />
                </svg>
                <span className="absolute text-xs font-black text-indigo-700 font-mono">{selectedCandidate.matchScore}%</span>
              </div>
            </div>

            {/* Skills */}
            <div className="sm:col-span-8 text-left">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono font-bold block mb-2">Parsed Skills Mapping</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((skill, idx) => (
                  <span key={idx} className="bg-indigo-50/50 border border-indigo-100 text-[9px] text-indigo-700 font-bold px-2 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Scorecard Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-indigo-600 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>AI Core Suitability Analysis</span>
              </span>
              {onRunScreening && (
                <button
                  onClick={() => {
                    setJdInput(`Position criteria: seeking experience in ${selectedCandidate.skills.slice(0, 3).join(', ')}. Strong capability in architecture design is required.`);
                    setShowScreeningModal(true);
                  }}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-100 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Calibrate Custom Weights</span>
                </button>
              )}
            </div>
            <div className="bg-indigo-50/40 border border-indigo-100/60 p-4 rounded-xl text-left">
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">{selectedCandidate.aiSummary}</p>
            </div>
          </div>

          {/* Highlights bullets */}
          <div className="space-y-2 text-left">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono font-bold block">Target Strengths & Proofpoints</span>
            <ul className="space-y-2 text-xs text-neutral-600">
              {selectedCandidate.keyHighlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Bottom Rail */}
        <div className="mt-8 border-t pt-4 flex items-center justify-between gap-4 border-neutral-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleComposeTemplate('intro')}
              className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-600 border border-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              Compose Intro
            </button>
            <button
              onClick={() => handleComposeTemplate('interview')}
              className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-600 border border-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              Reply Interview
            </button>
            <button
              onClick={() => handleComposeTemplate('rejection')}
              className="px-3.5 py-2 bg-neutral-50 hover:bg-red-50 text-xs font-bold text-neutral-500 hover:text-red-600 border border-neutral-200 hover:border-red-200 rounded-xl transition-colors cursor-pointer"
            >
              Archive Track
            </button>
          </div>

          <span className="text-[10px] font-bold text-neutral-400 font-mono">ID: {selectedCandidate.id}</span>
        </div>

        {/* Custom Outbound Compose Modal/Overlay */}
        {showOutboundAction && (
          <div className="fixed inset-0 z-50 bg-neutral-900/35 backdrop-blur-sm flex items-center justify-center p-6 text-left">
            <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-neutral-800">
              <button 
                onClick={() => setShowOutboundAction(false)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4.5 h-4.5" />
              </button>
              
              <div className="flex items-center gap-2 mb-4 border-b pb-3 border-neutral-100">
                <Send className="w-4.5 h-4.5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 font-display">Compose Recruiter Reply</h3>
                  <p className="text-[10px] text-neutral-400 font-mono font-bold font-mono">Preview template before dispatching via Synced Gmail Autopilot</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">To Recruiter Contact</span>
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-mono font-bold">
                    {selectedCandidate.name} &lt;{selectedCandidate.email}&gt;
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Outreach Text Draft</span>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-neutral-600 leading-relaxed max-h-40 overflow-y-auto">
                    {activeTemplate === 'intro' && (
                      <p>Hi {selectedCandidate.name}, thank you for reaching out! I would love to schedule a brief call to align on technical goals. Let me know what slots work best on your calendar.</p>
                    )}
                    {activeTemplate === 'interview' && (
                      <p>Hi {selectedCandidate.name}, I would love to proceed to the next technical screening panel! Please send along the meeting link. Looking forward to speaking with the team.</p>
                    )}
                    {activeTemplate === 'rejection' && (
                      <p>Hi {selectedCandidate.name}, thank you for the consideration. I have decided to focus my priorities on other active pipeline engagements at this time. Let’s stay connected.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowOutboundAction(false)}
                    className="w-1/2 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-bold rounded-xl border border-neutral-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendDraft}
                    className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Mail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom AI Screening Modal Overlay */}
        {showScreeningModal && (
          <div className="fixed inset-0 z-50 bg-neutral-900/35 backdrop-blur-sm flex items-center justify-center p-6 text-left">
            <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl text-neutral-800">
              <button 
                onClick={() => setShowScreeningModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4.5 h-4.5" />
              </button>
              
              <div className="flex items-center gap-2 mb-4 border-b pb-3 border-neutral-100">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 font-display">Calibrate Matching Weights</h3>
                  <p className="text-[10px] text-neutral-400 font-mono font-bold">Tune evaluation requirements for deep analysis scorecards</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Target Profile</span>
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-mono font-bold">
                    {selectedCandidate.name} ({selectedCandidate.role})
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Job Target alignment benchmarks</span>
                  <textarea
                    rows={5}
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    placeholder="Enter targeted skills or requirements you wish the AI to evaluate against..."
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-indigo-500 text-neutral-850 p-3 rounded-xl outline-none transition-all placeholder-neutral-400 font-sans leading-relaxed font-semibold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowScreeningModal(false)}
                    disabled={isScreening}
                    className="w-1/2 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-bold rounded-xl border border-neutral-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!jdInput.trim() || !onRunScreening) return;
                      setIsScreening(true);
                      try {
                        await onRunScreening(selectedCandidate.id, jdInput);
                        setShowScreeningModal(false);
                      } catch (e) {
                        console.error('Screening error:', e);
                      } finally {
                        setIsScreening(false);
                      }
                    }}
                    disabled={isScreening || !jdInput.trim()}
                    className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isScreening ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Recalculating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Recalculate Match</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
