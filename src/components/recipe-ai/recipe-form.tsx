'use client';

import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { recognizeIngredientsAction, generateRecipeAction } from '@/app/actions';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import {
  Loader2,
  Sparkles,
  UploadCloud,
  UtensilsCrossed,
} from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { RecipeDisplay } from './recipe-display';
import { Badge } from '../ui/badge';

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
];

export function RecipeForm() {
  const { toast } = useToast();
  const [isRecognizing, startRecognitionTransition] = useTransition();
  const [isGenerating, startGenerationTransition] = useTransition();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIngredients([]);
      setRecipe(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognizeIngredients = () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please upload an image of your ingredients first.',
      });
      return;
    }

    startRecognitionTransition(async () => {
      const result = await recognizeIngredientsAction({
        photoDataUri: imagePreview,
      });
      if (result.success) {
        setIngredients(result.data.ingredients);
        setRecipe(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Recognition Failed',
          description: result.error,
        });
      }
    });
  };

  const handleGenerateRecipe = () => {
    if (ingredients.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No ingredients found',
        description: 'Please recognize ingredients from an image first.',
      });
      return;
    }

    startGenerationTransition(async () => {
      const result = await generateRecipeAction({
        ingredients,
        dietaryPreferences: selectedPreferences,
      });
      if (result.success) {
        setRecipe(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Recipe Generation Failed',
          description: result.error,
        });
      }
    });
  };

  const handlePreferenceChange = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            1. Upload Your Ingredients
          </CardTitle>
          <CardDescription>
            Take a picture of what's in your fridge or pantry.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Label
              htmlFor="ingredient-image"
              className="w-full cursor-pointer"
            >
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/10 transition-colors">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Ingredients preview"
                    width={400}
                    height={300}
                    data-ai-hint="food ingredients"
                    className="mx-auto rounded-md object-contain max-h-60"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-10 w-10" />
                    <p>Click to upload or drag and drop</p>
                    <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>
            </Label>
            <Input
              id="ingredient-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <Button
              onClick={handleRecognizeIngredients}
              disabled={!imagePreview || isRecognizing}
              className="w-full md:w-auto"
            >
              {isRecognizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Recognize Ingredients
            </Button>
          </div>

          {isRecognizing && (
            <div className="text-center text-muted-foreground animate-pulse">
              Analyzing image...
            </div>
          )}

          {ingredients.length > 0 && !isRecognizing && (
            <div className="animate-fade-in space-y-3">
              <h3 className="font-semibold">Recognized Ingredients:</h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {ingredients.length > 0 && !isRecognizing && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              2. Set Preferences & Generate
            </CardTitle>
            <CardDescription>
              Any dietary needs? Let us know before we cook up a recipe for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Dietary Preferences (Optional)</Label>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {dietaryOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      onCheckedChange={() => handlePreferenceChange(option)}
                    />
                    <Label htmlFor={option} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={handleGenerateRecipe}
              disabled={isGenerating}
              className="w-full md:w-auto"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UtensilsCrossed className="mr-2 h-4 w-4" />
              )}
              Generate Recipe
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Generating your custom recipe...</p>
        </div>
      )}

      {recipe && !isGenerating && <RecipeDisplay recipe={recipe} />}
    </div>
  );
}
