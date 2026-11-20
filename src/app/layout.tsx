import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'DeepFact — AI-Powered Fake News Detection & Verification',
  description:
    'Forensic AI fact-checking platform that verifies entire news articles, extracts discrete claims, retrieves multi-source evidence, and delivers transparent verdicts.',
  keywords: [
    'Fact-Checking',
    'Fake News Detection',
    'AI News Verification',
    'Evidence-Based Verification',
    'Investigative Journalism',
    'AI Verification',
    'Cybersecurity',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-100 text-slate-900 dark:bg-cyber-950 dark:text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-black transition-colors duration-300">
        <AppProviders>
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />
          <div className="fixed inset-0 bg-radial-purple pointer-events-none z-0" />
          <div className="fixed inset-0 bg-grid-cyber pointer-events-none z-0 opacity-40" />

          {/* Sticky Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 relative z-10 w-full">{children}</main>

          {/* Footer */}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
