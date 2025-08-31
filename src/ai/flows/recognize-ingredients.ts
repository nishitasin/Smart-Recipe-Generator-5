'use server';

/**
 * @fileOverview Recognizes ingredients from a photo.
 *
 * - recognizeIngredientsFromPhoto - A function that handles the ingredient recognition process.
 * - RecognizeIngredientsFromPhotoInput - The input type for the recognizeIngredientsFromPhoto function.
 * - RecognizeIngredientsFromPhotoOutput - The return type for the recognizeIngredientsFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeIngredientsFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeIngredientsFromPhotoInput = z.infer<typeof RecognizeIngredientsFromPhotoInputSchema>;

const RecognizeIngredientsFromPhotoOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients recognized in the photo.'),
});
export type RecognizeIngredientsFromPhotoOutput = z.infer<typeof RecognizeIngredientsFromPhotoOutputSchema>;

export async function recognizeIngredientsFromPhoto(input: RecognizeIngredientsFromPhotoInput): Promise<RecognizeIngredientsFromPhotoOutput> {
  return recognizeIngredientsFromPhotoFlow(input);
}

const recognizeIngredientsFromPhotoPrompt = ai.definePrompt({
  name: 'recognizeIngredientsFromPhotoPrompt',
  input: {schema: RecognizeIngredientsFromPhotoInputSchema},
  output: {schema: RecognizeIngredientsFromPhotoOutputSchema},
  prompt: `You are a highly skilled chef. Your task is to identify the ingredients in the photo.

  List the ingredients that you identify.

  Photo: {{media url=photoDataUri}}`,
});

const recognizeIngredientsFromPhotoFlow = ai.defineFlow(
  {
    name: 'recognizeIngredientsFromPhotoFlow',
    inputSchema: RecognizeIngredientsFromPhotoInputSchema,
    outputSchema: RecognizeIngredientsFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await recognizeIngredientsFromPhotoPrompt(input);
    return output!;
  }
);
