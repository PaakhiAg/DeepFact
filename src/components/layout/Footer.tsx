import React from 'react';
import Link from 'next/link';
import { Shield, CheckCircle2, Globe2, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Platform Description */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-violet-600 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-neon-cyan" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Deep<span className="text-cyan-400">Fact</span>
              </span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              DeepFact is an advanced AI-powered news verification and fake news detection platform. 
              By decomposing full articles into individual factual claims and cross-referencing independent online 
              evidence, DeepFact delivers transparent, evidence-grounded veracity assessments to combat misinformation.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Evidence-Grounded Analysis
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Globe2 className="w-3.5 h-3.5" />
                Real-Time Web Verification
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Platform Navigation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home (3D Intelligence Hub)
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-cyan-400 transition-colors">
                  Verify Article or Claim
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Operational Dashboard
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-cyan-400 transition-colors">
                  System Diagnostics & Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification Principles */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Verification Standards
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Full-Span Extraction:</strong> Verifies entire articles, not just headlines.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Authority Weighting:</strong> Cross-references high-credibility global sources.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Zero-Fabrication Guarantee:</strong> Only verified, genuine web citations are reported.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Transparent Uncertainty:</strong> Clear distinction between verified, mixed, and unverified claims.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Public & Research Transparency Notice */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed font-mono">
          <strong className="text-slate-300">Verification Transparency Notice:</strong> DeepFact automated assessments are designed as investigative aids to support critical analysis and media literacy. Users are encouraged to inspect cited primary source links directly for full contextual corroboration.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} DeepFact Intelligence Systems. All rights reserved.</span>
          <span className="text-slate-400">AI-Powered News Verification Platform</span>
        </div>
      </div>
    </footer>
  );
}
