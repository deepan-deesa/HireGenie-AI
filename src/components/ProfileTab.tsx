/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Bell, Shield, Key, Check } from 'lucide-react';
import { Theme } from '../types';

interface ProfileTabProps {
  theme?: Theme;
}

export default function ProfileTab({ theme = 'light' }: ProfileTabProps) {
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@hiregeniedev.io');
  const [isSaved, setIsSaved] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(90);

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
      
      {/* Left Column: Personal details */}
      <div className={`${cardBg} lg:col-span-7 p-6 rounded-2xl flex flex-col justify-between`}>
        
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="flex items-center gap-2 border-b pb-3 border-neutral-100">
            <User className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-805 font-display">Account Identity</h3>
              <p className="text-[10px] text-neutral-400 font-bold font-mono">Configure professional metadata and login credentials</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border p-3 rounded-xl outline-none transition-all ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Professional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border p-3 rounded-xl outline-none transition-all ${inputBg}`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer transition-all"
            >
              {isSaved ? 'Identity Updated!' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Alerts & Preferences */}
      <div className={`${cardBg} lg:col-span-5 p-6 rounded-2xl flex flex-col justify-between`}>
        
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="flex items-center gap-2 border-b pb-3 border-neutral-100">
            <Bell className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-805 font-display">Notification Settings</h3>
              <p className="text-[10px] text-neutral-400 font-bold font-mono">Customize career summaries and direct email alert triggers</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Range alert */}
            <div className={`p-4 rounded-xl border space-y-3 ${panelBg}`}>
              <div className="flex items-center justify-between font-medium">
                <span className="text-[10px] uppercase font-bold text-neutral-450 font-mono">Job Match Alert Threshold</span>
                <span className="font-mono text-indigo-600 font-extrabold">{alertThreshold}% Match</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-neutral-400 font-bold font-sans leading-normal">
                Only trigger instant push notifications for career matches scoring above {alertThreshold}%.
              </p>
            </div>

            {/* Checkboxes alerts */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 bg-neutral-50/50 p-3 rounded-xl border border-neutral-150 hover:border-indigo-300 transition-colors cursor-pointer text-left">
                <input type="checkbox" defaultChecked className="rounded accent-indigo-600 border-neutral-300 text-indigo-600 w-4 h-4" />
                <span className="text-[11px] text-neutral-600">Email daily match summary logs</span>
              </label>

              <label className="flex items-center gap-2.5 bg-neutral-50/50 p-3 rounded-xl border border-neutral-150 hover:border-indigo-300 transition-colors cursor-pointer text-left">
                <input type="checkbox" defaultChecked className="rounded accent-indigo-600 border-neutral-300 text-indigo-600 w-4 h-4" />
                <span className="text-[11px] text-neutral-600">Instant SMS notifications for high-priority recruiter emails</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[9px] text-neutral-400 font-mono font-bold pt-4 border-t border-neutral-100">
          User Identifier: seeker-482a-921c-aef0
        </div>
      </div>
    </div>
  );
}
