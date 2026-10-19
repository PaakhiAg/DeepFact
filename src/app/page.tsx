'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HolographicGlobe3D from '@/components/3d/HolographicGlobe3D';
import {
  Shield,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Cpu,
  Layers,
  Network,
  Lock,
  Globe2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [quickInput, setQuickInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'url'>('url');

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    if (inputType === 'url' || quickInput.startsWith('http')) {
      router.push(`/verify?url=${encodeURIComponent(quickInput.trim())}`);
    } else {
      // Store in session storage for the verify page
      sessionStorage.setItem('deepfact_pending_text', quickInput.trim());
      router.push('/verify?mode=text');
    }
  };

  const sampleDemos = [
    {
      title: 'Moon Landing Hoax Warehouse',
      type: 'Social Media Hoax',
      verdict: 'Test Live Verification',
      verdictColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      action: () => router.push('/verify?sample=moon'),
    },
    {
      title: 'FDA Approves First CRISPR Therapy',
      type: 'Medical Breakthrough',
      verdict: 'Test Live Verification',
      verdictColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      action: () => router.push('/verify?sample=crispr'),
    },
    {
      title: 'EV vs Diesel Lifecycle Emissions',
      type: 'Nuanced Policy',
      verdict: 'Test Live Verification',
      verdictColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      action: () => router.push('/verify?sample=ev'),
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Quick Check */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Security Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium shadow-neon-cyan">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>DeepFact 2.0 • Retrieval-Augmented Fact Checking</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Verify the Truth Behind <br />
              <span className="text-cyber-gradient">Every Factual Claim.</span> <br />
              <span className="text-slate-300">Not Just the Headline.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              DeepFact ingests entire articles, social-media threads, and live URLs, breaks them down into discrete testable propositions, retrieves evidence from authoritative web indexes, and computes a transparent claim-by-claim verdict.
            </p>

            {/* Quick Check Input Form */}
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/30 shadow-glass max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setInputType('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    inputType === 'url'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Article Web URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('text')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    inputType === 'text'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pasted Article Text
                </button>
              </div>

              <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder={
                      inputType === 'url'
                        ? 'Enter news article URL (e.g. https://...)'
                        : 'Paste claim or article text to verify...'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-neon-cyan transition-all transform active:scale-95 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify Now</span>
                </button>
              </form>

              {/* Sample Quick Demos */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 mr-1">Instant Demo Cases:</span>
                {sampleDemos.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={demo.action}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5"
                  >
                    <span>{demo.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border ${demo.verdictColor}`}>
                      {demo.verdict}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Fabricated Citations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-Source Stance Graph</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Traceable Evidence</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Holographic Globe */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-3xl glass-panel p-2 border border-cyan-500/20 shadow-glass overflow-hidden flex items-center justify-center">
              {/* 3D Globe Component */}
              <HolographicGlobe3D interactive={true} className="w-full h-full" />

              {/* Holographic HUD Overlays */}
              <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 font-mono text-[10px] text-cyan-300 pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>NODE NETWORK: ACTIVE</span>
                </div>
                <p className="text-slate-400 mt-0.5">3D Evidence Arc Topology</p>
              </div>

              <div className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-slate-950/70 border border-white/10 font-mono text-[10px] text-slate-300 pointer-events-none text-right">
                <span className="text-neon-cyan">Interactive WebGL</span>
                <p className="text-slate-500">Click & Drag to Rotate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARCHITECTURAL PIPELINE (How DeepFact Works) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan font-bold">
            Automated Forensic Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How DeepFact Verifies Information
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Unlike headline-only detectors or naive keyword filters, DeepFact executes a rigorous 5-stage retrieval-augmented verification pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Ingestion & DOM Parse',
              desc: 'Normalizes URLs, extracts article text, bypasses boilerplates, and strips tracking scripts.',
              icon: FileText,
            },
            {
              step: '02',
              title: 'Claim Decomposition',
              desc: 'Identifies discrete factual assertions, preserves character spans, and separates opinions from facts.',
              icon: Layers,
            },
            {
              step: '03',
              title: 'Multi-Source Retrieval',
              desc: 'Queries independent web search indexes, news wires, scientific journals, and fact databases.',
              icon: Globe2,
            },
            {
              step: '04',
              title: 'Stance Cross-Reference',
              desc: 'Classifies whether each source supports, refutes, or provides neutral context for the claim.',
              icon: Network,
            },
            {
              step: '05',
              title: 'Forensic Synthesis',
              desc: 'Weighs source credibility tiers and aggregates claim outcomes into an overall transparent verdict.',
              icon: Shield,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel-interactive rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded">
                      {item.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. COMPARISON MATRIX: DeepFact vs Other Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-neon-violet font-bold">
            Superior Rigor
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why DeepFact Outperforms Traditional Tools
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Compare DeepFact against basic headline fact-checkers and generic LLM chatbots.
          </p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto shadow-glass">
          <table className="w-full text-left text-sm font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/60">
                <th className="p-4 text-xs uppercase tracking-wider text-slate-400">Capability</th>
                <th className="p-4 text-xs uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/30">
                  DeepFact RAG Engine
                </th>
                <th className="p-4 text-xs uppercase tracking-wider text-slate-400">Headline Checkers</th>
                <th className="p-4 text-xs uppercase tracking-wider text-slate-400">Generic Chatbots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              <tr>
                <td className="p-4 text-white font-sans font-semibold">Entire Article Span Verification</td>
                <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">Yes (Every Claim Isolated)</td>
                <td className="p-4 text-rose-400">No (Headline Only)</td>
                <td className="p-4 text-amber-400">Partial / Unstructured</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-sans font-semibold">Live Web RAG Multi-Source Search</td>
                <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">Yes (Tavily + DDG + Fallbacks)</td>
                <td className="p-4 text-slate-400">Static / Pre-indexed</td>
                <td className="p-4 text-slate-400">Cut-off / Hallucination Risk</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-sans font-semibold">Original Sentence Highlighting</td>
                <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">Yes (Interactive Reader)</td>
                <td className="p-4 text-rose-400">No</td>
                <td className="p-4 text-rose-400">No</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-sans font-semibold">Bipartite Stance & Evidence Graph</td>
                <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">Yes (Interactive 3D/2D)</td>
                <td className="p-4 text-rose-400">No</td>
                <td className="p-4 text-rose-400">No</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-sans font-semibold">Zero-Fabrication Citation Protocol</td>
                <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">Guaranteed Real URLs</td>
                <td className="p-4 text-amber-400">Limited</td>
                <td className="p-4 text-rose-400">Frequent Hallucinated URLs</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-sans font-semibold">Exportable Reports</td>
                <td className="p-4 text-emerald-400 font-bold bg-cyan-950/20">PDF & Markdown Dossiers</td>
                <td className="p-4 text-slate-400">No</td>
                <td className="p-4 text-slate-400">Copy/Paste text only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-violet-950/80 p-8 md:p-14 shadow-neon-cyan relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Ready to Inspect Any Article with Forensic Rigor?
            </h3>
            <p className="text-sm md:text-base text-slate-300">
              Access the DeepFact Verification Workbench, test real-time web URL parsing, and explore interactive evidence graphs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/verify"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm tracking-wide shadow-neon-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Launch Verification Workbench</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 border border-white/20 text-white font-mono text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
