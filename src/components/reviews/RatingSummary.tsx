import React, { useState, useEffect } from 'react';
import { RatingSummary as RatingSummaryType, reviews } from '@/lib/reviews-api';
import { StarRating } from './StarRating';
import { Skeleton } from '@/components/ui/skeleton';

interface RatingSummaryProps {
  userId: number;
  refreshTrigger?: number; // Increment this to force a refresh
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ 
  userId, 
  refreshTrigger = 0 
}) => {
  const [summary, setSummary] = useState<RatingSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await reviews.getRatingSummary(userId);
        setSummary(data);
      } catch (error) {
        console.error('Error fetching rating summary:', error);
        setError('Failed to load rating data');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userId, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-12" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-500">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg">{summary.averageRating.toFixed(1)}</span>
      <StarRating rating={summary.averageRating} size="sm" />
      <span className="text-gray-500 text-sm">
        ({summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

export default RatingSummary;
