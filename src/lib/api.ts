import axios from 'axios';
import { toast } from "sonner";

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    // Add Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Log removal for brevity, uncomment if needed
    // console.log('Making request to:', config.url);
    // console.log('Request headers:', config.headers);
    // console.log('Request data:', config.data);
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
    // console.log('Response received:', response.data);
    return response;
  },
  error => {
    // Simplified error logging
    if (error.response) {
      console.error(`Error Response: ${error.response.status} ${error.response.statusText}`, error.response.data);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
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
    // Assuming login response contains the token
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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
    const token = localStorage.getItem('token'); // Get token for manual header addition if needed
    const response = await api.post('/api/auth/register', formData, {
      headers: {
        // Explicitly set Content-Type for multipart/form-data
        // Letting Axios handle it by omitting/setting undefined might also work, but this is explicit.
        'Content-Type': 'multipart/form-data',
        // Add Authorization header manually IF interceptor somehow fails for this specific call 
        // (usually not needed if interceptor works reliably)
        // ...(token && { 'Authorization': `Bearer ${token}` })
      }
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
    // Token is added by the request interceptor
    const response = await api.get('/api/auth/profile');
    return response.data;
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
    console.log("Fetching pending talent bookings via GET /api/bookings/talent/pending...");
    // User now indicates this should be a GET request to this specific path.
    try {
      // Token is added by interceptor.
      const response = await api.get<BookingResponse[]>('/api/bookings/talent/pending');
      // Sort by date, newest first might be useful
      return response.data.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    } catch (error) {
      console.error("Failed to fetch pending bookings:", error);
      toast.error("Could not load pending booking requests.");
      return []; // Return empty array on error
    }
  },

  approveBooking: async (bookingId: number): Promise<BookingResponse> => {
    console.log(`Approving booking ID: ${bookingId}`);
    try {
      const response = await api.post<BookingResponse>(`/api/bookings/${bookingId}/approve`);
      toast.success(`Booking ID ${bookingId} approved successfully.`);
      return response.data;
    } catch (error) {
      console.error(`Failed to approve booking ${bookingId}:`, error);
      toast.error(`Could not approve booking ${bookingId}. Please try again.`);
      throw error; // Re-throw to allow component to handle UI updates if needed
    }
  },

  rejectBooking: async (bookingId: number): Promise<BookingResponse> => {
    console.log(`Rejecting booking ID: ${bookingId}`);
    // Assuming a similar endpoint for rejection
    try {
      const response = await api.post<BookingResponse>(`/api/bookings/${bookingId}/reject`);
      toast.success(`Booking ID ${bookingId} rejected successfully.`);
      return response.data;
    } catch (error) {
      console.error(`Failed to reject booking ${bookingId}:`, error);
      toast.error(`Could not reject booking ${bookingId}. Please try again.`);
      throw error; // Re-throw to allow component to handle UI updates if needed
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
  // New function to get a talent by ID (public profile)
  getById: async (talentId: string | number): Promise<Profile> => {
    console.log(`Fetching talent profile for ID: ${talentId}`);
    // This is a placeholder. Replace with your actual public talent profile endpoint.
    // Example: const response = await api.get<Profile>(`/api/users/profile/${talentId}`);
    // For now, returning a mock profile to allow BookTalentPage to function without a real backend for this.
    // Ensure this mock profile structure matches your `Profile` interface.
    const mockTalentProfile: Profile = {
      id: typeof talentId === 'string' ? parseInt(talentId) : talentId,
      fullName: `Mocked Talent ${talentId}`,
      email: `talent${talentId}@example.com`,
      phoneNumber: "+250788123456",
      userType: "TALENT",
      category: "MUSICIAN",
      location: "Kigali, Rwanda",
      bio: "A talented individual ready for booking.",
      serviceAndPricing: "Various services offered.",
      photoUrl: `https://via.placeholder.com/150/2ECC71/FFFFFF?text=T${talentId}`,
      enabled: true,
      username: `talent${talentId}`,
      authorities: [{ authority: "ROLE_TALENT" }],
      accountNonExpired: true,
      credentialsNonExpired: true,
      accountNonLocked: true,
    };
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Uncomment the line below and comment out the mock return when your actual endpoint is ready
    // return response.data;
    return Promise.resolve(mockTalentProfile);
  }
};

// --- User Notification Interfaces and Functions ---
export interface UserNotification {
  id: number;
  message: string;
  status: 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'INFO' | string; // Example statuses
  relatedBookingId?: number | null;
  isRead: boolean;
  createdAt: string; // ISO 8601 timestamp string
}

export const notifications = {
  getUserNotifications: async (): Promise<UserNotification[]> => {
    console.log("Fetching user notifications...");
    // Assuming the backend endpoint is /api/notifications for the logged-in user
    // Token is added by the interceptor
    try {
      const response = await api.get<UserNotification[]>('/api/notifications');
      // Sort notifications by date, newest first
      return response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Return empty array or re-throw depending on desired error handling
      return []; 
    }
  },
  // Placeholder for marking notifications as read (optional feature)
  // markAsRead: async (notificationId: number): Promise<void> => {
  //   await api.patch(`/api/notifications/${notificationId}/read`);
  // }
};

export default api; 