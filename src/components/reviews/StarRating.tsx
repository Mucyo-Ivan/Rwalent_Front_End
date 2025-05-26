import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (interactive) {
      setSelectedRating(index);
      if (onRatingChange) {
        onRatingChange(index);
      }
    }
  };

  return (
    <div 
      className={cn('flex items-center', className)} 
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, index) => {
        const starIndex = index + 1;
        const isActive = interactive 
          ? (hoverRating > 0 ? starIndex <= hoverRating : starIndex <= selectedRating)
          : starIndex <= rating;

        return (
          <Star
            key={index}
            className={cn(
              starSizes[size],
              'cursor-pointer transition-colors',
              isActive ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
              interactive && 'hover:text-yellow-400'
            )}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onClick={() => handleClick(starIndex)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
