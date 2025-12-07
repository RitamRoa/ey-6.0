export interface Provider {
  id: string;
  full_name: string;
  speciality: string;
  phone: string;
  address: string;
  license_id: string | null;
  status: 'active' | 'inactive' | 'unknown';
  confidence_score: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface ProviderSource {
  id: string;
  provider_id: string;
  field: string;
  value: string;
  source_type: 'pdf' | 'website' | 'api' | 'user_report';
  source_detail: string | null;
  reliability_score: number;
  seen_at: string;
}

export interface ChangeLogEntry {
  id: string;
  provider_id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  change_type: 'auto' | 'manual';
  reason: string | null;
  created_at: string;
}

export interface ValidationRun {
  id: string;
  started_at: string;
  finished_at: string | null;
  num_providers_checked: number;
  num_updates_applied: number;
  accuracy_before: number;
  accuracy_after: number;
  notes: string | null;
}
