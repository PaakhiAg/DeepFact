import * as cheerio from 'cheerio';
import { EvidenceSource, StanceType } from '../types';
import { evaluateDomainCredibility, extractDomain } from '../credibility';

export interface SearchQueryResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

/**
 * Reformulates a natural-language claim into concise search engine queries
 */
export function reformulateSearchQuery(claimText: string): { primaryQuery: string; factCheckQuery: string } {
  // Strip conversational or meta-reporting preambles
  const clean = claimText
    .replace(/^(breaking investigation reveals that|widely shared (editorial|post) asserts that|officials reportedly|it is claimed that|reports suggest that|according to (reports|sources|officials)|furthermore,? it argues that|social media reports allege that)\s*/i, '')
    .replace(/[^\w\s\d.-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'in', 'on', 'at', 'by', 'for', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under', 'again', 'further',
    'that', 'this', 'these', 'those', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'very', 'entirely', 'allegedly', 'reportedly', 'original'
  ]);

  const words = clean.split(' ').filter(Boolean);
  const keywords = words.filter((w) => !stopWords.has(w.toLowerCase()));

  // Primary search query: top 5-7 meaningful keywords
  const primaryQuery = keywords.slice(0, 7).join(' ') || clean.slice(0, 80);

  // Secondary fact-checking focused query
  const keySubject = keywords.slice(0, 4).join(' ');
  const factCheckQuery = `${keySubject} fact check`.trim();

  return { primaryQuery, factCheckQuery };
}

/**
 * Searches Tavily API if TAVILY_API_KEY is configured
 */
export async function searchTavily(query: string, apiKey?: string): Promise<SearchQueryResult[]> {
  const key = apiKey || process.env.TAVILY_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: 'advanced',
        include_answer: false,
        max_results: 5,
      }),
    });

    if (!res.ok) {
      console.warn(`Tavily search API returned HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results
      .filter((r: { url?: string; content?: string }) => r.url && r.content)
      .map((r: { title?: string; url: string; content: string }) => ({
        title: r.title || 'Source Article',
        url: r.url,
        snippet: r.content.replace(/\s+/g, ' ').trim(),
        domain: extractDomain(r.url),
      }));
  } catch (err) {
    console.warn('Tavily search error:', err);
    return [];
  }
}

/**
 * DuckDuckGo HTML Live Web Search (Zero-key required, live web retrieval)
 */
export async function searchDuckDuckGo(query: string): Promise<SearchQueryResult[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 DeepFact/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const results: SearchQueryResult[] = [];

    $('.result').each((_, el) => {
      if (results.length >= 5) return;
      const titleEl = $(el).find('.result__title a');
      const snippetEl = $(el).find('.result__snippet');
      const title = titleEl.text().replace(/\s+/g, ' ').trim();
      const rawHref = titleEl.attr('href') || '';

      // DuckDuckGo redirects links through /l/?uddg=
      let targetUrl = rawHref;
      try {
        if (rawHref.includes('uddg=')) {
          const match = rawHref.match(/uddg=([^&]+)/);
          if (match && match[1]) {
            targetUrl = decodeURIComponent(match[1]);
          }
        }
      } catch {
        targetUrl = rawHref;
      }

      const snippet = snippetEl.text().replace(/\s+/g, ' ').trim();
      if (title && snippet && targetUrl.startsWith('http')) {
        results.push({
          title,
          url: targetUrl,
          snippet,
          domain: extractDomain(targetUrl),
        });
      }
    });

    return results;
  } catch (err) {
    console.warn('DuckDuckGo search error:', err);
    return [];
  }
}

/**
 * Retrieve genuine web evidence for a claim.
 * Uses query reformulation to search live web indexes.
 * If no evidence is found, returns an honest empty array [].
 */
export async function retrieveEvidenceForClaim(
  claimText: string,
  userTavilyKey?: string
): Promise<SearchQueryResult[]> {
  const { primaryQuery, factCheckQuery } = reformulateSearchQuery(claimText);

  // 1. Try Tavily Search API if configured
  const tavilyResults = await searchTavily(primaryQuery, userTavilyKey);
  if (tavilyResults.length > 0) {
    return deduplicateAndRank(tavilyResults);
  }

  // 2. Try DuckDuckGo Live Search with primary reformulated query
  let ddgResults = await searchDuckDuckGo(primaryQuery);
  if (ddgResults.length > 0) {
    return deduplicateAndRank(ddgResults);
  }

  // 3. Try DuckDuckGo with targeted fact-checking query
  if (factCheckQuery && factCheckQuery !== primaryQuery) {
    ddgResults = await searchDuckDuckGo(factCheckQuery);
    if (ddgResults.length > 0) {
      return deduplicateAndRank(ddgResults);
    }
  }

  // 4. Honest empty-evidence result when nothing is found online
  return [];
}

/**
 * Deduplicate sources by domain and rank by domain authority
 */
function deduplicateAndRank(results: SearchQueryResult[]): SearchQueryResult[] {
  const seenDomains = new Set<string>();
  const unique: SearchQueryResult[] = [];

  for (const res of results) {
    const domain = res.domain.toLowerCase();
    if (!seenDomains.has(domain)) {
      seenDomains.add(domain);
      unique.push(res);
    }
  }

  // Sort by domain authority
  return unique.sort((a, b) => {
    const scoreA = evaluateDomainCredibility(a.domain).score;
    const scoreB = evaluateDomainCredibility(b.domain).score;
    return scoreB - scoreA;
  });
}

/**
 * Converts search query results into EvidenceSource objects
 */
export function formatAsEvidenceSources(
  results: SearchQueryResult[],
  claimText: string
): EvidenceSource[] {
  if (!results || results.length === 0) {
    return [];
  }

  return results.map((res, index) => {
    const credInfo = evaluateDomainCredibility(res.domain || res.url);
    const stance = detectHeuristicStance(claimText, res.snippet, res.title);

    return {
      id: `ev-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      title: res.title,
      url: res.url,
      domain: credInfo.domain,
      snippet: res.snippet,
      stance,
      confidence: Math.min(95, Math.max(50, credInfo.score - 5)),
      credibilityScore: credInfo.score,
      credibilityTier: credInfo.tier,
    };
  });
}

