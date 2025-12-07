import { callGeminiJson } from '../lib/gemini';
import { Provider } from '../types/db';

const EXTRACT_PROVIDERS_PROMPT = `
You are an information extraction engine for healthcare provider directories.
Given raw directory text, extract a list of providers.
For each provider, return:
- full_name
- speciality
- phone
- address
- license_id (if available)
- source_page (if you can infer from the text; else null)
- extraction_confidence (0 to 1)

Output ONLY valid JSON of shape:
{ "providers": [ ... ] }
`;

const TRUTHLENS_PROMPT = `
You are resolving conflicting contact details for a healthcare provider.
You are given the provider identity and multiple candidate values for a specific field.
Each candidate has:
  - value (string)
  - source_type (pdf/website/api/user_report)
  - reliability_score (0–1)
  - seen_at (timestamp string)

Choose the single best final_value and provide:
  - final_value
  - confidence (0–1)
  - reason (short text)

Return ONLY valid JSON:
  { "final_value": "...", "confidence": 0.0-1.0, "reason": "..." }
`;

const RISK_SCORING_PROMPT = `
You are estimating how likely it is that a provider’s contact details will change in the next 6 months.
You are given a small JSON object with:
  - number_of_past_changes
  - days_since_last_change
  - speciality
  - region
  - status

Return risk_level: 'low' | 'medium' | 'high' and risk_score (0–1).
Output ONLY:
  { "risk_level": "...", "risk_score": 0.0-1.0 }
`;

export interface ExtractedProvider {
  full_name: string;
  speciality: string;
  phone: string;
  address: string;
  license_id: string | null;
  source_page: number | null;
  extraction_confidence: number;
}

export async function extractProvidersFromText(text: string): Promise<ExtractedProvider[]> {
  try {
    const response = await callGeminiJson<{ providers: ExtractedProvider[] }>({
      systemPrompt: EXTRACT_PROVIDERS_PROMPT,
      userContent: text,
    });
    return response.providers || [];
  } catch (error) {
    console.error('Error extracting providers:', error);
    return [];
  }
}

export interface ConflictCandidate {
  value: string;
  source_type: string;
  reliability_score: number;
  seen_at: string;
}

export interface ConflictResolutionResult {
  final_value: string;
  confidence: number;
  reason: string;
}

export async function resolveFieldWithGemini(
  providerName: string,
  field: string,
  candidates: ConflictCandidate[]
): Promise<ConflictResolutionResult> {
  const userContent = {
    provider: providerName,
    field: field,
    candidates: candidates,
  };

  return callGeminiJson<ConflictResolutionResult>({
    systemPrompt: TRUTHLENS_PROMPT,
    userContent: userContent,
  });
}

export interface RiskFeatures {
  number_of_past_changes: number;
  days_since_last_change: number;
  speciality: string;
  region: string;
  status: string;
}

export interface RiskScoreResult {
  risk_level: 'low' | 'medium' | 'high';
  risk_score: number;
}

export async function scoreProviderRiskWithGemini(features: RiskFeatures): Promise<RiskScoreResult> {
  return callGeminiJson<RiskScoreResult>({
    systemPrompt: RISK_SCORING_PROMPT,
    userContent: features,
  });
}
