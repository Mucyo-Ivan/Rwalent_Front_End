import React, { useState, useEffect } from 'react';
import { reviews as reviewsApi } from '@/lib/reviews-api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RatingSummary from './RatingSummary';
import CreateReviewForm from './CreateReviewForm';
import ReviewsList from './ReviewsList';
import { Loader2 } from 'lucide-react';

interface TalentReviewsSectionProps {
  talentId: number;
  talentName: string;
}

const TalentReviewsSection: React.FC<TalentReviewsSectionProps> = ({
  talentId,
  talentName
}) => {
  const { userProfile, isAuthenticated } = useAuth();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReviewStatus, setCheckingReviewStatus] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  // Skip check if user is not authenticated or is the talent being viewed
  const skipReviewCheck = !isAuthenticated || userProfile?.id === talentId;
  
  // Fetch review count whenever refreshTrigger changes
  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const summary = await reviewsApi.getRatingSummary(talentId);
        setReviewCount(summary.totalReviews || 0);
      } catch (error) {
        console.error('Error fetching review count:', error);
        setReviewCount(0);
      }
    };
    
    fetchReviewCount();
  }, [talentId, refreshTrigger]);
  
  // Check if user has already reviewed this talent
  useEffect(() => {
    if (skipReviewCheck) {
      setCheckingReviewStatus(false);
      return;
    }
    
    const checkReviewStatus = async () => {
      setCheckingReviewStatus(true);
      try {
        const hasAlreadyReviewed = await reviewsApi.hasReviewedTalent(talentId);
        setHasReviewed(hasAlreadyReviewed);
      } catch (error) {
        console.error('Error checking review status:', error);
      } finally {
        setCheckingReviewStatus(false);
      }
    };
    
    checkReviewStatus();
  }, [talentId, isAuthenticated, userProfile?.id, skipReviewCheck, refreshTrigger]);
  
  const handleReviewCreated = () => {
    // Increment trigger to refresh all review components
    setRefreshTrigger(prev => prev + 1);
    // Assume the user has now reviewed
    setHasReviewed(true);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div className="flex items-center gap-3">
          <RatingSummary userId={talentId} refreshTrigger={refreshTrigger} />
          <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
            Total reviews: {reviewCount}
          </div>
        </div>
      </div>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          {isAuthenticated && userProfile?.id !== talentId && (
            <TabsTrigger value="add-review">Write a Review</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="reviews">
          <ReviewsList userId={talentId} refreshTrigger={refreshTrigger} />
        </TabsContent>
        
        <TabsContent value="add-review">
          {checkingReviewStatus ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-rwanda-green" />
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You need to sign in to leave a review.</p>
              <Button className="bg-rwanda-green hover:bg-rwanda-green/90">Sign In</Button>
            </div>
          ) : userProfile?.id === talentId ? (
            <div className="text-center py-8">
              <p className="text-gray-600">You cannot review your own profile.</p>
            </div>
          ) : (
            <CreateReviewForm
              talentId={talentId}
              talentName={talentName}
              onReviewCreated={handleReviewCreated}
              hasReviewed={hasReviewed}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentReviewsSection;
