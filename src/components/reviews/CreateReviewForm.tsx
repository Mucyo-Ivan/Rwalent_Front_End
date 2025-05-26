import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { toast } from 'sonner';
import { reviews } from '@/lib/reviews-api';

interface CreateReviewFormProps {
  talentId: number;
  talentName: string;
  onReviewCreated: () => void;
  hasReviewed: boolean;
}

const CreateReviewForm: React.FC<CreateReviewFormProps> = ({
  talentId,
  talentName,
  onReviewCreated,
  hasReviewed,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please provide a review comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await reviews.createReview({
        reviewedId: talentId,
        rating,
        comment: comment.trim()
      });
      
      toast.success('Your review has been submitted!');
      setComment('');
      setRating(5);
      setShowForm(false);
      onReviewCreated();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasReviewed) {
    return (
      <Card className="mb-6 bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">You have already reviewed this talent.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {showForm ? `Rate & Review ${talentName}` : 'Share Your Experience'}
        </CardTitle>
      </CardHeader>
      
      {!showForm ? (
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-4">
            Help others by sharing your experience with this talent.
          </p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="w-full bg-rwanda-green hover:bg-rwanda-green/90"
          >
            Write a Review
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-0">
            <div className="flex flex-col items-center gap-2">
              <p className="font-medium text-gray-700">Your Rating</p>
              <StarRating 
                interactive 
                rating={rating} 
                size="lg" 
                onRatingChange={setRating} 
              />
            </div>
            
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <Textarea
                id="review-comment"
                placeholder={`What did you like or dislike about working with ${talentName}?`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-rwanda-green hover:bg-rwanda-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};

export default CreateReviewForm;
