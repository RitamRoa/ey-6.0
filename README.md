# NeuroGrid 

**The Self-Healing Provider Directory for Modern Healthcare.**

> *Data decay is a silent killer in healthcare operations. NeuroGrid stops it.*

NeuroGrid is a system designed to keep healthcare provider directories accurate and up-to-date. It acts as a "self-healing" layer that continuously verifies provider data against external sources, resolves conflicts using AI, and flags high-risk discrepancies before they impact patient care or claims processing.

---

## Key Features

*   **Risk Scoring**: Automatically assigns risk levels to providers based on data staleness and verification failures.
*   **TruthLens™**: Our AI engine (powered by Gemini) that resolves conflicts between multiple data sources (e.g., PDF rosters vs. websites) to find the "single source of truth". 
*   **Instant Sync**: Real-time updates.
*   **Smart Ingestion**: Upload provider rosters (PDF/CSV) and let the system extract and merge the data automatically.
---

## Tech Stack

We built NeuroGrid with a focus on speed, reliability, and developer experience.

*   **Frontend**: React, Vite, Tailwind CSS.
*   **Backend**: Node.js, Express, TypeScript.
*   **Database**: Supabase (PostgreSQL).
*   **AI/ML**: Google Gemini API (for data extraction and validation).

---

## Getting Started

Follow the below steps.

### Prerequisites

*   Node.js (v18+)
*   npm install 
*   A Supabase project (for the database)
*   A Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/RitamRoa/ey-6.0.git
cd ey-neurogrid
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file 
cp .env.example .env -> the below is a mock .env file 
# Fill in your SUPABASE_URL, SUPABASE_KEY, and GEMINI_API_KEY in .env

# Start the server
npm run dev
```
## 👥 Team

**Made with ❤️ by Team NeuroGrid**

---

*NeuroGrid was built to solve real problems in provider data management. If you find this useful, give us a star! ⭐️*
