import { RecipeForm } from '@/components/recipe-ai/recipe-form';
import { ChefHat } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-4 mb-2">
          <ChefHat className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            Smart Recipe Generator
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground">
          Snap a picture of your ingredients and get a custom recipe in seconds.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <RecipeForm />
      </div>
    </main>
  );
}
