# SmartWaste AI 🌿

> AI-powered Municipal Waste Management Platform — IBM Hackathon 2024

**Municipal Solid Waste & Circular Economy — Urban Waste Management**

---

## Overview

SmartWaste AI is a production-quality, full-stack AI agent platform for municipal solid waste management. Built with Next.js 16 and powered by the Groq LLM API, it provides city officials, waste collectors, and citizens with an intelligent assistant for every aspect of urban waste management.

## Features

### 🤖 ChatGPT-Style AI Chat
- Natural language conversations with the Groq LLM (Llama 3.3 70B)
- Multilingual: English, Hindi, and Gujarati
- Conversation history with rename/delete
- Copy, like/dislike, and regenerate responses
- Smooth streaming-style experience

### 🚛 Five Specialized AI Agents
| Agent | Purpose |
|-------|---------|
| **Smart Assistant** | General waste management Q&A |
| **Route Optimization Agent** | AI-powered collection route planning |
| **Segregation Compliance Agent** | Household waste segregation monitoring |
| **Grievance Intake Agent** | Multilingual citizen complaint registration |
| **Municipal Routing Agent** | Auto-classify & route complaints to departments |
| **Ward Analytics Agent** | AI insights for municipal officers |

### 📊 Municipal Dashboard
- Ward-level KPI cards
- Real-time grievance tracking
- Quick action buttons
- Demo mode with realistic data

### 📋 Grievance Management
- Full complaint lifecycle (New → Assigned → In Progress → Resolved)
- AI classification for each complaint
- Filter by ward, category, priority, status
- Detailed complaint modal with AI routing info

### 🗺️ Route Optimization
- Interactive SVG route visualization
- Vehicle selection (4 demo vehicles)
- AI-generated optimization recommendations
- Collection stop progress tracking

### ♻️ Segregation Analytics
- Per-ward compliance percentages
- Donut charts for wet/dry/recyclable/mixed waste
- Weekly compliance trend table
- AI recommendations with language-specific nudges

### 📈 Ward Analytics
- Aggregated KPIs across all wards
- Daily collection bar charts
- Complaint category donut chart
- Ward performance comparison table
- AI anomaly detection and insights

### ⚙️ Settings
- Light / Dark / System theme
- Language: English / Hindi / Gujarati
- AI model selection (Groq models)
- Response style: concise / balanced / detailed
- Demo mode toggle
- Notifications toggle

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Groq API key (https://console.groq.com)

### Installation

```bash
# Navigate into project directory
cd smartwaste-ai

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit .env.local and add your Groq API key
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
  app/
    api/chat/route.ts     # Secure server-side Groq API route
    layout.tsx            # Root layout
    page.tsx              # Entry point
    globals.css           # Global styles + CSS variables
  components/
    AppShell.tsx          # Main app shell, routing, state
    Sidebar.tsx           # Collapsible sidebar with navigation
    ChatWindow.tsx        # Main chat interface
    ChatInput.tsx         # Input box with suggestions
    MessageBubble.tsx     # Message rendering with markdown
    WelcomeScreen.tsx     # Empty state / welcome
    DashboardPage.tsx     # Municipal command center
    GrievancesPage.tsx    # Complaint management table
    RoutesPage.tsx        # Route optimization UI
    SegregationPage.tsx   # Segregation compliance charts
    AnalyticsPage.tsx     # Ward analytics dashboard
    SettingsPage.tsx      # Settings & configuration
  lib/
    types.ts              # TypeScript types
    agents.ts             # AI agent definitions & system prompts
    utils.ts              # Utility functions
    storage.ts            # localStorage persistence
    demo-data.ts          # Realistic demo data for all pages
```

---

## Security

- ✅ `GROQ_API_KEY` is **never** exposed to the browser
- ✅ All LLM calls go through `/api/chat` — a secure server-side route
- ✅ Input validation on the API route
- ✅ Rate limit and error handling
- ✅ No sensitive data in localStorage (only conversation text and settings)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Groq API (Llama 3.3 70B) |
| Markdown | react-markdown + remark-gfm |
| Icons | lucide-react |
| Storage | localStorage (client) |

---

## Demo Mode

The application ships with full demo data for 4 municipal wards (Ward 12, 15, 21, 28).
All analytics, grievances, and route data is clearly labeled **DEMO DATA**.

Real municipal integrations (GIS maps, municipal APIs, citizen databases) can be connected by replacing the demo data layer in `src/lib/demo-data.ts`.

---

## IBM Hackathon 2024

Challenge: **Municipal Solid Waste & Circular Economy — Urban Waste Management**

SmartWaste AI addresses:
- Collection efficiency
- Citizen grievance resolution
- Segregation compliance
- Route optimization
- Ward-level intelligence
- Multilingual accessibility (English, Hindi, Gujarati)
- Circular economy principles
