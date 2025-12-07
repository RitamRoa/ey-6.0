# NeuroGrid Backend

## Setup

1.  **Environment Variables**: Ensure `.env` is configured with:
    *   `SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY` (Note: Ensure this is the Service Role Key for full access, or the Anon Key if RLS policies allow it)
    *   `GEMINI_API_KEY`
    *   `GEMINI_MODEL` (e.g., `gemini-flash-latest`)

2.  **Database Setup**:
    *   The application requires specific tables in your Supabase project.
    *   Copy the contents of `schema.sql` in this directory.
    *   Go to your Supabase Dashboard -> SQL Editor.
    *   Paste the SQL and run it to create the tables and policies.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
