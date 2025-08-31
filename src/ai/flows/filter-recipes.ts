'use server';

/**
 * @fileOverview Filters recipe suggestions based on dietary preferences.
 *
 * - filterRecipesByPreferences - A function that filters recipes based on user preferences.
 * - FilterRecipesByPreferencesInput - The input type for the filterRecipesByPreferences function.
 * - FilterRecipesByPreferencesOutput - The return type for the filterRecipesByPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterRecipesByPreferencesInputSchema = z.object({
  recipes: z.array(z.string()).describe('An array of recipe suggestions.'),
  dietaryPreferences: z
    .array(z.string())
    .describe('An array of dietary preferences (e.g., vegetarian, gluten-free).'),
});
export type FilterRecipesByPreferencesInput = z.infer<
  typeof FilterRecipesByPreferencesInputSchema
>;

const FilterRecipesByPreferencesOutputSchema = z.array(z.string()).describe(
  'An array of recipe suggestions filtered by dietary preferences.'
);
export type FilterRecipesByPreferencesOutput = z.infer<
  typeof FilterRecipesByPreferencesOutputSchema
>;

export async function filterRecipesByPreferences(
  input: FilterRecipesByPreferencesInput
): Promise<FilterRecipesByPreferencesOutput> {
  return filterRecipesByPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterRecipesByPreferencesPrompt',
  input: {schema: FilterRecipesByPreferencesInputSchema},
  output: {schema: FilterRecipesByPreferencesOutputSchema},
  prompt: `You are a recipe filter that filters recipes based on dietary preferences.

  You will receive an array of recipe suggestions and an array of dietary preferences.
  You will return an array of recipe suggestions that match the dietary preferences.

  Recipes:
  {{#each recipes}}- {{{this}}}\n{{/each}}

  Dietary Preferences:
  {{#each dietaryPreferences}}- {{{this}}}\n{{/each}}

  Filtered Recipes:`,
});

const filterRecipesByPreferencesFlow = ai.defineFlow(
  {
    name: 'filterRecipesByPreferencesFlow',
    inputSchema: FilterRecipesByPreferencesInputSchema,
    outputSchema: FilterRecipesByPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
