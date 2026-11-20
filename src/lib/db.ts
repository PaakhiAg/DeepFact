import fs from 'fs/promises';
import path from 'path';
import { VerificationReport, User, OverallVerdict } from './types';

interface DatabaseSchema {
  users: User[];
  reports: VerificationReport[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'deepfact-db.json');

const SEED_REPORTS: VerificationReport[] = [
  {
    id: 'report-demo-1',
    userId: 'user-demo-analyst',
    title: '[Demo Fixture] Viral Social Media Claim: Moon Landing Film Props Found in Nevada Warehouse',
    sourceType: 'social_media',
    rawContent: `Breaking investigation reveals that original 1969 Apollo 11 lunar landing movie stage props and high-intensity studio lamps were discovered in an abandoned warehouse in the Nevada desert. Officials reportedly recovered high-resolution cameras with 35mm film marked "Apollo Project Studio B". The discovery allegedly proves the historical moon landing was entirely filmed in a soundstage directed by Stanley Kubrick.`,
    extractedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    overallVerdict: 'Likely False',
    overallConfidence: 96,
    summary: 'DeepFact forensic verification detected critical factual inaccuracies. Out of 3 extracted claims, all 3 were decisively refuted by authoritative sources including NASA, Snopes, and Reuters. Independent retroreflector laser measurements and global astronomical observatories confirm the physical lunar landing.',
    tags: ['Space', 'Hoax', 'Viral Social Media', 'NASA'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    metrics: {
      totalClaims: 3,
      supportedCount: 0,
      refutedCount: 3,
      mixedCount: 0,
      unverifiedCount: 0,
      truthScore: 0,
      sourcesAnalyzed: 9,
      processingTimeMs: 2450,
    },
    claims: [
      {
        id: 'claim-1-1',
        claimText: 'Apollo 11 lunar landing movie stage props and studio lamps were discovered in a Nevada warehouse.',
        originalSentence: 'Breaking investigation reveals that original 1969 Apollo 11 lunar landing movie stage props and high-intensity studio lamps were discovered in an abandoned warehouse in the Nevada desert.',
        importance: 'high',
        verdict: 'Refuted',
        confidence: 96,
        explanation: 'Fact-checking records from Snopes and Reuters confirm that rumors of discovered "moon landing props" have circulated as known satirical parodies and internet hoaxes for decades. No such artifacts or government admissions have ever occurred.',
        stanceBreakdown: { supporting: 0, refuting: 3, neutral: 0 },
        evidence: [
          {
            id: 'ev-1-1',
            title: 'Fact Check: No "Moon Landing Movie Props" Found in Warehouse',
            url: 'https://www.snopes.com/fact-check/moon-landing-stage-props/',
            domain: 'snopes.com',
            snippet: 'Claims that stage props or film sets proving the Apollo moon landings were faked have circulated as satire and internet hoaxes for decades. No such artifacts exist.',
            stance: 'REFUTES',
            confidence: 95,
            credibilityScore: 94,
            credibilityTier: 'High Authority',
          },
          {
            id: 'ev-1-2',
            title: 'Apollo Moon Landing Hoax Accusations Thoroughly Debunked',
            url: 'https://www.nasa.gov/history/apollo-11-50th-anniversary-fact-sheet/',
            domain: 'nasa.gov',
            snippet: 'NASA and independent global observatories, including Soviet telemetry tracking, definitively confirmed the Apollo 11 lunar landings. Retroreflectors left on the lunar surface continue to be used by scientists worldwide.',
            stance: 'REFUTES',
            confidence: 98,
            credibilityScore: 99,
            credibilityTier: 'High Authority',
          },
        ],
      },
      {
        id: 'claim-1-2',
        claimText: 'High-resolution cameras with 35mm film marked "Apollo Project Studio B" were recovered.',
        originalSentence: 'Officials reportedly recovered high-resolution cameras with 35mm film marked "Apollo Project Studio B".',
        importance: 'medium',
        verdict: 'Refuted',
        confidence: 94,
        explanation: 'Apollo lunar surface photography utilized custom 70mm Hasselblad 500EL cameras with specialized Kodak thin-base film, not 35mm film canisters. The claim reflects fabricated technical details.',
        stanceBreakdown: { supporting: 0, refuting: 2, neutral: 0 },
        evidence: [
          {
            id: 'ev-1-3',
            title: 'Apollo 11 Photography Equipment Archive',
            url: 'https://www.nasa.gov/missions/apollo/apollo-11-cameras-and-photography/',
            domain: 'nasa.gov',
            snippet: 'Astronauts Neil Armstrong and Buzz Aldrin used customized medium-format Hasselblad 70mm data cameras on the lunar surface. 35mm motion picture studio equipment was never part of lunar inventory.',
            stance: 'REFUTES',
            confidence: 96,
            credibilityScore: 99,
            credibilityTier: 'High Authority',
          },
        ],
      },
      {
        id: 'claim-1-3',
        claimText: 'The moon landing was entirely filmed in a soundstage directed by Stanley Kubrick.',
        originalSentence: 'The discovery allegedly proves the historical moon landing was entirely filmed in a soundstage directed by Stanley Kubrick.',
        importance: 'high',
        verdict: 'Refuted',
        confidence: 98,
        explanation: 'The Kubrick conspiracy has been repeatedly debunked by film historians, Stanley Kubrick\'s family, and NASA archives. Over 400,000 scientists, engineers, and contractors participated in the Apollo missions across hundreds of independent facilities.',
        stanceBreakdown: { supporting: 0, refuting: 2, neutral: 0 },
        evidence: [
          {
            id: 'ev-1-4',
            title: 'Reuters Fact Check: Stanley Kubrick did not fake the moon landing',
            url: 'https://www.reuters.com/fact-check/kubrick-moon-landing-conspiracy-debunked/',
            domain: 'reuters.com',
            snippet: 'Kubrick\'s daughter Christiane Kubrick and biographer confirmed the rumors stem from a mockumentary titled "Dark Side of the Moon" (2002) which was a fictional French satire.',
            stance: 'REFUTES',
            confidence: 96,
            credibilityScore: 95,
            credibilityTier: 'High Authority',
          },
        ],
      },
    ],
  },
  {
    id: 'report-demo-2',
    userId: 'user-demo-analyst',
    title: '[Demo Fixture] FDA Approves Historic First CRISPR Gene-Editing Therapy Casgevy',
    sourceType: 'url',
    sourceUrl: 'https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapy-treatment-sickle-cell-disease',
    domain: 'fda.gov',
    rawContent: `The U.S. Food and Drug Administration approved Casgevy, the first therapy utilizing CRISPR/Cas9 genome editing technology for the treatment of sickle cell disease in patients aged 12 and older. Developed by Vertex Pharmaceuticals and CRISPR Therapeutics, the therapy modifies patients' hematopoietic stem cells to boost fetal hemoglobin production. In primary clinical trials, 29 out of 30 treated patients remained free from severe vaso-occlusive pain crises for at least 12 consecutive months.`,
    extractedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    overallVerdict: 'Likely True',
    overallConfidence: 97,
    summary: 'The core assertions in this content are well-corroborated by independent, high-credibility scientific and regulatory sources. Out of 3 extracted claims, all 3 were substantiated by official FDA documentation and Nature journal peer-reviewed reporting with zero contradictions.',
    tags: ['Medicine', 'Genetics', 'FDA', 'Biotechnology'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    metrics: {
      totalClaims: 3,
      supportedCount: 3,
      refutedCount: 0,
      mixedCount: 0,
      unverifiedCount: 0,
      truthScore: 100,
      sourcesAnalyzed: 8,
      processingTimeMs: 1980,
    },
    claims: [
      {
        id: 'claim-2-1',
        claimText: 'The FDA approved Casgevy as the first therapy utilizing CRISPR/Cas9 genome editing technology.',
        originalSentence: 'The U.S. Food and Drug Administration approved Casgevy, the first therapy utilizing CRISPR/Cas9 genome editing technology for the treatment of sickle cell disease in patients aged 12 and older.',
        importance: 'high',
        verdict: 'Supported',
        confidence: 98,
        explanation: 'Official FDA press releases and biomedical regulatory announcements confirm Casgevy (exagamglogene autotemcel) was granted landmark approval in December 2023 as the first CRISPR medicine.',
        stanceBreakdown: { supporting: 3, refuting: 0, neutral: 0 },
        evidence: [
          {
            id: 'ev-2-1',
            title: 'FDA Approves First Gene-Editing Therapy Casgevy for Sickle Cell Disease',
            url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapy-treatment-sickle-cell-disease',
            domain: 'fda.gov',
            snippet: 'The U.S. Food and Drug Administration approved Casgevy, the first cell-based gene therapy using CRISPR/Cas9, for the treatment of sickle cell disease.',
            stance: 'SUPPORTS',
            confidence: 99,
            credibilityScore: 97,
            credibilityTier: 'High Authority',
          },
        ],
      },
      {
        id: 'claim-2-2',
        claimText: 'The therapy was developed by Vertex Pharmaceuticals and CRISPR Therapeutics.',
        originalSentence: 'Developed by Vertex Pharmaceuticals and CRISPR Therapeutics, the therapy modifies patients\' hematopoietic stem cells to boost fetal hemoglobin production.',
        importance: 'medium',
        verdict: 'Supported',
        confidence: 96,
        explanation: 'Verified corporate and scientific registries corroborate that Casgevy was co-developed by Vertex Pharmaceuticals and CRISPR Therapeutics.',
        stanceBreakdown: { supporting: 2, refuting: 0, neutral: 0 },
        evidence: [
          {
            id: 'ev-2-2',
            title: 'Associated Press: FDA clears breakthrough CRISPR treatment',
            url: 'https://apnews.com/article/crispr-gene-editing-fda-approval-sickle-cell',
            domain: 'apnews.com',
            snippet: 'Regulators approved the therapy developed by Vertex Pharmaceuticals and CRISPR Therapeutics.',
            stance: 'SUPPORTS',
            confidence: 95,
            credibilityScore: 95,
            credibilityTier: 'High Authority',
          },
        ],
      },
      {
        id: 'claim-2-3',
        claimText: '29 out of 30 treated patients remained free from severe pain crises for at least 12 months in clinical trials.',
        originalSentence: 'In primary clinical trials, 29 out of 30 treated patients remained free from severe vaso-occlusive pain crises for at least 12 consecutive months.',
        importance: 'high',
        verdict: 'Supported',
        confidence: 96,
        explanation: 'Peer-reviewed clinical trial data published in Nature and New England Journal of Medicine confirm 29 of 30 patients reached complete freedom from severe vaso-occlusive crises.',
        stanceBreakdown: { supporting: 2, refuting: 0, neutral: 0 },
        evidence: [
          {
            id: 'ev-2-3',
            title: 'Historic CRISPR Landmark Cleared by Regulators',
            url: 'https://www.nature.com/articles/d41586-023-03704-5',
            domain: 'nature.com',
            snippet: 'Clinical trials showed that 29 of 30 evaluable patients with severe sickle cell disease treated with Casgevy remained completely free of severe pain crises for at least 12 consecutive months.',
            stance: 'SUPPORTS',
            confidence: 97,
            credibilityScore: 98,
            credibilityTier: 'High Authority',
          },
        ],
      },
    ],
  },
  {
    id: 'report-demo-3',
    userId: 'user-demo-analyst',
    title: '[Demo Fixture] Analysis: Electric Vehicles Lifecycle Emissions Compared to Diesel Cars',
    sourceType: 'text',
    rawContent: `A widely shared editorial asserts that electric vehicles produce more total carbon pollution than modern diesel vehicles. The article claims that manufacturing lithium-ion batteries emits twice the carbon footprint of building an entire diesel engine. Furthermore, it argues that because power grids rely heavily on coal, charging an EV causes equal or higher greenhouse emissions per mile than driving a Euro 6 diesel automobile.`,
    extractedDate: new Date(Date.now() - 86400000 * 8).toISOString(),
    overallVerdict: 'Mixed',
    overallConfidence: 84,
    summary: 'This article contains a blend of accurate factual elements and misleading oversimplifications. While battery manufacturing does generate higher initial upfront emissions, lifecycle emissions of electric vehicles are 50% to 70% lower than diesel vehicles across nearly all national energy grid mixes.',
    tags: ['Energy', 'Environment', 'Automotive', 'Climate'],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    metrics: {
      totalClaims: 3,
      supportedCount: 1,
      refutedCount: 1,
      mixedCount: 1,
      unverifiedCount: 0,
      truthScore: 50,
      sourcesAnalyzed: 7,
      processingTimeMs: 2150,
    },
    claims: [
      {
        id: 'claim-3-1',
        claimText: 'Manufacturing lithium-ion batteries produces higher initial upfront carbon emissions than building a diesel engine.',
        originalSentence: 'The article claims that manufacturing lithium-ion batteries emits twice the carbon footprint of building an entire diesel engine.',
        importance: 'medium',
        verdict: 'Supported',
        confidence: 88,
        explanation: 'Life-cycle assessments by the EPA and European Environment Agency confirm battery raw mineral extraction and cathode fabrication produce higher initial carbon emissions during manufacturing than internal combustion engines.',
        stanceBreakdown: { supporting: 2, refuting: 0, neutral: 0 },
        evidence: [
          {
            id: 'ev-3-1',
            title: 'Lifecycle Analysis: Electric Vehicles vs Internal Combustion Engines',
            url: 'https://www.epa.gov/greenvehicles/electric-vehicle-myths',
            domain: 'epa.gov',
            snippet: 'Manufacturing electric vehicles produces higher initial greenhouse gas emissions due to battery production.',
            stance: 'SUPPORTS',
            confidence: 92,
            credibilityScore: 96,
            credibilityTier: 'High Authority',
          },
        ],
      },
      {
        id: 'claim-3-2',
        claimText: 'Electric vehicles produce more total carbon pollution over their lifetime than modern diesel vehicles.',
        originalSentence: 'A widely shared editorial asserts that electric vehicles produce more total carbon pollution than modern diesel vehicles.',
        importance: 'high',
        verdict: 'Refuted',
        confidence: 94,
        explanation: 'Comprehensive lifecycle studies show EVs break even on manufacturing emissions within 1 to 2 years of operation and produce 60-70% lower net lifetime emissions than comparable diesel cars.',
        stanceBreakdown: { supporting: 0, refuting: 2, neutral: 0 },
        evidence: [
          {
            id: 'ev-3-2',
            title: 'Comparative Carbon Footprint of Electric and Diesel Vehicles',
            url: 'https://www.theguardian.com/environment/2023/jul/28/electric-vehicles-emissions-study-gas-diesel',
            domain: 'theguardian.com',
            snippet: 'Studies by the International Council on Clean Transportation (ICCT) show European EVs emit 66% to 69% less greenhouse gas than comparable diesel vehicles over their full lifecycle.',
            stance: 'REFUTES',
            confidence: 90,
            credibilityScore: 88,
            credibilityTier: 'Mainstream News',
          },
        ],
      },
      {
        id: 'claim-3-3',
        claimText: 'Charging an EV on coal-reliant grids causes equal or higher emissions per mile than driving diesel.',
        originalSentence: 'Furthermore, it argues that because power grids rely heavily on coal, charging an EV causes equal or higher greenhouse emissions per mile than driving a Euro 6 diesel automobile.',
        importance: 'medium',
        verdict: 'Mixed Evidence',
        confidence: 80,
        explanation: 'Only in extreme grids with more than 85% coal generation (such as historical Polish or Indian sub-grids) do EV operational emissions approach modern clean diesel; however, global grids are rapidly transitioning to renewables.',
        stanceBreakdown: { supporting: 1, refuting: 1, neutral: 0 },
        evidence: [
          {
            id: 'ev-3-3',
            title: 'Reuters Fact Check: Misleading claims on EV grid pollution',
            url: 'https://www.reuters.com/fact-check/ev-battery-pollution-diesel-comparison/',
            domain: 'reuters.com',
            snippet: 'Claims that EVs pollute more than diesel rely on extreme high-coal grid scenarios or outdated battery manufacturing figures.',
            stance: 'NEUTRAL',
            confidence: 85,
            credibilityScore: 95,
            credibilityTier: 'High Authority',
          },
        ],
      },
    ],
  },
];

const SEED_USERS: User[] = [
  {
    id: 'user-demo-analyst',
    email: 'analyst@deepfact.ai',
    name: 'Lead Fact-Checking Analyst',
    role: 'analyst',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-guest',
    email: 'guest@deepfact.ai',
    name: 'Guest Investigator',
    role: 'guest',
    createdAt: new Date().toISOString(),
  },
];

async function ensureDb(): Promise<DatabaseSchema> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch {
    const initialData: DatabaseSchema = {
      users: SEED_USERS,
      reports: SEED_REPORTS,
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

async function writeDb(data: DatabaseSchema): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getReports(
  userId?: string,
  searchQuery?: string,
  verdictFilter?: string
): Promise<VerificationReport[]> {
  const db = await ensureDb();
  let reports = db.reports;

  if (userId && userId !== 'all') {
    reports = reports.filter((r) => r.userId === userId || r.userId === 'user-demo-analyst');
  }

  if (verdictFilter && verdictFilter !== 'all') {
    reports = reports.filter((r) => r.overallVerdict.toLowerCase() === verdictFilter.toLowerCase());
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    reports = reports.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.rawContent.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getReportById(id: string): Promise<VerificationReport | null> {
  const db = await ensureDb();
  return db.reports.find((r) => r.id === id) || null;
}

export async function saveReport(report: VerificationReport): Promise<VerificationReport> {
  const db = await ensureDb();
  const existingIndex = db.reports.findIndex((r) => r.id === report.id);
  if (existingIndex >= 0) {
    db.reports[existingIndex] = report;
  } else {
    db.reports.unshift(report);
  }
  await writeDb(db);
  return report;
}

export async function deleteReport(id: string): Promise<boolean> {
  const db = await ensureDb();
  const initialLength = db.reports.length;
  db.reports = db.reports.filter((r) => r.id !== id);
  if (db.reports.length !== initialLength) {
    await writeDb(db);
    return true;
  }
  return false;
}

export async function getStats(userId?: string) {
  const reports = await getReports(userId);
  const total = reports.length;

  let totalClaims = 0;
  let supportedClaims = 0;
  let refutedClaims = 0;
  let mixedClaims = 0;
  let unverifiedClaims = 0;
  let totalSources = 0;

  const verdictDistribution: Record<OverallVerdict, number> = {
    'Likely True': 0,
    'Likely False': 0,
    'Mixed': 0,
    'Insufficient Evidence': 0,
  };

  for (const r of reports) {
    verdictDistribution[r.overallVerdict] = (verdictDistribution[r.overallVerdict] || 0) + 1;
    totalClaims += r.metrics.totalClaims;
    supportedClaims += r.metrics.supportedCount;
    refutedClaims += r.metrics.refutedCount;
    mixedClaims += r.metrics.mixedCount;
    unverifiedClaims += r.metrics.unverifiedCount;
    totalSources += r.metrics.sourcesAnalyzed;
  }

  const misinformationRate =
    total > 0 ? Math.round((verdictDistribution['Likely False'] / total) * 100) : 0;
  const avgTruthScore =
    total > 0 ? Math.round(reports.reduce((acc, r) => acc + r.metrics.truthScore, 0) / total) : 0;

  return {
    totalReports: total,
    totalClaims,
    supportedClaims,
    refutedClaims,
    mixedClaims,
    unverifiedClaims,
    totalSources,
    misinformationRate,
    avgTruthScore,
    verdictDistribution,
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await ensureDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await ensureDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function saveUser(user: User): Promise<User> {
  const db = await ensureDb();
  const index = db.users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    db.users[index] = user;
  } else {
    db.users.push(user);
  }
  await writeDb(db);
  return user;
}
