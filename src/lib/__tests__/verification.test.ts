import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  splitIntoSentences,
  extractClaimsHeuristic,
  synthesizeClaimVerdictHeuristically,
  aggregateOverallVerdict,
} from '../ai';
import { evaluateDomainCredibility, extractDomain } from '../credibility';
import { detectHeuristicStance, reformulateSearchQuery } from '../search';
import { isValidUrl } from '../extractor';
import { Claim, EvidenceSource } from '../types';

describe('DeepFact Verification Pipeline Unit Tests', () => {
  it('extracts domain correctly from varied URL formats', () => {
    assert.strictEqual(extractDomain('https://www.reuters.com/fact-check/test'), 'reuters.com');
    assert.strictEqual(extractDomain('http://nasa.gov/missions'), 'nasa.gov');
    assert.strictEqual(extractDomain('who.int/publications'), 'who.int');
  });

  it('accurately evaluates domain credibility tiers and scores', () => {
    const govResult = evaluateDomainCredibility('https://www.cdc.gov/flu');
    assert.strictEqual(govResult.tier, 'High Authority');
    assert.ok(govResult.score >= 95);

    const factCheckResult = evaluateDomainCredibility('https://www.snopes.com/fact-check/apollo');
    assert.strictEqual(factCheckResult.tier, 'High Authority');
    assert.ok(factCheckResult.score >= 90);

    const newsResult = evaluateDomainCredibility('https://www.bbc.com/news/world');
    assert.strictEqual(newsResult.tier, 'Mainstream News');
    assert.ok(newsResult.score >= 88);

    const unknownResult = evaluateDomainCredibility('https://random-unverified-blog.xyz/post');
    assert.strictEqual(unknownResult.tier, 'Independent / Web');
  });

  it('reformulates verbose sentences into concise search queries', () => {
    const rawSentence = 'Breaking investigation reveals that original 1969 Apollo 11 lunar landing movie stage props were discovered in Nevada';
    const { primaryQuery, factCheckQuery } = reformulateSearchQuery(rawSentence);

    assert.ok(!primaryQuery.toLowerCase().includes('breaking investigation reveals that'));
    assert.ok(primaryQuery.toLowerCase().includes('apollo'));
    assert.ok(factCheckQuery.toLowerCase().includes('fact check'));
  });

  it('returns Unverified with low confidence when evidence is empty', () => {
    const claim = 'Scientists discover secret subterranean ocean on Venus';
    const result = synthesizeClaimVerdictHeuristically(claim, []);

    assert.strictEqual(result.verdict, 'Unverified');
    assert.strictEqual(result.confidence, 25);
    assert.ok(result.explanation.includes('No independent evidence'));
  });

  it('returns Unverified when evidence is weak or only neutral mentions (never Supported by default)', () => {
    const claim = 'Local city council voted on park renovations';
    const weakNeutralEvidence: EvidenceSource[] = [
      {
        id: 'ev-1',
        title: 'City Parks General Guide',
        url: 'https://example.com/parks',
        domain: 'example.com',
        snippet: 'The city maintains several public parks and recreational facilities.',
        stance: 'NEUTRAL',
        confidence: 50,
        credibilityScore: 65,
        credibilityTier: 'Independent / Web',
      },
    ];

    const result = synthesizeClaimVerdictHeuristically(claim, weakNeutralEvidence);
    assert.strictEqual(result.verdict, 'Unverified');
    assert.ok(result.confidence <= 40);
  });

  it('detects heuristic stance (SUPPORTS, REFUTES, NEUTRAL)', () => {
    const claim = 'Scientists discover new cure for malaria';

    const refutingStance = detectHeuristicStance(
      claim,
      'This viral claim was thoroughly debunked as a false hoax by medical investigators.',
      'Fact Check: Malaria cure rumor is false'
    );
    assert.strictEqual(refutingStance, 'REFUTES');

    const supportingStance = detectHeuristicStance(
      claim,
      'Clinical trial data officially confirmed the treatment was approved with high efficacy.',
      'Trial Confirms New Malaria Treatment Success'
    );
    assert.strictEqual(supportingStance, 'SUPPORTS');
  });

  it('splits long content into distinct sentences', () => {
    const text = 'NASA launched the Artemis mission today. The spacecraft completed lunar orbit successfully. Ground telemetry confirmed all systems nominal.';
    const sentences = splitIntoSentences(text);
    assert.strictEqual(sentences.length, 3);
  });

  it('extracts testable factual claims from sample text', () => {
    const text = `The FDA approved a new gene editing therapy for clinical use. Researchers tested the treatment on 30 patients across hospitals. However, some people like the color blue. A total of 29 participants showed zero symptoms for 12 months.`;
    const claims = extractClaimsHeuristic(text);
    assert.ok(claims.length >= 2);
    const hasOpinionClaim = claims.some((c) => c.claimText.includes('like the color blue'));
    assert.strictEqual(hasOpinionClaim, false);
  });

  it('synthesizes claim verdict based on genuine evidence stances', () => {
    const claim = 'Apollo 11 was filmed in Hollywood';
    const evidence: EvidenceSource[] = [
      {
        id: '1',
        title: 'Snopes fact check',
        url: 'https://snopes.com/fact-check/apollo',
        domain: 'snopes.com',
        snippet: 'Debunked hoax: The claim that moon landings were filmed on a soundstage is false.',
        stance: 'REFUTES',
        confidence: 95,
        credibilityScore: 94,
        credibilityTier: 'High Authority',
      },
      {
        id: '2',
        title: 'NASA archives',
        url: 'https://nasa.gov',
        domain: 'nasa.gov',
        snippet: 'Definitive astronomical tracking and physical lunar samples refute staging conspiracies.',
        stance: 'REFUTES',
        confidence: 98,
        credibilityScore: 99,
        credibilityTier: 'High Authority',
      },
    ];

    const result = synthesizeClaimVerdictHeuristically(claim, evidence);
    assert.strictEqual(result.verdict, 'Refuted');
    assert.ok(result.confidence >= 80);
  });

  it('accurately aggregates claims into overall article verdict', () => {
    const claimsAllFalse: Claim[] = [
      {
        id: 'c1',
        claimText: 'Aliens landed in Times Square',
        originalSentence: 'Aliens landed in Times Square yesterday.',
        verdict: 'Refuted',
        confidence: 95,
        explanation: 'Debunked',
        evidence: [],
        stanceBreakdown: { supporting: 0, refuting: 2, neutral: 0 },
        importance: 'high',
      },
      {
        id: 'c2',
        claimText: 'Government declared martial law',
        originalSentence: 'The government declared national martial law.',
        verdict: 'Refuted',
        confidence: 90,
        explanation: 'Debunked',
        evidence: [],
        stanceBreakdown: { supporting: 0, refuting: 2, neutral: 0 },
        importance: 'high',
      },
    ];

    const aggregated = aggregateOverallVerdict(claimsAllFalse);
    assert.strictEqual(aggregated.overallVerdict, 'Likely False');
    assert.strictEqual(aggregated.metrics.refutedCount, 2);
    assert.strictEqual(aggregated.metrics.truthScore, 0);

    const claimsUnverified: Claim[] = [
      {
        id: 'c3',
        claimText: 'Unrecorded private conversation occurred',
        originalSentence: 'An unrecorded conversation took place.',
        verdict: 'Unverified',
        confidence: 30,
        explanation: 'No documentation found',
        evidence: [],
        stanceBreakdown: { supporting: 0, refuting: 0, neutral: 0 },
        importance: 'medium',
      },
    ];

    const aggregatedUnverified = aggregateOverallVerdict(claimsUnverified);
    assert.strictEqual(aggregatedUnverified.overallVerdict, 'Insufficient Evidence');
    assert.ok(aggregatedUnverified.overallConfidence <= 40);
  });

  it('validates URLs correctly', () => {
    assert.strictEqual(isValidUrl('https://apnews.com/article/123'), true);
    assert.strictEqual(isValidUrl('http://bbc.co.uk'), true);
    assert.strictEqual(isValidUrl('not-a-valid-url'), false);
    assert.strictEqual(isValidUrl('ftp://insecure-site.org'), false);
  });
});
