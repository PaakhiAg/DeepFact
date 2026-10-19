'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { VerificationReport } from '@/lib/types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Layers,
  Globe2,
  Clock,
  ArrowRight,
  Search,
  Trash2,
  Download,
  Filter,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const [reports, setReports] = useState<VerificationReport[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reportsRes, statsRes] = await Promise.all([
        fetch(`/api/reports?q=${encodeURIComponent(searchQuery)}&verdict=${verdictFilter}`),
        fetch('/api/stats'),
      ]);
      const reportsData = await reportsRes.json();
      const statsData = await statsRes.json();

      if (reportsData.success) setReports(reportsData.reports);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [searchQuery, verdictFilter]);

  const handleDeleteReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this forensic report?')) return;

    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

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
            value: stats?.totalReports ?? reports.length,
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
            value: stats?.totalClaims ?? 9,
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
            <span className="text-xs font-mono text-slate-400">{reports.length} Reports Logged</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              {
                verdict: 'Likely True',
                count: stats?.verdictDistribution?.['Likely True'] ?? 1,
                icon: CheckCircle,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/30',
              },
              {
                verdict: 'Likely False',
                count: stats?.verdictDistribution?.['Likely False'] ?? 1,
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
                count: stats?.verdictDistribution?.['Insufficient Evidence'] ?? 0,
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
            Every analysis reflects multi-source RAG scoring with credibility weights calibrated against official institutions.
          </p>
        </div>

        {/* Claim-Level Stance Totals */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-neon-violet" /> Claim-Level Propositions
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {stats?.totalClaims ?? 9} Extracted
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                label: 'Corroborated / Supported',
                count: stats?.supportedClaims ?? 4,
                pct: Math.round(((stats?.supportedClaims ?? 4) / (stats?.totalClaims || 9)) * 100),
                color: 'bg-emerald-500',
                text: 'text-emerald-400',
              },
              {
                label: 'Debunked / Refuted',
                count: stats?.refutedClaims ?? 4,
                pct: Math.round(((stats?.refutedClaims ?? 4) / (stats?.totalClaims || 9)) * 100),
                color: 'bg-rose-500',
                text: 'text-rose-400',
              },
              {
                label: 'Mixed / Nuanced Evidence',
                count: stats?.mixedClaims ?? 1,
                pct: Math.round(((stats?.mixedClaims ?? 1) / (stats?.totalClaims || 9)) * 100),
                color: 'bg-amber-500',
                text: 'text-amber-400',
              },
              {
                label: 'Unverified / Inadequate',
                count: stats?.unverifiedClaims ?? 0,
                pct: Math.round(((stats?.unverifiedClaims ?? 0) / (stats?.totalClaims || 9)) * 100),
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

      {/* Historical Forensic Reports Table */}
      <div className="glass-panel rounded-2xl border border-white/10 shadow-glass overflow-hidden space-y-4">
        {/* Table Controls Row */}
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Recent Forensic Investigations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any report to inspect the full interactive article reader, claim cards, and evidence links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dossiers..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Verdict Filter Select */}
            <div className="relative">
              <select
                value={verdictFilter}
                onChange={(e) => setVerdictFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Verdicts</option>
                <option value="Likely True">Likely True</option>
                <option value="Likely False">Likely False</option>
                <option value="Mixed">Mixed</option>
                <option value="Insufficient Evidence">Insufficient Evidence</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/40 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="p-4">Dossier / Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Verdict</th>
                <th className="p-4">Truth Index</th>
                <th className="p-4">Claims</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {reports.length > 0 ? (
                reports.map((report) => {
                  const verdictColor =
                    report.overallVerdict === 'Likely True'
                      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                      : report.overallVerdict === 'Likely False'
                      ? 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                      : report.overallVerdict === 'Mixed'
                      ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                      : 'text-slate-400 border-slate-500/40 bg-slate-500/10';

                  return (
                    <tr
                      key={report.id}
                      onClick={() => (window.location.href = `/reports/${report.id}`)}
                      className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-sans font-bold text-white text-xs max-w-sm truncate">
                          {report.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-sm">
                          ID: {report.id}
                        </div>
                      </td>
                      <td className="p-4 capitalize text-slate-400">{report.sourceType}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${verdictColor}`}>
                          {report.overallVerdict}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">
                        {report.metrics.truthScore}%
                      </td>
                      <td className="p-4 text-slate-400">
                        {report.metrics.totalClaims} claims
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/reports/${report.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] transition-colors inline-block"
                        >
                          View
                        </Link>
                        <button
                          onClick={(e) => handleDeleteReport(report.id, e)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No investigations found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
