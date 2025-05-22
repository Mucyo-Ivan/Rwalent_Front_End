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
      console.log('[API] Request headers:', config.headers);
    } else {
      // Only show warning for protected routes
      if (config.url && !config.url.includes('/api/auth/')) {
        console.warn('[API] No token found in localStorage for protected route:', config.url);
      }
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('[API] Response received:', response.status, response.config.url);
    return response;
  },
  error => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.log('[API] 401 Unauthorized - clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '/signin';
        toast.error('Your session has expired. Please sign in again.');
      }
      // Handle 403 Forbidden
      else if (error.response.status === 403) {
        console.log('[API] 403 Forbidden - access denied:', error.response.config.url);
        toast.error('You do not have permission to perform this action.');
      }
      // Handle other errors
      else {
        console.error(`[API] Error Response: ${error.response.status} ${error.response.statusText}`, error.response.data);
        toast.error(error.response.data?.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      console.error('[API] Error Request:', error.request);
      toast.error('Network error. Please check your connection.');
    } else {
      console.error('[API] Error Message:', error.message);
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
  // Updated registerTalent to handle FormData and Content-Type
  registerTalent: async (formData: FormData): Promise<any> => {
    console.log('Sending talent registration request with FormData...');
    const response = await api.post('/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data], // Prevent axios from transforming the FormData
    });
    return response.data;
  },
  // New function to upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ photoUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    });
    return response.data;
  },
  // New function to update profile with photo
  updateProfileWithPhoto: async (profileData: FormData): Promise<Profile> => {
    const response = await api.put('/api/auth/profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    });
    return response.data;
  },
  search: async (searchTerm: string): Promise<SearchResponse> => {
    // Backend for /api/talents/search does not support GET, trying POST.
    // Sending searchTerm in the request body.
    const response = await api.post(`/api/talents/search`, { query: searchTerm });
    return response.data;
  },
  // getProfile no longer needs the token argument if the interceptor handles it
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/api/auth/profile');
    const profile = response.data;
    // Update stored user type if it changed
    if (profile.userType) {
      localStorage.setItem('userType', profile.userType);
    }
    return profile;
  },
  // Updated updateProfile function to use the specific payload and endpoint
  updateProfile: async (profileData: UpdateProfilePayload): Promise<Profile> => {
      console.log('Sending profile update request with JSON data:', profileData);
      // Token is added by the request interceptor
      // Use PUT /api/auth/profile as indicated by the 400 error instance path
      const response = await api.put('/api/auth/profile', profileData);
      // Assuming response contains the updated profile, potentially with photoUrl/profilePictureUrl
      // Sticking with Profile return type for now.
    return response.data;
  },
  // Add new function to get talent dashboard data
  getTalentDashboardData: async () => {
    const response = await api.get('/api/talent/dashboard');
    return response.data;
  }
};

// --- Booking Related Interfaces and Functions ---
export interface BookingRequestPayload {
  bookingDate: string; // ISO 8601 format string: "2024-08-20T18:30:00"
  durationMinutes: number;
  notes: string;
  eventLocation: string;
  agreedPrice?: number | null; // Optional, as per example
  eventRequirements?: string | null; // Optional
}

export interface BookingResponse {
  id: number;
  talentId: number;
  userId: number;
  bookingDate: string;
  durationMinutes: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | string; // Allow other strings for flexibility
  notes: string;
  eventLocation: string;
  agreedPrice: number | null;
  eventRequirements: string | null;
  talentName?: string; // Optional as per example
  userName?: string; // Optional as per example
  // Add any other fields that might come from the backend
  createdAt?: string;
  updatedAt?: string;
}

