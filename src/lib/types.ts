export type ClaimVerdict = 'Supported' | 'Refuted' | 'Mixed Evidence' | 'Unverified';

export type OverallVerdict = 'Likely True' | 'Likely False' | 'Mixed' | 'Insufficient Evidence';

export type StanceType = 'SUPPORTS' | 'REFUTES' | 'NEUTRAL' | 'MENTIONS';

export type CredibilityTier = 'High Authority' | 'Mainstream News' | 'Independent / Web' | 'Low Trust';

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  stance: StanceType;
  confidence: number; // 0-100
  publishedDate?: string;
  author?: string;
  credibilityScore: number; // 0-100
  credibilityTier: CredibilityTier;
}

export interface Claim {
  id: string;
  claimText: string;
  originalSentence: string;
  charStartIndex?: number;
  charEndIndex?: number;
  category?: 'political' | 'scientific' | 'health' | 'economic' | 'general';
  importance: 'high' | 'medium' | 'low';
  verdict: ClaimVerdict;
  confidence: number; // 0-100
  explanation: string;
  evidence: EvidenceSource[];
  stanceBreakdown: {
    supporting: number;
    refuting: number;
    neutral: number;
  };
}

export interface ReportMetrics {
  totalClaims: number;
  supportedCount: number;
  refutedCount: number;
  mixedCount: number;
  unverifiedCount: number;
  truthScore: number; // 0 - 100
  sourcesAnalyzed: number;
  processingTimeMs: number;
}

export interface VerificationReport {
  id: string;
  userId: string;
  title: string;
  sourceUrl?: string;
  sourceType: 'url' | 'text' | 'social_media';
  rawContent: string;
  author?: string;
  publishedDate?: string;
  domain?: string;
  extractedDate: string;
  overallVerdict: OverallVerdict;
  overallConfidence: number; // 0-100
  summary: string;
  claims: Claim[];
  metrics: ReportMetrics;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'analyst' | 'admin' | 'guest';
  createdAt: string;
  customApiKey?: {
    geminiKey?: string;
    tavilyKey?: string;
  };
}

export interface VerificationProgress {
  step: number; // 1-5
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

export interface VerificationInput {
  text?: string;
  url?: string;
  sourceType: 'url' | 'text' | 'social_media';
  title?: string;
}

export interface DomainCredibilityInfo {
  domain: string;
  name: string;
  tier: CredibilityTier;
  score: number;
  type: 'academic' | 'government' | 'wire_service' | 'fact_checker' | 'reputable_media' | 'general';
}
