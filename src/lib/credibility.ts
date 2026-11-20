import { CredibilityTier, DomainCredibilityInfo } from './types';

export const KNOWN_DOMAINS: Record<string, { name: string; tier: CredibilityTier; score: number; type: DomainCredibilityInfo['type'] }> = {
  // Scientific & International Institutions
  'who.int': { name: 'World Health Organization', tier: 'High Authority', score: 98, type: 'academic' },
  'cdc.gov': { name: 'Centers for Disease Control', tier: 'High Authority', score: 97, type: 'government' },
  'nih.gov': { name: 'National Institutes of Health', tier: 'High Authority', score: 98, type: 'government' },
  'nasa.gov': { name: 'NASA', tier: 'High Authority', score: 99, type: 'government' },
  'nature.com': { name: 'Nature Publishing Group', tier: 'High Authority', score: 98, type: 'academic' },
  'science.org': { name: 'Science / AAAS', tier: 'High Authority', score: 98, type: 'academic' },
  'thelancet.com': { name: 'The Lancet', tier: 'High Authority', score: 97, type: 'academic' },
  'cell.com': { name: 'Cell Press', tier: 'High Authority', score: 96, type: 'academic' },
  'un.org': { name: 'United Nations', tier: 'High Authority', score: 95, type: 'government' },
  'epa.gov': { name: 'Environmental Protection Agency', tier: 'High Authority', score: 96, type: 'government' },
  'fda.gov': { name: 'Food and Drug Administration', tier: 'High Authority', score: 97, type: 'government' },

  // Primary Fact-Checking Organizations
  'snopes.com': { name: 'Snopes', tier: 'High Authority', score: 94, type: 'fact_checker' },
  'politifact.com': { name: 'PolitiFact', tier: 'High Authority', score: 93, type: 'fact_checker' },
  'factcheck.org': { name: 'FactCheck.org', tier: 'High Authority', score: 94, type: 'fact_checker' },
  'fullfact.org': { name: 'Full Fact UK', tier: 'High Authority', score: 92, type: 'fact_checker' },
  'leadstories.com': { name: 'Lead Stories', tier: 'High Authority', score: 90, type: 'fact_checker' },

  // Wire Services & Primary Journalism
  'reuters.com': { name: 'Reuters', tier: 'High Authority', score: 95, type: 'wire_service' },
  'apnews.com': { name: 'Associated Press', tier: 'High Authority', score: 95, type: 'wire_service' },
  'afp.com': { name: 'Agence France-Presse', tier: 'High Authority', score: 94, type: 'wire_service' },
  'bloomberg.com': { name: 'Bloomberg News', tier: 'Mainstream News', score: 91, type: 'reputable_media' },
  'bbc.com': { name: 'BBC News', tier: 'Mainstream News', score: 92, type: 'reputable_media' },
  'bbc.co.uk': { name: 'BBC News', tier: 'Mainstream News', score: 92, type: 'reputable_media' },
  'theguardian.com': { name: 'The Guardian', tier: 'Mainstream News', score: 88, type: 'reputable_media' },
  'nytimes.com': { name: 'The New York Times', tier: 'Mainstream News', score: 89, type: 'reputable_media' },
  'washingtonpost.com': { name: 'The Washington Post', tier: 'Mainstream News', score: 88, type: 'reputable_media' },
  'wsj.com': { name: 'The Wall Street Journal', tier: 'Mainstream News', score: 89, type: 'reputable_media' },
  'ft.com': { name: 'Financial Times', tier: 'Mainstream News', score: 91, type: 'reputable_media' },
  'dw.com': { name: 'Deutsche Welle', tier: 'Mainstream News', score: 89, type: 'reputable_media' },
  'scientificamerican.com': { name: 'Scientific American', tier: 'High Authority', score: 93, type: 'academic' },
  'nationalgeographic.com': { name: 'National Geographic', tier: 'Mainstream News', score: 90, type: 'reputable_media' },
  'technologyreview.com': { name: 'MIT Technology Review', tier: 'High Authority', score: 93, type: 'academic' },
  'npr.org': { name: 'NPR', tier: 'Mainstream News', score: 89, type: 'reputable_media' },
  'pbs.org': { name: 'PBS', tier: 'Mainstream News', score: 90, type: 'reputable_media' },
  'aljazeera.com': { name: 'Al Jazeera', tier: 'Mainstream News', score: 84, type: 'reputable_media' },
  'time.com': { name: 'TIME Magazine', tier: 'Mainstream News', score: 86, type: 'reputable_media' },
  'economist.com': { name: 'The Economist', tier: 'Mainstream News', score: 91, type: 'reputable_media' },

  // Known Low Trust / Satire / Conspiracy Domains
  'theonion.com': { name: 'The Onion (Satire)', tier: 'Low Trust', score: 15, type: 'general' },
  'babylonbee.com': { name: 'The Babylon Bee (Satire)', tier: 'Low Trust', score: 15, type: 'general' },
  'infowars.com': { name: 'Infowars (Disinformation)', tier: 'Low Trust', score: 12, type: 'general' },
  'naturalnews.com': { name: 'Natural News (Pseudoscience)', tier: 'Low Trust', score: 18, type: 'general' },
  'worldnewsdailyreport.com': { name: 'World News Daily (Hoax)', tier: 'Low Trust', score: 10, type: 'general' },
  'beforeitsnews.com': { name: 'Before It\'s News (Conspiracy)', tier: 'Low Trust', score: 15, type: 'general' },
};

/**
 * Extracts and cleans hostname from URL or string
 */
export function extractDomain(urlOrDomain: string): string {
  try {
    let clean = urlOrDomain.trim().toLowerCase();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return urlOrDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

/**
 * Evaluates domain credibility based on known registries and TLD analysis
 */
export function evaluateDomainCredibility(urlOrDomain: string): DomainCredibilityInfo {
  const domain = extractDomain(urlOrDomain);

  // Direct match
  if (KNOWN_DOMAINS[domain]) {
    const entry = KNOWN_DOMAINS[domain];
    return {
      domain,
      name: entry.name,
      tier: entry.tier,
      score: entry.score,
      type: entry.type,
    };
  }

  // Check top-level suffix matches (e.g. subdomains of .gov, .edu, nature.com)
  for (const [knownKey, entry] of Object.entries(KNOWN_DOMAINS)) {
    if (domain.endsWith('.' + knownKey)) {
      return {
        domain,
        name: `${domain} (${entry.name})`,
        tier: entry.tier,
        score: Math.max(75, entry.score - 5),
        type: entry.type,
      };
    }
  }

  // TLD heuristics
  if (domain.endsWith('.gov') || domain.endsWith('.mil')) {
    return {
      domain,
      name: domain,
      tier: 'High Authority',
      score: 95,
      type: 'government',
    };
  }

  if (domain.endsWith('.edu') || domain.endsWith('.ac.uk')) {
    return {
      domain,
      name: domain,
      tier: 'High Authority',
      score: 92,
      type: 'academic',
    };
  }

  // General web source defaults
  return {
    domain,
    name: domain,
    tier: 'Independent / Web',
    score: 65,
    type: 'general',
  };
}
