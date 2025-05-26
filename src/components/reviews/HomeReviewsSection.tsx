import React, { useState, useEffect } from 'react';
import { reviews as reviewsApi, Review } from '@/lib/reviews-api';
import { Star, User, Loader2 } from 'lucide-react';

const getRandomTalentIds = (): number[] => {
  // In a real app, you might want to get the most reviewed or top-rated talents
  // For demo, we'll use some random IDs to represent different talents
  return [1, 2, 3, 4, 5].sort(() => 0.5 - Math.random()).slice(0, 3);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const getBackgroundColor = (index: number): string => {
  const colors = ['bg-rwanda-yellow', 'bg-rwanda-green', 'bg-rwanda-blue'];
  return colors[index % colors.length];
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-rwanda-yellow">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get random talent IDs to show diverse reviews
        const talentIds = getRandomTalentIds();
        
        // Fetch reviews for each talent
        const reviewPromises = talentIds.map(id => 
          reviewsApi.getUserReviews(id, 0, 1, 'createdAt', 'DESC', 4)
            .then(response => {
              // Check if response has content and at least one review
              if (response && response.content && response.content.length > 0) {
                return response.content[0];
              }
              return null;
            })
            .catch(() => null)
        );
        
        const results = await Promise.all(reviewPromises);
        const validReviews = results.filter(review => review !== null) as Review[];
        
        if (validReviews.length === 0) {
          // Fallback to demo reviews if no real reviews are found
          setReviews([{
            id: 1,
            reviewerId: 101,
            reviewerName: "Patricia Mugisha",
            reviewedId: 1,
            reviewedName: "Eric Photographer",
            rating: 5,
            comment: "I found an amazing photographer for my wedding through RwandaTalent. The booking process was smooth and the quality of work exceeded my expectations!",
            createdAt: new Date().toISOString()
          }, {
            id: 2,
            reviewerId: 102,
            reviewerName: "Eric Niyonkuru",
            reviewedId: 2,
            reviewedName: "DJ Alexis",
            rating: 5,
            comment: "As a DJ, joining RwandaTalent has helped me connect with clients I wouldn't have found otherwise. My bookings have increased significantly!",
            createdAt: new Date().toISOString()
          }, {
            id: 3,
            reviewerId: 103,
            reviewerName: "Jacqueline Kamikazi",
            reviewedId: 3,
            reviewedName: "Event Planners Ltd",
            rating: 5,
            comment: "Our company regularly books event coordinators through RwandaTalent. The platform makes it easy to find qualified professionals quickly and reliably.",
            createdAt: new Date().toISOString()
          }]);
        } else {
          setReviews(validReviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
        // Fallback to demo reviews on error
        setReviews([{
          id: 1,
          reviewerId: 101,
          reviewerName: "Patricia Mugisha",
          reviewedId: 1,
          reviewedName: "Eric Photographer",
          rating: 5,
          comment: "I found an amazing photographer for my wedding through RwandaTalent. The booking process was smooth and the quality of work exceeded my expectations!",
          createdAt: new Date().toISOString()
        }, {
          id: 2,
          reviewerId: 102,
          reviewerName: "Eric Niyonkuru",
          reviewedId: 2,
          reviewedName: "DJ Alexis",
          rating: 5,
          comment: "As a DJ, joining RwandaTalent has helped me connect with clients I wouldn't have found otherwise. My bookings have increased significantly!",
          createdAt: new Date().toISOString()
        }, {
          id: 3,
          reviewerId: 103,
          reviewerName: "Jacqueline Kamikazi",
          reviewedId: 3,
          reviewedName: "Event Planners Ltd",
          rating: 5,
          comment: "Our company regularly books event coordinators through RwandaTalent. The platform makes it easy to find qualified professionals quickly and reliably.",
          createdAt: new Date().toISOString()
        }]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-rwanda-green" />
        <span className="ml-2 text-gray-600">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Check if there are any reviews, if not, use the fallback demo reviews
  if (reviews.length === 0) {
    // Set fallback reviews
    setReviews([{
      id: 1,
      reviewerId: 101,
      reviewerName: "Patricia Mugisha",
      reviewedId: 1,
      reviewedName: "Eric Photographer",
      rating: 5,
      comment: "I found an amazing photographer for my wedding through RwandaTalent. The booking process was smooth and the quality of work exceeded my expectations!",
      createdAt: new Date().toISOString()
    }, {
      id: 2,
      reviewerId: 102,
      reviewerName: "Eric Niyonkuru",
      reviewedId: 2,
      reviewedName: "DJ Alexis",
      rating: 5,
      comment: "As a DJ, joining RwandaTalent has helped me connect with clients I wouldn't have found otherwise. My bookings have increased significantly!",
      createdAt: new Date().toISOString()
    }, {
      id: 3,
      reviewerId: 103,
      reviewerName: "Jacqueline Kamikazi",
      reviewedId: 3,
      reviewedName: "Event Planners Ltd",
      rating: 5,
      comment: "Our company regularly books event coordinators through RwandaTalent. The platform makes it easy to find qualified professionals quickly and reliably.",
      createdAt: new Date().toISOString()
    }]);
    
    // Use a timeout to allow state to update
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-rwanda-green" />
        <span className="ml-2 text-gray-600">Loading reviews...</span>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review, index) => (
        <div key={review.id} className="bg-gray-50 p-6 rounded-lg shadow border border-gray-100 transition-transform hover:translate-y-[-5px]">
          <div className="flex items-center mb-4">
            <div className={`h-12 w-12 rounded-full ${getBackgroundColor(index)} text-white flex items-center justify-center font-bold text-xl`}>
              {getInitials(review.reviewerName || 'User')}
            </div>
            <div className="ml-4">
              <h4 className="font-medium">{review.reviewerName || 'Anonymous User'}</h4>
              <StarRating rating={review.rating || 5} />
            </div>
          </div>
          <p className="text-gray-600">
            "{review.comment || 'Great experience with this talent!'}"
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <span>Review for: {review.reviewedName || 'Talent'}</span>
            <span className="block mt-1">{new Date(review.createdAt || new Date()).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsSection;
