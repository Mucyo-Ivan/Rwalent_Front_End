import axios from 'axios';

// Create a separate axios instance for file uploads
const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true
});

export const uploadService = {
  uploadProfilePicture: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      console.log('Attempting to upload file:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await uploadApi.post('/api/auth/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      console.log('Upload response:', response);
      
      if (!response.data) {
        throw new Error('No response data received from server');
      }

      return response.data;
    } catch (error: any) {
      console.error('Detailed upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config
      });

      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('Access denied. Please try again.');
        }
        throw new Error(error.response.data?.detail || error.response.data?.message || 'Failed to upload profile picture');
      }
      throw error;
    }
  }
}; 