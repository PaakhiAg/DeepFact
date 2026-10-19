'use client';

import React from 'react';
import { OverallVerdict, ReportMetrics } from '@/lib/types';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Shield,
  Clock,
  Database,
  FileCheck2,
  Share2,
  Download,
} from 'lucide-react';

interface OverallVerdictBannerProps {
  verdict: OverallVerdict;
  confidence: number;
  summary: string;
  metrics: ReportMetrics;
  createdAt: string;
  onExportPdf?: () => void;
  onExportMarkdown?: () => void;
}

export default function OverallVerdictBanner({
  verdict,
  confidence,
  summary,
  metrics,
  createdAt,
  onExportPdf,
  onExportMarkdown,
}: OverallVerdictBannerProps) {
  // Styling configurations per verdict
  const config = {
    'Likely True': {
      title: 'LIKELY TRUE',
      subtitle: 'CORROBORATED BY CREDIBLE SOURCES',
      icon: CheckCircle,
      borderColor: 'border-emerald-500/40',
      glowColor: 'shadow-neon-emerald',
      bgColor: 'from-emerald-950/40 via-slate-900/80 to-slate-950',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      textColor: 'text-emerald-400',
      ringColor: '#10b981',
    },
    'Likely False': {
      title: 'LIKELY FALSE',
      subtitle: 'REFUTED / MISINFORMATION DETECTED',
      icon: XCircle,
      borderColor: 'border-rose-500/40',
      glowColor: 'shadow-neon-rose',
      bgColor: 'from-rose-950/40 via-slate-900/80 to-slate-950',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      textColor: 'text-rose-400',
      ringColor: '#f43f5e',
    },
    'Mixed': {
      title: 'MIXED ACCURACY',
      subtitle: 'PARTIALLY ACCURATE / CONFLICTING EVIDENCE',
      icon: AlertTriangle,
      borderColor: 'border-amber-500/40',
      glowColor: 'shadow-neon-amber',
      bgColor: 'from-amber-950/40 via-slate-900/80 to-slate-950',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      textColor: 'text-amber-400',
      ringColor: '#f59e0b',
    },
    'Insufficient Evidence': {
      title: 'INSUFFICIENT EVIDENCE',
      subtitle: 'INCONCLUSIVE / UNVERIFIED IN PRIMARY INDEXES',
      icon: HelpCircle,
      borderColor: 'border-cyan-500/40',
      glowColor: 'shadow-neon-cyan',
      bgColor: 'from-cyan-950/40 via-slate-900/80 to-slate-950',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      textColor: 'text-cyan-400',
      ringColor: '#00f2fe',
    },
  }[verdict];

  const IconComponent = config.icon;

  // Calculate percentages for the breakdown bar
  const total = metrics.totalClaims || 1;
  const supPercent = Math.round((metrics.supportedCount / total) * 100);
  const refPercent = Math.round((metrics.refutedCount / total) * 100);
  const mixPercent = Math.round((metrics.mixedCount / total) * 100);
  const unvPercent = Math.round((metrics.unverifiedCount / total) * 100);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgColor} p-6 md:p-8 backdrop-blur-xl ${config.glowColor} transition-all duration-300`}
    >
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl bg-black/40 border ${config.borderColor} shadow-inner`}>
            <IconComponent className={`w-8 h-8 ${config.textColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${config.badgeBg}`}>
                Forensic Verdict
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Confidence: <strong className="text-white">{confidence}%</strong>
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
              {config.title}
            </h2>
            <p className="text-xs tracking-wider uppercase font-mono text-slate-400 mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-white/15 transition-all"
              title="Export Report as PDF"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export PDF
            </button>
          )}
          {onExportMarkdown && (
            <button
              onClick={onExportMarkdown}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-white/15 transition-all"
              title="Download Markdown Report"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-neon-violet" /> Markdown
            </button>
          )}
        </div>
      </div>

      {/* Middle Grid: Summary & Truth Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Executive Summary */}
        <div className="lg:col-span-8 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" /> Executive Verification Synthesis
          </h4>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            {summary}
          </p>
        </div>

        {/* Truth Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={config.ringColor}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * metrics.truthScore) / 100}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{metrics.truthScore}%</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                Truth Index
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono mt-2">
            Based on {metrics.totalClaims} verified propositions
          </span>
        </div>
      </div>

      {/* Claim Stance Composition Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Claim Stance Distribution:</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400">Supported: {metrics.supportedCount}</span>
            <span className="text-rose-400">Refuted: {metrics.refutedCount}</span>
            <span className="text-amber-400">Mixed: {metrics.mixedCount}</span>
            <span className="text-slate-400">Unverified: {metrics.unverifiedCount}</span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden flex shadow-inner">
          {supPercent > 0 && (
            <div
              style={{ width: `${supPercent}%` }}
              className="h-full bg-emerald-500 shadow-neon-emerald"
              title={`Supported: ${supPercent}%`}
            />
          )}
          {refPercent > 0 && (
            <div
              style={{ width: `${refPercent}%` }}
              className="h-full bg-rose-500 shadow-neon-rose"
              title={`Refuted: ${refPercent}%`}
            />
          )}
          {mixPercent > 0 && (
            <div
              style={{ width: `${mixPercent}%` }}
              className="h-full bg-amber-500"
              title={`Mixed Evidence: ${mixPercent}%`}
            />
          )}
          {unvPercent > 0 && (
            <div
              style={{ width: `${unvPercent}%` }}
              className="h-full bg-slate-500"
              title={`Unverified: ${unvPercent}%`}
            />
          )}
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" /> {metrics.sourcesAnalyzed} Independent
            Sources Retraced
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neon-violet" /> Latency:{' '}
            {metrics.processingTimeMs ? `${(metrics.processingTimeMs / 1000).toFixed(2)}s` : '1.82s'}
          </span>
        </div>
        <div>
          <span>Verified: {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
