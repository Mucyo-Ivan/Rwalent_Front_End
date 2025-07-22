import api from '../api';
import { 
  TalentDashboardData, 
  BookingInfo, 
  BookingTrend, 
  CategoryDistribution, 
  MonthlyBookingData, 
  ReviewInfo, 
  BookingStatus,
  LocationDistribution
} from '../interfaces/dashboard';

// Dashboard API service
export const dashboardService = {
  // Get complete talent dashboard data
  getTalentDashboardData: async (): Promise<TalentDashboardData> => {
    try {
      const response = await api.get('/api/talent/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get monthly booking statistics
  getMonthlyBookings: async (year: number): Promise<MonthlyBookingData[]> => {
    try {
      const response = await api.get(`/api/talent/bookings/monthly?year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly bookings:', error);
      throw error;
    }
  },

  // Get earnings data with period filter
  getEarningsData: async (period: 'month' | 'year' | 'all' = 'all'): Promise<{
    total: number;
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
  }> => {
    try {
      const response = await api.get(`/api/talent/earnings?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      throw error;
    }
  },

  // Get profile statistics
  getProfileStats: async (): Promise<{
    profileCompletion: number;
    profileViews: number;
  }> => {
    try {
      const response = await api.get('/api/talent/profile/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      throw error;
    }
  },

  // Get booking statistics
  getBookingStats: async (): Promise<{
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    canceledBookings: number;
  }> => {
    try {
      const response = await api.get('/api/talent/bookings/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  },

  // Get service distribution
  getServiceDistribution: async (): Promise<CategoryDistribution[]> => {
    try {
      const response = await api.get('/api/talent/bookings/service-distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching service distribution:', error);
      throw error;
    }
  },

  // Get location distribution
  getLocationDistribution: async (): Promise<LocationDistribution[]> => {
    try {
      const response = await api.get('/api/talent/bookings/location-distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching location distribution:', error);
      throw error;
    }
  },

  // Get rating statistics
  getRatingStats: async (): Promise<{
    average: number;
    total: number;
    distribution: RatingDistribution[];
  }> => {
    try {
      const response = await api.get('/api/talent/ratings/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      throw error;
    }
  },

  // --- Booking specific methods, delegating to coreBookingApi ---
  approveBooking: async (bookingId: number) => {
    return coreBookingApi.approveBooking(bookingId);
  },

  rejectBooking: async (bookingId: number) => {
    return coreBookingApi.rejectBooking(bookingId);
  },

  getTalentBookings: async (talentId: number, status?: string, page: number = 0, size: number = 10) => {
    return coreBookingApi.getTalentBookings(talentId, status, page, size);
  },

  getUserBookings: async (userId: number, status?: string, page: number = 0, size: number = 10) => {
    return coreBookingApi.getUserBookings(userId, status, page, size);
  },

  getPendingTalentBookings: async (talentId: number) => {
    return coreBookingApi.getPendingTalentBookings(talentId);
  }
};
