# NeuroGrid 🧠

**The Self-Healing Provider Directory for Modern Healthcare.**

> *Data decay is a silent killer in healthcare operations. NeuroGrid stops it.*

NeuroGrid is an intelligent, automated system designed to keep healthcare provider directories accurate, up-to-date, and compliant. It acts as a "self-healing" layer that continuously verifies provider data against external sources, resolves conflicts using AI, and flags high-risk discrepancies before they impact patient care or claims processing.

---

## ✨ Key Features

*   **🛡️ Risk Scoring**: Automatically assigns risk levels to providers based on data staleness and verification failures.
*   **👁️ TruthLens™**: Our AI engine (powered by Gemini) that resolves conflicts between multiple data sources (e.g., PDF rosters vs. websites) to find the "single source of truth."
*   **⚡ Instant Sync**: Real-time updates across the network.
*   **📄 Smart Ingestion**: Upload provider rosters (PDF/CSV) and let the system extract, validate, and merge the data automatically.
*   **📊 Insightful Dashboard**: A clean, dark-mode interface to monitor network health, validation accuracy, and recent changes.

---

## 🛠️ Tech Stack

We built NeuroGrid with a focus on speed, reliability, and developer experience.

*   **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons.
*   **Backend**: Node.js, Express, TypeScript.
*   **Database**: Supabase (PostgreSQL).
*   **AI/ML**: Google Gemini API (for intelligent data extraction and validation).

---

## 🚀 Getting Started

Follow these steps to get NeuroGrid running locally.

### Prerequisites

*   Node.js (v18+)
*   npm or yarn
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

# Create a .env file
cp .env.example .env
# Fill in your SUPABASE_URL, SUPABASE_KEY, and GEMINI_API_KEY in .env

# Start the server
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` (or the port shown in your terminal) to launch the application.

---

## 👥 Team

**Made with ❤️ by Team NeuroGrid**

---

*NeuroGrid was built to solve real problems in provider data management. If you find this useful, give us a star! ⭐️*
