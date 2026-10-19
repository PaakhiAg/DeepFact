'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { VerificationReport } from '@/lib/types';
import OverallVerdictBanner from '@/components/verification/OverallVerdictBanner';
import InteractiveArticleReader from '@/components/verification/InteractiveArticleReader';
import ClaimCard from '@/components/verification/ClaimCard';
import EvidenceRelationshipGraph from '@/components/verification/EvidenceRelationshipGraph';
import {
  ArrowLeft,
  FileText,
  Network,
  Globe2,
  ShieldCheck,
  ExternalLink,
  Loader2,
  AlertOctagon,
} from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'reader' | 'graph' | 'sources'>('reader');

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/reports/${id}`);
        const data = await res.json();
        if (data.success && data.report) {
          setReport(data.report);
          if (data.report.claims?.length > 0) {
            setSelectedClaimId(data.report.claims[0].id);
          }
        } else {
          setError(data.error || 'Report not found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadReport();
  }, [id]);

  const handleExportMarkdown = () => {
    if (!report) return;

    let md = `# DeepFact Forensic Verification Report\n\n`;
    md += `**Title:** ${report.title}\n`;
    md += `**Overall Verdict:** ${report.overallVerdict} (${report.overallConfidence}% Confidence)\n`;
    md += `**Truth Index:** ${report.metrics.truthScore} / 100\n`;
    md += `**Analysis Date:** ${new Date(report.createdAt).toLocaleString()}\n`;
    if (report.sourceUrl) md += `**Source URL:** ${report.sourceUrl}\n`;
    md += `\n## Executive Summary\n${report.summary}\n\n`;
    md += `## Metrics Summary\n`;
    md += `- Total Claims: ${report.metrics.totalClaims}\n`;
    md += `- Corroborated / Supported: ${report.metrics.supportedCount}\n`;
    md += `- Refuted / False: ${report.metrics.refutedCount}\n`;
    md += `- Mixed Evidence: ${report.metrics.mixedCount}\n`;
    md += `- Unverified: ${report.metrics.unverifiedCount}\n`;
    md += `- Sources Retraced: ${report.metrics.sourcesAnalyzed}\n\n`;
    md += `## Individual Claim-by-Claim Verification\n\n`;

    report.claims.forEach((c, idx) => {
      md += `### Claim ${idx + 1}: ${c.claimText}\n`;
      md += `**Verdict:** ${c.verdict} (${c.confidence}%)\n`;
      md += `**Original Context:** *"${c.originalSentence}"*\n\n`;
      md += `**Forensic Explanation:** ${c.explanation}\n\n`;
      md += `**Evidence Sources (${c.evidence.length}):**\n`;
      c.evidence.forEach((ev) => {
        md += `- [${ev.stance}] **${ev.domain}** (${ev.credibilityTier} - ${ev.credibilityScore} pts): [${ev.title}](${ev.url})\n`;
        md += `  > "${ev.snippet}"\n`;
      });
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepFact-Report-${report.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading forensic verification dossier...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 w-16 h-16 mx-auto flex items-center justify-center border border-rose-500/30">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Dossier Unavailable</h2>
        <p className="text-xs text-slate-400 font-mono">{error || 'Could not locate report.'}</p>
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 text-xs font-mono hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Reports Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Navigation & Back Action */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dossiers Archive
        </Link>

        <span className="text-xs font-mono text-slate-500">
          Permanent ID: <strong className="text-cyan-400">{report.id}</strong>
        </span>
      </div>

      {/* Forensic Verdict Banner */}
      <OverallVerdictBanner
        verdict={report.overallVerdict}
        confidence={report.overallConfidence}
        summary={report.summary}
        metrics={report.metrics}
        createdAt={report.createdAt}
        onExportPdf={handleExportPdf}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setViewMode('reader')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              viewMode === 'reader'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Original Reader & Claims ({report.claims.length})</span>
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              viewMode === 'graph'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Evidence Topology Graph</span>
          </button>
          <button
            onClick={() => setViewMode('sources')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              viewMode === 'sources'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>All Retraced Sources ({report.metrics.sourcesAnalyzed})</span>
          </button>
        </div>
      </div>

      {/* View 1: Reader & Claims */}
      {viewMode === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 sticky top-24">
            <InteractiveArticleReader
              content={report.rawContent}
              claims={report.claims}
              selectedClaimId={selectedClaimId}
              onSelectClaim={(claimId) => {
                setSelectedClaimId(claimId);
                const el = document.getElementById(`claim-${claimId}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              title={report.title}
              sourceUrl={report.sourceUrl}
              domain={report.domain}
              author={report.author}
              publishedDate={report.publishedDate}
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>Isolated Verifiable Propositions</span>
              <span>{report.claims.length} Claims Verified</span>
            </div>

            {report.claims.map((claim, idx) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                index={idx}
                isSelected={claim.id === selectedClaimId}
                onSelect={() => setSelectedClaimId(claim.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* View 2: Evidence Graph */}
      {viewMode === 'graph' && (
        <EvidenceRelationshipGraph
          claims={report.claims}
          onSelectClaim={(id) => setSelectedClaimId(id)}
        />
      )}

      {/* View 3: All Sources Table */}
      {viewMode === 'sources' && (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-neon-cyan" /> Retraced Evidence Directory
          </h3>
          <div className="space-y-3">
            {report.claims.flatMap((c) => c.evidence).map((source, sIdx) => (
              <div
                key={`${source.id}-${sIdx}`}
                className="p-4 rounded-xl bg-slate-900/70 border border-white/10 hover:border-cyan-400/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">{source.domain}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {source.credibilityTier} ({source.credibilityScore} pts)
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                      source.stance === 'SUPPORTS'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : source.stance === 'REFUTES'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {source.stance}
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic mb-2 leading-relaxed">
                  &ldquo;{source.snippet}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="truncate max-w-md">{source.title}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-mono ml-2 flex-shrink-0"
                  >
                    Direct Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
