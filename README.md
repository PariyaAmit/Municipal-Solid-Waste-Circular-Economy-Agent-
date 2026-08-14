# SmartWaste AI 🌿

> AI-powered Municipal Waste Management Platform — IBM Hackathon 2024

**Challenge: Municipal Solid Waste & Circular Economy — Urban Waste Management**

---

## Overview

SmartWaste AI is a production-quality, full-stack AI agent platform for municipal solid waste management. Built with **Next.js 16** (App Router) and powered by the **Groq LLM API (Llama 3.3 70B)**, it provides city officials, waste collectors, and citizens with an intelligent assistant for every aspect of urban waste management.

---

## Features

### 🤖 ChatGPT-Style AI Chat
- Natural language conversations with the Groq LLM (Llama 3.3 70B)
- Multilingual: **English, Hindi, and Gujarati**
- Persistent conversation history with rename/delete
- Copy, like/dislike, and regenerate responses
- Smooth streaming-style experience

### 🚛 Five Specialized AI Agents

| Agent | Purpose |
|---|---|
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
- Full complaint lifecycle: **New → Assigned → In Progress → Resolved**
- AI classification for each complaint
- Filter by ward, category, priority, and status
- Detailed complaint modal with AI routing info

### 🗺️ Route Optimization
- Interactive SVG route visualization
- Vehicle selection (4 demo vehicles)
- AI-generated optimization recommendations
- Collection stop progress tracking

### ♻️ Segregation Analytics
- Per-ward compliance percentages
- Donut charts for wet / dry / recyclable / mixed waste
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

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Groq API — Llama 3.3 70B |
| Markdown | react-markdown + remark-gfm |
| Icons | lucide-react |
| Storage | localStorage (client-side) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Groq API key** — get one at [console.groq.com](https://console.groq.com)

### Installation

```bash
# 1. Navigate into the project directory
cd smartwaste-ai

# 2. Install dependencies
npm install

# 3. Set your environment variables
#    Create or edit .env.local:
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# 4. Start the development server
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
smartwaste-ai/
├── .env.local                     # Environment variables (API keys)
├── next.config.ts                 # Next.js configuration
├── tailwind.config / postcss      # Tailwind CSS v4 setup
└── src/
    ├── app/
    │   ├── api/
    │   │   └── chat/
    │   │       └── route.ts       # Secure server-side Groq API route
    │   ├── globals.css            # Global styles + CSS variables
    │   ├── layout.tsx             # Root layout + metadata
    │   └── page.tsx               # App entry point
    ├── components/
    │   ├── AppShell.tsx           # Main app shell, routing, global state
    │   ├── Sidebar.tsx            # Collapsible sidebar + navigation
    │   ├── ChatWindow.tsx         # Main chat interface
    │   ├── ChatInput.tsx          # Input box with smart suggestions
    │   ├── MessageBubble.tsx      # Message rendering with Markdown
    │   ├── WelcomeScreen.tsx      # Empty state / onboarding screen
    │   ├── DashboardPage.tsx      # Municipal command center
    │   ├── GrievancesPage.tsx     # Complaint management table
    │   ├── RoutesPage.tsx         # Route optimization UI
    │   ├── SegregationPage.tsx    # Segregation compliance charts
    │   ├── AnalyticsPage.tsx      # Ward analytics dashboard
    │   └── SettingsPage.tsx       # Settings & configuration
    └── lib/
        ├── types.ts               # Shared TypeScript types
        ├── agents.ts              # AI agent definitions & system prompts
        ├── utils.ts               # Utility / helper functions
        ├── storage.ts             # localStorage persistence layer
        └── demo-data.ts           # Realistic demo data for all pages
```

---

## Security

| Check | Status |
|---|---|
| `GROQ_API_KEY` never exposed to the browser | ✅ |
| All LLM calls routed through `/api/chat` (server-side) | ✅ |
| Input validation on the API route | ✅ |
| Rate limit and error handling | ✅ |
| No sensitive data in localStorage | ✅ |

---

## Demo Mode

The application ships with full demo data for **4 municipal wards** (Ward 12, 15, 21, 28).  
All analytics, grievances, and route data is clearly labeled **DEMO DATA**.

Real municipal integrations (GIS maps, municipal APIs, citizen databases) can be connected by replacing the demo data layer in [`src/lib/demo-data.ts`](src/lib/demo-data.ts).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Create optimized production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## IBM Hackathon 2024

**Challenge:** Municipal Solid Waste & Circular Economy — Urban Waste Management

SmartWaste AI addresses:
- ✅ Collection efficiency through AI-optimized routing
- ✅ Citizen grievance resolution with multilingual intake
- ✅ Segregation compliance monitoring per ward
- ✅ Route optimization with real-time recommendations
- ✅ Ward-level intelligence and anomaly detection
- ✅ Multilingual accessibility (English, Hindi, Gujarati)
- ✅ Circular economy principles baked into agent prompts

---

## License

Private — IBM Hackathon submission.
