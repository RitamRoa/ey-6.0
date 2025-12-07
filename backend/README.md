# NeuroGrid Backend

## Deployment on Vercel

This repository is a monorepo containing both the Backend (Express) and Frontend (React/Vite). You should deploy them as **two separate projects** on Vercel.

### 1. Deploying the Backend
1.  **Import Project**: Select the `backend` folder as the root directory.
2.  **Framework Preset**: Select **Other** (or leave default).
3.  **Environment Variables**:
    *   `SUPABASE_URL`: (From your Supabase Project Settings)
    *   `SUPABASE_SERVICE_ROLE_KEY`: (From your Supabase Project Settings)
    *   `GEMINI_API_KEY`: (Your Google AI Studio Key)
    *   `GEMINI_MODEL`: `gemini-flash-latest`
    *   `NODE_ENV`: `production`

### 2. Deploying the Frontend
1.  **Import Project**: Select the `frontend` folder as the root directory.
2.  **Framework Preset**: Vercel should automatically detect **Vite**.
3.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://your-backend-project.vercel.app/api`)
    *   *Note: You will need to deploy the backend first to get this URL, or assign a domain beforehand.*

### 3. Database Setup
Ensure you have run the `schema.sql` in your Supabase SQL Editor to create the necessary tables.

