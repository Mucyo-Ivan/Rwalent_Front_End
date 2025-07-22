import axios from 'axios';
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[API Request Interceptor] Token added. Request to:', config.url, 'Headers:', config.headers);
    } else {
      if (config.url && !config.url.includes('/api/auth/') && !config.url.includes('/api/talents/search')) {
        console.warn('[API Request Interceptor] No token found in localStorage for protected route:', config.url);
      }
    }

    // Handle multipart/form-data requests specifically for non-upload-service API calls
    // The upload-service will handle its own Content-Type.
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
      console.log('[API Request Interceptor] FormData detected. Content-Type set to multipart/form-data for', config.url);
    } else if (config.headers && !config.headers['Content-Type']) {
        // Default to application/json if not explicitly set and not FormData
        config.headers['Content-Type'] = 'application/json';
        console.log('[API Request Interceptor] Defaulting Content-Type to application/json for', config.url);
    }

    console.log('[API Request Interceptor] Sending request:', config.method?.toUpperCase(), config.url, 'Data:', config.data);
    return config;
  },
  error => {
    console.error('[API Request Interceptor] Request error:', error.message, error.config);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('[API Response Interceptor] Response received for:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status, 'Data:', response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error('[API Response Interceptor] Error Response: URL:', error.config.url, 'Status:', error.response.status, 'Data:', error.response.data, 'Headers:', error.response.headers);
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.log('[API Response Interceptor] 401 Unauthorized - clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userProfile'); // Clear user profile as well
        window.location.href = '/signin';
        toast.error('Your session has expired. Please sign in again.');
      }
      // Handle 403 Forbidden
      else if (error.response.status === 403) {
        console.log('[API Response Interceptor] 403 Forbidden - access denied for:', error.config.url);
        toast.error(error.response.data?.detail || 'You do not have permission to perform this action.');
      }
      // Handle other errors
      else {
        console.error(`[API Response Interceptor] Error Response: ${error.response.status} ${error.response.statusText}`, error.response.data);
        toast.error(error.response.data?.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[API Response Interceptor] Error Request: No response received. URL:', error.config.url, 'Error:', error.message);
      toast.error('Network error. Please check your connection or the backend server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API Response Interceptor] Error Message:', error.message, 'Config:', error.config);
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export interface Authority {
  authority: string;
}

export interface Profile {
  id: number;
  fullName: string;
  email: string;
  password?: string; // Password is often not included in profile responses for security, marked as optional.
  phoneNumber: string | null; // Allow null based on response examples
  userType: "TALENT" | "REGULAR_USER" | string;
  category: string | null;
  location: string | null;
  bio: string | null;
  serviceAndPricing: string | null;
  photoUrl: string | null; // Keep using photoUrl consistent with getProfile unless backend changed
  profilePicture?: string | null; // Adding profilePicture property for new API responses
  enabled: boolean;
  username: string;
  authorities: Authority[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface Talent {
  id: number;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: string;
  category: string;
  location: string;
  bio: string;
  serviceAndPricing: string;
  photoUrl: string;
  enabled: boolean;
  username: string;
  authorities: Array<{ authority: string }>;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
}

export interface SearchResponse {
  content: Talent[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// User Notification interfaces
export interface UserNotification {
  id: number;
  message: string;
  status: 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'INFO' | string;
  notificationType: 'BOOKING_ACCEPTED' | 'BOOKING_REJECTED' | 'NEW_MESSAGE' | 'INFO' | string;
  relatedBookingId?: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPage {
  content: UserNotification[];
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
}

// Define the specific payload type for the update request based on user example
interface UpdateProfilePayload {
  fullName: string;
  email: string; 
  phoneNumber?: string | null; 
  location?: string | null;   
}

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      // Also store user type for quick access
      if (response.data.userType) {
        localStorage.setItem('userType', response.data.userType);
      }
    }
    return response.data;
  },
  registerRegular: async (userData: {
    fullName: string;
    email: string;
    password: string;
    userType: string;
  }) => {
    console.log('Sending regular registration request:', userData);
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  registerTalent: async (userData: {
    fullName: string;
    email: string;
    password: string;
    userType: string;
    phoneNumber: string;
    category: string;
    location: string;
    bio: string;
    serviceAndPricing: string;
    photoUrl?: string; // photoUrl is now optional
  }): Promise<any> => {
    console.log('Sending talent registration request with JSON data:', userData);
    try {
      const response = await api.post('/api/auth/register', userData, {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
    });
    return response.data;
    } catch (error: any) {
      console.error('Talent registration error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        throw new Error(error.response.data.detail || 'Failed to register talent');
      }
      throw error;
    }
  },
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },
  updateProfile: async (profileData: UpdateProfilePayload & { photoUrl?: string }): Promise<Profile> => {
    try {
      const response = await api.put('/api/auth/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
  search: async (searchTerm: string): Promise<SearchResponse> => {
    // Backend for /api/talents/search does not support GET, trying POST.
    // Sending searchTerm in the request body.
    const response = await api.post(`/api/talents/search`, { query: searchTerm });
    return response.data;
  },
  // Add new function to get talent dashboard data
  getTalentDashboardData: async () => {
    const response = await api.get('/api/talent/dashboard');
    return response.data;
  }
};

// --- Booking Related Interfaces and Functions ---
// ERASED: All booking-related interfaces and the 'booking' export

// --- Booking API Client ---
export interface BookingRequestPayload {
  talentId: number;
  bookingDate: string;
  durationMinutes: number;
  eventLocation: string;
  agreedPrice?: number;
  eventRequirements?: string;
  notes?: string;
}

export interface BookingResponse {
  id: number;
  talentId: number;
  userId: number;
  bookingDate: string;
  durationMinutes: number;
  status: string;
  eventLocation: string;
  agreedPrice: number;
  eventRequirements: string;
  notes: string;
  talentName?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const booking = {
  // 1. Create a Booking (User)
  createBooking: async (payload: BookingRequestPayload): Promise<BookingResponse> => {
    const response = await api.post('/api/bookings', payload);
    return response.data;
  },

  // 2. Get My Bookings (User)
  getMyBookings: async (): Promise<BookingResponse[]> => {
    const response = await api.get('/api/bookings/my');
    return response.data;
  },

  // 3. Get Bookings for My Talent Profile (Talent)
  getTalentBookings: async (): Promise<BookingResponse[]> => {
    const response = await api.get('/api/bookings/talent');
    return response.data;
  },

  // 4. Get Booking by ID
  getBookingById: async (id: number): Promise<BookingResponse> => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  // 5. Approve a Booking (Talent)
  approveBooking: async (id: number): Promise<BookingResponse> => {
    const response = await api.post(`/api/bookings/${id}/approve`);
    return response.data;
  },

  // 6. Reject a Booking (Talent)
  rejectBooking: async (id: number): Promise<BookingResponse> => {
    const response = await api.post(`/api/bookings/${id}/reject`);
    return response.data;
  },

  // 7. Cancel a Booking (Client)
  cancelBooking: async (id: number): Promise<BookingResponse> => {
    const response = await api.post(`/api/bookings/${id}/cancel`);
    return response.data;
  },


  getPendingTalentBookings: async (): Promise<BookingResponse[]> => {
    const response = await api.get('/api/bookings/talent/pending');
    return response.data;
  },
};

export const notifications = {
  getUserNotifications: async (page = 0, size = 10): Promise<NotificationPage> => {
    console.log('[Notifications] Fetching notifications page:', page, 'size:', size);
    const response = await api.get(`/api/notifications?page=${page}&size=${size}`);
    console.log('[Notifications] Received notifications:', response.data);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    console.log('[Notifications] Fetching unread count');
    const response = await api.get('/api/notifications/unread-count');
    console.log('[Notifications] Unread count:', response.data);
    return response.data || 0;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    console.log('[Notifications] Marking notification as read:', notificationId);
    await api.put(`/api/notifications/${notificationId}/mark-read`);
  },

  markAllAsRead: async (): Promise<void> => {
    console.log('[Notifications] Marking all notifications as read');
    await api.put('/api/notifications/mark-all-read');
  },

  clearNotification: async (notificationId: number): Promise<void> => {
    console.log('[Notifications] Clearing notification:', notificationId);
    await api.delete(`/api/notifications/${notificationId}/delete`);
  },

  clearAllNotifications: async (): Promise<void> => {
    console.log('[Notifications] Clearing all notifications');
    await api.delete('/api/notifications/clear-all');
  },

  deleteReadNotifications: async (): Promise<void> => {
    console.log('[Notifications] Deleting read notifications');
    await api.delete('/api/notifications/delete-read');
  }
};

export const reviews = {
  submitReview: async (talentId: number, rating: number, comment: string) => {
    const response = await api.post(`/api/reviews/talent/${talentId}`, { rating, comment });
    return response.data;
  },
  getReviewsForTalent: async (talentId: number) => {
    const response = await api.get(`/api/reviews/talent/${talentId}`);
    return response.data;
  },
};

export default api; 