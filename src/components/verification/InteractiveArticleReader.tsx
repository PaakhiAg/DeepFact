'use client';

import React, { useState } from 'react';
import { Claim } from '@/lib/types';
import { FileText, Eye, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface InteractiveArticleReaderProps {
  content: string;
  claims: Claim[];
  selectedClaimId?: string;
  onSelectClaim: (claimId: string) => void;
  title?: string;
  sourceUrl?: string;
  domain?: string;
  author?: string;
  publishedDate?: string;
}

export default function InteractiveArticleReader({
  content,
  claims,
  selectedClaimId,
  onSelectClaim,
  title,
  sourceUrl,
  domain,
  author,
  publishedDate,
}: InteractiveArticleReaderProps) {
  const [highlightsActive, setHighlightsActive] = useState(true);

  // Function to render text with highlighted spans for claims
  const renderAnnotatedContent = () => {
    if (!highlightsActive || claims.length === 0) {
      return <p className="whitespace-pre-line text-slate-300 leading-relaxed text-sm md:text-base">{content}</p>;
    }

    // Find sentences in the text
    const sentences = content.split(/(\n\n+|\n)/);

    return (
      <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-300">
        {sentences.map((sentence, sIdx) => {
          if (sentence === '\n' || sentence === '\n\n') {
            return <div key={sIdx} className="h-2" />;
          }

          // Check if this sentence matches any claim
          const matchingClaim = claims.find((c) => {
            const cleanS = sentence.trim().toLowerCase();
            const cleanOrig = c.originalSentence.trim().toLowerCase();
            return (
              cleanS.includes(cleanOrig) ||
              cleanOrig.includes(cleanS) ||
              (cleanS.length > 30 && cleanOrig.slice(0, 30) === cleanS.slice(0, 30))
            );
          });

          if (matchingClaim) {
            const isSelected = matchingClaim.id === selectedClaimId;
            let highlightStyle = 'bg-emerald-500/15 border-b-2 border-emerald-400 text-emerald-200';
            let Icon = CheckCircle2;

            if (matchingClaim.verdict === 'Refuted') {
              highlightStyle = 'bg-rose-500/15 border-b-2 border-rose-400 text-rose-200';
              Icon = XCircle;
            } else if (matchingClaim.verdict === 'Mixed Evidence') {
              highlightStyle = 'bg-amber-500/15 border-b-2 border-amber-400 text-amber-200';
              Icon = AlertCircle;
            } else if (matchingClaim.verdict === 'Unverified') {
              highlightStyle = 'bg-slate-500/15 border-b-2 border-slate-400 text-slate-200';
              Icon = HelpCircle;
            }

            return (
              <span
                key={sIdx}
                onClick={() => onSelectClaim(matchingClaim.id)}
                className={`inline cursor-pointer px-1 py-0.5 rounded transition-all duration-200 relative group ${highlightStyle} ${
                  isSelected ? 'ring-2 ring-neon-cyan shadow-neon-cyan' : 'hover:opacity-90'
                }`}
                title={`Click to view claim analysis: ${matchingClaim.verdict} (${matchingClaim.confidence}%)`}
              >
                {sentence}{' '}
                <span className="inline-flex items-center text-[10px] font-mono px-1 rounded bg-black/50 ml-1 select-none">
                  <Icon className="w-2.5 h-2.5 mr-0.5 inline" /> {matchingClaim.verdict}
                </span>
              </span>
            );
          }

          return <span key={sIdx}>{sentence} </span>;
        })}
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-glass">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Original Verified Content
            </h3>
          </div>
          {title && <p className="text-xs text-slate-400 mt-1 font-medium">{title}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setHighlightsActive(!highlightsActive)}
            className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
              highlightsActive
                ? 'bg-cyan-950/60 border-neon-cyan text-cyan-300'
                : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {highlightsActive ? 'Claim Highlights ON' : 'Highlights OFF'}
          </button>
        </div>
      </div>

      {/* Article Metadata Bar */}
      {(domain || author || publishedDate || sourceUrl) && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-4 pb-3 border-b border-white/5">
          {domain && (
            <span className="text-cyan-400 font-semibold">
              Domain: {domain}
            </span>
          )}
          {author && <span>By {author}</span>}
          {publishedDate && <span>Published: {publishedDate}</span>}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline truncate max-w-xs"
            >
              {sourceUrl}
            </a>
          )}
        </div>
      )}

      {/* Interactive Highlighted Body */}
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {renderAnnotatedContent()}
      </div>

      {/* Reader Guidance Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Click any highlighted proposition to jump to its RAG evidence dossier</span>
        <span className="text-cyan-400">{claims.length} Extracted Spans</span>
      </div>
    </div>
  );
}
