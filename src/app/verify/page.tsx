'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VerificationReport, Claim } from '@/lib/types';
import OverallVerdictBanner from '@/components/verification/OverallVerdictBanner';
import InteractiveArticleReader from '@/components/verification/InteractiveArticleReader';
import ClaimCard from '@/components/verification/ClaimCard';
import EvidenceRelationshipGraph from '@/components/verification/EvidenceRelationshipGraph';
import VerificationProgressHUD from '@/components/verification/VerificationProgressHUD';
import {
  Search,
  Globe2,
  FileText,
  Share2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Layers,
  Network,
  Download,
  Key,
} from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');
  const modeParam = searchParams.get('mode');
  const sampleParam = searchParams.get('sample');

  // 1-Click Sample Test Cases
  const sampleArticles = [
    {
      id: 'moon',
      label: 'Apollo Moon Landing Hoax (Hoax / Refuted)',
      type: 'social_media' as const,
      title: 'Viral Claim: Apollo Moon Landing Stage Props Found in Nevada',
      text: `Breaking investigation reveals that original 1969 Apollo 11 lunar landing movie stage props and high-intensity studio lamps were discovered in an abandoned warehouse in the Nevada desert. Officials reportedly recovered high-resolution cameras with 35mm film marked "Apollo Project Studio B". The discovery allegedly proves the historical moon landing was entirely filmed in a soundstage directed by Stanley Kubrick.`,
    },
    {
      id: 'crispr',
      label: 'FDA CRISPR Gene Editing Approval (Verified / True)',
      type: 'text' as const,
      title: 'FDA Approves Historic First CRISPR Gene-Editing Therapy Casgevy',
      text: `The U.S. Food and Drug Administration approved Casgevy, the first therapy utilizing CRISPR/Cas9 genome editing technology for the treatment of sickle cell disease in patients aged 12 and older. Developed by Vertex Pharmaceuticals and CRISPR Therapeutics, the therapy modifies patients' hematopoietic stem cells to boost fetal hemoglobin production. In primary clinical trials, 29 out of 30 treated patients remained free from severe vaso-occlusive pain crises for at least 12 consecutive months.`,
    },
    {
      id: 'ev',
      label: 'Electric Cars vs Diesel Pollution (Nuanced / Mixed)',
      type: 'text' as const,
      title: 'Lifecycle Emissions Analysis: Electric Vehicles vs Modern Diesel Cars',
      text: `A widely shared editorial asserts that electric vehicles produce more total carbon pollution than modern diesel vehicles. The article claims that manufacturing lithium-ion batteries emits twice the carbon footprint of building an entire diesel engine. Furthermore, it argues that because power grids rely heavily on coal, charging an EV causes equal or higher greenhouse emissions per mile than driving a Euro 6 diesel automobile.`,
    },
    {
      id: 'who',
      label: 'WHO Global Sugar Tax Emergency (Misleading / Nuanced)',
      type: 'text' as const,
      title: 'WHO Declares Global Health Emergency to Ban Sugar-Sweetened Drinks',
      text: `Social media reports allege that the World Health Organization has officially declared a binding international public health emergency requiring all sovereign nations to ban or place punitive 50% tariffs on refined sugar products immediately. The announcement claims member nations that fail to enforce the ban face economic sanctions under international sanitary regulations.`,
    },
  ];

  // Input States
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'social_media'>(
    urlParam ? 'url' : modeParam === 'text' || sampleParam ? 'text' : 'url'
  );
  const [urlInput, setUrlInput] = useState(urlParam || '');
  const [textInput, setTextInput] = useState('');
  const [articleTitle, setArticleTitle] = useState('');

  // Custom API keys state
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');

  // Processing & Telemetry States
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState('');
  const [detailMessage, setDetailMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUrlInaccessible, setIsUrlInaccessible] = useState(false);

  // Result States
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'reader' | 'graph' | 'sources'>('reader');

  const handleSelectSample = (sample: (typeof sampleArticles)[0]) => {
    setActiveTab(sample.type);
    setTextInput(sample.text);
    setArticleTitle(sample.title);
    setErrorMessage(null);
    setIsUrlInaccessible(false);
  };

  // Check pending text from session storage or URL sample parameter
  useEffect(() => {
    const pendingText = sessionStorage.getItem('deepfact_pending_text');
    if (pendingText) {
      setTextInput(pendingText);
      setActiveTab('text');
      sessionStorage.removeItem('deepfact_pending_text');
    } else if (sampleParam) {
      const match = sampleArticles.find((s) => s.id === sampleParam);
      if (match) {
        handleSelectSample(match);
      }
    }

    // Retrieve saved custom keys from localStorage if present
    const savedGemini = localStorage.getItem('deepfact_gemini_key') || '';
    const savedTavily = localStorage.getItem('deepfact_tavily_key') || '';
    if (savedGemini) setGeminiKey(savedGemini);
    if (savedTavily) setTavilyKey(savedTavily);
  }, [sampleParam]);

  // Main Pipeline Trigger
  const handleVerify = async () => {
    setErrorMessage(null);
    setIsUrlInaccessible(false);

    if (activeTab === 'url' && !urlInput.trim()) {
      setErrorMessage('Please enter an article URL to verify.');
      return;
    }

    if (activeTab !== 'url' && (!textInput.trim() || textInput.trim().length < 20)) {
      setErrorMessage('Please enter sufficient text content (at least 20 characters) to analyze.');
      return;
    }

    setIsVerifying(true);
    setCurrentStep(3); // Pipeline active in web search and claim extraction
    setStatusMessage('Executing live multi-source RAG verification pipeline...');
    setDetailMessage('Extracting factual claims, reformulating search queries, querying web indexes, and cross-referencing evidence stances.');

    try {
      const payload: Record<string, any> = {
        sourceType: activeTab,
        title: articleTitle.trim() || undefined,
      };

      if (activeTab === 'url') {
        payload.url = urlInput.trim();
      } else {
        payload.text = textInput.trim();
      }

      if (geminiKey.trim() || tavilyKey.trim()) {
        payload.customApiKey = {
          geminiKey: geminiKey.trim() || undefined,
          tavilyKey: tavilyKey.trim() || undefined,
        };
      }

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.isUrlInaccessible) {
          setIsUrlInaccessible(true);
          setErrorMessage(data.error);
        } else {
          setErrorMessage(data.error || 'Verification failed. Please check inputs and retry.');
        }
        setIsVerifying(false);
        return;
      }

      // Success
      setCurrentStep(5);
      setStatusMessage('Verification complete. Forensic dossier generated.');
      setReport(data.report);
      if (data.report.claims && data.report.claims.length > 0) {
        setSelectedClaimId(data.report.claims[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error occurred during verification.';
      setErrorMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Export handlers
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

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Multi-Claim RAG Workbench
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Forensic Fact Verification Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Submit complete news articles or social media posts to decompose claims, retrieve cross-indexed web evidence, and assess factual accuracy.
          </p>
        </div>

        {/* API Key Toggle Button */}
        <button
          onClick={() => setShowKeyConfig(!showKeyConfig)}
          className="self-start md:self-end px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400/50 text-slate-300 text-xs font-mono flex items-center gap-2 transition-all"
        >
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showKeyConfig ? 'Hide Custom Keys' : 'Configure Custom API Keys'}</span>
        </button>
      </div>

      {/* Optional Custom API Key Configuration Drawer */}
      {showKeyConfig && (
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-glass animate-in fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Optional Custom Provider Keys (Zero Mandatory Setup)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            DeepFact works out-of-the-box with built-in heuristic NLP, open web search, and curated ground-truth databases. If you wish to connect your own free-tier Google Gemini or Tavily search keys for live production calls, specify them below:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Google Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  localStorage.setItem('deepfact_gemini_key', e.target.value);
                }}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Tavily Search API Key (Optional)
              </label>
              <input
                type="password"
                value={tavilyKey}
                onChange={(e) => {
                  setTavilyKey(e.target.value);
                  localStorage.setItem('deepfact_tavily_key', e.target.value);
                }}
                placeholder="tvly-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Primary Input Container */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-cyan-500/20 shadow-glass space-y-6">
        {/* Input Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide flex items-center gap-2 transition-all ${
                activeTab === 'url'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Article Web URL</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide flex items-center gap-2 transition-all ${
                activeTab === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Full Article Text</span>
            </button>
            <button
              onClick={() => setActiveTab('social_media')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide flex items-center gap-2 transition-all ${
                activeTab === 'social_media'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Social Media Post</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Accepts complete content up to 10,000 words
          </span>
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          {activeTab === 'url' ? (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Article Web Address (HTTP/HTTPS)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.reuters.com/... or https://bbc.com/news/..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                DeepFact will fetch the article, parse the body, bypass ads and cookie banners, and isolate its factual assertions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Optional Article / Post Title
                </label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g. Breaking: Discovery of new antibiotic compound"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-neon-cyan focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  {activeTab === 'social_media' ? 'Pasted Social Media Post / Thread' : 'Complete Article Body Text'}
                </label>
                <textarea
                  rows={8}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste complete paragraphs, sentences, or statements here..."
                  className="w-full p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan leading-relaxed font-sans"
                />
              </div>
            </div>
          )}

          {/* Error & Inaccessible URL Alert with Fallback Action */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-white block font-bold">Verification Notice:</strong>
                <p>{errorMessage}</p>
                {isUrlInaccessible && (
                  <button
                    onClick={() => {
                      setActiveTab('text');
                      setErrorMessage(null);
                      setIsUrlInaccessible(false);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-white font-mono text-xs font-bold transition-all"
                  >
                    Switch to Pasted Text Mode <FileText className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Row: Verify Button + Preset Samples */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            {/* 1-Click Preset Samples */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Test Presets:
              </span>
              {sampleArticles.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 text-[11px] font-mono transition-all"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Launch Verification Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-neon-cyan ${
                isVerifying
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black'
              }`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Verification RAG...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Initiate Forensic Verification</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Verification In-Progress Telemetry HUD */}
      {isVerifying && (
        <VerificationProgressHUD
          currentStep={currentStep}
          statusMessage={statusMessage}
          detailMessage={detailMessage}
        />
      )}

      {/* VERIFICATION REPORT RESULTS SECTION */}
      {report && !isVerifying && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Overall Forensic Verdict Banner */}
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

            <div className="text-xs font-mono text-slate-400">
              Report ID: <span className="text-cyan-400 font-semibold">{report.id}</span>
            </div>
          </div>

          {/* View 1: Dual-Pane Original Reader & Claim Cards */}
          {viewMode === 'reader' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Original Text Reader with Spans */}
              <div className="lg:col-span-5 sticky top-24">
                <InteractiveArticleReader
                  content={report.rawContent}
                  claims={report.claims}
                  selectedClaimId={selectedClaimId}
                  onSelectClaim={(id) => {
                    setSelectedClaimId(id);
                    const el = document.getElementById(`claim-${id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  title={report.title}
                  sourceUrl={report.sourceUrl}
                  domain={report.domain}
                  author={report.author}
                  publishedDate={report.publishedDate}
                />
              </div>

              {/* Right Column: Claim Cards with Evidence and Explanations */}
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

          {/* View 2: Bipartite Evidence Topology Graph */}
          {viewMode === 'graph' && (
            <div className="space-y-4">
              <EvidenceRelationshipGraph
                claims={report.claims}
                onSelectClaim={(id) => setSelectedClaimId(id)}
              />
            </div>
          )}

          {/* View 3: Complete Sources Explorer Directory */}
          {viewMode === 'sources' && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-neon-cyan" /> Retraced Web Evidence Directory
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every independent domain queried and analyzed during this verification session.
                  </p>
                </div>
              </div>

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
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-mono flex-shrink-0 ml-2"
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
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading DeepFact Workbench...</p>
        </div>
      }
    >
      <VerifyContent />
    </React.Suspense>
  );
}
