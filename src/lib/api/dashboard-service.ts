import api from '../api';
import { 
  TalentDashboardData, 
  BookingInfo, 
  BookingTrend, 
  CategoryDistribution, 
  MonthlyBookingData, 
  ReviewInfo, 
  BookingStatus 
} from '../interfaces/dashboard';

// Mock data generator for dashboard
const generateMockDashboardData = (): TalentDashboardData => {
  // Current date for calculations
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Random booking counts
  const totalBookings = Math.floor(Math.random() * 50) + 20;
  const pendingBookings = Math.floor(Math.random() * 5) + 1;
  const confirmedBookings = Math.floor(Math.random() * 10) + 5;
  const completedBookings = Math.floor(Math.random() * 30) + 10;
  const canceledBookings = Math.floor(Math.random() * 5);
  
  // Financial data
  const thisMonthEarnings = Math.floor(Math.random() * 500000) + 100000; // In RWF
  const lastMonthEarnings = Math.floor(Math.random() * 500000) + 100000;
  const totalEarnings = thisMonthEarnings + lastMonthEarnings + Math.floor(Math.random() * 1000000);
  const thisYearEarnings = totalEarnings * 0.8;
  
  // Generate upcoming bookings
  const upcomingBookings: BookingInfo[] = Array.from({ length: 5 }, (_, i) => {
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + i + 1);
    return {
      id: 1000 + i,
      clientName: `Client ${i + 1}`,
      clientId: 2000 + i,
      date: futureDate.toISOString(),
      time: `${10 + Math.floor(Math.random() * 8)}:00`,
      duration: (Math.floor(Math.random() * 4) + 1) * 60, // 1-4 hours in minutes
      status: i === 0 ? 'PENDING' : 'CONFIRMED' as BookingStatus,
      location: ['Kigali Convention Center', 'Marriott Hotel', 'Radisson Blu', 'Client Venue', 'Private Event'][Math.floor(Math.random() * 5)],
      price: Math.floor(Math.random() * 100000) + 50000,
      notes: i % 2 === 0 ? 'Special requirements for this event.' : undefined,
      createdAt: new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)).toISOString()
    };
  });
  
  // Generate recent bookings (some completed, some canceled)
  const recentBookings: BookingInfo[] = Array.from({ length: 5 }, (_, i) => {
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - i - 1);
    return {
      id: 2000 + i,
      clientName: `Past Client ${i + 1}`,
      clientId: 3000 + i,
      date: pastDate.toISOString(),
      time: `${10 + Math.floor(Math.random() * 8)}:00`,
      duration: (Math.floor(Math.random() * 4) + 1) * 60,
      status: i % 3 === 0 ? 'CANCELED' : 'COMPLETED' as BookingStatus,
      location: ['Kigali Convention Center', 'Marriott Hotel', 'Radisson Blu', 'Client Venue', 'Private Event'][Math.floor(Math.random() * 5)],
      price: Math.floor(Math.random() * 100000) + 50000,
      notes: i % 2 === 0 ? 'Client was very satisfied.' : undefined,
      createdAt: new Date(now.getTime() - ((i+10) * 24 * 60 * 60 * 1000)).toISOString()
    };
  });
  
  // Generate monthly booking data for the current year
  const monthlyBookings: MonthlyBookingData[] = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(currentYear, i, 1);
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
    const isPast = i <= currentMonth;
    
    return {
      month: `${monthName} ${currentYear}`,
      count: isPast ? Math.floor(Math.random() * 10) + (i === currentMonth ? 5 : 10) : 0,
      revenue: isPast ? Math.floor(Math.random() * 300000) + (i === currentMonth ? 100000 : 200000) : 0
    };
  });
  
  // Generate booking trends
  const bookingTrends: BookingTrend[] = Array.from({ length: 12 }, (_, i) => {
    return {
      period: `${i + 1}`,
      bookings: Math.floor(Math.random() * 10) + (i < 6 ? 5 : 10)
    };
  });
  
  // Generate category distribution
  const categories = ['Wedding', 'Corporate Event', 'Birthday Party', 'Concert', 'Festival'];
  const serviceDistribution: CategoryDistribution[] = categories.map((category, i) => {
    const count = Math.floor(Math.random() * 20) + 5;
    return {
      category,
      count,
      percentage: 0 // Will be calculated below
    };
  });
  
  // Calculate percentages
  const totalServices = serviceDistribution.reduce((sum, item) => sum + item.count, 0);
  serviceDistribution.forEach(item => {
    item.percentage = Math.round((item.count / totalServices) * 100);
  });
  
  // Generate location distribution
  const locations = ['Kigali', 'Musanze', 'Rubavu', 'Huye', 'Muhanga'];
  const bookingsByLocation = locations.map((location, i) => {
    const count = Math.floor(Math.random() * 15) + 3;
    return {
      location,
      count,
      percentage: 0 // Will be calculated below
    };
  });
  
  // Calculate percentages for locations
  const totalLocations = bookingsByLocation.reduce((sum, item) => sum + item.count, 0);
  bookingsByLocation.forEach(item => {
    item.percentage = Math.round((item.count / totalLocations) * 100);
  });
  
  // Generate ratings distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const count = Math.floor(Math.random() * 10) + (rating > 3 ? 10 : 5);
    return {
      rating,
      count,
      percentage: 0 // Will be calculated below
    };
  });
  
  // Calculate percentages and average rating
  const totalRatings = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  let ratingSum = 0;
  
  ratingDistribution.forEach(item => {
    item.percentage = Math.round((item.count / totalRatings) * 100);
    ratingSum += item.rating * item.count;
  });
  
  const averageRating = ratingSum / totalRatings;
  
  // Generate recent reviews
  const recentReviews: ReviewInfo[] = Array.from({ length: 3 }, (_, i) => {
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - i - 1);
    
    return {
      id: 3000 + i,
      clientName: `Reviewer ${i + 1}`,
      clientId: 4000 + i,
      rating: Math.min(5, Math.floor(Math.random() * 2) + 4), // 4-5 stars for positive reviews
      comment: [
        'Amazing talent! Would definitely book again for our next event.',
        'Very professional and punctual. The performance exceeded our expectations.',
        'Incredible talent and great personality. Made our event special.'
      ][i],
      date: pastDate.toISOString(),
      bookingId: 5000 + i
    };
  });
  
  // Profile completeness percentage
  const profileCompletion = 85;
  
  // Profile views
  const profileViews = Math.floor(Math.random() * 500) + 100;
  
  return {
    profileCompletion,
    profileViews,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    canceledBookings,
    upcomingBookings,
    recentBookings,
    earnings: {
      total: totalEarnings,
      thisMonth: thisMonthEarnings,
      lastMonth: lastMonthEarnings,
      thisYear: thisYearEarnings
    },
    monthlyBookings,
    bookingTrends,
    serviceDistribution,
    bookingsByLocation,
    ratings: {
      average: parseFloat(averageRating.toFixed(1)),
      total: totalRatings,
      distribution: ratingDistribution
    },
    recentReviews
  };
};