/**
 * Contextual heuristic stance detection comparing claim content against evidence snippet
 */
export function detectHeuristicStance(
  claimText: string,
  snippet: string,
  title: string
): StanceType {
  const combined = (title + ' ' + snippet).toLowerCase();
  const lowerClaim = claimText.toLowerCase();

  // Strong refuting signals (often from fact checkers or debunking articles)
  const explicitRefutePatterns = [
    /\b(fact check|snopes|reuters fact check|politifact|ap fact check)\b.*\b(false|debunked|hoax|misleading|myth|fake|pants on fire)\b/i,
    /\b(false|untrue|fabricated|debunked as (a )?hoax|no evidence (to suggest|that)|never occurred|incorrectly claimed|conspiracy theory)\b/i,
    /\b(does not show|has been disproven|contrary to claims|falsely claimed)\b/i,
  ];

  // Strong corroborating / supporting signals
  const explicitSupportPatterns = [
    /\b(officially confirmed|fda approved|scientists confirmed|study published in|official announcement|proven to|clinical trials demonstrated)\b/i,
    /\b(corroborates|verified by|substantiated|evidence confirms|records indicate that|authorized by)\b/i,
  ];

  for (const pat of explicitRefutePatterns) {
    if (pat.test(combined)) return 'REFUTES';
  }

  for (const pat of explicitSupportPatterns) {
    if (pat.test(combined)) return 'SUPPORTS';
  }

  // Count individual signal words
  const refutingWords = ['false', 'debunked', 'hoax', 'misleading', 'myth', 'disproven', 'unfounded'];
  const supportingWords = ['confirmed', 'proven', 'verified', 'approved', 'demonstrated', 'corroborated'];

  let refuteScore = 0;
  let supportScore = 0;

  for (const w of refutingWords) {
    if (combined.includes(w)) refuteScore++;
  }

  for (const w of supportingWords) {
    if (combined.includes(w)) supportScore++;
  }

  if (refuteScore > 0 && refuteScore > supportScore) return 'REFUTES';
  if (supportScore > 0 && supportScore > refuteScore) return 'SUPPORTS';

  // Keyword overlap
  const claimWords = lowerClaim.split(/\s+/).filter((w) => w.length > 4);
  const matchedWords = claimWords.filter((w) => combined.includes(w));

  if (claimWords.length > 0 && matchedWords.length / claimWords.length >= 0.5) {
    return 'MENTIONS';
  }

  return 'NEUTRAL';
}
