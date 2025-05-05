import axios from 'axios';

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
    console.log('Making request to:', config.url);
    console.log('Request data:', config.data);
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
    console.log('Response received:', response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

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

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
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
    photoUrl: string;
  }) => {
    console.log('Sending talent registration request:', userData);
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  search: async (searchTerm: string): Promise<SearchResponse> => {
    const response = await api.post('/api/auth/search', { searchTerm });
    return response.data;
  },
};

export const talent = {
  getByCategory: async (category: string): Promise<SearchResponse> => {
    try {
      const response = await api.get(`/api/auth/talents/category/${category}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching talents for category ${category}:`, error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },
  getAll: async (): Promise<SearchResponse> => {
    try {
      const response = await api.get('/api/auth/talents');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching all talents:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  }
};

export default api; 