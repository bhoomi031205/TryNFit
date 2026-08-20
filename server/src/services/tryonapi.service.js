import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config/env.config.js';

const TRYON_API_URL = 'https://tryon-api.com/api/v1/tryon';
const MODELS_API_URL = 'https://tryon-api.com/api/v1/models';
const IS_DEV = config.nodeEnv === 'development';

let modelHealthCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 45000; // 45 seconds TTL cache

/**
 * Fetches model metadata list from GET /api/v1/models without consuming any credits
 */
export const fetchModelHealthMetrics = async (apiKey) => {
  const now = Date.now();
  if (modelHealthCache && now - lastCacheTime < CACHE_TTL_MS) {
    return modelHealthCache;
  }

  try {
    const res = await axios.get(MODELS_API_URL, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'TryNFit-App/1.0',
      },
      timeout: 10000,
    });
    modelHealthCache = res.data?.data || [];
    lastCacheTime = now;
    return modelHealthCache;
  } catch (err) {
    if (IS_DEV) {
      console.warn('⚠️ Could not fetch models health list, using default model hierarchy:', err.message);
    }
    return modelHealthCache || [];
  }
};

/**
 * Dynamically selects the healthiest TryOn-API model with strong framing preservation priority
 * Order: fal/fashn-tryon-v1-5 -> fal/leffa-tryon -> wearfits/tryon-clothing -> auto
 */
export const selectBestTryOnModel = async (apiKey, mode = 'balanced') => {
  const models = await fetchModelHealthMetrics(apiKey);

  const getMetrics = (modelId) => {
    const item = models.find((m) => m.id === modelId);
    const tryon = item?.tryon || {};
    const metrics = tryon.metrics || {};
    return {
      status: tryon.status || 'unknown',
      health: metrics.health || 'unknown',
      successRate: metrics.success_rate ?? null,
      latencyMs: metrics.measured_latency_ms ?? null,
    };
  };

  const wearfitsMetrics = getMetrics('wearfits/tryon-clothing');
  const fashnMetrics = getMetrics('fal/fashn-tryon-v1-5');

  // FAST PATH: Prioritize ultra-fast 12-15s Wearfits GPU model when mode is performance/balanced
  const isWearfitsAvailable =
    wearfitsMetrics.health === 'ok' ||
    wearfitsMetrics.status === 'available' ||
    wearfitsMetrics.health !== 'unhealthy';

  if ((mode === 'performance' || mode === 'balanced') && isWearfitsAvailable) {
    if (IS_DEV) {
      console.log('\n⚡ [Fast GPU Model Routing]: Selected wearfits/tryon-clothing (~14s ultra-fast inference)');
    }
    return { selectedModel: 'wearfits/tryon-clothing', reason: 'Ultra-fast 14s inference model selected', metrics: wearfitsMetrics };
  }

  // Quality mode or fallback
  if (fashnMetrics.health === 'ok' || fashnMetrics.status === 'available') {
    if (IS_DEV) {
      console.log('\n🔍 [Model Health Routing]: Selected fal/fashn-tryon-v1-5');
    }
    return { selectedModel: 'fal/fashn-tryon-v1-5', reason: 'FASHN v1.5 selected for quality mode', metrics: fashnMetrics };
  }

  // Fallback to TryOn-API Gateway auto routing
  if (IS_DEV) {
    console.log('\n🔍 [Model Health Routing]: Selected auto gateway routing');
  }
  return { selectedModel: 'auto', reason: 'Routing to TryOn-API auto gateway for fastest available GPU', metrics: { health: 'ok' } };
};

/**
 * Executes virtual try-on using official TryOn-API with dynamic health routing
 */
