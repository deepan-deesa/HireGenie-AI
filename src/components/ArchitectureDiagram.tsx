/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, GitFork, Compass, ArrowRight, CheckCircle2, User, Cpu, Mail, Layout, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { SitemapNode, UserFlowStep } from '../types';

export default function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<'sitemap' | 'userflow'>('sitemap');

  const sitemapData: SitemapNode = {
    name: "HireGenie AI Portal",
    description: "Enterprise Talent Intelligence Platform",
    children: [
      {
        name: "Public Facing Landing Page",
        description: "Inbound Marketing & Value Prop",
        children: [
          { name: "Features & Pricing", description: "Bento layouts of product tiers & modules" },
          { name: "Interactive Sandbox", description: "Mini resume parser experience for prospective users" },
        ]
      },
      {
        name: "Auth & Onboarding Portal",
        description: "Identity & Integration Provisioning",
        children: [
          { name: "Secure Login / Register", description: "Standard secure credentials" },
          { name: "Workspace Setup", description: "Company onboarding & team size config" },
        ]
      },
      {
        name: "Recruiter Command Workspace",
        description: "Authenticated Premium Dashboard Layout",
        children: [
          { name: "Overview Hub", description: "KPI analytics, active requisitions feed, dynamic metrics" },
          { name: "Job Management", description: "Job definition editor, custom key-skill profile weights" },
          { name: "Candidate Pipeline", description: "Parsed scoreboards, resume viewer, match evaluation" },
          { name: "Gmail Integration", description: "Two-way synced communication thread, automated drafts" },
          { name: "AI Agent Settings", description: "Tuning model prompt prompts, screening benchmarks" },
          { name: "Settings & Keys", description: "Secure credential stores, API webhooks, team logs" },
          { name: "User Profile", description: "Personal metadata, notification intervals, dark mode toggle" }
        ]
      }
    ]
  };

  const userFlowSteps: UserFlowStep[] = [
    {
      step: 1,
      title: "Recruiter Registration",
      actor: "User",
      description: "Recruiter registers on HireGenie AI and links Gmail via Workspace OAuth integration."
    },
    {
      step: 2,
      title: "Define Job Opening",
      actor: "User",
      description: "Recruiter creates a new Job Post, choosing target skills and defining strict AI rating weights."
    },
    {
      step: 3,
      title: "Automated Job Parser Setup",
      actor: "System",
      description: "System provisions dedicated email parsing hooks and sets up candidate submission pipelines."
    },
    {
      step: 4,
      title: "Resume Ingest & Parse",
      actor: "Gmail",
      description: "Applicant emails a resume. HireGenie ingests, parses content, and matches candidates."
    },
    {
      step: 5,
      title: "AI Candidate Scoring",
      actor: "AI Agent",
      description: "Gemini evaluates the parsed profile against the target criteria to output a high-fidelity match score."
    },
    {
      step: 6,
      title: "AI Response Generation",
      actor: "AI Agent",
      description: "HireGenie auto-drafts a personalized, contextual screening reply based on the match score."
    },
    {
      step: 7,
      title: "Review & Outbound Action",
      actor: "User",
      description: "Recruiter reviews the candidate, adjusts the AI-drafted reply, and clicks Send via one-click API."
    }
  ];

  const getActorColor = (actor: string) => {
    switch (actor) {
      case 'User': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'System': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'AI Agent': return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'Gmail': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'User': return <User className="w-4 h-4" />;
      case 'System': return <Layout className="w-4 h-4" />;
      case 'AI Agent': return <Cpu className="w-4 h-4" />;
      case 'Gmail': return <Mail className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight font-display flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet-400 animate-pulse" />
            Platform Blueprint
          </h2>
          <p className="text-sm text-neutral-400">Architectural mapping of HireGenie AI</p>
        </div>
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sitemap'
                ? 'bg-neutral-800 text-white shadow-lg'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Network className="w-4 h-4" />
            Sitemap Schema
          </button>
          <button
            onClick={() => setActiveTab('userflow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'userflow'
                ? 'bg-neutral-800 text-white shadow-lg'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <GitFork className="w-4 h-4" />
            Candidate Journey Flow
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'sitemap' ? (
          <div className="space-y-6">
            <div className="p-4 bg-violet-950/20 border border-violet-800/30 rounded-xl">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-violet-400/20 text-violet-300 rounded mb-1">Architecture Note</span>
              <p className="text-xs text-neutral-300">
                HireGenie is structured around a central <strong>Recruiter Command Workspace</strong> acting as the primary application view. All sections share a common global navigation sidebar layout.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {sitemapData.children?.map((node, i) => (
                <div key={i} className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 relative hover:border-neutral-700 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
                  <h3 className="font-semibold text-neutral-200 text-sm mt-1">{node.name}</h3>
                  <p className="text-xs text-neutral-400 mb-4">{node.description}</p>
                  
                  <div className="space-y-3">
                    {node.children?.map((child, idx) => (
                      <div key={idx} className="bg-neutral-900/80 p-3 rounded-lg border border-neutral-800/60 hover:bg-neutral-900 transition-colors">
                        <span className="text-xs font-medium text-violet-300">{child.name}</span>
                        <p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">{child.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-sky-950/20 border border-sky-800/30 rounded-xl mb-4">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-sky-400/20 text-sky-300 rounded mb-1">Process Standard</span>
              <p className="text-xs text-neutral-300">
                This transaction pipeline illustrates the sequence from active vacancy creation to contextual notification dispatch and recruiter resolution.
              </p>
            </div>

            <div className="relative border-l border-neutral-800 pl-6 ml-4 space-y-6 py-2">
              {userFlowSteps.map((step, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="relative group"
                >
                  {/* Circle number */}
                  <div className="absolute -left-10 top-0.5 w-7 h-7 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-xs font-semibold text-neutral-300 group-hover:border-violet-500/50 transition-colors">
                    {step.step}
                  </div>

                  <div className="bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="font-medium text-sm text-neutral-100">{step.title}</span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${getActorColor(step.actor)}`}>
                        {getActorIcon(step.actor)}
                        {step.actor}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
