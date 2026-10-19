'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AppProviders';
import {
  Settings,
  Key,
  ShieldCheck,
  Cpu,
  Globe2,
  Database,
  CheckCircle2,
  Save,
  Info,
  Server,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [geminiKey, setGeminiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem('deepfact_gemini_key') || '';
    const savedTavily = localStorage.getItem('deepfact_tavily_key') || '';
    if (savedGemini) setGeminiKey(savedGemini);
    if (savedTavily) setTavilyKey(savedTavily);
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deepfact_gemini_key', geminiKey.trim());
    localStorage.setItem('deepfact_tavily_key', tavilyKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            System & Engine Configuration
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Settings & Diagnostics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect RAG pipeline diagnostics, configure personal AI provider keys, and verify zero-fabrication policies.
        </p>
      </div>

      {/* Engine Diagnostics */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Server className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Live System & Telemetry Diagnostics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Claim Extraction Core</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-white font-mono font-bold">
              Google Gemini / Heuristic Proposition Parser
            </p>
            <p className="text-[11px] text-slate-400">
              Decomposes input content into testable propositions while preserving character spans.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Web Evidence Retrieval</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                MULTI-PROVIDER
              </span>
            </div>
            <p className="text-xs text-white font-mono font-bold">
              Tavily Search + DuckDuckGo + Ground-Truth DB
            </p>
            <p className="text-[11px] text-slate-400">
              Retrieves live independent citations with automated paywall & block fallback.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Credibility Tier Registry</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                40+ DOMAINS
              </span>
            </div>
            <p className="text-xs text-white font-mono font-bold">
              Academic, Institutional & Fact-Checking
            </p>
            <p className="text-[11px] text-slate-400">
              Scored from WHO (.int), NASA, FDA (.gov) to wire services and independent journalism.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Integrity Protocol</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ENFORCED
              </span>
            </div>
            <p className="text-xs text-white font-mono font-bold">
              Zero Fabricated Citations Protocol
            </p>
            <p className="text-[11px] text-slate-400">
              Only retrieved, real URLs and verbatim quotes are permitted in verification verdicts.
            </p>
          </div>
        </div>
      </div>

      {/* Custom API Key Configuration */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-glass space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              AI & Search API Providers (Optional)
            </h3>
          </div>
          {savedSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Keys Updated Successfully
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          DeepFact functions seamlessly out of the box with intelligent semantic heuristics and live open web search. If you wish to provide your own personal Google Gemini or Tavily keys for dedicated API quotas, you can specify them here:
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy... (leave blank to use system default)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Free-tier key available from Google AI Studio.
            </span>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1">
              Tavily Search API Key
            </label>
            <input
              type="password"
              value={tavilyKey}
              onChange={(e) => setTavilyKey(e.target.value)}
              placeholder="tvly-... (leave blank to use system open search)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Free-tier key available from Tavily (1,000 free searches/month).
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono tracking-wider shadow-neon-cyan hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Provider Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* User Session Info */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-3">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
          Active Clearance Profile
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-300 gap-2">
          <span>Name: <strong className="text-white">{user?.name || 'Guest Investigator'}</strong></span>
          <span>Email: <strong className="text-cyan-400">{user?.email || 'analyst@deepfact.ai'}</strong></span>
          <span>Role: <strong className="text-emerald-400 uppercase">{user?.role || 'Analyst'}</strong></span>
        </div>
      </div>
    </div>
  );
}
