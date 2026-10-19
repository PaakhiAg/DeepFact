'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { VerificationReport } from '@/lib/types';
import {
  FileText,
  Search,
  Trash2,
  ExternalLink,
  Shield,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<VerificationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports?q=${encodeURIComponent(searchQuery)}&verdict=${verdictFilter}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchQuery, verdictFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this verification dossier?')) return;

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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Archived Investigations
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Forensic Dossiers & Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Review, reopen, filter, and export past claim verifications, evidence topologies, and forensic summaries.
          </p>
        </div>

        <Link
          href="/verify"
          className="self-start md:self-end px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono tracking-wide shadow-neon-cyan hover:opacity-90 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Verification</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, domain, or title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Verdict Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          {['all', 'Likely True', 'Likely False', 'Mixed', 'Insufficient Evidence'].map((v) => (
            <button
              key={v}
              onClick={() => setVerdictFilter(v)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                verdictFilter === v
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-neon-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {v === 'all' ? 'All Dossiers' : v}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div
                key={report.id}
                className="glass-panel-interactive rounded-2xl p-6 border border-white/10 flex flex-col justify-between group cursor-pointer"
                onClick={() => (window.location.href = `/reports/${report.id}`)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${verdictColor}`}>
                      {report.overallVerdict}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Truth: <strong className="text-white">{report.metrics.truthScore}%</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 leading-snug">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {report.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      {report.metrics.totalClaims} claims verified
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/reports/${report.id}`}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      Open Dossier <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Dossier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 font-mono glass-panel rounded-2xl">
            No archived verification dossiers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
