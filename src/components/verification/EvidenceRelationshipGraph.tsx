'use client';

import React, { useState } from 'react';
import { Claim, EvidenceSource } from '@/lib/types';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, ShieldCheck, Link2 } from 'lucide-react';

interface EvidenceRelationshipGraphProps {
  claims: Claim[];
  onSelectClaim?: (claimId: string) => void;
}

export default function EvidenceRelationshipGraph({ claims, onSelectClaim }: EvidenceRelationshipGraphProps) {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || '');
  const [activeSource, setActiveSource] = useState<EvidenceSource | null>(null);

  const activeClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-glass overflow-hidden relative">
      {/* Decorative cyber grid corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial-glow pointer-events-none opacity-50" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Link2 className="w-5 h-5 text-neon-cyan" /> Evidence Relationship Topology
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual bipartite graph mapping discrete claims to authoritative web sources and stance links.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Corroborating (Supports)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> Contradicting (Refutes)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Context / Neutral
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Claims Select List */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Target Claims ({claims.length})
          </h4>
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {claims.map((claim, index) => {
              const isSelected = claim.id === selectedClaimId;
              const verdictColor =
                claim.verdict === 'Supported'
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                  : claim.verdict === 'Refuted'
                  ? 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                  : claim.verdict === 'Mixed Evidence'
                  ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                  : 'border-slate-500/40 text-slate-400 bg-slate-500/10';

              return (
                <div
                  key={claim.id}
                  onClick={() => {
                    setSelectedClaimId(claim.id);
                    onSelectClaim?.(claim.id);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? 'border-neon-cyan bg-cyan-950/40 shadow-neon-cyan ring-1 ring-neon-cyan/50'
                      : 'border-white/10 bg-slate-900/60 hover:border-white/25 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      Claim #{index + 1}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${verdictColor}`}>
                      {claim.verdict} ({claim.confidence}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    &ldquo;{claim.claimText}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span>{claim.evidence.length} sources connected</span>
                    <span>•</span>
                    <span className="text-emerald-400">{claim.stanceBreakdown.supporting} sup</span>
                    <span className="text-rose-400">{claim.stanceBreakdown.refuting} ref</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right: Connected Sources & Stance Node Graph */}
        <div className="lg:col-span-7 bg-slate-950/60 rounded-xl p-5 border border-white/10 min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Connected Evidence Network for Selected Claim
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {activeClaim?.evidence?.length || 0} Retrieved Nodes
              </span>
            </div>

            {activeClaim ? (
              <div className="space-y-3">
                {activeClaim.evidence.map((source, idx) => {
                  const isHovered = activeSource?.id === source.id;
                  let stanceBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Corroborates
                    </span>
                  );
                  let nodeBorder = 'border-emerald-500/30 hover:border-emerald-400';

                  if (source.stance === 'REFUTES') {
                    stanceBadge = (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" /> Contradicts / Debunks
                      </span>
                    );
                    nodeBorder = 'border-rose-500/30 hover:border-rose-400';
                  } else if (source.stance === 'NEUTRAL' || source.stance === 'MENTIONS') {
                    stanceBadge = (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <AlertCircle className="w-3 h-3" /> Context / Nuance
                      </span>
                    );
                    nodeBorder = 'border-amber-500/30 hover:border-amber-400';
                  }

                  return (
                    <div
                      key={source.id || idx}
                      onMouseEnter={() => setActiveSource(source)}
                      onMouseLeave={() => setActiveSource(null)}
                      className={`p-3 rounded-lg border bg-slate-900/80 transition-all duration-200 ${nodeBorder} ${
                        isHovered ? 'shadow-neon-cyan translate-x-1' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            {source.domain}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {source.credibilityTier} ({source.credibilityScore} pts)
                          </span>
                        </div>
                        {stanceBadge}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 italic mb-2">
                        &ldquo;{source.snippet}&rdquo;
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[280px]">{source.title}</span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors ml-2 flex-shrink-0"
                        >
                          Visit Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-mono">Select a claim to inspect linked evidence</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>RAG Query: Exact-Phrase & Stance Cross-Referenced</span>
            <span className="text-emerald-400">Zero Hallucination Protocol Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
