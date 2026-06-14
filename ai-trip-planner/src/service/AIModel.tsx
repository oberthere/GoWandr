import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});
