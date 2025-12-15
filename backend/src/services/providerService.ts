import { supabase } from '../lib/supabase';
import { Provider, ProviderSource, ChangeLogEntry, ValidationRun } from '../types/db';
import { ExtractedProvider } from './geminiService';

export async function getAllProviders(filters?: { search?: string; speciality?: string; risk_level?: string }) {
  let query = supabase.from('providers').select('*');

  if (filters?.search) {
    query = query.ilike('full_name', `%${filters.search}%`);
  }
  if (filters?.speciality) {
    query = query.eq('speciality', filters.speciality);
  }
  if (filters?.risk_level) {
    query = query.eq('risk_level', filters.risk_level);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Provider[];
}

export async function getProviderById(id: string) {
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('id', id)
    .single();

  if (providerError) throw providerError;

  const { data: sources, error: sourcesError } = await supabase
    .from('provider_sources')
    .select('*')
    .eq('provider_id', id);

  if (sourcesError) throw sourcesError;

  const { data: changes, error: changesError } = await supabase
    .from('change_logs')
    .select('*')
    .eq('provider_id', id)
    .order('created_at', { ascending: false });

  if (changesError) throw changesError;

  return {
    provider: provider as Provider,
    sources: sources as ProviderSource[],
    changes: changes as ChangeLogEntry[],
  };
}

export async function upsertProviderFromExtraction(extracted: ExtractedProvider, sourceDetail: string) {
  // 1. Check if provider exists (simple check by name + license or name + address)
  // For hackathon, let's just check by full_name to keep it simple, or full_name + license if available
  let matchQuery = supabase.from('providers').select('id').eq('full_name', extracted.full_name);
  
  if (extracted.license_id) {
    matchQuery = matchQuery.eq('license_id', extracted.license_id);
  }

  const { data: existing } = await matchQuery.maybeSingle();

  let providerId: string;

  if (existing) {
    providerId = existing.id;
    // Optionally update fields if confidence is higher? For now, we just add a source.
  } else {
    // Insert new provider
    const { data: newProvider, error } = await supabase
      .from('providers')
      .insert({
        full_name: extracted.full_name,
        speciality: extracted.speciality,
        phone: extracted.phone,
        address: extracted.address,
        license_id: extracted.license_id,
        status: 'active',
        confidence_score: extracted.extraction_confidence,
        risk_score: 0.5, // Default
        risk_level: 'medium', // Default
      })
      .select()
      .single();

    if (error) throw error;
    providerId = newProvider.id;
  }

  // 2. Insert provider_sources
  const sourcesToInsert = [
    {
      provider_id: providerId,
      field: 'phone',
      value: extracted.phone,
      source_type: 'pdf',
      source_detail: sourceDetail,
      reliability_score: extracted.extraction_confidence,
      seen_at: new Date().toISOString(),
    },
    {
      provider_id: providerId,
      field: 'address',
      value: extracted.address,
      source_type: 'pdf',
      source_detail: sourceDetail,
      reliability_score: extracted.extraction_confidence,
      seen_at: new Date().toISOString(),
    }
  ];

  const { error: sourceError } = await supabase.from('provider_sources').insert(sourcesToInsert);
  if (sourceError) throw sourceError;

  return providerId;
}

export async function updateProviderField(
  providerId: string,
  field: string,
  newValue: string,
  confidence: number,
  reason: string
) {
  // Get old value for log
  const { data: oldProvider } = await supabase.from('providers').select(field).eq('id', providerId).single();
  const oldValue = oldProvider ? oldProvider[field as keyof typeof oldProvider] : null;

  if (oldValue === newValue) return; // No change

  // Update provider
  const { error: updateError } = await supabase
    .from('providers')
    .update({
      [field]: newValue,
      confidence_score: confidence,
      updated_at: new Date().toISOString(),
    })
    .eq('id', providerId);

  if (updateError) throw updateError;

  // Log change
  const { error: logError } = await supabase.from('change_logs').insert({
    provider_id: providerId,
    field,
    old_value: String(oldValue),
    new_value: newValue,
    change_type: 'auto',
    reason,
  });

  if (logError) throw logError;
}

export async function updateProviderRisk(providerId: string, riskLevel: string, riskScore: number) {
  const { error } = await supabase
    .from('providers')
    .update({
      risk_level: riskLevel,
      risk_score: riskScore,
      updated_at: new Date().toISOString(),
    })
    .eq('id', providerId);
  
  if (error) throw error;
}

export async function createValidationRun(runData: Partial<ValidationRun>) {
  const { error } = await supabase.from('validation_runs').insert({
    ...runData,
    started_at: runData.started_at || new Date().toISOString(),
  });
  if (error) throw error;
}

export async function getDashboardMetrics() {
  const { count: totalProviders } = await supabase.from('providers').select('*', { count: 'exact', head: true });
  
  const { count: highRisk } = await supabase
    .from('providers')
    .select('*', { count: 'exact', head: true })
    .eq('risk_level', 'high');

  const { count: lowConfidence } = await supabase
    .from('providers')
    .select('*', { count: 'exact', head: true })
    .lt('confidence_score', 0.7);

  const { data: recentRuns } = await supabase
    .from('validation_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(5);

  // Calculate average accuracy from recent runs
  let avgAccuracy = 0;
  if (recentRuns && recentRuns.length > 0) {
    const sum = recentRuns.reduce((acc, run) => acc + (run.accuracy_after || 0), 0);
    avgAccuracy = sum / recentRuns.length;
  }

  return {
    total_providers: totalProviders || 0,
    num_high_risk: highRisk || 0,
    num_low_confidence: lowConfidence || 0,
    recent_validation_runs: recentRuns || [],
    avg_accuracy: avgAccuracy,
  };
}
