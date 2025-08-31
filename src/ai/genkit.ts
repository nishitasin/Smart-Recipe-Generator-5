import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Function to get a random API key from a comma-separated string
const getRandomApiKey = (): string | undefined => {
  const apiKeysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;

  if (!apiKeysString) {
    console.warn(
      'No GEMINI_API_KEYS or GEMINI_API_KEY found in environment variables.'
    );
    return undefined;
  }

  const apiKeys = apiKeysString.split(',').filter(key => key.trim() !== '');

  if (apiKeys.length === 0) {
    console.warn('API key environment variable is empty.');
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex];
};


export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getRandomApiKey(),
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
