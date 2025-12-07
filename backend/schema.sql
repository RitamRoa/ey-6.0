-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create providers table
create table if not exists public.providers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  speciality text,
  phone text,
  address text,
  license_id text,
  status text check (status in ('active', 'inactive', 'unknown')) default 'unknown',
  confidence_score float default 0,
  risk_score float default 0,
  risk_level text check (risk_level in ('low', 'medium', 'high')) default 'low',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create provider_sources table
create table if not exists public.provider_sources (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade,
  field text not null,
  value text,
  source_type text check (source_type in ('pdf', 'website', 'api', 'user_report')),
  source_detail text,
  reliability_score float default 0,
  seen_at timestamptz default now()
);

-- Create change_logs table
create table if not exists public.change_logs (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade,
  field text not null,
  old_value text,
  new_value text,
  change_type text check (change_type in ('auto', 'manual')),
  reason text,
  created_at timestamptz default now()
);

-- Create validation_runs table
create table if not exists public.validation_runs (
  id uuid default uuid_generate_v4() primary key,
  started_at timestamptz default now(),
  finished_at timestamptz,
  num_providers_checked int default 0,
  num_updates_applied int default 0,
  accuracy_before float,
  accuracy_after float,
  notes text
);

-- Enable Row Level Security (RLS)
alter table public.providers enable row level security;
alter table public.provider_sources enable row level security;
alter table public.change_logs enable row level security;
alter table public.validation_runs enable row level security;

-- Create policies (allow all access for service role, public read for now)
create policy "Allow public read access" on public.providers for select using (true);
create policy "Allow public read access" on public.provider_sources for select using (true);
create policy "Allow public read access" on public.change_logs for select using (true);
create policy "Allow public read access" on public.validation_runs for select using (true);

-- Allow anon insert/update/delete for hackathon demo purposes
create policy "Allow anon all" on public.providers for all using (true) with check (true);
create policy "Allow anon all" on public.provider_sources for all using (true) with check (true);
create policy "Allow anon all" on public.change_logs for all using (true) with check (true);
create policy "Allow anon all" on public.validation_runs for all using (true) with check (true);

-- Allow insert/update/delete for authenticated users (or service role which bypasses RLS)
-- For simplicity in this hackathon setup, we might want to allow anon insert if needed, 
-- but usually the backend uses the service role key which bypasses RLS.
