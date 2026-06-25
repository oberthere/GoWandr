import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);

// Full Flash (not Flash-Lite) for coherent multi-day planning. Flash-Lite is
// faster but produces noticeably thinner itineraries.
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// `thinkingConfig` isn't in this SDK's types yet, but the API accepts it and the
// SDK forwards generationConfig as-is. thinkingBudget is the speed/quality dial:
// 0 = fastest but less reasoned, higher = smarter but slower.
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  thinkingConfig: { thinkingBudget: 2048 },
} as GenerationConfig;

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});
