# SmartWrite - AI Communication Intelligence Platform

## Overview
SmartWrite is a production-grade AI writing assistant that goes beyond grammar checking. It predicts reader reactions, detects emotional risks, analyzes tone dynamics, and transforms writing communication using GPT-5-mini via Replit AI Integrations.

**Core Philosophy:** "Most tools check language. SmartWrite checks consequences."

## Recent Changes
- **Feb 7, 2026**: Initial MVP built with full AI analysis pipeline, modern editor interface, landing page, and all core features.

## Tech Stack
- **Frontend**: React 18 + TypeScript, Tailwind CSS, Shadcn UI components, Wouter routing
- **Backend**: Express.js + TypeScript
- **AI**: OpenAI GPT-5-mini via Replit AI Integrations (no API key needed)
- **Database**: PostgreSQL via Drizzle ORM
- **Theme**: Deep indigo/violet AI-native design with full dark/light mode

## Project Architecture

### Pages
- `/` - Landing page with feature showcase
- `/editor` - Main writing editor with AI analysis

### Key Features
1. Real-time grammar & spell checking with explanations
2. Tone detection & transformation (Professional/Casual/Friendly/Assertive/Persuasive)
3. Reader Reaction Predictor (Recruiter/Professor/Manager/Client/Teammate)
4. Intent vs Interpretation Analyzer
5. Writing Score Dashboard (Clarity/Grammar/Confidence/Engagement/Professionalism/Readability)
6. Mistake Explanation Engine
7. Readability & Complexity Analyzer
8. Power Dynamics Detector
9. Emotional/Regret Detection
10. Audience Targeting Mode
11. Paraphrasing & Summarization
12. AI Chat Sidebar for brainstorming

### API Endpoints
- `POST /api/ai/analyze` - Full writing analysis
- `POST /api/ai/reactions` - Reader reaction predictions
- `POST /api/ai/transform-tone` - Tone transformation
- `POST /api/ai/paraphrase` - Text paraphrasing
- `POST /api/ai/summarize` - Text summarization
- `POST /api/ai/chat` - Streaming AI chat

### File Structure
- `client/src/pages/` - Page components (landing, editor)
- `client/src/components/` - Reusable UI components
- `client/src/hooks/` - Custom hooks (use-analysis, use-toast)
- `client/src/lib/` - Utilities and types
- `server/` - Express routes, storage, AI prompts
- `shared/` - Shared schema and types

## User Preferences
- Dark mode by default
- Deep indigo/violet theme for AI-native feel
