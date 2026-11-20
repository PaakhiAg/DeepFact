# DeepFact – Retrieval-Augmented Fake News Detection & Verification

DeepFact is an AI-powered fake news detection and verification platform that analyzes complete news articles, extracts individual factual claims, retrieves supporting evidence from online sources, and generates transparent verification reports.

## Features

- **Full Article Analysis:** Analyze complete news articles, URLs, and pasted text.
- **Claim Extraction:** Break articles into individual verifiable factual claims.
- **Evidence Retrieval:** Retrieve relevant information from multiple online sources.
- **Credibility Assessment:** Evaluate source reliability using domain credibility scoring.
- **Claim Verification:** Classify evidence as supporting, refuting, or neutral.
- **Transparent Reports:** Generate claim-level verdicts with evidence and source references.
- **Interactive Dashboard:** View verification statistics and previous reports.
- **3D Visualizations:** Interactive 3D graphics and animated interface.
- **Report Export:** Export verification results in Markdown and printable formats.

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, WebGL
- **AI Integration:** Google Gemini API
- **Search:** Tavily Search API, DuckDuckGo
- **Backend:** Next.js API Routes
- **Data Storage:** JSON-based local database

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PaakhiAg/DeepFact.git
   ```

2. Navigate to the project directory:

   ```bash
   cd DeepFact
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file using `.env.example` as a reference and configure the required API keys.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Purpose

DeepFact aims to make online information verification more transparent by examining individual claims rather than relying only on headlines or overall article summaries. It presents retrieved evidence and source references to help users make more informed judgments.

## Disclaimer

DeepFact is an academic project developed for educational and research purposes. Its automated verification results should not replace independent fact-checking or human judgment.

---