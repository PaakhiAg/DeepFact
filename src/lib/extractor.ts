import * as cheerio from 'cheerio';
import { extractDomain } from './credibility';

export interface ExtractedArticle {
  url: string;
  domain: string;
  title: string;
  author?: string;
  publishedDate?: string;
  cleanText: string;
  wordCount: number;
  snippet: string;
}

export class ExtractionError extends Error {
  isUrlInaccessible: boolean;
  constructor(message: string, isUrlInaccessible = true) {
    super(message);
    this.name = 'ExtractionError';
    this.isUrlInaccessible = isUrlInaccessible;
  }
}

/**
 * Validates whether string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Fetches and parses an article from a URL, extracting clean content and metadata
 */
export async function extractArticleFromUrl(urlStr: string, timeoutMs = 10000): Promise<ExtractedArticle> {
  if (!isValidUrl(urlStr)) {
    throw new ExtractionError('Invalid URL provided. Please enter a valid http or https web address.');
  }

  const cleanUrl = urlStr.trim();
  const domain = extractDomain(cleanUrl);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 DeepFact/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('abort') || message.includes('timeout')) {
      throw new ExtractionError(
        `Connection timed out while accessing ${domain}. The site took longer than ${timeoutMs / 1000}s to respond. Please copy and paste the article text directly.`
      );
    }
    throw new ExtractionError(
      `Unable to reach ${domain} (${message}). The site may be protected, offline, or blocking automated access. Please copy and paste the article text directly.`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new ExtractionError(
        `Access to ${domain} was denied (HTTP ${response.status} - Paywall/Anti-bot). Please copy and paste the article text directly into DeepFact.`
      );
    }
    throw new ExtractionError(
      `Failed to load article from ${domain} (HTTP ${response.status}). Please copy and paste the article text directly.`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $('script, style, noscript, iframe, svg, nav, footer, header, aside, .advertisement, .ads, .cookie-banner, .social-share').remove();

  // Extract Title
  let title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    'Untitled Article';

  title = title.replace(/\s+/g, ' ').trim();

  // Extract Author
  const author =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('[rel="author"]').first().text().trim() ||
    $('.author, .byline').first().text().trim() ||
    undefined;

  // Extract Published Date
  const publishedDate =
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="pubdate"]').attr('content') ||
    $('time').first().attr('datetime') ||
    $('time').first().text().trim() ||
    undefined;

  // Extract Body Text
  // Look for standard article content containers first
  const bodyContainer = $(
    'article, [itemprop="articleBody"], .article-content, .story-body, .post-content, main, .entry-content'
  ).first();

  let text = '';
  if (bodyContainer.length > 0) {
    // Collect paragraphs
    const paragraphs: string[] = [];
    bodyContainer.find('p').each((_, el) => {
      const pText = $(el).text().replace(/\s+/g, ' ').trim();
      if (pText.length > 30) {
        paragraphs.push(pText);
      }
    });
    text = paragraphs.join('\n\n');
  }

  // Fallback if specific containers didn't yield enough text
  if (!text || text.length < 150) {
    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const pText = $(el).text().replace(/\s+/g, ' ').trim();
      if (pText.length > 40) {
        paragraphs.push(pText);
      }
    });
    text = paragraphs.join('\n\n');
  }

  // If still too short, extract all readable body text
  if (!text || text.length < 100) {
    text = $('body').text().replace(/\s+/g, ' ').trim();
  }

  if (!text || text.length < 80) {
    throw new ExtractionError(
      `Could not extract sufficient readable text from ${domain}. The article might be behind an interactive paywall or rendered exclusively via client-side JavaScript. Please copy and paste the article text directly.`
    );
  }

  const words = text.split(/\s+/).filter(Boolean);
  const snippet = text.slice(0, 300) + (text.length > 300 ? '...' : '');

  return {
    url: cleanUrl,
    domain,
    title,
    author: author ? author.slice(0, 80) : undefined,
    publishedDate: publishedDate ? publishedDate.slice(0, 40) : undefined,
    cleanText: text,
    wordCount: words.length,
    snippet,
  };
}
