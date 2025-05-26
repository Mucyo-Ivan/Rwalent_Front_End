import React, { useState, useEffect } from 'react';
import { reviews } from '@/lib/reviews-api';
import { StarRating } from './StarRating';
import { Skeleton } from '@/components/ui/skeleton';

interface TalentRatingProps {
  talentId: number;
  showCount?: boolean;
  className?: string;
}

const TalentRating: React.FC<TalentRatingProps> = ({ 
  talentId, 
  showCount = true,
  className = '',
}) => {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      if (!talentId) return;
      
      setLoading(true);
      try {
        const data = await reviews.getRatingSummary(talentId);
        setRating(data.averageRating);
        setCount(data.totalReviews);
      } catch (error) {
        console.error('Error fetching rating:', error);
        setError('Failed to load rating');
        // Provide default values as fallback
        setRating(0);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [talentId]);

  if (loading) {
    return <Skeleton className="h-5 w-24" />;
  }

  if (error || count === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No ratings yet
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <StarRating rating={rating} size="sm" />
      {showCount && (
        <span className="text-sm text-gray-600">
          ({count})
        </span>
      )}
    </div>
  );
};

export default TalentRating;