export const booking = {
  createBookingRequest: async (talentId: number, payload: BookingRequestPayload): Promise<BookingResponse> => {
    console.log(`Sending booking request for talent ID ${talentId}:`, payload);
    // The token is added by the request interceptor.
    // URL is now /api/bookings/talent/{talentId}
    const response = await api.post<BookingResponse>(`/api/bookings/talent/${talentId}`, payload);
    return response.data;
  },

  getPendingTalentBookings: async (): Promise<BookingResponse[]> => {
    try {
      // Use the real API endpoint to fetch pending booking requests
      const response = await api.get<BookingResponse[]>('/api/bookings/talent/pending');
      
      // Check if the response contains data
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.log('No pending booking requests found or empty response');
        return [];
      }
      
      // Sort by date, newest first
      return response.data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Failed to fetch pending bookings:", error);
      toast.error("Could not load pending booking requests.");
      
      // If the API fails in development, we could fall back to mock data here
      // but in production we should return an empty array
      return []; // Return empty array on error
    }
  },

  approveBooking: async (bookingId: number): Promise<BookingResponse> => {
    try {
      // Using POST to approve a booking
      const response = await api.post<BookingResponse>(`/api/bookings/${bookingId}/approve`);
      toast.success("Booking approved successfully");
      return response.data;
    } catch (error) {
      console.error(`Failed to approve booking ${bookingId}:`, error);
      toast.error("Could not approve booking. Please try again.");
      throw error;
    }
  },

  rejectBooking: async (bookingId: number): Promise<BookingResponse> => {
    try {
      // Using POST to reject a booking
      const response = await api.post<BookingResponse>(`/api/bookings/${bookingId}/reject`);
      toast.success("Booking request declined");
      return response.data;
    } catch (error) {
      console.error(`Failed to reject booking ${bookingId}:`, error);
      toast.error("Could not decline booking. Please try again.");
      throw error;
    }
  },

  // Placeholder for fetching user's bookings - can be expanded later
  // getUserBookings: async (): Promise<BookingResponse[]> => {
  //   const response = await api.get<BookingResponse[]>('/api/bookings/my-bookings');
  //   return response.data;
  // },
  // Placeholder for talent fetching their bookings - can be expanded later
  // getTalentBookings: async (): Promise<BookingResponse[]> => {
  //   const response = await api.get<BookingResponse[]>('/api/bookings/talent-bookings');
  //   return response.data;
  // }
};

export const talent = {
  // Fetch talent by ID using the exact API endpoint provided
  getTalentById: async (id: string): Promise<any> => {
    try {
      // Using the exact API endpoint as specified
      const response = await api.get(`/api/talents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching talent with ID ${id}:`, error);
      // Return null on error and let the component handle the fallback
      return null;
    }
  },
  
  getByCategory: async (category: string): Promise<SearchResponse> => {
    try {
      const response = await api.get(`/api/talents/category/${category}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching talents for category ${category}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },
  
  getAll: async (): Promise<SearchResponse> => {
    try {
      const response = await api.get('/api/talents');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching all talents:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },
  
  // Get talent by ID - ALWAYS PROVIDES DEMO DATA if real data not found
  getById: async (talentId: string | number): Promise<any> => {
    const idToFetch = talentId;
    const defaultId = typeof idToFetch === 'string' ? parseInt(idToFetch) : idToFetch;
    
    try {
      console.log(`Fetching talent with ID: ${idToFetch}`);
      const response = await api.get(`/api/talents/${idToFetch}`);
      
      if (response && response.data) {
        console.log(`Successfully retrieved talent data from API for ID: ${idToFetch}`);
        return response.data;
      } else {
        console.warn(`No data returned for ID ${idToFetch}, using demo data.`);
        throw new Error('No data returned');
      }
    } catch (apiError) {
      console.log(`API error or no data for ID ${idToFetch}, using demo data instead.`);
      
      // ALWAYS return demo data - this ensures the app works even without a database
      // This creates a realistic talent profile for demo purposes
      return {
        id: defaultId,
        fullName: `Demo Talent ${defaultId}`,
        email: `demo.talent${defaultId}@rwalent.com`,
        username: `demo.talent${defaultId}@rwalent.com`,
        phoneNumber: "+250788123456",
        userType: "TALENT",
        category: "MUSICIAN",
        location: "Kigali, Rwanda",
        bio: "This is a demo talent profile for the Rwalent platform. In a production environment, this would show a real talent's biography and information.",
        serviceAndPricing: "Demo performances starting from 20,000 RWF per hour",
        photoUrl: null,
        profilePicture: null,
        enabled: true,
        authorities: [{ authority: 'ROLE_TALENT' }],
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true
      };
    }
  }
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

export default api; 