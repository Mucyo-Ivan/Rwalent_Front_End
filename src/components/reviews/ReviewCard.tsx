import React from 'react';
import { Review } from '@/lib/reviews-api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { StarRating } from './StarRating';
import EnhancedAvatar from '@/components/ui/EnhancedAvatar';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  const { userProfile } = useAuth();
  const isMyReview = userProfile?.id === review.reviewerId;
  
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
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <EnhancedAvatar
              user={{
                fullName: review.reviewerName,
                id: review.reviewerId
              }}
              size="sm"
              className="h-10 w-10"
              fallbackClassName="bg-rwanda-green text-white"
            />
            <div>
              <h3 className="font-medium text-gray-900">{review.reviewerName}</h3>
              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          
          <StarRating rating={review.rating} size="sm" />
        </div>
        
        <div className="mt-4">
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </CardContent>
      
      {isMyReview && onDelete && (
        <CardFooter className="pt-0 pb-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-red-500"
            onClick={() => onDelete(review.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReviewCard;
