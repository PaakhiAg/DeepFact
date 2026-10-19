import { GoogleGenerativeAI } from '@google/generative-ai';
import { Claim, ClaimVerdict, EvidenceSource, OverallVerdict, ReportMetrics } from '../types';

export interface AIProviderConfig {
  geminiKey?: string;
  tavilyKey?: string;
}

/**
 * Splits text into sentences while preserving original phrasing
 */
export function splitIntoSentences(text: string): string[] {
  return text
    .replace(/([.?!])\s*(?=[A-Z0-9"'])/g, '$1|---|')
    .split('|---|')
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

/**
 * Extracts discrete factual claims from input text
 */
export async function extractClaimsFromText(
  text: string,
  config?: AIProviderConfig
): Promise<Array<{ claimText: string; originalSentence: string; importance: 'high' | 'medium' | 'low' }>> {
  const apiKey = config?.geminiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are DeepFact, an expert investigative fact-checking system.
Analyze the following text and extract 3 to 6 discrete, verifiable factual claims.
For each claim:
1. Provide the exact or near-exact original sentence from the text ("originalSentence").
2. State the specific testable factual proposition ("claimText").
3. Assign importance: "high", "medium", or "low".

Rules:
- Do not extract subjective opinions, rhetorical questions, or vague impressions.
- Only extract testable assertions of fact (events, statistics, scientific findings, official statements).
- Output strictly valid JSON matching this schema:
[
  {
    "claimText": "...",
    "originalSentence": "...",
    "importance": "high"
  }
]

Text to analyze:
"""
${text.slice(0, 5000)}
"""`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          claimText: String(item.claimText || '').trim(),
          originalSentence: String(item.originalSentence || item.claimText || '').trim(),
          importance: ['high', 'medium', 'low'].includes(item.importance) ? item.importance : 'medium',
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Gemini claim extraction error (quota/network): ${msg}. Using semantic heuristic extraction.`);
    }
  }

  // Heuristic claim extraction fallback
  return extractClaimsHeuristic(text);
}

/**
 * Heuristic factual claim extractor when AI model is unavailable or offline
 */
export function extractClaimsHeuristic(
  text: string
): Array<{ claimText: string; originalSentence: string; importance: 'high' | 'medium' | 'low' }> {
  const sentences = splitIntoSentences(text);
  const claims: Array<{ claimText: string; originalSentence: string; importance: 'high' | 'medium' | 'low' }> = [];

  const factualIndicators = [
    /\b(confirmed|discovered|announced|approved|banned|reported|admitted|tested|developed|released)\b/i,
    /\b(percent|%|\$|million|billion|trillion|\d{4})\b/i,
    /\b(study|researchers|scientists|fda|nasa|who|government|court|officials|cdc|epa)\b/i,
    /\b(causes|proven|cured|faked|hoax|conspiracy|found that)\b/i,
  ];

  for (const sentence of sentences) {
    if (claims.length >= 6) break;

    const matches = factualIndicators.filter((re) => re.test(sentence)).length;
    if (matches >= 1 && sentence.split(' ').length >= 6) {
      const importance: 'high' | 'medium' | 'low' = matches >= 2 ? 'high' : 'medium';
      claims.push({
        claimText: sentence.replace(/^(According to [^,]+,\s*|However,\s*|Moreover,\s*|Breaking investigation reveals that\s*)/i, '').trim(),
        originalSentence: sentence,
        importance,
      });
    }
  }

  if (claims.length === 0 && sentences.length > 0) {
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      claims.push({
        claimText: sentences[i],
        originalSentence: sentences[i],
        importance: 'medium',
      });
    }
  }

  return claims;
}

/**
 * Evaluates a single claim against retrieved evidence using Gemini or transparent RAG heuristics
 */
