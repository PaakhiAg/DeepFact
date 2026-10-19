# DeepFact — Retrieval-Augmented Fake News Detection & Verification

> **Final-Year Major Capstone Project**  
> An end-to-end, multi-claim AI forensic fact-checking platform with real-time web RAG, domain credibility scoring, and an interactive 3D WebGL intelligence visualization.

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20WebGL-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 1. System Overview

Traditional fact-checking solutions suffer from significant shortcomings:
1. **Headline Myopia:** They classify entire articles based purely on a headline or single sentence, ignoring nuanced bodies of text.
2. **Hallucination Risks:** Generic AI chatbots fabricate quotations, invent non-existent URLs, or rely on outdated cutoff dates.
3. **Black-Box Verdicts:** Generic models output a binary "Fake" or "Real" label without showing which specific sentences were verified or which primary sources either supported or contradicted them.

**DeepFact solves these challenges through a 5-Stage Retrieval-Augmented Generation (RAG) Architecture**:
- **Full Article Ingestion & Decomposition:** Extracts readable text from URLs or pasted social posts and isolates individual verifiable factual propositions, preserving their character spans and original sentences.
- **Multi-Source Evidence Retrieval:** Queries live web search indexes (Tavily Search API & DuckDuckGo open search) plus curated fact-checking databases.
- **Domain Credibility Scoring:** Distinguishes institutional authorities (.gov, .edu, WHO, NASA, FDA) and primary wire services (Reuters, AP) from low-trust blogs and clickbait.
- **Cross-Reference Stance Classification:** Classifies each retrieved source as **Supports**, **Refutes**, or **Neutral/Context**.
- **Transparent Forensic Synthesis:** Computes a Truth Index score (0-100%), overall verdict (**Likely True**, **Likely False**, **Mixed**, or **Insufficient Evidence**), and renders an interactive bipartite relationship graph and highlighted article reader.

---

## 2. Key Features

- **Entire Article & Social Media Verification:** Ingests complete articles up to 10,000 words or raw URLs with automated paywall/ad stripping.
- **Interactive 3D Holographic Globe:** Three.js WebGL globe featuring real-time node arcs, floating particle fields, interactive rotation, and a graceful CSS fallback for low-power devices.
- **Interactive Original Article Reader:** Highlights every extracted claim in the original text (color-coded by verdict). Clicking any sentence scrolls directly to its evidence dossier.
- **Bipartite Evidence Relationship Topology:** Visual network mapping claims to corroborating and contradicting evidence sources.
- **Operational Intelligence Dashboard:** Real-time analytics, verdict distribution charts, misinformation rates, and historical dossier search.
- **Zero-Fabrication Citation Protocol:** Guarantees that only genuine, retrieved web URLs and excerpts appear in reports.
- **Export Capabilities:** Export forensic dossiers as clean printable PDFs or Markdown (`.md`) files.
- **Zero Mandatory Configuration:** Works immediately out of the box with built-in heuristic NLP and open search, with optional custom Gemini and Tavily API key support.

---

## 3. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **3D Graphics & Animations:** Three.js, Canvas WebGL, Lucide React Icons
- **Backend & API:** Next.js Server Routes, Cheerio Article Parser
- **AI & RAG Engine:** Google Gemini API (`@google/generative-ai`), Tavily Search API, DuckDuckGo Open Scraper, Built-in Domain Credibility Engine
- **Storage:** Local Persistent Database (`.data/deepfact-db.json`) with Seeded Demonstrations & Supabase compatibility
- **Testing:** Native Node.js Test Runner with `tsx` (TypeScript integration)

---

## 4. Getting Started

