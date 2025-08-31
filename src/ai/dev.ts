import { config } from 'dotenv';
config();

import '@/ai/flows/recognize-ingredients.ts';
import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/filter-recipes.ts';