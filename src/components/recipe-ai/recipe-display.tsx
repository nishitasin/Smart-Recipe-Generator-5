"use client";

import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RecipeRating } from './recipe-rating';
import { Utensils } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: GenerateRecipeOutput;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const instructionSteps = recipe.instructions
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0);

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-headline">
          <Utensils className="h-8 w-8 text-primary" />
          {recipe.recipeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-headline mb-3">Ingredients</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 list-disc list-inside text-foreground/80">
            {recipe.ingredientsList.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <h3 className="text-xl font-bold font-headline mb-3">Instructions</h3>
          <ol className="list-decimal list-inside space-y-3">
            {instructionSteps.map((step, index) => (
              <li key={index}>{step.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        </div>
        <Separator />
        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Did you like this recipe?
          </p>
          <RecipeRating recipeName={recipe.recipeName} />
        </div>
      </CardContent>
    </Card>
  );
}
