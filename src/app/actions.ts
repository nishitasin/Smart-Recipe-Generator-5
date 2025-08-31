'use server';

import {
  recognizeIngredientsFromPhoto,
  type RecognizeIngredientsFromPhotoOutput,
} from '@/ai/flows/recognize-ingredients';
import {
  generateRecipe,
  type GenerateRecipeOutput,
} from '@/ai/flows/generate-recipe';
import { z } from 'zod';

const recognizeIngredientsActionSchema = z.object({
  photoDataUri: z.string().startsWith('data:image/'),
});

export async function recognizeIngredientsAction(values: {
  photoDataUri: string;
}): Promise<
  | { success: true; data: RecognizeIngredientsFromPhotoOutput }
  | { success: false; error: string }
> {
  const validatedFields = recognizeIngredientsActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid image format. Please upload a valid image.',
    };
  }

  try {
    const result = await recognizeIngredientsFromPhoto(validatedFields.data);
    if (!result.ingredients || result.ingredients.length === 0) {
      return {
        success: false,
        error:
          'No ingredients were recognized. Please try a clearer image.',
      };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to recognize ingredients. Please try another image.',
    };
  }
}

const generateRecipeActionSchema = z.object({
  ingredients: z.array(z.string()).min(1),
  dietaryPreferences: z.array(z.string()).optional(),
});

export async function generateRecipeAction(values: {
  ingredients: string[];
  dietaryPreferences?: string[];
}): Promise<
  | { success: true; data: GenerateRecipeOutput }
  | { success: false; error: string }
> {
  const validatedFields = generateRecipeActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input. At least one ingredient is required.',
    };
  }

  try {
    const result = await generateRecipe(validatedFields.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to generate a recipe. Please try again.',
    };
  }
}