export async function verifyClaimWithEvidence(
  claimText: string,
  originalSentence: string,
  evidence: EvidenceSource[],
  config?: AIProviderConfig
): Promise<{
  verdict: ClaimVerdict;
  confidence: number;
  explanation: string;
}> {
  // If zero evidence was retrieved from search, honestly return Unverified
  if (!evidence || evidence.length === 0) {
    return {
      verdict: 'Unverified',
      confidence: 25,
      explanation: 'No authoritative documentation or independent reporting was found in live search indexes to verify or debunk this assertion.',
    };
  }

  const apiKey = config?.geminiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const evidenceBrief = evidence
        .map(
          (e, i) =>
            `[Source ${i + 1}] (${e.domain} - ${e.credibilityTier}): "${e.snippet}" (URL: ${e.url})`
        )
        .join('\n');

      const prompt = `You are DeepFact, a rigorous, evidence-grounded AI investigative fact-checker.
Evaluate the following claim strictly against the provided evidence snippets.

Claim to Evaluate: "${claimText}"

Retrieved Web Evidence:
${evidenceBrief}

Strict Rules of Verification:
1. ONLY use information explicitly stated in the retrieved evidence snippets. DO NOT assume, guess, or inject unmentioned facts.
2. Choose one verdict:
   - "Supported": The evidence from credible sources directly confirms the specific assertion.
   - "Refuted": The evidence from credible sources contradicts, disproves, or debunks the assertion.
   - "Mixed Evidence": The evidence reveals partial truth accompanied by misleading context, or authoritative sources report conflicting findings.
   - "Unverified": The evidence is insufficient, ambiguous, or does not directly address the claim. When in doubt, you MUST choose "Unverified".
3. Confidence (0-100): Reflect the certainty and quality of evidence. If Unverified, confidence must be between 20 and 40.
4. Explanation (2-3 sentences): Provide a transparent journalistic explanation citing specific source domains.

Output strictly valid JSON:
{
  "verdict": "Supported" | "Refuted" | "Mixed Evidence" | "Unverified",
  "confidence": 85,
  "explanation": "..."
}`;

      const res = await model.generateContent(prompt);
      const cleaned = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (['Supported', 'Refuted', 'Mixed Evidence', 'Unverified'].includes(parsed.verdict)) {
        let confidence = Math.max(20, Math.min(99, Number(parsed.confidence) || 70));
        if (parsed.verdict === 'Unverified') {
          confidence = Math.min(confidence, 40);
        }
        return {
          verdict: parsed.verdict,
          confidence,
          explanation: parsed.explanation || 'Evaluated against retrieved web source documentation.',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Gemini verification error (quota/network): ${msg}. Using heuristic synthesis.`);
    }
  }

  // Heuristic verification synthesis based on evidence stances & credibility
  return synthesizeClaimVerdictHeuristically(claimText, evidence);
}

/**
 * Algorithmic synthesis of claim verdict based on multi-source stances and credibility scores.
 * Guarantees that inadequate or missing evidence produces Unverified, NEVER Supported.
 */
export function synthesizeClaimVerdictHeuristically(
  claimText: string,
  evidence: EvidenceSource[]
): {
  verdict: ClaimVerdict;
  confidence: number;
  explanation: string;
} {
  if (!evidence || evidence.length === 0) {
    return {
      verdict: 'Unverified',
      confidence: 25,
      explanation: 'No independent evidence sources could be retrieved across online search indexes for this claim.',
    };
  }

  let supportWeight = 0;
  let refuteWeight = 0;
  let neutralCount = 0;

  for (const src of evidence) {
    const weight = src.credibilityScore / 100;
    if (src.stance === 'SUPPORTS') {
      supportWeight += weight;
    } else if (src.stance === 'REFUTES') {
      refuteWeight += weight;
    } else {
      neutralCount++;
    }
  }

  const topSources = evidence.slice(0, 2).map((s) => s.domain).join(' and ');

  // Strong refuting consensus
  if (refuteWeight >= 0.8 && refuteWeight > supportWeight * 1.3) {
    const confidence = Math.min(95, Math.round(72 + refuteWeight * 10));
    return {
      verdict: 'Refuted',
      confidence,
      explanation: `Authoritative sources including ${topSources} explicitly contradict or debunk this assertion. Cross-referenced documentation indicates the claim is inaccurate or fabricated.`,
    };
  }

  // Strong corroborating consensus
  if (supportWeight >= 0.8 && supportWeight > refuteWeight * 1.3) {
    const confidence = Math.min(95, Math.round(72 + supportWeight * 10));
    return {
      verdict: 'Supported',
      confidence,
      explanation: `Independent documentation from credible sources including ${topSources} corroborates this statement. The reported events or findings align with verified records.`,
    };
  }

  // Conflicting or nuanced evidence
  if (supportWeight >= 0.4 && refuteWeight >= 0.4) {
    return {
      verdict: 'Mixed Evidence',
      confidence: 70,
      explanation: `Retrieved sources present conflicting accounts or indicate this assertion contains partial truths accompanied by misleading elements.`,
    };
  }

  // When evidence is weak, ambiguous, or only neutral context mentions
  return {
    verdict: 'Unverified',
    confidence: 35,
    explanation: `Retrieved search results for "${claimText.slice(0, 50)}..." provide related context (${neutralCount} sources) but lack conclusive corroboration or direct refutation. The claim remains unverified pending primary documentation.`,
  };
}

/**
 * Aggregates claim-level outcomes into an overall article verdict and metrics.
 * Ensures honest verdicts when evidence is insufficient.
 */
export function aggregateOverallVerdict(claims: Claim[]): {
  overallVerdict: OverallVerdict;
  overallConfidence: number;
  summary: string;
  metrics: ReportMetrics;
} {
  const totalClaims = claims.length;
  if (totalClaims === 0) {
    return {
      overallVerdict: 'Insufficient Evidence',
      overallConfidence: 20,
      summary: 'No verifiable factual claims could be extracted from the provided text.',
      metrics: {
        totalClaims: 0,
        supportedCount: 0,
        refutedCount: 0,
        mixedCount: 0,
        unverifiedCount: 0,
        truthScore: 50,
        sourcesAnalyzed: 0,
        processingTimeMs: 0,
      },
    };
  }

  let supportedCount = 0;
  let refutedCount = 0;
  let mixedCount = 0;
  let unverifiedCount = 0;
  let totalConfidence = 0;
  let totalSources = 0;

  for (const c of claims) {
    totalConfidence += c.confidence;
    totalSources += c.evidence.length;
    if (c.verdict === 'Supported') supportedCount++;
    else if (c.verdict === 'Refuted') refutedCount++;
    else if (c.verdict === 'Mixed Evidence') mixedCount++;
    else if (c.verdict === 'Unverified') unverifiedCount++;
  }

  const avgConfidence = Math.round(totalConfidence / totalClaims);

  // Truth score formula (0 - 100)
  // Supported = 100, Mixed = 50, Unverified = 50 (neutral uncertainty), Refuted = 0
  const weightedPoints =
    supportedCount * 100 + mixedCount * 50 + unverifiedCount * 50 + refutedCount * 0;
  const truthScore = Math.round(weightedPoints / totalClaims);

  let overallVerdict: OverallVerdict;
  let summary: string;

  // 1. Majority or all unverified -> Insufficient Evidence
  if (unverifiedCount >= Math.ceil(totalClaims * 0.5) && refutedCount === 0 && supportedCount === 0) {
    overallVerdict = 'Insufficient Evidence';
    summary = `DeepFact retrieved web evidence across public indexes, but independent documentation is currently insufficient to verify or debunk the extracted claims (${unverifiedCount} of ${totalClaims} claims unverified). Caution is recommended before treating these statements as factual.`;
  } else if (unverifiedCount >= Math.ceil(totalClaims * 0.6)) {
    overallVerdict = 'Insufficient Evidence';
    summary = `The majority of assertions in this content (${unverifiedCount} of ${totalClaims}) could not be verified by authoritative online documentation. While some claims were evaluated, overall evidence remains insufficient for a definitive verdict.`;
  } else if (refutedCount >= Math.ceil(totalClaims * 0.45) || (refutedCount >= 1 && supportedCount === 0 && totalClaims <= 3)) {
    overallVerdict = 'Likely False';
    summary = `DeepFact forensic verification detected critical factual inaccuracies. Out of ${totalClaims} extracted claims, ${refutedCount} were decisively contradicted or debunked by authoritative sources. Readers should treat this content with high skepticism.`;
  } else if (supportedCount >= Math.ceil(totalClaims * 0.6) && refutedCount === 0) {
    overallVerdict = 'Likely True';
    summary = `The core assertions in this content are corroborated by independent, high-credibility sources. Out of ${totalClaims} extracted claims, ${supportedCount} were substantiated with zero major contradictions detected.`;
  } else if (mixedCount >= 1 || (supportedCount > 0 && refutedCount > 0)) {
    overallVerdict = 'Mixed';
    summary = `This content contains a blend of verifiable facts and inaccurate or nuanced statements. Verification identified ${supportedCount} supported claim(s), ${refutedCount} refuted claim(s), and ${mixedCount} nuanced assertion(s). Critical discernment is advised.`;
  } else {
    overallVerdict = 'Insufficient Evidence';
    summary = `Available documentation across online indexes yielded insufficient conclusive evidence to determine the overall veracity of this content.`;
  }

  return {
    overallVerdict,
    overallConfidence: overallVerdict === 'Insufficient Evidence' ? Math.min(avgConfidence, 40) : avgConfidence,
    summary,
    metrics: {
      totalClaims,
      supportedCount,
      refutedCount,
      mixedCount,
      unverifiedCount,
      truthScore,
      sourcesAnalyzed: totalSources,
      processingTimeMs: 0,
    },
  };
}
