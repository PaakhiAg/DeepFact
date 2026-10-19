'use client';

import React, { useState } from 'react';
import { Claim, EvidenceSource } from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Quote,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function ClaimCard({ claim, index, isSelected = false, onSelect }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(true);

  const verdictStyles = {
    Supported: {
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: CheckCircle2,
      textColor: 'text-emerald-400',
      bgGlow: 'hover:shadow-neon-emerald',
    },
    Refuted: {
      border: 'border-rose-500/40',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: XCircle,
      textColor: 'text-rose-400',
      bgGlow: 'hover:shadow-neon-rose',
    },
    'Mixed Evidence': {
      border: 'border-amber-500/40',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      textColor: 'text-amber-400',
      bgGlow: 'hover:shadow-neon-amber',
    },
    Unverified: {
      border: 'border-slate-500/40',
      badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      icon: HelpCircle,
      textColor: 'text-slate-400',
      bgGlow: '',
    },
  }[claim.verdict];

  const IconComponent = verdictStyles.icon;

  return (
    <div
      id={`claim-${claim.id}`}
      onClick={onSelect}
      className={`glass-panel rounded-2xl p-5 md:p-6 border transition-all duration-300 ${
        verdictStyles.border
      } ${verdictStyles.bgGlow} ${
        isSelected ? 'ring-2 ring-neon-cyan shadow-neon-cyan bg-slate-900/90' : 'bg-slate-900/60'
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800">
            CLAIM #{index + 1}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${verdictStyles.badge}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {claim.verdict}
          </span>
          <span className="text-[11px] font-mono text-slate-400 capitalize px-2 py-0.5 rounded bg-slate-800">
            {claim.importance} Priority
          </span>
        </div>

        {/* Confidence Gauge Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Confidence:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-xs font-bold text-white">
            <span
              className={`w-2 h-2 rounded-full ${
                claim.confidence >= 80
                  ? 'bg-emerald-400'
                  : claim.confidence >= 60
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
              }`}
            />
            {claim.confidence}%
          </div>
        </div>
      </div>

      {/* Verifiable Factual Proposition */}
      <div className="mb-4">
        <h4 className="text-base md:text-lg font-semibold text-white leading-snug">
          {claim.claimText}
        </h4>
      </div>

      {/* Original Sentence in Article */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 mb-4">
        <div className="flex items-start gap-2.5">
          <Quote className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 opacity-70" />
          <div className="text-xs text-slate-300 italic leading-relaxed">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 not-italic block mb-1">
              Context in Original Article:
            </span>
            &ldquo;{claim.originalSentence}&rdquo;
          </div>
        </div>
      </div>

      {/* AI Forensic Reasoning Explanation */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-white/10 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-neon-violet" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Forensic Cross-Reference Assessment
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {claim.explanation}
        </p>
      </div>

      {/* Stance Breakdown Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 py-2 border-t border-white/10">
        <div className="flex items-center gap-3">
          <span>Evidence Sources:</span>
          <span className="text-emerald-400 font-semibold">
            {claim.stanceBreakdown.supporting} Corroborating
          </span>
          <span>•</span>
          <span className="text-rose-400 font-semibold">
            {claim.stanceBreakdown.refuting} Contradicting
          </span>
          {claim.stanceBreakdown.neutral > 0 && (
            <>
              <span>•</span>
              <span className="text-amber-400 font-semibold">
                {claim.stanceBreakdown.neutral} Contextual
              </span>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
        >
          {expanded ? (
            <>
              Hide Sources ({claim.evidence.length}) <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show Sources ({claim.evidence.length}) <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expandable Evidence Source Cards */}
      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Independent Citations & Web Excerpts
          </span>
          {claim.evidence.map((source, sIdx) => {
            const isSupports = source.stance === 'SUPPORTS';
            const isRefutes = source.stance === 'REFUTES';

            const stanceBadge = isSupports ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                SUPPORTS
              </span>
            ) : isRefutes ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                REFUTES
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                NEUTRAL / CONTEXT
              </span>
            );

            return (
              <div
                key={source.id || sIdx}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {source.domain}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {source.credibilityTier} ({source.credibilityScore} pts)
                    </span>
                  </div>
                  {stanceBadge}
                </div>

                <p className="text-xs text-slate-300 italic mb-2 leading-relaxed">
                  &ldquo;{source.snippet}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="truncate max-w-[340px]">{source.title}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline font-mono ml-2 flex-shrink-0"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
