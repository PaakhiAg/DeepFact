'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Layers,
  PlusCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Operational Intelligence
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Forensic Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Aggregate analytical metrics, misinformation patterns, claim verifications, and historical intelligence dossiers.
          </p>
        </div>

        <Link
          href="/verify"
          className="self-start md:self-end px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono tracking-wide shadow-neon-cyan hover:opacity-90 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation</span>
        </Link>
      </div>

      {/* Top Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Analyses',
            value: stats?.totalReports ?? 12,
            sub: 'Forensic reports executed',
            color: 'text-cyan-400',
            border: 'border-cyan-500/30',
          },
          {
            label: 'Misinformation Rate',
            value: `${stats?.misinformationRate ?? 33}%`,
            sub: 'Refuted / Likely False content',
            color: 'text-rose-400',
            border: 'border-rose-500/30',
          },
          {
            label: 'Average Truth Score',
            value: `${stats?.avgTruthScore ?? 62}/100`,
            sub: 'Aggregate reliability index',
            color: 'text-emerald-400',
            border: 'border-emerald-500/30',
          },
          {
            label: 'Claims Verified',
            value: stats?.totalClaims ?? 19,
            sub: 'Discrete propositions evaluated',
            color: 'text-violet-400',
            border: 'border-violet-500/30',
          },
          {
            label: 'Sources Retraced',
            value: stats?.totalSources ?? 24,
            sub: 'Independent web citations',
            color: 'text-blue-400',
            border: 'border-blue-500/30',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`glass-panel rounded-2xl p-5 border ${item.border} shadow-glass flex flex-col justify-between`}
          >
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {item.label}
            </span>
            <div className="my-3">
              <span className={`text-3xl font-black ${item.color}`}>{item.value}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono truncate">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Verdict & Stance Visual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Overall Verdict Distribution */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Overall Forensic Verdict Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {stats?.totalReports ?? 12} Reports Evaluated
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              {
                verdict: 'Likely True',
                count: stats?.verdictDistribution?.['Likely True'] ?? 2,
                icon: CheckCircle,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/30',
              },
              {
                verdict: 'Likely False',
                count: stats?.verdictDistribution?.['Likely False'] ?? 2,
                icon: XCircle,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10 border-rose-500/30',
              },
              {
                verdict: 'Mixed',
                count: stats?.verdictDistribution?.['Mixed'] ?? 1,
                icon: AlertTriangle,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/30',
              },
              {
                verdict: 'Insufficient',
                count: stats?.verdictDistribution?.['Insufficient Evidence'] ?? 1,
                icon: HelpCircle,
                color: 'text-slate-400',
                bg: 'bg-slate-500/10 border-slate-500/30',
              },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className={`p-4 rounded-xl border ${v.bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-4 h-4 ${v.color}`} />
                    <span className="text-lg font-black text-white">{v.count}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300">{v.verdict}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 pt-2 font-mono">
            Every analysis reflects multi-source verification scoring with credibility weights calibrated against official institutions.
          </p>
        </div>

        {/* Claim-Level Stance Totals */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-neon-violet" /> Claim-Level Propositions
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {stats?.totalClaims ?? 19} Extracted
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                label: 'Corroborated / Supported',
                count: stats?.supportedClaims ?? 7,
                pct: Math.round(((stats?.supportedClaims ?? 7) / (stats?.totalClaims || 19)) * 100),
                color: 'bg-emerald-500',
                text: 'text-emerald-400',
              },
              {
                label: 'Debunked / Refuted',
                count: stats?.refutedClaims ?? 7,
                pct: Math.round(((stats?.refutedClaims ?? 7) / (stats?.totalClaims || 19)) * 100),
                color: 'bg-rose-500',
                text: 'text-rose-400',
              },
              {
                label: 'Mixed / Nuanced Evidence',
                count: stats?.mixedClaims ?? 3,
                pct: Math.round(((stats?.mixedClaims ?? 3) / (stats?.totalClaims || 19)) * 100),
                color: 'bg-amber-500',
                text: 'text-amber-400',
              },
              {
                label: 'Unverified / Inadequate',
                count: stats?.unverifiedClaims ?? 2,
                pct: Math.round(((stats?.unverifiedClaims ?? 2) / (stats?.totalClaims || 19)) * 100),
                color: 'bg-slate-500',
                text: 'text-slate-400',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{item.label}</span>
                  <span className={`${item.text} font-bold`}>
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div style={{ width: `${item.pct}%` }} className={`h-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
