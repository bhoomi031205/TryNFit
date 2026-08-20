import axios from 'axios';
import { supabase, isSupabaseConfigured } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 180 seconds (3 minutes) timeout for TryOn-API neural inference
});

// Attach Supabase access token to requests if available
apiClient.interceptors.request.use(async (config) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn('Could not attach Supabase auth token:', err);
  }
  return config;
});

/**
 * Checks server health and TryOn-API status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Health check failed:', error);
    }
    return { status: 'down', apiKeyConfigured: false };
  }
};

/**
 * Fetches all saved try-on records from backend history
 */
export const fetchHistory = async () => {
  try {
    const response = await apiClient.get('/api/history');
    return response.data?.data || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to fetch history:', error);
    }
    return [];
  }
};

/**
 * Deletes a single try-on record by ID (0 AI API credits consumed)
 */
export const deleteHistoryItem = async (id) => {
  try {
    const response = await apiClient.delete(`/api/history/${id}`);
    return response.data?.data || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to delete history item:', error);
    }
    throw error;
  }
};

/**
 * Clears all try-on history (0 AI API credits consumed)
 */
export const clearAllHistory = async () => {
  try {
    const response = await apiClient.delete('/api/history');
    return response.data?.data || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to clear history:', error);
    }
    throw error;
  }
};

/**
 * Sends person and garment images for TryOn-API Virtual Try-On
 * @param {Object} params
 * @param {File} params.personImage - User's portrait file
 * @param {File} params.garmentImage - Garment image file
 * @param {string} [params.category] - 'apparel' | 'auto' | 'tops' | 'bottoms' | 'one-pieces'
 * @param {string} [params.mode] - 'balanced' | 'quality' | 'performance'
 * @param {Function} [onUploadProgress] - Optional upload progress callback
 */
export const generateTryOn = async (
  { personImage, garmentImage, category = 'apparel', mode = 'balanced' },
  onUploadProgress = null
) => {
  const formData = new FormData();
  formData.append('personImage', personImage);
  formData.append('garmentImage', garmentImage);
  formData.append('category', category);
  formData.append('mode', mode);

  if (import.meta.env.DEV) {
    console.log('🚀 [TryOn-API Client Request Started]:', {
      personFileName: personImage?.name,
      garmentFileName: garmentImage?.name,
      category,
    });
  }

  try {
    const response = await apiClient.post('/api/tryon/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });

    if (import.meta.env.DEV) {
      console.log('📡 [TryOn-API Client Response Received]:', {
        status: response.status,
        resultUrl: response.data?.data?.resultUrl,
      });
    }

    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [TryOn-API Client Error]:', error.response?.data || error.message);
    }

    if (error.response?.data?.error) {
      const customError = new Error(error.response.data.error);
      customError.code = error.response.data.code || 'SERVICE_ERROR';
      customError.status = error.response.status;
      throw customError;
    }

    if (error.response?.status === 502 || error.response?.status === 503 || error.response?.status === 504) {
      const gatewayError = new Error('The try-on model service is temporarily busy or unavailable (HTTP 502/503). Please retry in a few moments.');
      gatewayError.code = 'SERVICE_UNAVAILABLE';
      gatewayError.status = error.response.status;
      throw gatewayError;
    }

    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error('The try-on generation request timed out. Processing took longer than 120 seconds.');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }

    if (error.message === 'Network Error') {
      const netError = new Error('Cannot connect to the TryNFit server. Please ensure the backend is running.');
      netError.code = 'NETWORK_ERROR';
      throw netError;
    }

    throw new Error('An unexpected error occurred during virtual try-on. Please try again.');
  }
};
