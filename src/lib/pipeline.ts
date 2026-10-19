import {
  VerificationInput,
  VerificationReport,
  Claim,
} from './types';
import { extractArticleFromUrl, ExtractionError, isValidUrl } from './extractor';
import { extractClaimsFromText, verifyClaimWithEvidence, aggregateOverallVerdict } from './ai';
import { formatAsEvidenceSources, retrieveEvidenceForClaim } from './search';
import { saveReport } from './db';

export interface PipelineProgressCallback {
  (step: number, label: string, detail: string): void;
}

export async function runVerificationPipeline(
  input: VerificationInput,
  userId = 'user-demo-analyst',
  config?: { geminiKey?: string; tavilyKey?: string },
  onProgress?: PipelineProgressCallback
): Promise<VerificationReport> {
  const startTime = Date.now();

  let contentToAnalyze = '';
  let articleTitle = input.title || '';
  let sourceUrl = input.url;
  let domain = '';
  let author: string | undefined;
  let publishedDate: string | undefined;

  // Step 1: Input Validation and Ingestion
  onProgress?.(1, 'Content Ingestion & Normalization', 'Validating payload and extracting readable content...');

  if (input.sourceType === 'url' || (input.url && isValidUrl(input.url))) {
    try {
      const extracted = await extractArticleFromUrl(input.url!);
      contentToAnalyze = extracted.cleanText;
      articleTitle = input.title || extracted.title;
      sourceUrl = extracted.url;
      domain = extracted.domain;
      author = extracted.author;
      publishedDate = extracted.publishedDate;
    } catch (err) {
      if (err instanceof ExtractionError) {
        throw err;
      }
      throw new ExtractionError(
        `Failed to retrieve article from ${input.url}. Please copy and paste the article text directly.`
      );
    }
  } else if (input.text && input.text.trim().length >= 20) {
    contentToAnalyze = input.text.trim();
    if (!articleTitle) {
      // Derive title from first line or sentence
      const firstLine = contentToAnalyze.split('\n')[0].trim();
      articleTitle = firstLine.length > 80 ? firstLine.slice(0, 77) + '...' : firstLine;
    }
  } else {
    throw new Error('Please provide sufficient text (at least 20 characters) or a valid article URL to verify.');
  }

  // Step 2: AI Claim Extraction
  onProgress?.(2, 'Claim Extraction & Isolation', 'Isolating testable factual assertions and original context spans...');

  const rawClaims = await extractClaimsFromText(contentToAnalyze, config);
  if (rawClaims.length === 0) {
    throw new Error('No testable factual propositions could be identified in the submitted text.');
  }

  // Step 3 & 4: Multi-Source Web Retrieval & Cross-Reference Stance Verification
  onProgress?.(3, 'Multi-Source Evidence Retrieval', 'Searching authoritative web indexes, news wires, and fact-checking records...');

  const verifiedClaims: Claim[] = [];

  for (let i = 0; i < rawClaims.length; i++) {
    const raw = rawClaims[i];
    onProgress?.(
      4,
      `Verifying Claim ${i + 1}/${rawClaims.length}`,
      `Cross-referencing: "${raw.claimText.slice(0, 50)}..."`
    );

    // Retrieve live search evidence
    const queryResults = await retrieveEvidenceForClaim(raw.claimText, config?.tavilyKey);
    const evidenceSources = formatAsEvidenceSources(queryResults, raw.claimText);

    // Verify claim with Gemini or algorithmic synthesis
    const evaluation = await verifyClaimWithEvidence(
      raw.claimText,
      raw.originalSentence,
      evidenceSources,
      config
    );

    // Calculate stance breakdown
    let supporting = 0;
    let refuting = 0;
    let neutral = 0;

    for (const e of evidenceSources) {
      if (e.stance === 'SUPPORTS') supporting++;
      else if (e.stance === 'REFUTES') refuting++;
      else neutral++;
    }

    // Locate character span within original content
    const charStartIndex = contentToAnalyze.indexOf(raw.originalSentence);
    const charEndIndex =
      charStartIndex >= 0 ? charStartIndex + raw.originalSentence.length : undefined;

    verifiedClaims.push({
      id: `claim-${Date.now()}-${i}`,
      claimText: raw.claimText,
      originalSentence: raw.originalSentence,
      charStartIndex: charStartIndex >= 0 ? charStartIndex : undefined,
      charEndIndex,
      importance: raw.importance,
      verdict: evaluation.verdict,
      confidence: evaluation.confidence,
      explanation: evaluation.explanation,
      evidence: evidenceSources,
      stanceBreakdown: {
        supporting,
        refuting,
        neutral,
      },
    });
  }

  // Step 5: Overall Synthesis and Verdict Aggregation
  onProgress?.(5, 'Synthesis & Analytical Verdict', 'Synthesizing evidence weights and compiling forensic report...');

  const aggregation = aggregateOverallVerdict(verifiedClaims);
  const processingTimeMs = Date.now() - startTime;
  aggregation.metrics.processingTimeMs = processingTimeMs;

  // Generate automated tags
  const tags: string[] = [];
  if (domain) tags.push(domain);
  if (input.sourceType === 'social_media') tags.push('Social Media');
  if (contentToAnalyze.toLowerCase().includes('health') || contentToAnalyze.toLowerCase().includes('fda'))
    tags.push('Health/Science');
  if (contentToAnalyze.toLowerCase().includes('election') || contentToAnalyze.toLowerCase().includes('court'))
    tags.push('Politics');
  if (tags.length === 0) tags.push('General News');

  const reportId = `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const finalReport: VerificationReport = {
    id: reportId,
    userId,
    title: articleTitle,
    sourceUrl,
    sourceType: input.sourceType,
    rawContent: contentToAnalyze,
    author,
    publishedDate,
    domain,
    extractedDate: new Date().toISOString(),
    overallVerdict: aggregation.overallVerdict,
    overallConfidence: aggregation.overallConfidence,
    summary: aggregation.summary,
    claims: verifiedClaims,
    metrics: aggregation.metrics,
    tags,
    createdAt: new Date().toISOString(),
  };

  await saveReport(finalReport);
  return finalReport;
}
