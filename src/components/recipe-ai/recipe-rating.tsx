'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeRatingProps {
  recipeName: string;
}

export function RecipeRating({ recipeName }: RecipeRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const storageKey = `recipe-rating-${recipeName}`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const savedRating = localStorage.getItem(storageKey);
        if (savedRating) {
          setRating(Number(savedRating));
        }
      } catch (error) {
        console.error('Could not access local storage:', error);
      }
    }
  }, [storageKey, isMounted]);

  const handleSetRating = (newRating: number) => {
    if (isMounted) {
      setRating(newRating);
      try {
        localStorage.setItem(storageKey, String(newRating));
      } catch (error) {
        console.error('Could not save to local storage:', error);
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center gap-1 h-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-6 w-6 text-muted-foreground/20" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => handleSetRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          aria-label={`Rate ${star} out of 5 stars`}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <Star
            className={cn(
              'h-6 w-6 cursor-pointer transition-colors',
              hoverRating >= star || rating >= star
                ? 'text-accent fill-accent'
                : 'text-muted-foreground/50'
            )}
          />
        </button>
      ))}
    </div>
  );
}
