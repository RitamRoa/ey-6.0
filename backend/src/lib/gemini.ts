import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro'; // Default to a known model, user can override

if (!GEMINI_API_KEY) {
  console.warn('Missing GEMINI_API_KEY environment variable.');
}

interface CallGeminiOptions {
  systemPrompt: string;
  userContent: string | object;
}

export async function callGemini(options: CallGeminiOptions): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const userText = typeof options.userContent === 'string' 
    ? options.userContent 
    : JSON.stringify(options.userContent);

  const payload = {
    contents: [{
      role: 'user',
      parts: [{ text: `${options.systemPrompt}\n\n${userText}` }]
    }],
    generationConfig: {
      temperature: 0.2, // Low temperature for more deterministic output
    }
  };

  let lastError: any;
  const MAX_RETRIES = 3;
  const BASE_DELAY = 2000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const candidates = response.data.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
        return candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected Gemini response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Empty or unexpected response from Gemini');
      }
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error.response?.status === 429;
      const isNotFound = error.response?.status === 404;

      if (isNotFound) {
        console.error(`Model ${GEMINI_MODEL} not found. Please check GEMINI_MODEL in .env. Try 'gemini-pro' or 'gemini-1.5-flash'.`);
        break; // Don't retry on 404
      }
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY * attempt;
        console.warn(`Gemini API rate limit hit (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error('Error calling Gemini API:', error.response?.data || error.message);
      throw error;
    }
  }

  throw lastError;
}

export async function callGeminiJson<T>(options: CallGeminiOptions): Promise<T> {
  const rawText = await callGemini(options);
  
  // Clean up markdown code blocks if present
  const jsonString = rawText.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON from Gemini response:', rawText);
    throw new Error('Gemini response was not valid JSON');
  }
}
