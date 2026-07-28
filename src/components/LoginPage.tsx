/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, ArrowRight, Loader2, Sparkles, UserPlus, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { AppView } from '../types';

interface LoginPageProps {
  onNavigate: (view: AppView) => void;
  onSuccess: () => void;
}

export default function LoginPage({ onNavigate, onSuccess }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('jobseeker@hiregenie.ai');
  const [password, setPassword] = useState('password');
  const [fullName, setFullName] = useState('Alex Mercer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-center items-center p-6 relative font-sans">
      {/* Back button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-indigo-600 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to marketing
      </button>

      {/* Ambient background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 mx-auto mb-3">
            H
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display text-neutral-900">
            {isSignUp ? 'Create your career account' : 'Welcome to your career hub'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            {isSignUp 
              ? 'Start tracking application pipelines and scanning job matches on autopilot' 
              : 'Sign in to access your personal AI job workspace'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-neutral-200/80 p-8 rounded-2xl shadow-xl shadow-neutral-100/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl outline-none transition-all font-medium"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 font-mono">Personal Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl outline-none transition-all font-medium"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Secret Password</label>
                {!isSignUp && (
                  <a href="#" className="text-[10px] text-indigo-600 hover:text-indigo-500 font-bold">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-neutral-800 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl outline-none transition-all font-medium"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:transform-none cursor-pointer mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing career cockpit...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Initialize Career Agent' : 'Enter Job Seeker Console'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative my-6 text-center">
            <hr className="border-neutral-100" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-white text-[9px] uppercase font-bold text-neutral-400 tracking-wider font-mono">Alternative Sync</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-700 py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer font-bold"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Toggle link */}
        <p className="text-center text-xs text-neutral-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-500 font-bold cursor-pointer underline underline-offset-2 ml-1"
          >
            {isSignUp ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  );
}