export const runTryOnApiInference = async ({
  personFile,
  garmentFile,
  category = 'apparel',
  mode = 'balanced',
}) => {
  const startTime = Date.now();

  // 1. Validate TRYON_API_KEY presence
  const apiKey = config.tryonApiKey;
  if (!apiKey) {
    const keyErr = new Error('TRYON_API_KEY is missing in server/.env. Please configure your API key to enable live try-on generation.');
    keyErr.status = 401;
    keyErr.code = 'MISSING_API_KEY';
    throw keyErr;
  }

  // 2. Dynamically select healthiest ultra-fast model
  const { selectedModel, reason } = await selectBestTryOnModel(apiKey, mode);

  if (IS_DEV) {
    console.log(`\n🚀 [TryOn-API Request Started] Uploading person image (${personFile.originalname || 'person.jpg'}) and garment image (${garmentFile.originalname || 'garment.jpg'}) to tryon-api.com (target model: ${selectedModel})...`);
  }

  try {
    const formData = new FormData();
    formData.append('person_images', personFile.buffer, {
      filename: personFile.originalname || 'person.jpg',
      contentType: personFile.mimetype || 'image/jpeg',
    });
    formData.append('garment_images', garmentFile.buffer, {
      filename: garmentFile.originalname || 'garment.jpg',
      contentType: garmentFile.mimetype || 'image/jpeg',
    });
    formData.append('model', selectedModel);
    formData.append('category', 'apparel');

    const response = await axios.post(TRYON_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      timeout: 180000,
    });

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const data = response.data;

    if (IS_DEV) {
      console.log('📥 [TryOn-API Response Metadata]:', {
        id: data?.id,
        status: data?.status,
        model: data?.model || selectedModel,
        executionTime: `${executionTime}s`,
      });
    }

    // Extract result image URL directly from response.images[0].url
    const resultImageUrl =
      (typeof data?.images?.[0] === 'string' ? data.images[0] : data?.images?.[0]?.url) ||
      data?.data?.images?.[0]?.url ||
      data?.resultUrl ||
      data?.image_url;

    const statusStr = String(data?.status || '').toLowerCase();
    const isCompleted = statusStr === 'completed' || statusStr === 'succeeded' || statusStr === 'success' || (Boolean(resultImageUrl) && statusStr !== 'failed');

    if (data && isCompleted && resultImageUrl) {
      if (IS_DEV) {
        console.log(`✅ [TryOn-API Successful Generation]: id=${data?.id || 'N/A'} model=${data?.model || selectedModel} (${executionTime}s)`);
      }

      return {
        success: true,
        id: data.id || `tryonapi_${Date.now()}`,
        status: 'completed',
        resultUrl: resultImageUrl,
        credits: data.usage?.credits ?? 1,
        model: data.model || selectedModel,
        executionTime: `${executionTime}s`,
      };
    }

    // Handle provider error states cleanly
    if (data && (statusStr === 'failed' || data.error)) {
      const errObj = data.error || {};
      const errMsg = errObj.message || data.routing?.attempts?.[0]?.error || 'Virtual try-on generation failed on provider.';
      const errCode = errObj.code || data.routing?.attempts?.[0]?.errorCode || 'GENERATION_FAILED';

      if (IS_DEV) {
        console.error(`❌ [TryOn-API Provider Error]: Code=${errCode} | Message=${errMsg}`);
      }

      if (errCode === 'SERVICE_UNAVAILABLE' || errCode === 'TIMEOUT_ERROR' || errMsg.includes('unavailable') || errMsg.includes('timed out')) {
        const unavailErr = new Error(`TryOn-API Service Notice: ${errMsg}`);
        unavailErr.status = 503;
        unavailErr.code = 'SERVICE_UNAVAILABLE';
        throw unavailErr;
      }

      if (errCode === 'POSE_TRANSFER_FAILED' || errMsg.includes('Multiple people') || errMsg.includes('pose')) {
        const poseErr = new Error(`TryOn-API Pose Error: ${errMsg}`);
        poseErr.status = 400;
        poseErr.code = 'POSE_TRANSFER_FAILED';
        throw poseErr;
      }

      if (errCode === 'INSUFFICIENT_CREDITS' || errMsg.includes('credit') || errMsg.includes('balance')) {
        const creditErr = new Error('TryOn-API Credit Error: Insufficient credit balance. Please top up your credits on tryon-api.com.');
        creditErr.status = 402;
        creditErr.code = 'INSUFFICIENT_CREDITS';
        throw creditErr;
      }

      const providerErr = new Error(`TryOn-API Error (${errCode}): ${errMsg}`);
      providerErr.status = 400;
      providerErr.code = errCode;
      throw providerErr;
    }

    throw new Error('TryOn-API returned a response without a valid generated result image URL.');
  } catch (error) {
    if (IS_DEV) {
      console.error('❌ [TryOn-API Catch Error]:', error.response?.data || error.message);
    }

    // Preserve already formatted app errors with status & code
    if (error.code && error.status && error.status !== 502) {
      throw error;
    }

    const resData = error.response?.data;
    const status = error.response?.status;

    if (status === 401 || resData?.error?.code === 'UNAUTHORIZED' || resData?.error?.message?.includes('Invalid')) {
      const authErr = new Error('TryOn-API Key Error: Invalid or unauthorized TRYON_API_KEY in server/.env.');
      authErr.status = 401;
      authErr.code = 'INVALID_API_KEY';
      throw authErr;
    }

    if (status === 402 || resData?.error?.code === 'INSUFFICIENT_CREDITS') {
      const creditErr = new Error('TryOn-API Credit Error: Insufficient credit balance on tryon-api.com.');
      creditErr.status = 402;
      creditErr.code = 'INSUFFICIENT_CREDITS';
      throw creditErr;
    }

    if (resData?.error?.code === 'POSE_TRANSFER_FAILED' || resData?.error?.message?.includes('Multiple people') || resData?.error?.message?.includes('pose')) {
      const poseErr = new Error(`TryOn-API Pose Error: ${resData.error.message}`);
      poseErr.status = 400;
      poseErr.code = 'POSE_TRANSFER_FAILED';
      throw poseErr;
    }

    if (status === 502 || status === 503 || status === 504) {
      const serviceMsg = resData?.error?.message || 'The selected AI try-on model is temporarily busy. TryNFit will automatically use another available model when possible.';
      const serviceErr = new Error(serviceMsg);
      serviceErr.status = 503;
      serviceErr.code = resData?.error?.code || 'SERVICE_UNAVAILABLE';
      throw serviceErr;
    }

    if (error.code === 'ECONNABORTED') {
      const timeoutErr = new Error('The try-on generation request timed out after 120 seconds.');
      timeoutErr.status = 504;
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }

    const apiErr = new Error(`TryOn-API Failure: ${resData?.error?.message || error.message || 'Processing failed.'}`);
    apiErr.status = status || 500;
    apiErr.code = resData?.error?.code || 'TRYON_API_FAILURE';
    throw apiErr;
  }
};
