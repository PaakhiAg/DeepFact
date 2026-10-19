'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AppProviders';
import { Shield, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsGuest } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('analyst@deepfact.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        const ok = await login(email, password);
        if (ok) {
          router.push('/dashboard');
        } else {
          setError('Invalid credentials. You can use the Quick Demo Analyst button below.');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success) {
          router.push('/dashboard');
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    await loginAsGuest();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 md:p-10 rounded-3xl border border-cyan-500/30 shadow-glass relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-violet-600 p-[1px] shadow-neon-cyan flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-neon-cyan" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'Investigator Authentication' : 'Create Analyst Account'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Secure clearance portal for DeepFact RAG fact verification.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'signin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'register'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Senior Analyst"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Investigator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@deepfact.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono tracking-wider shadow-neon-cyan transition-all flex items-center justify-center gap-2 uppercase"
          >
            <span>{mode === 'signin' ? 'Authenticate Session' : 'Create Clearance Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              setEmail('analyst@deepfact.ai');
              setPassword('password123');
              login('analyst@deepfact.ai', 'password123').then(() => router.push('/dashboard'));
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/70 text-xs font-mono flex items-center justify-center gap-2 transition-all font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Demo Analyst (analyst@deepfact.ai)</span>
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Continue as Guest Investigator</span>
          </button>
        </div>
      </div>
    </div>
  );
}
