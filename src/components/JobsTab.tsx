/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, MapPin, Plus, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { JobOpening, Theme } from '../types';

interface JobsTabProps {
  jobs: JobOpening[];
  onCreateJob: (job: Omit<JobOpening, 'id' | 'applicantsCount' | 'postedDate'>) => void;
  theme?: Theme;
}

export default function JobsTab({ jobs, onCreateJob, theme = 'light' }: JobsTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Intelligence');
  const [location, setLocation] = useState('Remote');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Closed'>('Active');
  const [aiFocus, setAiFocus] = useState('System Design, LLM alignment & Latency Tuning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateJob({
      title,
      department,
      location,
      type,
      status
    });
    // Reset
    setTitle('');
    setAiFocus('System Design, LLM alignment & Latency Tuning');
    setShowModal(false);
  };

  const isLight = theme === 'light';

  // Styling helpers
  const cardBg = isLight ? 'bg-white border-neutral-200/80 shadow-md shadow-neutral-100/50 hover:border-indigo-200' : 'bg-neutral-900 border-neutral-850 hover:border-neutral-800';
  const panelBg = isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-850';
  const inputBg = isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-indigo-500' : 'bg-neutral-950 border-neutral-800 text-white focus:border-indigo-500';

  return (
    <div className={`space-y-6 font-sans transition-colors duration-200 ${isLight ? 'text-neutral-800' : 'text-white'}`}>
      {/* Tab Header Actions */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className={`text-sm font-bold ${isLight ? 'text-neutral-800' : 'text-neutral-200'} font-display`}>Matched Openings</h2>
          <p className="text-[11px] text-neutral-400 font-medium">Explore AI matched positions, configure career preferences, and track opportunities</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Job</span>
        </button>
      </div>

      {/* Jobs Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className={`${cardBg} p-6 rounded-2xl flex flex-col justify-between transition-all relative group text-left`}
          >
            {/* Corner Status Badge */}
            <span className={`absolute top-6 right-6 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
              job.status === 'Active'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
            }`}>
              {job.status}
            </span>

            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono font-bold block">{job.department}</span>
              <h3 className={`font-bold text-sm mt-1 font-display group-hover:text-indigo-600 transition-colors ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
                {job.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-neutral-400 mt-3 font-mono font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span>•</span>
                <span>{job.type}</span>
              </div>
            </div>

            <div className={`flex items-center justify-between border-t ${isLight ? 'border-neutral-100' : 'border-neutral-850/60'} pt-4 mt-6`}>
              <div className="flex items-baseline gap-1">
                <span className={`text-sm font-black font-mono ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>{job.applicantsCount}</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Tracking Funnel</span>
              </div>

              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-full text-[9px] font-bold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                <span>AI Agent Match Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Requisition Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/35 backdrop-blur-sm flex items-center justify-center p-6">
          <div className={`border rounded-2xl w-full max-w-lg p-6 relative shadow-2xl ${isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-neutral-900 border-neutral-800 text-white'}`}>
            <button 
              onClick={() => setShowModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer ${isLight ? 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700' : 'hover:bg-neutral-800 text-neutral-400'}`}
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className={`flex items-center gap-2 mb-4 border-b pb-3 text-left ${isLight ? 'border-neutral-150' : 'border-neutral-850'}`}>
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className={`text-sm font-bold font-display ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>Track New Position</h3>
                <p className="text-[10px] text-neutral-400 font-mono font-bold">Configure roles and targeted AI alignment weights</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl outline-none transition-all placeholder-neutral-400 font-medium border ${inputBg}`}
                  placeholder="e.g. Staff AI Systems Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Match Category</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full text-xs p-3 rounded-xl outline-none transition-all border font-semibold ${inputBg}`}
                  >
                    <option>Artificial Intelligence</option>
                    <option>UI/UX Engineering</option>
                    <option>Platform Systems</option>
                    <option>Inference Architectures</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full text-xs p-3 rounded-xl outline-none transition-all border font-medium ${inputBg}`}
                    placeholder="e.g. SF, CA / Remote"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Employment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className={`w-full text-xs p-3 rounded-xl outline-none transition-all border font-semibold ${inputBg}`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full text-xs p-3 rounded-xl outline-none transition-all border font-semibold ${inputBg}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>AI Matching Preference Keywords</span>
                </label>
                <input
                  type="text"
                  required
                  value={aiFocus}
                  onChange={(e) => setAiFocus(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl outline-none transition-all border font-medium ${inputBg}`}
                  placeholder="e.g. Transformers, LLM training, PyTorch"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/15 cursor-pointer"
              >
                Track & Activate Match Analysis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
