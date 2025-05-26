import api from './api';

// Review interfaces
export interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewedId: number;
  reviewedName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsPage {
  content: Review[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  number: number;
  size: number;
  numberOfElements: number;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewPayload {
  reviewedId: number;
  rating: number;
  comment: string;
}

// Reviews API client
export const reviews = {
  // Create a new review
  createReview: async (payload: ReviewPayload): Promise<Review> => {
    console.log('[Reviews] Creating new review');
    const response = await api.post('/api/reviews', payload);
    return response.data;
  },

  // Get all reviews for a specific user with pagination and filtering
  getUserReviews: async (userId: number, page = 0, size = 10, sortBy = 'createdAt', direction = 'DESC', minRating?: number): Promise<ReviewsPage> => {
    console.log('[Reviews] Fetching reviews for user:', userId);
    let url = `/api/reviews/${userId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    if (minRating !== undefined) {
      url += `&minRating=${minRating}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get all reviews written by the current user
  getMyReviews: async (page = 0, size = 10): Promise<ReviewsPage> => {
    console.log('[Reviews] Fetching my reviews');
    const response = await api.get(`/api/reviews/mine?page=${page}&size=${size}`);
    return response.data;
  },

  // Get the average rating and total review count for a user
  getRatingSummary: async (userId: number): Promise<RatingSummary> => {
    console.log('[Reviews] Fetching rating summary for user:', userId);
    const response = await api.get(`/api/reviews/${userId}/rating-summary`);
    return response.data;
  },

  // Check if current user has already reviewed a talent
  hasReviewedTalent: async (talentId: number): Promise<boolean> => {
    console.log('[Reviews] Checking if user has reviewed talent:', talentId);
    const response = await api.get(`/api/reviews/check/${talentId}`);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: number): Promise<void> => {
    console.log('[Reviews] Deleting review:', reviewId);
    await api.delete(`/api/reviews/${reviewId}`);
  },
};

export default reviews;