// Dashboard API service with mock data
export const dashboardService = {
  // Get talent dashboard data - unified endpoint returning complete data
  getTalentDashboardData: async (): Promise<TalentDashboardData> => {
    try {
      // Attempt to fetch from real API first
      try {
        const response = await api.get('/api/talent/dashboard');
        return response.data;
      } catch (apiError) {
        console.log('Using mock dashboard data until backend is implemented');
        // Use mock data as fallback
        return generateMockDashboardData();
      }
    } catch (error) {
      console.error('Error in dashboard data service:', error);
      throw error;
    }
  },

  // Get monthly booking stats
  getMonthlyBookings: async (year: number): Promise<MonthlyBookingData[]> => {
    try {
      try {
        const response = await api.get(`/api/bookings/talent/monthly?year=${year}`);
        return response.data;
      } catch (apiError) {
        // Return the monthly bookings from the mock data
        return generateMockDashboardData().monthlyBookings;
      }
    } catch (error) {
      console.error('Error fetching monthly bookings:', error);
      throw error;
    }
  },

  // Get earnings data
  getEarningsData: async (period: 'month' | 'year' | 'all' = 'all'): Promise<any> => {
    try {
      try {
        const response = await api.get(`/api/talent/earnings?period=${period}`);
        return response.data;
      } catch (apiError) {
        // Return earnings data from mock data
        return generateMockDashboardData().earnings;
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      throw error;
    }
  },

  // Get booking distribution by category
  getBookingDistribution: async (): Promise<CategoryDistribution[]> => {
    try {
      try {
        const response = await api.get('/api/talent/booking-distribution');
        return response.data;
      } catch (apiError) {
        // Return service distribution from mock data
        return generateMockDashboardData().serviceDistribution;
      }
    } catch (error) {
      console.error('Error fetching booking distribution:', error);
      throw error;
    }
  },

  // Get recent bookings
  getRecentBookings: async (limit: number = 5): Promise<BookingInfo[]> => {
    try {
      try {
        const response = await api.get(`/api/bookings/talent/recent?limit=${limit}`);
        return response.data;
      } catch (apiError) {
        // Return recent bookings from mock data
        return generateMockDashboardData().recentBookings.slice(0, limit);
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }
  },

  // Get booking trends
  getBookingTrends: async (period: 'week' | 'month' | 'year' = 'month'): Promise<BookingTrend[]> => {
    try {
      try {
        const response = await api.get(`/api/talent/booking-trends?period=${period}`);
        return response.data;
      } catch (apiError) {
        // Return booking trends from mock data
        return generateMockDashboardData().bookingTrends;
      }
    } catch (error) {
      console.error('Error fetching booking trends:', error);
      throw error;
    }
  },

  // Get recent reviews
  getRecentReviews: async (limit: number = 3): Promise<ReviewInfo[]> => {
    try {
      try {
        const response = await api.get(`/api/reviews/talent/recent?limit=${limit}`);
        return response.data;
      } catch (apiError) {
        // Return recent reviews from mock data
        return generateMockDashboardData().recentReviews.slice(0, limit);
      }
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      throw error;
    }
  },
  
  // Approve a booking
  approveBooking: async (bookingId: number): Promise<void> => {
    try {
      await api.post(`/api/bookings/${bookingId}/approve`);
    } catch (error) {
      console.error('Error approving booking:', error);
      // For demo, pretend it worked if the API doesn't exist yet
      console.log('Mock approval for booking', bookingId);
    }
  },
  
  // Reject a booking
  rejectBooking: async (bookingId: number): Promise<void> => {
    try {
      await api.post(`/api/bookings/${bookingId}/reject`);
    } catch (error) {
      console.error('Error rejecting booking:', error);
      // For demo, pretend it worked if the API doesn't exist yet
      console.log('Mock rejection for booking', bookingId);
    }
  }
};