### Prerequisites
- Node.js 18.x, 20.x, or 22.x
- npm 9+ or yarn

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd deepfact
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your optional keys if you wish:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   TAVILY_API_KEY=your_tavily_api_key
   ```
   > **Note:** DeepFact runs with 100% functionality even without any API keys configured! It uses smart heuristic NLP, open web queries, and pre-indexed fact-checking knowledge bases.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Running Tests

DeepFact includes unit and integration tests covering domain credibility scoring, heuristic stance detection, claim isolation, and verdict aggregation:

```bash
npm test
```

Expected output:
```
# Subtest: DeepFact Verification Pipeline Unit Tests
    ok 1 - extracts domain correctly from varied URL formats
    ok 2 - accurately evaluates domain credibility tiers and scores
    ok 3 - detects heuristic stance (SUPPORTS, REFUTES, NEUTRAL)
    ok 4 - splits long content into distinct sentences
    ok 5 - extracts testable factual claims from sample text
    ok 6 - synthesizes claim verdict based on evidence stances
    ok 7 - accurately aggregates claims into overall article verdict
    ok 8 - validates URLs correctly
# pass 8
# fail 0
```

---

## 6. Pre-Seeded Demonstration Accounts & Cases

For live demonstrations and evaluator testing, DeepFact provides:

- **Demo Investigator Account:**
  - Email: `analyst@deepfact.ai`
  - Password: `password123`
  - Or click **"Instant Demo Analyst"** on `/login` to sign in with one click.
  - Or click **"Continue as Guest Investigator"**.

- **1-Click Test Presets (Available on `/verify`):**
  1. **Apollo Moon Landing Hoax** -> Refuted (NASA, Snopes, Reuters)
  2. **FDA CRISPR Gene-Editing Approval** -> Supported (FDA, Nature, AP)
  3. **Electric vs Diesel Emissions** -> Mixed (EPA, ICCT, Reuters)
  4. **WHO Global Sugar Ban Rumor** -> Misleading / Nuanced (WHO, Snopes)

---

## 7. Project Architecture

```
deepfact/
├── .data/                          # Persistent JSON database & seeded reports
│   └── deepfact-db.json
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # Server-side API endpoints
│   │   │   ├── auth/               # Login, register, session inspection
│   │   │   ├── extract-url/        # Live URL article scraping
│   │   │   ├── reports/            # Reports listing, retrieval, deletion
│   │   │   ├── stats/              # Analytics dashboard metrics
│   │   │   └── verify/             # Verification pipeline coordinator
│   │   ├── dashboard/              # Forensic intelligence dashboard
│   │   ├── login/                  # Investigator authentication portal
│   │   ├── reports/                # Archived dossiers explorer & detail view
│   │   ├── settings/               # System diagnostics & custom API keys
│   │   ├── verify/                 # Primary interactive verification workbench
│   │   ├── globals.css             # Cyberpunk dark theme & glassmorphic styles
│   │   ├── layout.tsx              # Root layout with 3D ambient glows
│   │   └── page.tsx                # Interactive 3D landing page
│   ├── components/
│   │   ├── 3d/                     # Three.js 3D Holographic Globe
│   │   ├── layout/                 # Navbar & Academic Disclaimer Footer
│   │   ├── providers/              # Theme & Auth React context providers
│   │   └── verification/           # Verdict banner, claim cards, reader, HUD
│   └── lib/
│       ├── ai/                     # Gemini client & heuristic verification engine
│       ├── search/                 # Tavily & DuckDuckGo multi-source search
│       ├── __tests__/              # Verification pipeline unit tests
│       ├── auth.ts                 # User authentication utilities
│       ├── credibility.ts          # Domain authority & reputation scorer
│       ├── db.ts                   # Data persistence & seed reports
│       ├── extractor.ts            # Article web scraper & paywall handler
│       ├── pipeline.ts             # End-to-end verification coordinator
│       └── types.ts                # TypeScript interfaces
├── .env.example                    # Environment variable template
├── package.json                    # Project metadata & scripts
├── tailwind.config.ts              # Custom cyber palette & glow shadows
└── tsconfig.json                   # TypeScript configuration
```

---

## 8. Responsible AI & Academic Disclaimer

DeepFact is an educational and academic investigative tool. While it uses multi-source RAG to minimize hallucinations and requires evidence tracing for every claim, automated systems assist human judgment rather than replacing it. Users should always review original citations directly.
