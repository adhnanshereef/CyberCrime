<div align="center">
  <img src="public/favicon.png" alt="NCRP Logo" width="120" />
  
  # National Cyber Crime Reporting Portal 🛡️
  
  **A demo-grade, AI-powered Progressive Web App for filing and tracking cybercrime complaints in India.**  
  *Built for [Build What Moves India](https://buildwhatmovesindia.com).*

  <p align="center">
    <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

---

## 🌟 Overview

This portal provides citizens an accessible, multilingual way to report cybercrimes (financial fraud, crimes against women/children) with full AI assistance. Users can describe what happened using **voice or text** in any Indian language, and the system uses AI to analyze the complaint, generate contextual follow-up questions, verify identity documents, and produce a structured case report.

### ✨ Key Innovations
- 🎙️ **Voice-First Reporting** - Speak naturally in your own language; we translate and analyze it automatically.
- 🤖 **AI-Driven Dynamic Questions** - Follow-up questions are generated based on exactly what was said, bypassing rigid, frustrating forms.
- 🕵️ **Anonymous Reporting** - Complaints regarding crimes against women/children can be filed with zero personal info.
- 📱 **Fully Responsive** - Beautifully optimized for any screen, from a 320px mobile device to a 4K monitor.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Angular 22](https://angular.dev) (Standalone Components, Signals, Lazy-Loaded Routes) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com) with a custom earthy design palette |
| **Language** | TypeScript (Strict mode) |
| **Backend (BaaS)** | [Supabase](https://supabase.com) (Edge Functions, Environment Secrets) |
| **AI - Transcription** | [Sarvam AI](https://sarvam.ai) (\saaras:v3\ Speech-to-Text-Translate for Indian languages) |
| **AI - Analysis** | [Google Gemini](https://ai.google.dev) (Multi-model fallback: 3.7/3.6/3.5-flash) |
| **AI - ID Verification** | [Google Gemini Vision](https://ai.google.dev) (OCR on Government ID Images) |
| **Hosting** | [Vercel](https://vercel.com) (Frontend) + [Supabase](https://supabase.com) (Edge Functions) |
| **State Persistence**| Browser \localStorage\ (Draft complaints, session, submitted cases) |

---

## 🏗️ Architecture

### Frontend - Angular SPA

The app is a single-page application with fully **lazy-loaded routes**, meaning each screen is only downloaded when the user navigates to it, ensuring lightning-fast performance.

\\\	ext
src/app/
├── app.ts                  # Root component (Navbar, Route Outlet, Global Menus)
├── app.routes.ts           # Lazy-loaded route definitions
├── app.css                 # Global Tailwind + Custom Design Tokens (CSS Vars)
│
├── core/
│   ├── services/
│   │   ├── ai.service.ts              # HTTP client for Supabase Edge Functions
│   │   ├── complaint-state.service.ts # Global state: draft, login, localStorage persistence
│   │   ├── language.service.ts        # Active language signal & translations
│   │   └── ui-state.service.ts        # Global loading overlay state
│   ├── data/
│   │   └── contacts.ts                # Static Nodal Officer contact directory
│   └── config/
│       └── environments/              # Supabase URL/Key per environment
│
├── screens/
│   ├── home/               # Landing page - hero, learning corner, footer
│   ├── language-select/    # Pick UI language
│   ├── complaint-type/     # Women/Children vs Financial Fraud selector
│   ├── urgency/            # Emergency contact screen (Financial flow)
│   ├── login/              # OTP-based mobile login (Financial flow)
│   ├── what-happened/      # Voice recorder & text area (Core input step)
│   ├── dynamic-questions/  # AI-generated follow-up question flow
│   ├── basic-details/      # Name + address form
│   ├── verify-id/          # Upload government ID & AI OCR verification
│   ├── review/             # Full complaint summary before submission
│   ├── success/            # Submission confirmation with case ID
│   ├── track/              # Look up a submitted case by mobile number
│   └── contact/            # Searchable nodal officer contact directory
│
└── shared/
    └── components/
        └── audio-player/   # Reusable Web Audio API waveform visualizer
\\\

### 🛣️ User Flows

**💸 Financial Fraud Flow (with Login)**
> Home ➔ Language ➔ Complaint Type ➔ Urgency ➔ Login (OTP) ➔ What Happened ➔ AI Questions ➔ Basic Details ➔ Verify ID ➔ Review ➔ Success

**🛡️ Anonymous Flow (Women / Children)**
> Home ➔ (Navbar dropdown or Complaint Type) ➔ What Happened ➔ AI Questions ➔ Review ➔ Success

**🔍 Track Flow**
> Home ➔ Login (OTP) ➔ Track page (shows submitted cases)

---

### ☁️ Backend - Supabase Edge Functions (Deno)

Three serverless functions handle all AI communication. They run on Deno and keep API keys securely server-side.

\\\	ext
supabase/functions/
├── process-complaint/     # Main AI pipeline for voice/text complaint analysis
│   └── index.ts           # 1. Sarvam AI (STT + translate) ➔ 2. Gemini (Extract + Questions)
├── process-screenshot/    # Analyzes transaction screenshots
│   └── index.ts           # Gemini Vision ➔ UTR, Amount, Date, Bank Name
└── verify-id/             # Verifies government ID image
    └── index.ts           # Gemini Vision ➔ ID Type, Name Match
\\\

### 🧠 State Management

All state is managed through modern Angular **Signals** with reliable \localStorage\ persistence. The \ComplaintStateService\ acts as the single source of truth:

- \currentDraft\ - Holds the entire in-progress complaint (text, audio base64, AI analysis, answers, images).
- \currentUserMobile\ - The logged-in mobile number (or \'Anonymous'\).
- \updateDraft()\ - Merges partial updates and persists to \localStorage\ immediately, smartly initializing a draft if one doesn't exist.
- \login()\ - Sets the current user and seeds/loads their draft from \localStorage\.
- \saveAsSubmitted()\ - Moves the completed draft into a separate \
crc_submitted\ list.

---

## 🎨 Design System

The UI follows a custom earthy, premium design palette with warm neutral tones. All tokens are defined as CSS custom properties in \src/app/app.css\ and consumed via Tailwind utility classes.

| Token | Purpose | Preview |
|---|---|---|
| \--color-primary\ | Brand accent (warm brown) | 🟤 |
| \--color-background\| App background (off-white/cream) | ⚪ |
| \--color-surface\ | Card surfaces | ⬜ |
| \--color-border\ | Subtle dividers | 🔘 |
| \--color-urgent\ | Danger/alerts (muted red) | 🔴 |
| \--font-primary\ | DM Serif Display | *Headings* |
| \--font-sans\ | System sans-serif | Body Text |

---

## 🚀 Getting Started & Commands

### 1. Environment Setup

**Clone the repository**
\\\ash
git clone <repo-url>
cd CyberCrime
\\\

**Install dependencies**
\\\ash
npm install
\\\

**Configure environment variables**
Edit \src/environments/environment.ts\:
\\\	ypescript
export const environment = {
  production: false,
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseKey: 'YOUR_ANON_PUBLIC_KEY'
};
\\\

**Configure Supabase Edge Function secrets**
*(You must have the Supabase CLI installed)*
\\\ash
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set SARVAM_API_KEY=your_key
\\\

### 2. Development

\\\ash
# Start local dev server (hot reload)
npm start
# or
ng serve
\\\
Open [http://localhost:4200](http://localhost:4200) in your browser.

### 3. Build for Production

\\\ash
# Production build (optimised, output in dist/CyberCrime/)
npm run build
# or
ng build
\\\

### 4. Supabase Edge Functions

\\\ash
# Deploy all edge functions to your Supabase project
supabase functions deploy process-complaint
supabase functions deploy process-screenshot
supabase functions deploy verify-id

# Serve edge functions locally for testing
supabase functions serve
\\\

---

## 👨‍💻 Credits

Created by **Adhnan Shereef T** ([adhnan.me](https://adhnan.me)) for **Build What Moves India** ([buildwhatmovesindia.com](https://buildwhatmovesindia.com))

> ⚠️ **Disclaimer:** This is a **demo application**. It does not connect to any real government database or file actual police complaints. All data is stored locally in your browser.
