// Dashboard data interface definition
export interface TalentDashboardData {
  // Profile information
  profileCompletion: number; // Percentage of profile completion
  profileViews: number; // Number of profile views
  
  // Booking statistics
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  canceledBookings: number;
  
  // Booking details
  upcomingBookings: BookingInfo[];
  recentBookings: BookingInfo[];
  
  // Financial information
  earnings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
  };
  
  // Analytics
  monthlyBookings: MonthlyBookingData[];
  bookingTrends: BookingTrend[];
  
  // Categories and distributions
  serviceDistribution: CategoryDistribution[];
  bookingsByLocation: LocationDistribution[];
  
  // Reviews
  ratings: {
    average: number;
    total: number;
    distribution: RatingDistribution[];
  };
  recentReviews: ReviewInfo[];
}

export interface BookingInfo {
  id: number;
  clientName: string;
  clientId: number;
  date: string; // ISO string format
  time: string;
  duration: number; // in minutes
  status: BookingStatus;
  location: string;
  price: number;
  notes?: string;
  createdAt: string;
}

export interface MonthlyBookingData {
  month: string; // Format: 'MMM YYYY'
  count: number;
  revenue: number;
}

export interface BookingTrend {
  period: string; // Could be day, week, month
  bookings: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface LocationDistribution {
  location: string;
  count: number;
  percentage: number;
}

export interface RatingDistribution {
  rating: number; // 1 to 5
  count: number;
  percentage: number;
}

export interface ReviewInfo {
  id: number;
  clientName: string;
  clientId: number;
  rating: number;
  comment: string;
  date: string; // ISO string format
  bookingId?: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'REJECTED';
