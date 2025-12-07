import { Request, Response } from 'express';
import { extractTextFromPdf } from '../lib/pdf';
import { extractProvidersFromText, resolveFieldWithGemini, scoreProviderRiskWithGemini, ConflictCandidate } from '../services/geminiService';
import * as providerService from '../services/providerService';

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = await extractTextFromPdf(req.file.buffer);
    const extractedProviders = await extractProvidersFromText(text);

    const results = [];
    for (const p of extractedProviders) {
      const id = await providerService.upsertProviderFromExtraction(p, req.file.originalname);
      results.push({ ...p, id });
    }

    res.json({ message: 'Extraction complete', count: results.length, providers: results });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getProviders = async (req: Request, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string,
      speciality: req.query.speciality as string,
      risk_level: req.query.risk_level as string,
    };
    const providers = await providerService.getAllProviders(filters);
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProviderDetail = async (req: Request, res: Response) => {
  try {
    const data = await providerService.getProviderById(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const validateProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { provider, sources } = await providerService.getProviderById(id);

    const fieldsToValidate = ['phone', 'address'];
    const updates = [];

    for (const field of fieldsToValidate) {
      // Gather candidates
      const candidates: ConflictCandidate[] = sources
        .filter(s => s.field === field)
        .map(s => ({
          value: s.value,
          source_type: s.source_type,
          reliability_score: s.reliability_score,
          seen_at: s.seen_at,
        }));

      // Add current value as a candidate (source: 'current_db')
      if (provider[field as keyof typeof provider]) {
        candidates.push({
          value: String(provider[field as keyof typeof provider]),
          source_type: 'current_db',
          reliability_score: provider.confidence_score,
          seen_at: provider.updated_at || provider.created_at,
        });
      }

      // Mock external API candidate (randomly add a variation to simulate conflict)
      if (Math.random() > 0.5) {
        candidates.push({
          value: field === 'phone' ? '555-0199' : '123 Mock St, Fake City',
          source_type: 'api',
          reliability_score: 0.9,
          seen_at: new Date().toISOString(),
        });
      }

      if (candidates.length > 1) {
        const resolution = await resolveFieldWithGemini(provider.full_name, field, candidates);
        
        if (resolution.final_value !== provider[field as keyof typeof provider]) {
          await providerService.updateProviderField(id, field, resolution.final_value, resolution.confidence, resolution.reason);
          updates.push({ field, ...resolution });
        }
      }
    }

    const updatedData = await providerService.getProviderById(id);
    res.json({ ...updatedData, updates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshAll = async (req: Request, res: Response) => {
  try {
    const providers = await providerService.getAllProviders(); // In real app, paginate
    const startTime = new Date();
    let updatesApplied = 0;

    // Limit to 10 for demo speed if needed, or do all
    const subset = providers.slice(0, 20); 

    for (const p of subset) {
      // Get change count
      const { changes } = await providerService.getProviderById(p.id);
      
      const features = {
        number_of_past_changes: changes.length,
        days_since_last_change: p.updated_at ? Math.floor((Date.now() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60 * 24)) : 30,
        speciality: p.speciality,
        region: 'Unknown', // Derive from address if possible
        status: p.status,
      };

      const risk = await scoreProviderRiskWithGemini(features);
      
      if (risk.risk_level !== p.risk_level || Math.abs(risk.risk_score - p.risk_score) > 0.1) {
        await providerService.updateProviderRisk(p.id, risk.risk_level, risk.risk_score);
        updatesApplied++;
      }
    }

    await providerService.createValidationRun({
      started_at: startTime.toISOString(),
      finished_at: new Date().toISOString(),
      num_providers_checked: subset.length,
      num_updates_applied: updatesApplied,
      accuracy_before: 0.85, // Mock
      accuracy_after: 0.92, // Mock
      notes: 'Automated risk refresh',
    });

    res.json({ message: 'Refresh complete', checked: subset.length, updates: updatesApplied });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await providerService.getDashboardMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
