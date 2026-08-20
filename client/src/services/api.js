import axios from 'axios';
import { supabase, isSupabaseConfigured } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
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
 * Deletes a single try-on record by ID
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
 * Clears all try-on history
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
 * Uses async job submission + automatic polling so requests NEVER time out on Vercel
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

  try {
    // 1. Submit job asynchronously (< 1.5 seconds)
    const submitResponse = await apiClient.post('/api/tryon/generate', formData, {
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

    const initialData = submitResponse.data;

    // Fast path: If result was returned immediately
    if (initialData?.data?.resultUrl) {
      return initialData;
    }

    const jobId = initialData?.jobId || initialData?.id;
    if (!jobId) {
      throw new Error('No job identifier was returned by the try-on engine.');
    }

    // 2. Poll status endpoint every 2.5s until completed (bypasses all 504 serverless timeouts)
    const maxPollAttempts = 40; // 40 * 2.5s = 100s max
    const pollIntervalMs = 2500;

    for (let attempt = 1; attempt <= maxPollAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

      try {
        const statusRes = await apiClient.get(`/api/tryon/status?jobId=${jobId}`);
        const statusData = statusRes.data;

        if (statusData?.status === 'completed' && statusData?.data?.resultUrl) {
          return statusData;
        }

        if (statusData?.status === 'failed' || statusData?.error) {
          const errPayload = statusData.error;
          const errMsg = typeof errPayload === 'string' ? errPayload : errPayload?.message || 'Virtual try-on processing failed.';
          const failErr = new Error(errMsg);
          failErr.code = statusData.code || 'GENERATION_FAILED';
          throw failErr;
        }
      } catch (pollErr) {
        if (pollErr.code === 'GENERATION_FAILED' || pollErr.code === 'POSE_TRANSFER_FAILED' || pollErr.status === 400) {
          throw pollErr;
        }
        console.warn(`[Poll attempt ${attempt}] status check notice:`, pollErr.message);
      }
    }

    throw new Error('Virtual try-on processing took longer than expected. Please retry.');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [TryOn-API Client Error]:', error.response?.data || error.message);
    }

    if (error.response?.data?.error) {
      const errPayload = error.response.data.error;
      const errMsg = typeof errPayload === 'string' ? errPayload : errPayload.message || JSON.stringify(errPayload);
      const customError = new Error(errMsg);
      customError.code = error.response.data.code || errPayload.code || 'SERVICE_ERROR';
      customError.status = error.response.status;
      throw customError;
    }

    if (error.code && error.message) {
      throw error;
    }

    if (error.response?.status === 502 || error.response?.status === 503 || error.response?.status === 504) {
      const gatewayError = new Error('The try-on model service is temporarily busy. Please retry in a few moments.');
      gatewayError.code = 'SERVICE_UNAVAILABLE';
      gatewayError.status = error.response.status;
      throw gatewayError;
    }

    throw new Error(error.message || 'An unexpected error occurred during virtual try-on.');
  }
};
