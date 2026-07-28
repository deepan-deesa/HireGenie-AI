/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, Key, Mail, Check, Users, Building, AlertCircle, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { Theme } from '../types';

interface SettingsTabProps {
  theme?: Theme;
}

export default function SettingsTab({ theme = 'light' }: SettingsTabProps) {
  const [fullName, setFullName] = useState('Alex Mercer');
  const [portfolioUrl, setPortfolioUrl] = useState('https://alexmercer.dev');
  const [isSaved, setIsSaved] = useState(false);

  const integrations = [
    { name: 'Google Gmail SMTP Autopilot', type: 'Email Automation', status: 'Linked', update: 'Ready' },
    { name: 'LinkedIn Direct Matcher', type: 'Career Network', status: 'Active', update: 'Synced' },
    { name: 'GitHub Metadata Parser', type: 'Code Portfolio', status: 'Linked', update: 'Ready' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isLight = theme === 'light';

  // Styles
  const cardBg = isLight ? 'bg-white border-neutral-200 shadow-md shadow-neutral-100/50' : 'bg-neutral-900 border-neutral-850';
  const panelBg = isLight ? 'bg-neutral-50 border-neutral-200/60' : 'bg-neutral-950 border-neutral-850';
  const inputBg = isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-indigo-500' : 'bg-neutral-950 border-neutral-800 text-white focus:border-indigo-500';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans transition-colors duration-200 text-left ${isLight ? 'text-neutral-800' : 'text-white'}`}>
      
      {/* Left Column: Job Seeker Strategy Config */}
      <div className={`${cardBg} lg:col-span-7 p-6 rounded-2xl flex flex-col justify-between`}>
        
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="flex items-center gap-2 border-b pb-3 border-neutral-100">
            <Globe className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-800 font-display">Target Profile Metadata</h3>
              <p className="text-[10px] text-neutral-400 font-bold font-mono">Configure career targets, preferences, and personal outreach details</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full border p-3 rounded-xl outline-none transition-all ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">LinkedIn or Portfolio URL</label>
                <input
                  type="url"
                  required
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className={`w-full border p-3 rounded-xl outline-none transition-all ${inputBg}`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer transition-all"
            >
              {isSaved ? 'Preferences Saved!' : 'Save Profile Preferences'}
            </button>
          </form>

          {/* Connected Channels */}
          <div className="space-y-3.5 pt-4 border-t border-neutral-100">
            <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> 
              <span>Active Target Channels (3 Linked Platforms)</span>
            </span>
            
            <div className="space-y-2.5">
              {integrations.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-neutral-150 flex items-center justify-between bg-neutral-50/50">
                  <div className="text-left">
                    <span className="block text-xs font-bold text-neutral-800">{t.name}</span>
                    <span className="block text-[9px] text-neutral-400 font-semibold">{t.type} • Status: {t.update}</span>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-indigo-50 border-indigo-100 text-indigo-700 font-mono">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Security, OAuth & Keys Tutorial */}
      <div className={`${cardBg} lg:col-span-5 p-6 rounded-2xl flex flex-col justify-between`}>
        
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="flex items-center gap-2 border-b pb-3 border-neutral-100">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-800 font-display">Credential Integrity</h3>
              <p className="text-[10px] text-neutral-400 font-bold font-mono font-mono">OAuth settings and backend server keys metadata</p>
            </div>
          </div>

          {/* Key details */}
          <div className="space-y-3.5 text-xs font-medium">
            <div className={`p-4 rounded-xl border space-y-3 ${panelBg}`}>
              <span className="text-[9px] uppercase font-bold font-mono text-indigo-600 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-500" /> Secret Key Architecture Status
              </span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                As per Stripe and Linear safety benchmarks, secret keys (like your <strong>GEMINI_API_KEY</strong>) are managed server-side and never exposed to the client.
              </p>

              <div className="p-3 bg-white/40 border border-neutral-200 rounded-lg space-y-2 font-mono text-[10px] text-neutral-400 font-semibold">
                <div className="flex items-center justify-between">
                  <span>GEMINI_API_KEY</span>
                  <span className="text-emerald-700 font-bold uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px]">Secured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GOOGLE_GMAIL_OAUTH_CLIENT</span>
                  <span className="text-emerald-700 font-bold uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px]">Linked</span>
                </div>
              </div>
            </div>

            {/* Google workspace info */}
            <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-xs text-indigo-800 block">Workspace OAuth Callback Setup</span>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-1 font-sans font-medium">
                  The Google Gmail sync works by leveraging oauth redirects. To configure your specific enterprise credentials:
                  <br />
                  <span className="font-mono text-neutral-400 font-bold block mt-1.5">Callback URI: https://your-domain.app/api/auth/google/callback</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[9px] text-neutral-400 font-mono font-bold pt-4 border-t border-neutral-100">
          Environment Variable Reference: .env.example
        </div>
      </div>
    </div>
  );
}
