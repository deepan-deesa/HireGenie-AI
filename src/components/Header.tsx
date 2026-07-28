/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { DashboardTab, Theme } from '../types';

interface HeaderProps {
  activeTab: DashboardTab;
  theme: Theme;
  onThemeToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showBlueprint: boolean;
}

export default function Header({ 
  activeTab, 
  theme, 
  onThemeToggle, 
  searchQuery, 
  onSearchChange,
  showBlueprint
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    if (showBlueprint) return 'Platform Blueprint';
    switch (activeTab) {
      case 'overview': return 'Overview Hub';
      case 'jobs': return 'Job Openings';
      case 'candidates': return 'Candidates Board';
      case 'gmail': return 'Gmail Workspace';
      case 'agent': return 'AI Screening Agent';
      case 'settings': return 'Settings & Keys';
      case 'profile': return 'Recruiter Profile';
      default: return 'Workspace';
    }
  };

  const getHeadingDescription = () => {
    if (showBlueprint) return 'Platform Sitemap and candidate transaction user flow mapping';
    switch (activeTab) {
      case 'overview': return 'Track your personal application pipelines and matching telemetry insights';
      case 'jobs': return 'Discovered open job matching positions';
      case 'candidates': return 'Detailed resume profile, parser suitability scoring and analysis';
      case 'gmail': return 'Real-time Gmail inbox thread sync, prioritized recruiter correspondence';
      case 'agent': return 'Tuning evaluation parameters, career matching preferences & target roles';
      case 'settings': return 'Integrations, API keys, and notification preferences';
      case 'profile': return 'Manage credentials and individual career target profiles';
      default: return '';
    }
  };

  const notifications = [
    { id: 1, text: "Your resume match rating scored 96% for OpenAI Technical Staff position.", type: "match", time: "10 min ago" },
    { id: 2, text: "AI drafted a custom interview confirmation email for Sarah from Stripe.", type: "draft", time: "1 hour ago" },
    { id: 3, text: "Sleek sync found 2 new priority recruiter threads in your inbox.", type: "sync", time: "2 hours ago" }
  ];

  const isLight = theme === 'light';

  return (
    <header className={`h-16 border-b sticky top-0 z-20 flex items-center justify-between px-6 select-none transition-colors duration-200 ${
      isLight ? 'bg-white/90 border-neutral-200/80 text-neutral-800' : 'bg-neutral-950/80 border-neutral-900 text-white'
    } backdrop-blur-md`}>
      {/* Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 font-semibold">Console</span>
          <span className={isLight ? 'text-neutral-300' : 'text-neutral-700'}>/</span>
          <span className={`font-bold tracking-wide uppercase font-mono text-[10px] ${
            isLight ? 'text-indigo-600' : 'text-indigo-400'
          }`}>
            {getBreadcrumb()}
          </span>
        </div>
        <h1 className={`text-xs font-semibold mt-0.5 tracking-tight hidden sm:block ${
          isLight ? 'text-neutral-500' : 'text-neutral-400'
        }`}>
          {getHeadingDescription()}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-48 sm:w-64 hidden md:block">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search matching skills, jobs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full border text-xs pl-9 pr-8 py-2 rounded-xl outline-none transition-all placeholder-neutral-400 font-medium ${
              isLight 
                ? 'bg-neutral-50 border-neutral-200 focus:border-indigo-500 text-neutral-800' 
                : 'bg-neutral-900/60 border-neutral-850 focus:border-indigo-500 text-neutral-200'
            }`}
          />
          <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] border px-1 rounded ${
            isLight ? 'bg-neutral-100 text-neutral-400 border-neutral-200' : 'bg-neutral-950 text-neutral-500 border-neutral-800'
          }`}>
            ⌘K
          </span>
        </div>

        {/* Gmail Sync Status */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold ${
          isLight 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
            : 'bg-neutral-900 border-neutral-850 text-emerald-400'
        }`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Autopilot Connected</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isLight 
              ? 'hover:bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-neutral-800' 
              : 'hover:bg-neutral-900 border-neutral-850 hover:border-neutral-800 text-neutral-400 hover:text-white'
          }`}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showNotifications 
                ? isLight 
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold' 
                  : 'bg-neutral-900 border-indigo-500 text-white'
                : isLight 
                  ? 'border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-800' 
                  : 'border-neutral-850 hover:border-neutral-850 text-neutral-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 mt-3 w-80 border rounded-2xl shadow-2xl p-4 z-50 transition-all ${
              isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-neutral-900 border-neutral-800 text-white'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 mb-3 ${
                isLight ? 'border-neutral-100' : 'border-neutral-800'
              }`}>
                <span className={`text-xs font-bold ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>Live Updates</span>
                <span className={`text-[10px] font-mono font-bold cursor-pointer hover:underline ${
                  isLight ? 'text-indigo-600' : 'text-indigo-400'
                }`}>Mark all read</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded-xl border transition-colors ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200/60 hover:border-neutral-300' 
                      : 'bg-neutral-950 border-neutral-850 hover:border-neutral-800'
                  }`}>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-neutral-600 font-medium' : 'text-neutral-300'}`}>{n.text}</p>
                    <span className="text-[9px] text-neutral-400 block mt-1 font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
