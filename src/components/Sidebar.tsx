/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, Layout, Briefcase, Users, Mail, Cpu, Settings, User, LogOut, Sparkles, Building, ChevronDown 
} from 'lucide-react';
import { DashboardTab, Theme } from '../types';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  onToggleBlueprint: () => void;
  showBlueprint: boolean;
  theme?: Theme;
}

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  onToggleBlueprint,
  showBlueprint,
  theme = 'light'
}: SidebarProps) {
  
  interface NavItem {
    id: 'overview' | 'jobs' | 'candidates' | 'gmail' | 'agent';
    name: string;
    icon: React.ComponentType<any>;
    count?: number;
    highlight?: boolean;
  }

  // Renamed and stylized for individual job seekers
  const navItems: NavItem[] = [
    { id: 'overview', name: 'Dashboard Hub', icon: Layout },
    { id: 'jobs', name: 'Job Matches', icon: Briefcase, count: 3 },
    { id: 'candidates', name: 'My Applications', icon: Users, count: 5 },
    { id: 'gmail', name: 'Recruiter Emails', icon: Mail, highlight: true },
    { id: 'agent', name: 'AI Career Agent', icon: Cpu },
  ];

  const configItems = [
    { id: 'settings', name: 'Settings & Integrations', icon: Settings },
    { id: 'profile', name: 'Career Profile', icon: User },
  ] as const;

  const isLight = theme === 'light';

  return (
    <aside className={`w-64 border-r flex flex-col justify-between h-screen fixed top-0 left-0 z-30 select-none transition-colors duration-200 ${
      isLight ? 'bg-white border-neutral-200/80 text-neutral-800' : 'bg-neutral-950 border-neutral-900 text-white'
    }`}>
      {/* Top Brand Section */}
      <div>
        <div className={`p-6 border-b ${isLight ? 'border-neutral-100' : 'border-neutral-900'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/15">
              H
            </div>
            <div>
              <span className={`font-display font-bold text-sm tracking-tight block ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                HireGenie AI
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isLight ? 'text-indigo-600 bg-indigo-50 border border-indigo-100/60' : 'text-indigo-400 bg-indigo-950/40 border border-indigo-900/40'
              }`}>
                v1.0.0-AUTOPILOT
              </span>
            </div>
          </div>

          {/* User Status Header Selector */}
          <div className={`mt-5 border px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
            isLight 
              ? 'bg-neutral-50 border-neutral-200/80 hover:border-neutral-300 text-neutral-700' 
              : 'bg-neutral-900 border-neutral-850 hover:border-neutral-800 text-neutral-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold">Autopilot Scanning</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        {/* Navigation Middle Section */}
        <div className="p-4 space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider pl-2 block mb-2 font-mono">
              Career Cockpit
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !showBlueprint;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      if (showBlueprint) onToggleBlueprint();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? isLight
                          ? 'bg-indigo-50/70 text-indigo-900 border-l-2 border-indigo-600 pl-2.5' 
                          : 'bg-neutral-900 text-white border-l-2 border-indigo-500 pl-2.5'
                        : isLight
                          ? 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : isLight ? 'text-neutral-400 group-hover:text-neutral-700' : 'text-neutral-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`px-1.5 py-0.5 border text-[9px] font-mono rounded-md font-bold ${
                        isActive 
                          ? isLight 
                            ? 'bg-white border-indigo-100 text-indigo-600' 
                            : 'bg-neutral-950 border-indigo-900 text-indigo-400'
                          : isLight
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-500'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.highlight && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider pl-2 block mb-2 font-mono">
              Profile & Config
            </span>
            <nav className="space-y-1">
              {configItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !showBlueprint;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      if (showBlueprint) onToggleBlueprint();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? isLight
                          ? 'bg-indigo-50/70 text-indigo-900 border-l-2 border-indigo-600 pl-2.5' 
                          : 'bg-neutral-900 text-white border-l-2 border-indigo-500 pl-2.5'
                        : isLight
                          ? 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : isLight ? 'text-neutral-400 group-hover:text-neutral-700' : 'text-neutral-400'}`} />
                      <span>{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Profile and Blueprint Action */}
      <div className={`p-4 border-t space-y-3 ${isLight ? 'border-neutral-100' : 'border-neutral-900'}`}>
        {/* Toggle Sitemap and Userflow Blueprint */}
        <button
          onClick={onToggleBlueprint}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            showBlueprint
              ? isLight
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                : 'bg-indigo-950/20 border-indigo-500/60 text-indigo-300 shadow-lg'
              : isLight
                ? 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
                : 'bg-neutral-900 border-neutral-850 text-neutral-300 hover:border-neutral-700 hover:text-white'
          }`}
        >
          <Compass className={`w-4 h-4 ${showBlueprint ? 'text-indigo-600 animate-spin' : 'text-neutral-400'}`} />
          <span>Platform Blueprint</span>
          <span className={`ml-auto font-mono text-[9px] border px-1.5 py-0.5 rounded ${
            isLight ? 'bg-white text-neutral-400 border-neutral-200' : 'bg-neutral-950 text-neutral-400 border-neutral-800'
          }`}>
            FLOW
          </span>
        </button>

        {/* User Card */}
        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-neutral-900 border-neutral-850 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs uppercase shadow-sm ${
              isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-600/20 border-indigo-500/20 text-indigo-400'
            }`}>
              AM
            </div>
            <div className="truncate max-w-[110px]">
              <span className={`block text-xs font-bold truncate ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>Alex Mercer</span>
              <span className="block text-[9px] text-neutral-400 truncate font-semibold">Job Seeker</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50/50' : 'text-neutral-400 hover:text-red-400 hover:bg-neutral-800'
            }`}
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
