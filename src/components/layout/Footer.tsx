import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Terminal, BookOpen, AlertOctagon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Academic Disclaimer Callout */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed font-mono">
            <strong className="text-white">Academic & Research Transparency Disclaimer:</strong> DeepFact is an automated AI investigative fact-checking system designed to enhance human verification and critical analysis. While it retrieves independent multi-source evidence and performs stance classification, automated tools are aids to human discernment and are not infallible. Users should always review primary cited evidence URLs directly.
          </div>
        </div>

        {/* Links and Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-cyan" />
              <span className="text-base font-bold text-white tracking-wide">
                Deep<span className="text-cyan-400">Fact</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Retrieval-Augmented Fake News Detection & Verification Platform. End-to-end multi-claim decomposition, live web cross-referencing, and transparent forensic verdict synthesis.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Core Capabilities
            </h5>
            <ul className="space-y-2 text-xs">
              <li>• Full-Article Claim Extraction</li>
              <li>• Live Web RAG Cross-Referencing</li>
              <li>• Domain Authority Credibility Scoring</li>
              <li>• Bipartite Stance Topologies</li>
              <li>• Exportable Forensic Dossiers (PDF/MD)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Technology Stack
            </h5>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li>• Next.js 14 App Router & TypeScript</li>
              <li>• Three.js Interactive 3D Canvas</li>
              <li>• Google Gemini AI & Tavily Search</li>
              <li>• Tailwind CSS & Framer Motion</li>
              <li>• Cheerio Semantic Article Extractor</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Final-Year Major Project
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built as a comprehensive senior capstone project demonstrating advanced RAG pipelines, cybersecurity forensics, and interactive 3D WebGL data visualization.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>v1.0.0-RELEASE (Ready)</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} DeepFact Intelligence Systems. All rights reserved.</span>
          <span>Zero Fabricated Citations Protocol</span>
        </div>
      </div>
    </footer>
  );
}
