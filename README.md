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

**🚀 Key Features**

Feature

Description

📰 Full Article Analysis

Analyze complete articles through URLs or pasted text.

🎯 Claim Extraction

Identify individual factual statements for verification.

🔎 Evidence Retrieval

Retrieve relevant evidence from online sources.

🛡️ Source Credibility

Assess the reliability of information sources.

⚖️ Claim Verification

Classify evidence as supporting, refuting, or neutral.

📊 Intelligence Dashboard

Explore verification statistics and reports.

🌐 3D Visualizations

Interactive 3D graphics and animated interface.

📄 Report Export

Export verification results in Markdown and printable formats.

**⚙️ How It Works**

DeepFact follows a multi-stage verification pipeline:

Content Extraction – Reads news articles from URLs or user-provided text.

Claim Identification – Breaks the content into individual verifiable claims.

Evidence Retrieval – Searches for relevant information across available sources.

Credibility Assessment – Evaluates source reliability and evidence relevance.

Verification & Reporting – Generates claim-level verdicts with supporting evidence and references.

**🧰 Technology Stack**

Frontend & UI

Next.js 14

React 18

TypeScript

Tailwind CSS

AI & Information Retrieval

Google Gemini API

Retrieval-Augmented Generation (RAG)

Tavily Search API

DuckDuckGo Search

Graphics & Backend

Three.js

WebGL

Next.js API Routes

JSON-based Local Storage

**💻 Getting Started**

Prerequisites

Node.js 18 or later

npm

Installation

1. Clone the repository

git clone https://github.com/PaakhiAg/DeepFact.git

2. Navigate to the project

cd DeepFact

3. Install dependencies

npm install

4. Configure environment variables

Create a .env.local file using .env.example as a reference and add your API keys where required.

5. Start the development server

npm run dev

6. Open the application

Visit http://localhost:3000.

**🎯 Project Objective**

The primary objective of DeepFact is to improve the transparency of online information verification by analyzing complete articles rather than relying exclusively on headlines or summaries.

By combining AI-assisted claim extraction, evidence retrieval, and source credibility assessment, the platform helps users examine information and make more informed decisions.

**⚠️ Disclaimer**

DeepFact is developed as a final-year academic project for educational and research purposes. Automated verification results should be reviewed alongside the original evidence and independent fact-checking.

<p align="center">
  <strong>DeepFact — Verify Beyond the Headline.</strong>
  <br/>
  Developed as a Final-Year Major Project.
</p>