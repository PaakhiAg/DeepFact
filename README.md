# DeepFact — Retrieval-Augmented Fake News Detection & Verification
 
<p align="center">
  <strong>Verify the story. Examine the evidence. Discover the facts.</strong>
</p>

<p align="center">
  An intelligent fact-checking platform that analyzes complete news articles, extracts individual claims, retrieves supporting evidence, and generates transparent verification reports using Retrieval-Augmented Generation (RAG).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?logo=threedotjs" />
  <img src="https://img.shields.io/badge/AI-RAG-purple" />
</p>

**✨ Overview**

DeepFact is a Retrieval-Augmented Generation (RAG) based fake news detection and verification system designed to go beyond headline-level classification.

Instead of simply labeling an article as real or fake, DeepFact examines its content, identifies individual factual claims, searches for relevant evidence, and evaluates the credibility and relevance of retrieved sources.

Its goal is to make news verification more transparent, evidence-based, and understandable.

## 🚀 Key Features

- **📰 Full Article Verification:** Analyzes complete news articles through URLs or pasted text instead of relying only on headlines.

- **🎯 Intelligent Claim Extraction:** Identifies and separates individual factual claims from the submitted content for detailed verification.

- **🔎 Real-Time Evidence Retrieval:** Searches multiple online sources to gather relevant information and supporting evidence for each claim.

- **🛡️ Source Credibility Assessment:** Evaluates the reliability of retrieved sources using domain credibility scoring and source reputation.

- **⚖️ Claim-Level Fact-Checking:** Classifies evidence as supporting, refuting, or neutral to provide more detailed verification results.

- **📊 Interactive Intelligence Dashboard:** Displays verification statistics, report history, and analytical insights.

- **🌐 3D Interactive Visualizations:** Features animated 3D graphics and WebGL elements for an engaging user experience.

- **📄 Detailed Verification Reports:** Presents overall verdicts, individual claim assessments, evidence references, and explanations.

- **📥 Report Export:** Allows users to export verification results in Markdown and printable formats.

---

## ⚙️ How DeepFact Works

DeepFact follows a multi-stage Retrieval-Augmented Generation (RAG) verification pipeline:

1. **Content Extraction:** Extracts readable content from news URLs or user-submitted text.
2. **Claim Identification:** Breaks the article into individual factual claims that can be independently verified.
3. **Evidence Retrieval:** Searches available online sources for relevant supporting or contradicting information.
4. **Source Credibility Assessment:** Evaluates the reliability of retrieved sources.
5. **Claim Verification:** Compares claims against retrieved evidence and identifies supporting, refuting, or neutral information.
6. **Verdict Generation:** Generates an overall assessment with claim-level results, evidence references, and explanations.

---

## 🧰 Technology Stack

**Frontend & User Interface**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

**AI & Evidence Retrieval**
- Google Gemini API
- Retrieval-Augmented Generation (RAG)
- Tavily Search API
- DuckDuckGo Search

**Backend & Visualization**
- Next.js API Routes
- Three.js
- WebGL
- JSON-based Local Database

---

## 💻 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or later
- npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/PaakhiAg/DeepFact.git
```

**2. Navigate to the project directory**

```bash
cd DeepFact
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file using `.env.example` as a reference.

Add the required API keys:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Keep your API keys private. Never commit `.env.local` to GitHub.

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application**

Visit:

[http://localhost:3000](http://localhost:3000)

---

## 🎯 Project Objective

The objective of DeepFact is to make online information verification more transparent and evidence-based.

By analyzing complete articles, extracting individual claims, retrieving relevant evidence, and assessing source credibility, DeepFact helps users understand not just whether information may be misleading, but also why.

---

## ⚠️ Disclaimer

DeepFact is an academic project developed for educational and research purposes. Its automated verification results should not replace independent fact-checking or human judgment. Users are encouraged to review the original evidence and sources before drawing conclusions.

---

<p align="center">

  **DeepFact — Verify Beyond the Headline.**

  *Developed as a Final-Year Major Project.*

</p>