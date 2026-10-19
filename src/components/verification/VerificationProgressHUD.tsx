'use client';

import React from 'react';
import { Loader2, Shield, Search, Cpu, CheckCircle2, Terminal } from 'lucide-react';

interface VerificationProgressHUDProps {
  currentStep: number; // 1 to 5
  statusMessage: string;
  detailMessage: string;
}

export default function VerificationProgressHUD({
  currentStep,
  statusMessage,
  detailMessage,
}: VerificationProgressHUDProps) {
  const steps = [
    { num: 1, title: 'Content Ingestion', desc: 'Parsing & DOM Normalization' },
    { num: 2, title: 'Claim Isolation', desc: 'Identifying verifiable propositions' },
    { num: 3, title: 'Web RAG Retrieval', desc: 'Querying authoritative indexes' },
    { num: 4, title: 'Cross-Stance Matrix', desc: 'Comparing corroborations & rebuttals' },
    { num: 5, title: 'Forensic Synthesis', desc: 'Aggregating transparent verdict' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-neon-cyan/30 shadow-neon-cyan max-w-3xl mx-auto my-8 relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Header with Radar Icon */}
      <div className="relative z-10 flex items-center justify-between pb-6 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-neon-cyan/50 bg-cyan-950/40 flex items-center justify-center">
            <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <Cpu className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              DeepFact Forensic Verification HUD
            </h3>
            <p className="text-xs font-mono text-neon-cyan tracking-wider uppercase">
              RAG Pipeline Stage {currentStep} of 5 Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-neon-cyan/40 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Live Intelligence Stream
        </div>
      </div>

      {/* 5-Step Pipeline Progress Bar */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-2 mb-8">
        {steps.map((s) => {
          const isComplete = currentStep > s.num;
          const isActive = currentStep === s.num;

          return (
            <div
              key={s.num}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'border-neon-cyan bg-cyan-950/60 shadow-neon-cyan ring-1 ring-neon-cyan'
                  : isComplete
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                  : 'border-white/5 bg-slate-900/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Step 0{s.num}
                </span>
                {isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : null}
              </div>
              <h5 className="text-xs font-bold text-white tracking-tight">{s.title}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live Telemetry Terminal */}
      <div className="relative z-10 p-4 rounded-xl bg-black/70 border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Terminal className="w-3.5 h-3.5" /> Telemetry Log
          </span>
          <span className="text-slate-500">Node Cluster: US-EAST-PRIMARY</span>
        </div>
        <div className="space-y-1.5 text-slate-300">
          <p className="text-cyan-300 font-semibold">&gt; {statusMessage}</p>
          <p className="text-slate-400 text-[11px]">&gt; {detailMessage}</p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
            <span>[TAVILY_AGENT_QUERY]</span>
            <span>[GEMINI_CROSS_STANCE_ACTIVE]</span>
            <span className="text-emerald-400">[ZERO_TAMPER_PROTOCOL]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
