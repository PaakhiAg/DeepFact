'use client';

import React from 'react';
import { useAuth } from '@/components/providers/AppProviders';
import {
  Settings,
  User,
  BadgeCheck,
  LogOut,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Account Clearance
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your active analyst credentials and operational clearance level.
        </p>
      </div>

      {/* Active Clearance Profile Card */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-cyan-500/30 shadow-glass space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-violet-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-neon-cyan" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Active Clearance Profile
              </h3>
              <p className="text-xs font-mono text-cyan-400">
                Verified Analyst Session
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <BadgeCheck className="w-3.5 h-3.5" />
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Analyst Name
            </span>
            <p className="text-sm font-bold text-white font-mono">
              {user?.name || 'Guest Investigator'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Clearance Email
            </span>
            <p className="text-sm font-bold text-cyan-400 font-mono truncate">
              {user?.email || 'analyst@deepfact.ai'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Assigned Role
            </span>
            <p className="text-sm font-bold text-emerald-400 font-mono uppercase">
              {user?.role || 'Analyst'}
            </p>
          </div>
        </div>

        {user && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Session secured with local authentication clearance.
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-mono flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
