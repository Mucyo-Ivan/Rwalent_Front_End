import React, { useState, useEffect } from 'react';
import { Review, ReviewsPage, reviews as reviewsApi } from '@/lib/reviews-api';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewsListProps {
  userId: number;
  refreshTrigger?: number; // Increment this to force a refresh
}

const ReviewsList: React.FC<ReviewsListProps> = ({ userId, refreshTrigger = 0 }) => {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [direction, setDirection] = useState<string>('DESC');
  const [totalReviews, setTotalReviews] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async (resetPage = false) => {
    const pageToFetch = resetPage ? 0 : page;
    
    if (resetPage) {
      setPage(0);
      setReviewsList([]);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.getUserReviews(userId, pageToFetch, 5, sortBy, direction, minRating);
      
      if (resetPage) {
        setReviewsList(response.content);
      } else {
        setReviewsList(prev => [...prev, ...response.content]);
      }
      
      setHasMore(!response.last);
      setTotalReviews(response.totalElements);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchReviews(true);
  }, [userId, minRating, sortBy, direction, refreshTrigger]);

  // Load more when page changes
  useEffect(() => {
    if (page > 0) {
      fetchReviews();
    }
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (isDeleting) return;
    
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await reviewsApi.deleteReview(reviewId);
      setReviewsList(prev => prev.filter(review => review.id !== reviewId));
      setTotalReviews(prev => prev - 1);
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete the review');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Reviews {totalReviews > 0 && `(${totalReviews})`}
        </h2>
        
        <div className="flex gap-2">
          <Select 
            value={minRating?.toString() || 'all'} 
            onValueChange={(value) => setMinRating(value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
              <SelectItem value="1">1+ Star</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={`${sortBy}-${direction}`} 
            onValueChange={(value) => {
              const [newSortBy, newDirection] = value.split('-');
              setSortBy(newSortBy);
              setDirection(newDirection);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-DESC">Newest</SelectItem>
              <SelectItem value="createdAt-ASC">Oldest</SelectItem>
              <SelectItem value="rating-DESC">Highest Rated</SelectItem>
              <SelectItem value="rating-ASC">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      {reviewsList.length === 0 && !loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewsList.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onDelete={handleDeleteReview}
            />
          ))}
          
          {hasMore && (
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                onClick={handleLoadMore} 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Reviews'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {loading && reviewsList.length === 0 && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rwanda-green" />
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
