import React, { useState, useEffect } from 'react';
import { Review, reviews } from '@/lib/reviews-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { StarRating } from '@/components/reviews/StarRating';
import { formatDistanceToNow } from 'date-fns';

const UserReviewsPage: React.FC = () => {
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReviews = async () => {
      setLoading(true);
      try {
        const response = await reviews.getMyReviews();
        setUserReviews(response.content);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setError('Failed to load your reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  const handleDeleteReview = async (reviewId: number) => {
    if (isDeleting) return;
    
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await reviews.deleteReview(reviewId);
      setUserReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete the review');
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-rwanda-green" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      ) : userReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
          <Button 
            onClick={() => navigate('/talents')}
            className="bg-rwanda-green hover:bg-rwanda-green/90"
          >
            Browse Talents
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {userReviews.map(review => (
            <Card key={review.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-rwanda-green text-white">
                      <AvatarFallback>{getInitials(review.reviewedName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{review.reviewedName}</h3>
                      <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/talents/${review.reviewedId}`)}
                  >
                    View Profile
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span>Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewsPage;
